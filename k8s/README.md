# Kubernetes Manifests Reference

This folder contains all Kubernetes configuration files for the Travel Booking System.

## Files Overview

| File | Purpose |
|------|---------|
| `namespace.yaml` | Kubernetes namespace (travel-booking) |
| `configmap.yaml` | Environment configuration |
| `secret.yaml` | Sensitive data (secrets) |
| `frontend-deployment.yaml` | Frontend pod replicas |
| `frontend-service.yaml` | Frontend service |
| `backend-deployment.yaml` | Backend pod replicas |
| `backend-service.yaml` | Backend service |
| `mongodb-deployment.yaml` | MongoDB pod |
| `mongodb-service.yaml` | MongoDB service |
| `redis-deployment.yaml` | Redis pod |
| `redis-service.yaml` | Redis service |
| `ingress.yaml` | Ingress routing (optional) |
| `deploy.ps1` | PowerShell deployment script |
| `deploy.sh` | Bash deployment script |

## Quick Deploy

### Option 1: Using Script (Windows)
```powershell
.\deploy.ps1
```

### Option 2: Using Script (Linux/macOS)
```bash
bash deploy.sh
```

### Option 3: Manual
```bash
kubectl apply -f .
```

## Verify Deployment
```bash
kubectl get all -n travel-booking
kubectl get pods -n travel-booking
kubectl get services -n travel-booking
```

## Access Application
```bash
kubectl port-forward service/frontend 3000:80 -n travel-booking
# Open: http://localhost:3000
```

---

See `KUBERNETES_GUIDE.md` for complete documentation!
