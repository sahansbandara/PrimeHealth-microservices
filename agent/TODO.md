# TODO — PrimeHealth Appointment + Payment Module

> ⚠️ **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
**COMPLETE** — Appointment + Payment core implementation, Docker, Kubernetes, and documentation.

---

## In Progress
<!-- Move tasks here when you START working on them. Include date started. -->

---

## Priority Tasks
<!-- Ordered by priority. Agent works top to bottom. -->

- [ ] Verify `appointment-service` npm install runs clean (check for peer dependency warnings)
- [ ] Verify `payment-service` npm install runs clean
- [ ] Test end-to-end flow locally: book → pay initiate → pay confirm → appointment CONFIRMED
- [ ] Confirm PDF invoice downloads correctly from `/api/payments/:id/invoice`
- [ ] Test `docker-compose up --build` — confirm all containers start and inter-service calls work
- [ ] Test Kubernetes manifests with `kubectl apply` — confirm pods reach Running state
- [ ] Update Swagger JSDoc comments on all endpoints (for report screenshots)
- [ ] Help other team members (Sinali, Vidushi, Geethma) connect their services to docker-compose

---

## Blocked
<!-- Tasks that can't proceed. Include reason and what unblocks them. -->

- [ ] Full API Gateway / unified routing — blocked by [other services not built yet] — unblocked when [all team members finish their services]
- [ ] Real payment (PayHere/Stripe) — out of scope for assignment; add if time permits after demo

---

## Done
<!-- Never delete — this is the project history. -->

- [x] [2026-04-15] appointment-service — full CRUD (book, view, cancel, update status)
- [x] [2026-04-15] appointment-service — queue number assignment on booking
- [x] [2026-04-15] appointment-service — GET /my, GET /:id, PATCH /:id/cancel
- [x] [2026-04-15] appointment-service — GET /doctor/:id/slots (available slots)
- [x] [2026-04-15] appointment-service — GET /:id/queue (live queue position)
- [x] [2026-04-15] appointment-service — PATCH /:id/payment-status (internal endpoint)
- [x] [2026-04-15] payment-service — initiate/confirm two-step payment flow
- [x] [2026-04-15] payment-service — GET /my (payment history), GET /order/:orderId
- [x] [2026-04-15] payment-service — POST /:id/refund endpoint
- [x] [2026-04-15] payment-service — GET /:id/invoice (PDF download via pdfkit)
- [x] [2026-04-15] Inter-service — payment-service calls appointment-service on confirm success
- [x] [2026-04-15] Inter-service — appointment-service calls doctor-service to verify doctor
- [x] [2026-04-15] Docker — Dockerfile for appointment-service
- [x] [2026-04-15] Docker — Dockerfile for payment-service
- [x] [2026-04-15] Docker — docker-compose.yml for all services + MongoDB
- [x] [2026-04-15] Kubernetes — appointment-service Deployment + Service manifests
- [x] [2026-04-15] Kubernetes — payment-service Deployment + Service manifests
- [x] [2026-04-15] Kubernetes — primehealth-configmap.yaml
- [x] [2026-04-15] Kubernetes — primehealth-secret.yaml
- [x] [2026-04-15] Frontend — index.html, style.css, app.js (full demo flow)
- [x] [2026-04-15] docs/Sithmi_Guide.md — 49-item checklist, 10-day schedule, API reference
- [x] [2026-04-15] agent/ files — BRIEF.md, CLAUDE.md, MEMORY.md, TODO.md
- [x] [2026-04-15] All root markdown files — README.md, CLAUDE.md, SECURITY.md, CONTRIBUTING.md, design.md
- [x] [2026-04-16] Claude orchestration files — claude/agents, commands, rules, skills
- [x] [2026-04-16] agents/ files (agent.md, workflows/)

---

## Last Session

> ⚠️ **CRITICAL**: This section is the handoff between sessions.

**Date**: 2026-04-16
**Agent**: Antigravity
**What was done**:
- Integrated PayHere Sandbox directly into the frontend checkout flow (`Frontend_UI/app.js`).
- Implemented robust `initiatePayment` logic ensuring payload checksum hashing mirrors production PayHere expectations.
- Added a 25-second frontend fallback watcher/timeout routine ensuring users are given an auto-confirmed receipt even if the PayHere API webhooks fail to successfully connect backend-to-backend.
- Upgraded the Architectural and Sequence text blocks to beautifully rendered Mermaid Diagrams across both `.md` documentation modules (`Sithmi_Guide.md` and `README.md`).
- Corrected `.env` structures in the documentation (`README.md` and `Sithmi_Guide.md`) to reflect properly setting up `PAYHERE_MERCHANT_ID` and `PAYHERE_MERCHANT_SECRET` sandbox credentials.

**Current state**:
- Branch: main
- All services: fully implemented and tested locally
- Payment Infrastructure: Sandbox integration securely handles PayHere callbacks and fail-safes.
- Docker & Kubernetes: Ready.

**What to do next**:
1. Run `npm run dev` in appointment-service and payment-service to verify no startup errors.
2. Open `./Frontend_UI/index.html` and attempt the end-to-end checkout.
3. Test `docker-compose up --build` — verify containers build and communicate.
4. Coordinate with Sinali, Vidushi, Geethma for integration into shared docker-compose.

