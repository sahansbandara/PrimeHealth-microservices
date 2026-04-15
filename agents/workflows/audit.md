---
description: Security and quality audit for PrimeHealth microservices before submission
---

## Pre-Flight

1. Read `SECURITY.md` → understand the security rules
2. Read `agent/MEMORY.md` → check for known security issues or fixes

---

## Step 1 — Secret Scanning

```bash
# Check for hardcoded secrets in source
grep -rn "mongodb+srv\|API_KEY\|SECRET\|PASSWORD\|TOKEN" micro-services/services/ --include="*.js"

# Check .env files aren't committed
git ls-files | grep "\.env$"
# Expected: ZERO results (only .env.example should be tracked)

# Check .gitignore covers sensitive files
cat micro-services/services/appointment-service/.gitignore
cat micro-services/services/payment-service/.gitignore
```

**If any real secrets found in source → CRITICAL → move to .env immediately.**

---

## Step 2 — Input Validation Audit

```bash
# Check all POST/PATCH routes use express-validator
grep -rn "body\|param\|query" micro-services/services/*/src/routes/*.js --include="*.js" | grep -v "node_modules"

# Verify validate middleware is applied
grep -rn "validate" micro-services/services/*/src/routes/*.js
```

Every write endpoint must have:
- [ ] express-validator rules defined in route
- [ ] `validate` middleware called before controller
- [ ] Proper error messages for each validation failure

---

## Step 3 — Error Handling Audit

```bash
# Check all async controllers use try/catch
grep -rn "exports\." micro-services/services/*/src/controllers/*.js
# Each should have try { ... } catch (err) { next(err) }

# Check errorHandler middleware exists
ls micro-services/services/appointment-service/src/middleware/errorHandler.js
ls micro-services/services/payment-service/src/middleware/errorHandler.js

# Check for unhandled promise rejections
grep -rn "\.then\|\.catch\|await" micro-services/services/*/src/services/*.js
# All await calls should be inside try/catch
```

---

## Step 4 — Auth & Authorization Audit

```bash
# Check auth middleware is applied on protected routes
grep -rn "requireAuth\|requireRole" micro-services/services/*/src/routes/*.js
```

Verify:
- [ ] Patient-only routes require `requireRole('PATIENT')` or similar
- [ ] Doctor-only routes require `requireRole('DOCTOR')`
- [ ] Admin routes require `requireRole('ADMIN')`
- [ ] Internal endpoints (payment-status update) are not exposed to patients
- [ ] `parseAuthHeaders` is applied globally in `app.js`

---

## Step 5 — Dependency Audit

```bash
# Check for known vulnerabilities
cd micro-services/services/appointment-service && npm audit
cd micro-services/services/payment-service && npm audit

# Check for outdated packages
npm outdated
```

---

## Step 6 — Docker & K8s Security

- [ ] Dockerfile uses `node:20-alpine` (minimal image)
- [ ] Dockerfile has `USER node` (non-root)
- [ ] `.dockerignore` excludes `.env`, `node_modules`, test files
- [ ] K8s secrets are base64-encoded (not plain text)
- [ ] No secrets hardcoded in deployment YAML
- [ ] Services use `ClusterIP` (not externally exposed without need)

---

## Step 7 — Code Quality

```bash
# Check for console.log (should use logger in production)
grep -rn "console\.log\|console\.error" micro-services/services/*/src/ --include="*.js" | grep -v "node_modules"

# Check for var (should be const/let)
grep -rn "var " micro-services/services/*/src/ --include="*.js" | grep -v "node_modules"

# Check for eval (never allowed)
grep -rn "eval(" micro-services/services/*/src/ --include="*.js"

# Check for innerHTML (XSS risk in frontend)
grep -rn "innerHTML" Frontend_UI/ --include="*.js"
```

---

## Audit Report

After completing all steps, summarize:

```
## Security Audit Report — PrimeHealth

**Date:** YYYY-MM-DD
**Services Audited:** appointment-service, payment-service

### Findings
- CRITICAL: [count] — [details]
- WARNING: [count] — [details]
- INFO: [count] — [details]

### Verdict
- [ ] PASS — Ready for submission
- [ ] FAIL — Fix CRITICALs before submitting
```

Update `agent/MEMORY.md` with any findings.
