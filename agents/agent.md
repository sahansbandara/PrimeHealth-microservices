# Agent Configuration — PrimeHealth Microservices

## Boot Sequence (BEFORE ANY CODE)

1. Read `CLAUDE.md` — tech stack and project config
2. Read `agent/TODO.md` — read **Last Session** first, then tasks
3. Read `agent/MEMORY.md` — mistakes to avoid, patterns that work
4. Read `agent/BRIEF.md` — requirements and acceptance criteria
5. Read `docs/Sithmi_Guide.md` — developer reference (Appointment + Payment modules)
6. Read `design.md` — design system tokens and component patterns

After reading, state:
1. What was last done (from Last Session)
2. What's next (from Priority Tasks)
3. Any relevant past mistakes to avoid (from MEMORY)

---

## Project Context

Building **PrimeHealth Microservices** — an AI-enabled healthcare platform for SE3020 Distributed Systems (25% of final grade).

**Sithmi owns: appointment-service (`:5003`) + payment-service (`:5004`)**

Target users: Patients, Doctors, and Admin.

---

## Available Tools

| Tool | When to Use |
|------|-------------|
| **Antigravity / Claude Code** | Code generation, file operations, running services locally |
| **browser_subagent** | Testing the Frontend_UI and verifying visual design |
| **run_command** | Running npm scripts, curl tests, Docker commands |
| **write_to_file / replace_file_content** | Creating and editing source files |

---

## Agent Behavior Rules

1. **Boot first** — Complete the full boot sequence before writing any code
2. **REST APIs** — Return standardized `{ success, message, data }` JSON; use ApiError for errors
3. **Auth middleware** — Use `parseAuthHeaders + requireAuth + requireRole` chain
4. **Inter-service calls** — Use env variable URLs + axios + timeout + ApiError(502) on failure
5. **Container-first** — Ensure Docker and K8s files represent production parity with env vars
6. **Read guides** — Follow `docs/Sithmi_Guide.md` architecture for all decisions
7. **No scope creep** — Only build what BRIEF.md specifies for Sithmi's module
8. **Never localhost in containers** — Use service names in Docker Compose, K8s DNS names in K8s
9. **Handoff always** — Update `agent/TODO.md` Last Session before stopping work
10. **Live updates** — Update `agent/MEMORY.md` and `agent/TODO.md` as you work, not after

---

## Module Boundaries

| Who can modify | Files |
|----------------|-------|
| **Sithmi** | `micro-services/services/appointment-service/**` |
| **Sithmi** | `micro-services/services/payment-service/**` |
| **Sithmi** | `Frontend_UI/**` |
| **Sithmi** | `docs/Sithmi_Guide.md` |
| **Sithmi** | `micro-services/k8s/appointment*.yaml` |
| **Sithmi** | `micro-services/k8s/payment*.yaml` |
| **Shared** | `micro-services/docker/docker-compose.yml`, `k8s/configmap.yaml`, `k8s/secret.yaml` |
| **Do not touch** | `micro-services/services/doctor-service/**` (Vidushi's module) |
| **Do not touch** | `micro-services/services/prescription-service/**` (Vidushi's module) |
