---
description: Build a new endpoint, feature, or frontend component for PrimeHealth microservices
---

## Pre-Flight (Before Writing Any Code)

1. Read `agent/TODO.md` → confirm this task is in Priority Tasks or In Progress
2. Read `agent/MEMORY.md` → check Mistakes section for relevant past issues
3. Read `agent/BRIEF.md` → verify the feature is in scope
4. Read `agent/CLAUDE.md` → get tech stack, patterns, and folder structure
5. Move task to "In Progress" in `agent/TODO.md` with today's date

## Planning

6. Identify the build type:
   - **Backend endpoint** — new route + controller + service method
   - **Frontend page/section** — HTML section + CSS + JS handlers
   - **Service client** — inter-service HTTP call (axios wrapper)
   - **Model change** — Mongoose schema update
   - **Config** — Dockerfile, docker-compose, K8s manifest

7. Define the scope:
   - Which file(s) need creating or modifying?
   - What existing patterns should be followed? (check MEMORY.md → Patterns)
   - What validation is needed? (express-validator for write endpoints)
   - What error states need handling?

## Backend Build Phase

8. If creating a new endpoint:
   - Add Mongoose model field (if needed) in `models/`
   - Add business logic in `services/ServiceName.js`
   - Add thin controller in `controllers/ControllerName.js` (req/res only)
   - Add route in `routes/Routes.js` with:
     - express-validator validation rules
     - `validate` middleware
     - Swagger JSDoc `@swagger` comments
     - Auth middleware: `requireAuth`, `requireRole('ROLE')`
   - Static routes (`/my`, `/all`) BEFORE dynamic routes (`/:id`)

9. Follow response format:
   ```javascript
   res.status(200).json({ success: true, message: 'Description', data: result });
   ```

10. Error handling:
    ```javascript
    throw new ApiError(400, 'Validation failed');
    throw new ApiError(404, 'Appointment not found');
    throw new ApiError(502, 'Doctor service unavailable');
    ```

## Frontend Build Phase

11. If creating a frontend feature:
    - Add HTML section in `index.html` (unique IDs)
    - Add CSS in `style.css` using design.md tokens (no hardcoded colors/fonts)
    - Add JS in `app.js` using the existing API call pattern
    - Handle all states: loading, success, empty, error

## Verification

12. Test locally:
    ```bash
    npm run dev
    curl -X [METHOD] http://localhost:[PORT]/api/[path] \
      -H "Content-Type: application/json" \
      -H "x-user-id: p-123" -H "x-user-role: PATIENT" \
      -d '{...}'
    ```
13. Confirm Swagger docs show the new endpoint at `/api-docs`
14. If frontend: open in browser, test all user actions

## Post-Build

15. Update `agent/TODO.md` → move task to "Done" with date
16. Update `agent/MEMORY.md` → log any patterns discovered or bugs fixed
17. Commit: `feat(service-name): add [description]`
