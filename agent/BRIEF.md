# Project Brief — Appointment + Payment Module

## Project Name
PrimeHealth Microservices — AI-Enabled Smart Healthcare Platform

## Course & Grading
- **Course**: SE3020 — Distributed Systems
- **Year**: BSc (Hons) IT Specialized in SE — Year 3, Semester 1
- **Weightage**: 25% of final grade
- **Team Size**: 4 members
- **Deadline**: 11th week of semester

---

## Problem

Build a cloud-native healthcare platform using microservices architecture. The platform enables patients to book doctor appointments, process payments, attend video consultations, upload medical reports, and receive AI-based health suggestions. Must use Docker and Kubernetes for containerization and orchestration.

---

## Goal

Build a **complete Appointment + Payment Module** that demonstrates:
1. RESTful microservice design with proper separation of concerns
2. Inter-service communication (appointment ↔ payment ↔ doctor)
3. Advanced features (queue management, invoice PDF, payment history)
4. Docker containerization and Kubernetes orchestration
5. A working end-to-end flow: **book → pay → confirm → invoice**

---

## Module Owner
**Sithmi** — Appointment (`:5003`) + Payment (`:5004`)

## Team Members

| Member | Module | Port(s) |
|--------|--------|---------|
| **Sithmi** | Appointment + Payment | 5003, 5004 |
| Sinali | Patient + AI Symptom Checker | 5001 |
| Vidushi | Doctor + Prescription | 5002, 5005 |
| Geethma | Telemedicine + Admin/Analytics | — |

---

## Primary Users
- **Patient**: Book appointments, pay consultation fees, view payment history, download invoices
- **Doctor**: View appointments, update status, manage schedule
- **Admin**: View all appointments and payments, manage platform operations

---

## MVP Goal
A patient can:
1. Book a doctor appointment
2. Pay for it (simulated gateway)
3. See the appointment confirmed automatically
4. View payment history
5. Download a PDF invoice

— all through connected microservices running in Docker/Kubernetes.

---

## Functional Requirements

### Must Have (Core)
- [x] Book appointment (select doctor, date, time, reason)
- [x] Cancel appointment
- [x] View my appointments with status tracking
- [x] Initiate payment for appointment
- [x] Confirm payment (simulated success)
- [x] Payment confirms appointment automatically (inter-service call)
- [x] View payment history
- [x] Health check endpoint on both services (`/health`)
- [x] Swagger API documentation on both services (`/api-docs`)
- [x] Dockerfiles for both services
- [x] docker-compose.yml for local orchestration
- [x] Kubernetes manifests (deployment + service + configmap + secret)

### Should Have (Advanced)
- [x] Queue management system (auto-assign queue number at booking)
- [x] Queue position display (`GET /:id/queue`)
- [x] Invoice PDF generation and download (`GET /:id/invoice`)
- [x] Available slot checking per doctor per date (`GET /doctor/:id/slots`)
- [x] Duplicate booking prevention (compound unique index)

### Nice to Have (Optional — Not Started)
- [ ] Real PayHere/Stripe gateway integration
- [ ] AI-based doctor recommendation
- [ ] Rescheduling intelligence
- [ ] Dynamic pricing for peak times
- [ ] Webhook-based payment confirmation

---

## Non-Functional Requirements

**Architecture**: Microservices with isolated services, RESTful APIs, inter-service HTTP (axios), header-based auth
**Performance**: API response under 500ms, indexed MongoDB queries for slot lookups
**Security**: No API keys in source, auth middleware on all protected routes, input validation via express-validator, CORS per service
**Containerization**: Each service independently containerized, docker-compose for local, K8s for production

---

## API Routes

### appointment-service (Port 5003)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/appointments | PATIENT | Create appointment |
| GET | /api/appointments/my | PATIENT | My appointments |
| GET | /api/appointments/:id | PATIENT/DOCTOR | Get by ID |
| PATCH | /api/appointments/:id/cancel | PATIENT | Cancel appointment |
| GET | /api/appointments | ADMIN | List all appointments |
| PATCH | /api/appointments/:id/status | DOCTOR/ADMIN | Update status |
| GET | /api/appointments/doctor/:doctorId/slots | Public | Available slots |
| GET | /api/appointments/:id/queue | PATIENT | Queue position |
| PATCH | /api/appointments/:id/payment-status | Internal | Update payment status |

### payment-service (Port 5004)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/payments/initiate | PATIENT | Start payment |
| POST | /api/payments/confirm | PATIENT | Confirm payment |
| GET | /api/payments/my | PATIENT | Payment history |
| GET | /api/payments/:id | PATIENT | Get payment by ID |
| GET | /api/payments/order/:orderId | PATIENT | Get by order ID |
| GET | /api/payments/:id/invoice | PATIENT | Download invoice PDF |

---

## Data Models

### Appointment
```
patientId, doctorId, doctorName, specialty
appointmentDate, startTime, endTime, reason
consultationFee, queueNumber
status: PENDING | CONFIRMED | CANCELLED | COMPLETED
paymentStatus: UNPAID | PENDING | PAID | FAILED | REFUNDED
paymentId, notes
timestamps (createdAt, updatedAt)
```

### Payment
```
appointmentId, patientId, doctorId
orderId (UUID), transactionId
amount, currency (LKR), method (CREDIT_CARD)
status: PENDING | SUCCESS | FAILED | REFUNDED
paidAt, failureReason, gatewayResponse
invoiceNumber
timestamps (createdAt, updatedAt)
```

---

## Acceptance Criteria

### Core Flow
- [x] Patient creates appointment → `status=PENDING`, `paymentStatus=UNPAID`
- [x] Queue number assigned automatically at booking
- [x] Patient initiates payment → `Payment.status=PENDING`
- [x] Patient confirms payment → `Payment.status=SUCCESS`, appointment `CONFIRMED/PAID`
- [x] Payment history lists all user payments
- [x] Invoice PDF downloads with correct details
- [x] Cancellation blocked for `COMPLETED` appointments
- [x] Duplicate booking for same doctor/date/time prevented

### Integration
- [x] payment-service calls appointment-service to update payment status
- [x] appointment-service can call doctor-service to verify doctor
- [x] Services run independently (can start/stop individually)

### DevOps
- [x] Both services start with `npm run dev`
- [x] Both services have `/health` endpoints
- [x] Both services have Swagger at `/api-docs`
- [x] Docker build succeeds for both services
- [x] docker-compose starts all services together
- [x] K8s manifests apply without errors

---

## Deliverables Checklist

- [x] appointment-service source code
- [x] payment-service source code
- [x] Frontend pages (booking, payment, history)
- [x] Dockerfile per service
- [x] docker-compose.yml
- [x] Kubernetes manifests
- [x] API documentation (Swagger)
- [ ] Postman collection for testing
- [ ] Report section (architecture diagram, API docs, individual contributions)

---

## Out of Scope (For Now)
- Real payment gateway processing
- AI doctor recommendation engine
- Dynamic pricing algorithm
- WebSocket real-time updates
- SMS/Email notifications
- JWT token authentication
