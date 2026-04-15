---
description: REST API rules for PrimeHealth Microservices
---

## Route Structure
- Prefix: `/api/v1/` or just `/api/` depending on the service standard format.
- Method mapping: `GET` (read), `POST` (create), `PATCH` or `PUT` (update), `DELETE` (remove).

## Standardized Responses
Return standard JSON responses strictly:
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": { ... }
}
```

## Auth headers
Use:
- `x-user-id`
- `x-user-role`
(Since JWT is out of scope for the current module mock).

## Documenting
Must include Swagger comments before the route definitions.
