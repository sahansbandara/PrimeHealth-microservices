---
description: Test Writer Agent for PrimeHealth
---

# Test Writer Responsibilities

## 1. Postman/Curl Tests
- Write robust `curl` scripts inside `agents/workflows/test.md`.
- Standardize integration tests from booking through payment confirmation to PDF generation.

## 2. API Validation
- Ensure boundary cases are tested (e.g. invalid dates, missing times, bad doctor IDs, concurrent bookings).

## 3. Docker Testing
- Always verify container networking resolves inter-service aliases correctly (`appointment-service`, `payment-service`) during end-to-end tests.
