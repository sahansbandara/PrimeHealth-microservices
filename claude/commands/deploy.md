---
description: Deploy command standard for PrimeHealth
---

# Deploy Workflow
When instructed to deploy:
1. Run local integration checks.
2. Build local docker-compose images: `docker-compose up --build -d`.
3. Check status via `/health`.
4. Run Kubernetes deployments if configured `kubectl apply -f .`.
5. Update `agent/TODO.md`.
