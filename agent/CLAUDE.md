# Project: PrimeHealth Microservices

## MANDATORY AGENT RULES
**On every new session, before writing any code:**
1. Read `agent/TODO.md` → Last Session section first
2. Read `agent/MEMORY.md` → avoid past mistakes
3. Read `agent/BRIEF.md` → know the requirements
4. Read `CLAUDE.md` (project root) → know the stack and conventions

**While coding, update `agent/` files live:**
- Task started/completed → edit `agent/TODO.md`
- Bug found/fixed → edit `agent/MEMORY.md` → Mistakes
- Pattern discovered → edit `agent/MEMORY.md` → Patterns
- Dependency added → edit `agent/MEMORY.md` → Dependencies
- Architecture decision → edit `agent/MEMORY.md` → Architecture Decisions
- Session ending → edit `agent/TODO.md` → Last Session with full handoff

**These updates are not optional. They are part of the task.**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ (CommonJS — `require`/`module.exports`) |
| Framework | Express.js 4.x |
| Database | MongoDB (Mongoose ODM) — Atlas or local |
| Auth | Header-based mock auth (`x-user-id`, `x-user-role`) |
| Validation | express-validator |
| HTTP Client | Axios (inter-service communication) |
| Docs | swagger-jsdoc + swagger-ui-express |
| Logging | Winston |
| PDF | pdfkit (invoice generation) |
| Containerization | Docker + docker-compose |
| Orchestration | Kubernetes |
| Frontend | Vanilla HTML + CSS + JS (dark-mode) |

---

## Module Focus — Appointment + Payment (Sithmi)

- **appointment-service** — Port 5003
- **payment-service** — Port 5004
- Frontend pages for booking, payment, history, invoices

---

## Code Standards

- CommonJS (`require`/`module.exports`) — matching doctor-service reference
- No inline styles — CSS classes from design.md tokens only
- Handle ALL states: loading, error, empty, success
- Functions max ~30 lines
- Pattern: controller → service → model (thin controllers, fat services)
- Standard response: `{ success: boolean, message: string, data: any }`
- Error handling: `throw new ApiError(statusCode, message)` → `errorHandler` middleware catches it
- Conventional commits: `type(scope): description`

---

## Folder Structure (Per Service)

```
service-name/
├── package.json
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
└── src/
    ├── server.js           # Entry point — connects DB, starts Express
    ├── app.js              # Express app setup — middleware, routes
    ├── config/
    │   ├── db.js           # Mongoose connection
    │   ├── logger.js       # Winston logger
    │   └── swagger.js      # Swagger spec
    ├── controllers/        # Thin request handlers
    ├── middleware/
    │   ├── auth.js         # parseAuthHeaders, requireAuth, requireRole
    │   ├── errorHandler.js # Global error handler
    │   ├── notFound.js     # 404 handler
    │   └── requestLogger.js # HTTP request logger
    ├── models/             # Mongoose schemas
    ├── routes/             # Express router + validation + Swagger JSDoc
    ├── services/           # Business logic + service clients
    └── utils/
        ├── ApiError.js     # Custom error class
        ├── validate.js     # express-validator middleware
        └── generateOrderId.js  # UUID-based order IDs (payment only)
```

---

## Port Map

| Service | Port |
|---------|------|
| patient-service | 5001 |
| doctor-service | 5002 |
| appointment-service | 5003 |
| payment-service | 5004 |
| prescription-service | 5005 |
| frontend | 3000 |

---

## Inter-Service Communication

```
Frontend → appointment-service  (create booking)
Frontend → payment-service      (initiate + confirm payment)
payment-service → appointment-service  (update payment status — internal call)
appointment-service → doctor-service   (verify doctor exists — optional)
```

---

## Environment Variables (Per Service)

```env
PORT=500X
MONGO_URI=mongodb+srv://...
CORS_ORIGIN=*
NODE_ENV=development
LOG_LEVEL=debug

# Service URLs (for inter-service calls)
DOCTOR_SERVICE_URL=http://localhost:5002
APPOINTMENT_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004

# Docker: use container names (http://appointment-service:5003)
# K8s: use K8s Service DNS names (http://appointment-service:5003)
```

---

## Critical Patterns

### Controller (thin — req/res only)
```javascript
exports.create = async (req, res, next) => {
  try {
    const result = await service.create(req.body, req.user);
    res.status(201).json({ success: true, message: 'Created', data: result });
  } catch (err) {
    next(err);
  }
};
```

### Service Client (inter-service call)
```javascript
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const BASE = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:5003';

exports.updatePaymentStatus = async (appointmentId, paymentData) => {
  try {
    const { data } = await axios.patch(
      `${BASE}/api/appointments/${appointmentId}/payment-status`,
      paymentData,
      { timeout: 5000 }
    );
    return data;
  } catch (err) {
    throw new ApiError(502, 'Appointment service unavailable');
  }
};
```

### Route Ordering
```javascript
// Static routes FIRST
router.get('/my', requireAuth, controller.getMyItems);
router.get('/all', requireAuth, requireRole('ADMIN'), controller.getAll);

// Dynamic routes AFTER
router.get('/:id', controller.getById);
router.patch('/:id/cancel', requireAuth, controller.cancel);
```
