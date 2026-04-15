# Project Brain — PrimeHealth Microservices

> **Every agent (Claude Code, Antigravity, Cursor, Gemini) reads this file first.**
> This is the control center. Follow the boot sequence, then build.

---

## Boot Sequence — MANDATORY (Before ANY Code)

**Step 1:** Read `agent/TODO.md` → **Last Session section FIRST** (know what was done, what's next)
**Step 2:** Read `agent/MEMORY.md` → mistakes to avoid, patterns that work
**Step 3:** Read `agent/BRIEF.md` → requirements and acceptance criteria
**Step 4:** Read `agent/CLAUDE.md` → tech stack and project config
**Step 5:** Read `design.md` → full UI design system specification
**Step 6:** Read `docs/Sithmi_Guide.md` → Appointment + Payment module developer guide

After reading all files, state:
1. What was last done (from Last Session)
2. What's next (from TODO priorities)
3. Any relevant past mistakes to avoid (from MEMORY)

---

## Live Update Rules — NON-NEGOTIABLE

While coding, update these files **immediately** (not at the end, not when asked):

| Event | File to Update | Section |
|-------|---------------|---------|
| Start a task | `agent/TODO.md` | Move to "In Progress" |
| Complete a task | `agent/TODO.md` | Move to "Done" with date |
| Find/fix a bug | `agent/MEMORY.md` | Mistakes |
| Pattern works well | `agent/MEMORY.md` | Patterns That Work |
| Add a dependency | `agent/MEMORY.md` | Dependencies & Versions |
| Architecture decision | `agent/MEMORY.md` | Architecture Decisions |
| Session ending | `agent/TODO.md` | Last Session (full handoff) |

---

## Project

- **Name:** PrimeHealth Microservices
- **Type:** Cloud-native healthcare platform — university assignment (SE3020 Distributed Systems)
- **Year:** BSc (Hons) IT Specialized in SE — Year 3, Semester 1
- **Deadline:** 11th week of semester
- **Weightage:** 25% of final grade

## Team & Module Ownership

| Member | Module |
|--------|--------|
| **Sithmi** | appointment-service (`:5003`) + payment-service (`:5004`) |
| Sinali | patient-service + AI symptom checker |
| Vidushi | doctor-service + prescription-service |
| Geethma | telemedicine-service + admin-analytics-service |

## Stack

- **Runtime:** Node.js 18+ (CommonJS — `require`/`module.exports`)
- **Framework:** Express.js 4.x
- **Database:** MongoDB (Mongoose ODM) with Atlas or local
- **Auth:** Header-based mock auth (`x-user-id`, `x-user-role`)
- **Logging:** Winston
- **Validation:** express-validator
- **HTTP Client:** Axios (inter-service calls)
- **Docs:** swagger-jsdoc + swagger-ui-express
- **PDF:** pdfkit (invoice generation)
- **Containerization:** Docker + docker-compose
- **Orchestration:** Kubernetes
- **Frontend:** Vanilla HTML + CSS + JS (dark-mode, glassmorphism)

## Port Map

| Service | Port |
|---------|------|
| patient-service | 5001 |
| doctor-service | 5002 |
| appointment-service | 5003 |
| payment-service | 5004 |
| prescription-service | 5005 |
| frontend | 3000 |

## Commands

```bash
# Per service (run from service directory)
npm install          # Install dependencies
npm run dev          # Start with nodemon (hot reload)
npm start            # Start production mode

# Docker
docker-compose up --build    # Build and start all containers
docker-compose down          # Stop all containers
docker-compose logs -f       # Follow logs

# Kubernetes (from micro-services/k8s/)
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f appointment-deployment.yaml appointment-service.yaml
kubectl apply -f payment-deployment.yaml payment-service.yaml
kubectl get pods             # Check pod status
kubectl get services         # Check service exposure
kubectl port-forward svc/appointment-service 5003:5003
kubectl port-forward svc/payment-service 5004:5004
kubectl logs -f deployment/appointment-service

# Quick health checks
curl http://localhost:5003/health
curl http://localhost:5004/health
```

## Conventions

### Code
- CommonJS only (`require`/`module.exports`) — matches doctor-service pattern
- Pattern: controller → service → model (thin controllers, fat services)
- Standard response: `{ success: boolean, message: string, data: any }`
- Error handling: `throw new ApiError(statusCode, message)` → caught by `errorHandler` middleware
- Auth chain: `parseAuthHeaders` (global) → `requireAuth` (route-level) → `requireRole('PATIENT')` (route-level)
- Max function length: 30 lines
- All async operations: loading state, error state, success state

### Git
- Branch naming: `feature/[name]`, `fix/[name]`, `hotfix/[name]`
- Commit format: `type(scope): description`
- Types: `feat`, `fix`, `style`, `refactor`, `docs`, `test`, `chore`
- Example: `feat(appointment-service): add queue position endpoint`

### Environment Variables
```env
PORT=500X
MONGO_URI=mongodb+srv://...
CORS_ORIGIN=*
NODE_ENV=development
LOG_LEVEL=debug
DOCTOR_SERVICE_URL=http://localhost:5002      # or http://doctor-service:5002 in Docker/K8s
APPOINTMENT_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004
```

> ⚠️ In Docker: use container names. In K8s: use Kubernetes Service DNS names. NEVER localhost.

## Service Folder Structure (Per Microservice)

```
service-name/
├── package.json
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
└── src/
    ├── server.js               # Entry — connects DB, starts Express
    ├── app.js                  # Express setup — middleware, routes
    ├── config/
    │   ├── db.js               # Mongoose connection
    │   ├── logger.js           # Winston logger
    │   └── swagger.js          # Swagger spec
    ├── controllers/            # Thin request handlers (req/res only)
    ├── middleware/
    │   ├── auth.js             # parseAuthHeaders, requireAuth, requireRole
    │   ├── errorHandler.js     # Global error → JSON response
    │   ├── notFound.js         # 404 handler
    │   └── requestLogger.js    # HTTP request logging
    ├── models/                 # Mongoose schemas
    ├── routes/                 # Express routers with validation + Swagger JSDoc
    ├── services/               # Business logic + inter-service clients
    └── utils/
        ├── ApiError.js         # Custom error class
        └── validate.js         # express-validator middleware
```

## Orchestration Layer

```
claude/                     → Claude Code orchestration
  agents/                   → 6 specialist agents
  commands/                 → 3 slash commands (/fix-issue, /deploy, /pr-review)
  rules/                    → 3 context rules (frontend.md, database.md, api.md)
  skills/                   → 1 skill (frontend-design)

agent/                      → Session memory
  BRIEF.md                  → Requirements & acceptance criteria
  CLAUDE.md                 → Tech stack & project config
  MEMORY.md                 → Mistakes, patterns, decisions
  TODO.md                   → Tasks, priorities, session handoff

agents/                     → Multi-tool orchestration
  agent.md                  → Agent behavior rules & boot sequence
  workflows/                → Reusable workflows (build, test, deploy, audit, commit)
```

## Project Structure

```
PrimeHealth-microservices-main/
├── CLAUDE.md                        # THIS FILE — project brain
├── CONTRIBUTING.md                  # Contribution guidelines
├── SECURITY.md                      # Security policy
├── design.md                        # UI design system spec
├── agent/                           # Session memory system
│   ├── BRIEF.md                     # Module requirements
│   ├── CLAUDE.md                    # Tech stack reference
│   ├── MEMORY.md                    # Persistent learning
│   └── TODO.md                      # Task tracker + handoff
├── agents/                          # Multi-tool orchestration
│   ├── agent.md
│   └── workflows/
├── claude/                          # Claude Code orchestration
│   ├── agents/
│   ├── commands/
│   ├── rules/
│   └── skills/
├── docs/
│   └── Sithmi_Guide.md              # Appointment + Payment dev guide
├── Frontend_UI/                     # Testing UI (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
└── micro-services/
    ├── docker/
    │   ├── docker-compose.yml
    │   └── .env.example
    ├── k8s/                         # Kubernetes manifests
    └── services/
        ├── doctor-service/          # Port 5002 (reference service)
        ├── appointment-service/     # Port 5003 (Sithmi)
        ├── payment-service/         # Port 5004 (Sithmi)
        └── prescription-service/   # Port 5005
```

## Agent Rules

- Before ANY code: complete the boot sequence above
- Copy doctor-service structure for new services — it is the reference implementation
- NEVER use localhost for service-to-service URLs in Docker or Kubernetes
- NEVER commit `.env` files, API keys, or secrets
- NEVER let frontend directly mark payment as successful — payment-service controls this
- NEVER touch Kubernetes before local + Docker flow works
- Always update `agent/TODO.md` and `agent/MEMORY.md` in real-time while coding
- Only build what BRIEF.md specifies — no scope creep

## Launch Checklist

- [ ] Both services start with `npm run dev` without error
- [ ] `GET /health` returns 200 on both services
- [ ] Swagger UI opens at `/api-docs` on both services
- [ ] Full booking flow works in Postman (book → pay → confirm)
- [ ] appointment auto-confirms after successful payment (inter-service works)
- [ ] Queue position endpoint returns correct data
- [ ] PDF invoice downloads with correct details
- [ ] `docker-compose up --build` succeeds
- [ ] All containers communicate correctly via container DNS names
- [ ] `kubectl apply` succeeds, all pods reach Running state
- [ ] Frontend demo flow works without Postman
- [ ] No API keys or secrets in any source file
- [ ] No `localhost` in any Docker or Kubernetes config

## Forbidden

- No `var` — use `const` and `let`
- No ES module syntax (`import`/`export`) — CommonJS only
- No hardcoded service URLs — always use env variables
- No localhost in Docker or K8s service-to-service calls
- No committing `.env` files or secrets
- No frontend marking payment success — payment-service does this via internal API
- No Kubernetes work before local service flow is proven in Postman
- No skipping input validation — express-validator required on all write endpoints
