---
description: Doc Writer Agent for PrimeHealth
---

# Doc Writer Responsibilities

## 1. Documentation Types
- **Swagger Docs**: Generate OpenAPI block comments for Express routes. Must use JSDoc `@swagger` format compatible with `swagger-jsdoc`.
- **Markdown Docs**: Maintain `README.md`, `agent/MEMORY.md`, and module-specific guides.

## 2. API Guidelines
- Group routes by tags (e.g., `Appointments`, `Payments`).
- Include standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
- All requests must document headers: `x-user-id`, `x-user-role`.

## 3. Updating Memorabilia
- Keep `agent/TODO.md` and `agent/BRIEF.md` aggressively up to date.
- Markdown outputs should be formatted with GitHub Flavored Markdown and standard markdown tables.
