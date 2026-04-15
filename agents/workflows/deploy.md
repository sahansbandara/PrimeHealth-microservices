---
description: Deploy PrimeHealth services via Docker Compose or Kubernetes
---

## Pre-Flight

1. Read `agent/TODO.md` → confirm all priority tasks are done before deploying
2. Run `agents/workflows/test.md` → Level 2 minimum (all endpoints work locally)
3. Verify no uncommitted changes: `git status` should be clean

---

## Option A — Docker Compose Deployment

```bash
# 1. Navigate to docker directory
cd micro-services/docker

# 2. Create environment file
cp .env.example .env
# Edit .env — set MONGO_URI_APPOINTMENT and MONGO_URI_PAYMENT

# 3. Build and start
docker-compose up --build -d

# 4. Verify all containers running
docker-compose ps
# Expected: appointment-service, payment-service, doctor-service — all "Up"

# 5. Health checks
curl http://localhost:5003/health
curl http://localhost:5004/health

# 6. Run integration test (Level 3 from test.md)
# Book → Pay → Confirm → Verify → Invoice

# 7. Check logs if something fails
docker-compose logs -f appointment-service
docker-compose logs -f payment-service
```

### Troubleshooting Docker

| Issue | Fix |
|-------|-----|
| Container exits immediately | Check `docker-compose logs <service>` for error |
| MongoDB connection refused | Verify MONGO_URI in .env is correct; check Atlas IP whitelist |
| Inter-service call fails | Ensure URLs use container names, not localhost |
| Port conflict | `lsof -i :5003` → kill conflicting process |

---

## Option B — Kubernetes Deployment

```bash
# 1. Navigate to k8s directory
cd micro-services/k8s

# 2. Apply ConfigMap and Secret first
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# 3. Deploy services
kubectl apply -f appointment-deployment.yaml
kubectl apply -f appointment-service.yaml
kubectl apply -f payment-deployment.yaml
kubectl apply -f payment-service.yaml

# 4. Verify pods
kubectl get pods
# All pods should show "Running" and "1/1 READY"

# 5. Verify services
kubectl get svc
# appointment-service and payment-service should show ClusterIP

# 6. Port-forward for testing
kubectl port-forward svc/appointment-service 5003:5003 &
kubectl port-forward svc/payment-service 5004:5004 &

# 7. Run integration test
curl http://localhost:5003/health
curl http://localhost:5004/health

# 8. Check logs if something fails
kubectl logs -f deployment/appointment-service
kubectl logs -f deployment/payment-service
```

### Troubleshooting K8s

| Issue | Fix |
|-------|-----|
| Pod in CrashLoopBackOff | `kubectl logs <pod-name>` → check for missing env vars |
| ImagePullBackOff | Docker image not built or not pushed to registry |
| Service not reachable | Check `kubectl get svc` → correct port mapping |
| Secret not found | Apply `secret.yaml` before deployments |

---

## Post-Deploy

1. Take screenshots of `kubectl get pods` and `kubectl get svc` for the report
2. Update `agent/TODO.md` → mark deployment task as Done
3. Commit: `chore(k8s): deploy appointment and payment services`
