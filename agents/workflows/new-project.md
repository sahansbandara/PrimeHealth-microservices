---
description: Create a new microservice for PrimeHealth following the established patterns
---

## Pre-Flight

1. Read `agent/CLAUDE.md` → get the tech stack, folder structure, and port map
2. Read `agent/MEMORY.md` → review Architecture Decisions and Patterns That Work
3. Identify the service name and port (check Port Map — don't reuse existing ports)
4. Add the task to `agent/TODO.md` → In Progress

---

## Step 1 — Scaffold the Service

Copy the directory structure from `doctor-service` — it is the reference implementation:

```bash
# From the project root
cp -r micro-services/services/doctor-service micro-services/services/<new-service>
```

Then replace all doctor-specific content:
- `package.json` → update name, description, port
- `.env.example` → update PORT, add any service-specific URLs
- `src/server.js` → update service name in logs
- `src/app.js` → update route mounting path
- `src/config/swagger.js` → update title, description, port

---

## Step 2 — Create the Model

Create `src/models/<ModelName>.js`:
- Define Mongoose schema with all required fields
- Add timestamps: `{ timestamps: true }`
- Add compound indexes for uniqueness/performance
- Export the model

---

## Step 3 — Create the Service Layer

Create `src/services/<serviceName>Service.js`:
- All business logic goes here (not in controllers)
- Use `ApiError` for error handling
- If calling another service: create `src/services/<otherService>Client.js`
  - Use axios with timeout (5000ms)
  - Read URL from env: `process.env.OTHER_SERVICE_URL`

---

## Step 4 — Create the Controller

Create `src/controllers/<controllerName>.js`:
- Thin handlers: req/res only, delegate to service
- Pattern:
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

---

## Step 5 — Create the Routes

Create `src/routes/<routeName>.js`:
- Add express-validator rules for each write endpoint
- Add Swagger JSDoc `@swagger` comments for each endpoint
- Apply auth middleware: `requireAuth`, `requireRole('ROLE')`
- Static routes BEFORE dynamic routes (`/my` before `/:id`)

---

## Step 6 — Docker & K8s

1. Update `Dockerfile` (if not already correct from copy)
2. Add service to `micro-services/docker/docker-compose.yml`
3. Create Kubernetes manifests:
   - `k8s/<service>-deployment.yaml`
   - `k8s/<service>-service.yaml`
4. Add env vars to `k8s/configmap.yaml` and `k8s/secret.yaml`

---

## Step 7 — Test

Follow `agents/workflows/test.md`:
1. Health check → `/health`
2. Swagger UI → `/api-docs`
3. All CRUD operations via curl
4. Inter-service calls (if any)

---

## Post-Create

- Update `agent/TODO.md` → Done with date
- Update `agent/MEMORY.md` → Dependencies, Architecture Decisions
- Update `agent/CLAUDE.md` → add to Port Map
- Update `CLAUDE.md` (root) → add to Port Map and Project Structure
- Commit: `feat(<service-name>): scaffold new service skeleton`
