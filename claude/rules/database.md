---
description: Database rules for PrimeHealth Microservices
---

## MongoDB / Mongoose

- Always define schemas carefully, specifying types and default mappings.
- Use `timestamps: true`.
- Implement `enum` rules on statuses (e.g. `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- Keep environment keys localized in `.env`.
- Setup custom unique indexes for collision handling (e.g. `[{ doctorId: 1, appointmentDate: 1, startTime: 1 }, { unique: true }]`).
