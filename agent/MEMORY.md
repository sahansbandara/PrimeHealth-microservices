# Memory — PrimeHealth Appointment + Payment Module

> Agent long-term memory. **READ THIS BEFORE EVERY SESSION.**
> Update IMMEDIATELY after any mistake, discovery, correction, or new learning.

---

## Mistakes — Never Repeat These

> Format: `[DATE]` What went wrong → Root cause → What to do instead

- [TEMPLATE] Started with Kubernetes before local services worked → Debugging containers + code simultaneously is impossible → ALWAYS build and test locally first, then Docker, then K8s
- [TEMPLATE] Let frontend directly mark appointment as paid → Bad architecture, skips payment validation → Payment-service must be the ONLY thing that updates payment status
- [TEMPLATE] Hardcoded service URLs in source files → Breaks in Docker/K8s where hostnames change → ALWAYS use environment variables for service URLs
- [TEMPLATE] Skipped queue + invoice features → Missed easy advanced marks → Queue + invoice are highest value-to-effort advanced features; always implement them
- [TEMPLATE] Tried real payment gateway first → High failure risk for low demo value → Use simulated payment first, add real gateway after demo works
- [2026-04-15] Route conflict: `/my` and `/:id` on same router → Express matched `my` as an ID → ALWAYS put static routes (`/my`, `/all`, `/queue`) BEFORE dynamic routes (`/:id`)
- [2026-04-15] Forgot `/api/appointments` prefix in `app.js` route mounting → All endpoints returned 404 → Always mount routes with explicit prefix: `app.use('/api/appointments', appointmentRoutes)`
- [2026-04-15] Used `localhost` as APPOINTMENT_SERVICE_URL in Docker → Inter-service calls failed inside containers → Use container DNS names in Docker (`http://appointment-service:5003`); only localhost for local dev

---

## Patterns That Work

> Solutions and approaches that proved reliable. Reference before inventing new approaches.

- **Controller pattern**: Thin controllers delegating to service layer. `try { const result = await service.method(); res.json({success:true, data:result}) } catch(err) { next(err) }`
- **ApiError class**: `throw new ApiError(400, 'message')` — caught automatically by errorHandler middleware, returns correct HTTP status
- **Auth middleware chain**: `parseAuthHeaders` (global in `app.js`) → `requireAuth` (route-level) → `requireRole('PATIENT')` (route-level)
- **Service client pattern**: Separate file per external service (`doctorServiceClient.js`, `appointmentServiceClient.js`). Use axios with timeout. Wrap in try/catch, throw ApiError(502) on external failure. Log the error.
- **Validation pattern**: Use express-validator in route definitions, then `validate` middleware before controller. Errors are caught before reaching controller.
- **Response format**: Always `{ success: boolean, message: string, data: any }` — consistent across all services
- **Route ordering**: Static routes BEFORE dynamic (`/my`, `/all` before `/:id`, `/doctor/:doctorId/slots` before `/:id/cancel`)
- **Queue number**: Auto-assigned at booking time via `Appointment.countDocuments({doctorId, appointmentDate, status: { $ne: 'CANCELLED' }})` + 1
- **Two-step payment**: 1) `POST /initiate` creates Payment(PENDING) with orderId 2) `POST /confirm` with orderId → simulates gateway → updates Payment(SUCCESS) → calls appointment-service to PAID/CONFIRMED
- **PDF invoice**: `pdfkit` streams directly to response — `res.setHeader('Content-Type', 'application/pdf')` then `doc.pipe(res)` — no temp file needed
- **MongoDB connection**: Simple `connectDB()` in `server.js`. Wait for connection before `app.listen()`. Log connection success with service name.
- **Environment defaults**: `process.env.VARIABLE || 'default_value'` — always provide sensible defaults for local dev

---

## Project Knowledge

> Things specific to THIS project that an agent needs to know.

- **Project**: SE3020 Distributed Systems assignment — 25% of final grade, due week 11
- **Module owner**: Sithmi owns appointment-service (`:5003`) + payment-service (`:5004`)
- **Reference service**: `doctor-service` is the clean template — copy its structure exactly
- **CommonJS**: ALL services use `require`/`module.exports` — NOT ES modules
- **Auth**: Header-based mock auth — `x-user-id` + `x-user-role` headers (PATIENT, DOCTOR, ADMIN)
- **Payment status flow**: `UNPAID → PENDING → PAID` on appointment; `PENDING → SUCCESS` on payment
- **Appointment status flow**: `PENDING → CONFIRMED` (after payment) or `CANCELLED` or `COMPLETED`
- **Internal endpoint**: `PATCH /api/appointments/:id/payment-status` is only called by payment-service — do NOT expose it to patients

### Port Map

| Service | Port |
|---------|------|
| patient-service | 5001 |
| doctor-service | 5002 |
| appointment-service | 5003 |
| payment-service | 5004 |
| prescription-service | 5005 |

### Data Flow (Critical)

```
Book:    Frontend → appointment-service (status=PENDING, paymentStatus=UNPAID)
Initiate: Frontend → payment-service/initiate (Payment status=PENDING)
Confirm:  Frontend → payment-service/confirm
          ↳ payment-service → appointment-service/payment-status (PAID/CONFIRMED)
```

### What Was Already Built vs Generated

- `doctor-service`: fully functional reference service — built before this project started
- `prescription-service`: fully functional — built before this project started
- `appointment-service`: built during sessions with Antigravity (2026-04-15)
- `payment-service`: built during sessions with Antigravity (2026-04-15)
- `Frontend_UI/`: built during sessions with Antigravity (2026-04-15)
- All K8s manifests: generated (2026-04-15)
- All markdown docs: written/rewritten (2026-04-15 to 2026-04-16)

---

## Dependencies & Versions

> Track every dependency added. Match doctor-service versions.

### appointment-service

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.19.2 | Web framework |
| mongoose | ^8.6.3 | MongoDB ODM |
| dotenv | ^16.4.5 | Environment variables |
| cors | ^2.8.5 | CORS middleware |
| helmet | ^7.1.0 | Security headers |
| morgan | ^1.10.0 | HTTP request logging |
| express-validator | ^7.2.0 | Input validation |
| swagger-jsdoc | ^6.2.8 | Swagger from JSDoc |
| swagger-ui-express | ^5.0.1 | Swagger UI endpoint |
| axios | ^1.7.7 | Inter-service HTTP calls |
| winston | ^3.13.1 | Application logging |
| nodemon | ^3.1.4 | Dev hot-reload |

### payment-service (same as above, plus)

| Package | Version | Purpose |
|---------|---------|---------|
| pdfkit | ^0.15.0 | PDF invoice generation |
| uuid | ^10.0.0 | Order ID generation |

---

## Architecture Decisions

> Key decisions and WHY they were made.

| Decision | Reason |
|----------|--------|
| CommonJS over ES modules | doctor-service uses CommonJS — all services must match for consistency |
| Header-based auth over JWT | Assignment scope doesn't require real JWT; team agreed on this pattern |
| Simulated payment over real gateway | Reduces setup complexity and failure risk during demo |
| MongoDB Atlas over local MongoDB | Simpler for team collaboration; no Docker volume management during dev |
| pdfkit over puppeteer for invoices | Lightweight, no headless browser, works in Docker alpine images |
| Axios for inter-service calls | Already used in doctor-service (`prescriptionServiceClient.js`) — consistent |
| Compound unique index on appointments | `{doctorId, appointmentDate, startTime}` prevents double-booking at DB level |
| `/my` before `/:id` in route order | Prevents Express matching "my" as a MongoDB ObjectId |
| Two-step payment (initiate + confirm) | Mirrors real payment gateway flow (create intent → complete) |

---

## Commands

```bash
# Per service
npm install          # Install dependencies
npm run dev          # Start with nodemon (hot reload)
npm start            # Start production mode

# Docker
docker-compose up --build    # Build and start all containers
docker-compose down          # Stop all
docker-compose logs -f       # Follow logs

# Kubernetes
kubectl apply -f k8s/                    # Deploy all manifests
kubectl get pods                         # Check pod status
kubectl port-forward svc/appointment-service 5003:5003
kubectl port-forward svc/payment-service 5004:5004
kubectl logs -f deployment/appointment-service

# Quick tests
curl http://localhost:5003/health
curl http://localhost:5004/health
```

---

## File Map

> Quick reference for key files.

```
micro-services/services/appointment-service/src/
├── server.js                        # Entry point — DB connect + listen
├── app.js                           # Express setup — middleware + routes
├── config/db.js                     # MongoDB connection
├── config/logger.js                 # Winston logger
├── config/swagger.js                # Swagger config
├── controllers/appointmentController.js  # Thin handlers
├── middleware/auth.js               # parseAuthHeaders, requireAuth, requireRole
├── middleware/errorHandler.js       # Global error handler
├── models/Appointment.js            # Mongoose schema
├── routes/appointmentRoutes.js      # Routes + validation + Swagger JSDoc
├── services/appointmentService.js   # Business logic
├── services/doctorServiceClient.js  # Calls doctor-service
└── utils/ApiError.js                # Custom error class

micro-services/services/payment-service/src/
├── server.js
├── app.js
├── config/...
├── controllers/paymentController.js
├── middleware/...
├── models/Payment.js
├── routes/paymentRoutes.js
├── services/paymentService.js            # Business logic + invoice
├── services/appointmentServiceClient.js  # Calls appointment-service
├── services/invoiceService.js            # PDF generation wrapper
└── utils/
    ├── ApiError.js
    └── generateOrderId.js               # UUID-based order ID

micro-services/docker/
├── docker-compose.yml
└── .env.example

micro-services/k8s/
├── configmap.yaml
├── secret.yaml
├── appointment-deployment.yaml
├── appointment-service.yaml
├── payment-deployment.yaml
└── payment-service.yaml
```
