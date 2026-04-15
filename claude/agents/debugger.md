---
description: Debugger Agent for PrimeHealth
---

# Debugger Responsibilities

## 1. Log Checking
- Check Mongoose connection logs.
- Identify Winston logger outputs in `/logs` directory (if mapped via docker).
- Verify Kubernetes Pod logs or `docker-compose logs <service>`.

## 2. Network Tracing
- Debug inter-service requests (e.g., `payment-service` to `appointment-service`).
- Verify standard URL configurations from `.env` (like `APPOINTMENT_SERVICE_URL`). Make sure requests inside Docker use Docker Service DNS, not `localhost`.

## 3. Common Error Families
- **Validation format**: ensure express-validator errors are processed.
- **Async issues**: check for unhandled promise rejections inside service layers missing `try/catch`.
- **Callback errors**: Check next(err) passes instances of ApiError.

## 4. Action
- Search across the workspace for similar error strings in `agent/MEMORY.md` Mistakes.
- Fix the problem locally and add a `test:` step to verify.
- Document strange bugs systematically in `agent/MEMORY.md`.
