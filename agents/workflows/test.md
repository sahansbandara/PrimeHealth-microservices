---
description: Test PrimeHealth microservices — health checks, API flow, Docker, and K8s verification
---

## Pre-Flight

1. Read `agent/MEMORY.md` → check for known test failures or gotchas
2. Read `docs/Sithmi_Guide.md` → Testing Guide section for curl commands
3. Confirm both services are running: `curl http://localhost:5003/health && curl http://localhost:5004/health`

---

## Level 1 — Health Checks

```bash
curl http://localhost:5003/health   # → { status: "ok", service: "appointment-service" }
curl http://localhost:5004/health   # → { status: "ok", service: "payment-service" }
```

If either fails: check `.env` file exists, `MONGO_URI` is set, service started with `npm run dev`.

---

## Level 2 — Individual Endpoint Testing

### Appointment Service (Port 5003)

```bash
# Create appointment
curl -X POST http://localhost:5003/api/appointments \
  -H "Content-Type: application/json" \
  -H "x-user-id: p-test-1" -H "x-user-role: PATIENT" \
  -d '{"patientId":"p-test-1","doctorId":"d-001","doctorName":"Dr. Smith","specialty":"Cardiology","appointmentDate":"2026-05-01","startTime":"09:00","reason":"Checkup","consultationFee":2000}'

# Get my appointments
curl http://localhost:5003/api/appointments/my \
  -H "x-user-id: p-test-1" -H "x-user-role: PATIENT"

# Get specific appointment
curl http://localhost:5003/api/appointments/<APPOINTMENT_ID>

# Check queue position
curl http://localhost:5003/api/appointments/<APPOINTMENT_ID>/queue

# Cancel appointment
curl -X PATCH http://localhost:5003/api/appointments/<APPOINTMENT_ID>/cancel \
  -H "x-user-id: p-test-1" -H "x-user-role: PATIENT"

# Available slots for a doctor
curl "http://localhost:5003/api/appointments/doctor/d-001/slots?date=2026-05-01"
```

### Payment Service (Port 5004)

```bash
# Initiate payment
curl -X POST http://localhost:5004/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{"appointmentId":"<ID>","patientId":"p-test-1","amount":2000,"method":"CREDIT_CARD"}'

# Confirm payment
curl -X POST http://localhost:5004/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{"orderId":"<ORDER_ID>"}'

# Payment history
curl http://localhost:5004/api/payments/my \
  -H "x-user-id: p-test-1" -H "x-user-role: PATIENT"

# Download invoice (redirect to PDF)
curl -o invoice.pdf http://localhost:5004/api/payments/<PAYMENT_ID>/invoice
```

---

## Level 3 — Integration Test (Full Flow)

Run in sequence — each step uses output from previous:

1. **Book** → capture `appointmentId`
2. **Initiate payment** with that `appointmentId` → capture `orderId`
3. **Confirm payment** with that `orderId` → expect `SUCCESS`
4. **Verify appointment** → expect `status: CONFIRMED`, `paymentStatus: PAID`
5. **Download invoice** → expect PDF file

If step 4 fails: check `APPOINTMENT_SERVICE_URL` in payment-service `.env`.

---

## Level 4 — Docker Testing

```bash
cd micro-services/docker
docker-compose up --build

# Wait for services to start, then test:
curl http://localhost:5003/health
curl http://localhost:5004/health

# Run Level 3 integration test against Docker endpoints
docker-compose down
```

If inter-service calls fail in Docker: check docker-compose uses container name URLs (not localhost).

---

## Level 5 — Kubernetes Testing

```bash
cd micro-services/k8s
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f appointment-deployment.yaml -f appointment-service.yaml
kubectl apply -f payment-deployment.yaml -f payment-service.yaml

kubectl get pods    # All should be Running
kubectl get svc     # Check ports

# Port-forward to test
kubectl port-forward svc/appointment-service 5003:5003 &
kubectl port-forward svc/payment-service 5004:5004 &

# Run Level 3 integration test
```

---

## Post-Test

- If all tests pass: update `agent/TODO.md` — mark testing task as Done
- If bugs found: fix them, then add to `agent/MEMORY.md` → Mistakes
- Commit: `test(service-name): verify [description]`
