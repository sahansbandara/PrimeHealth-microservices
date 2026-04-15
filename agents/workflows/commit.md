---
description: Commit and push changes for PrimeHealth following conventional commit standards
---

## Pre-Commit Checklist

1. `git diff --stat` → review what files changed
2. Verify no `.env` files in the diff: `git diff --name-only | grep "\.env$"` → must be empty
3. Verify no `node_modules/` in the diff
4. Verify services still work: `curl http://localhost:5003/health && curl http://localhost:5004/health`

---

## Commit Message Format

```
type(scope): description
```

### Types

| Type | When |
|------|------|
| `feat` | New endpoint, feature, or UI section |
| `fix` | Bug fix |
| `style` | CSS/formatting only (no logic change) |
| `refactor` | Code cleanup without behavior change |
| `docs` | Documentation files only |
| `test` | Test files only |
| `chore` | Dependencies, Dockerfiles, K8s manifests, tooling |

### Scopes

```
appointment-service    payment-service    frontend
docker                 k8s                docs
agent                  claude             security
```

### Examples

```bash
git commit -m "feat(appointment-service): add queue position endpoint"
git commit -m "fix(payment-service): prevent double confirm on same orderId"
git commit -m "docs(sithmi-guide): add Kubernetes deployment steps"
git commit -m "chore(docker): update docker-compose with payment-service"
git commit -m "style(frontend): fix card spacing on mobile"
git commit -m "refactor(payment-service): extract invoice generation to invoiceService"
```

---

## Commit Workflow

```bash
# 1. Stage changes
git add -A

# 2. Review staged diff
git diff --cached --stat

# 3. Commit with conventional message
git commit -m "type(scope): description"

# 4. Push to remote
git push origin main
# or push to feature branch: git push origin feature/my-feature
```

---

## Multi-File Commits

If changes span multiple services, either:

**Option A — One commit per service:**
```bash
git add micro-services/services/appointment-service/
git commit -m "feat(appointment-service): add cancel endpoint"

git add micro-services/services/payment-service/
git commit -m "feat(payment-service): add refund endpoint"
```

**Option B — Single commit for related changes:**
```bash
git add -A
git commit -m "feat(appointment+payment): add cancel and refund endpoints"
```

---

## Post-Commit

- Update `agent/TODO.md` if a task is now complete
- Update `agent/MEMORY.md` if a pattern or bug was discovered
