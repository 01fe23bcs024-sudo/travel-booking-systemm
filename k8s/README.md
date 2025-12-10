# Kubernetes Manifests - Travel Booking System

Complete Kubernetes configuration for deploying the Travel Booking System.

## 📁 Files Included

### Core Configuration
- **namespace.yaml** - Creates `travel-booking` namespace
- **configmap.yaml** - Environment configuration
- **secret.yaml** - Sensitive data (JWT secret, URIs)

### Frontend
- **frontend-deployment.yaml** - Frontend pod replicas
- **frontend-service.yaml** - LoadBalancer for external access

### Backend
- **backend-deployment.yaml** - Backend API pod replicas
- **backend-service.yaml** - ClusterIP for internal access

### Databases
- **mongodb-deployment.yaml** - MongoDB pod with storage
- **mongodb-service.yaml** - MongoDB service
- **redis-deployment.yaml** - Redis pod with storage
- **redis-service.yaml** - Redis service

### Networking
- **ingress.yaml** - HTTP/HTTPS routing (optional)

### Deployment
- **deploy.ps1** - PowerShell deployment script
- **deploy.sh** - Bash deployment script

---

## 🚀 Quick Start

### Prerequisites
```bash
# Install kubectl
kubectl version --client

# Verify cluster access
kubectl cluster-info
```

### Deploy All
```bash
# Using script (PowerShell - Windows)
cd k8s
.\deploy.ps1

# Using script (Bash - Linux/macOS)
cd k8s
bash deploy.sh

# Or manually
kubectl apply -f k8s/
```

### Verify Deployment
```bash
# Check all resources
kubectl get all -n travel-booking

# Watch deployments
kubectl get pods -n travel-booking -w
```

### Access Application
```bash
# Port forward frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Port forward backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open: http://localhost:3000
```

---

## 🔐 Security Notes

⚠️ **For Production:**
1. Change `JWT_SECRET` in secret.yaml
2. Use external MongoDB/Redis services (not local pods)
3. Enable RBAC and Network Policies
4. Use TLS certificates for HTTPS
5. Set proper resource limits and requests
6. Use Private Container Registry for images

---

## 📚 Documentation

- See **KUBERNETES_GUIDE.md** for detailed instructions
- See **MINIKUBE_QUICK_START.md** for local development
- See **KUBERNETES_CHEATSHEET.md** for common commands

---

## 🆘 Troubleshooting

```bash
# Check pod status
kubectl describe pod <pod-name> -n travel-booking

# View logs
kubectl logs deployment/backend -n travel-booking

# Check service endpoints
kubectl get endpoints -n travel-booking
```

For more help, see KUBERNETES_GUIDE.md → Troubleshooting section.

---

**Ready to deploy? Start with the deployment script!** 🚀
