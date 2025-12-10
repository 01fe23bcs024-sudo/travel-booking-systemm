# Kubernetes Manifests for Travel Booking System

This folder contains all Kubernetes configuration files for deploying the Travel Booking System.

## Files Overview

### Core Configuration
- **namespace.yaml** - Creates `travel-booking` namespace
- **configmap.yaml** - Environment configuration (non-sensitive)
- **secret.yaml** - Sensitive data (JWT, passwords, API keys)

### Database
- **mongodb-deployment.yaml** - MongoDB database deployment (1 replica)
- **mongodb-service.yaml** - MongoDB service (internal access)

### Cache
- **redis-deployment.yaml** - Redis cache deployment (1 replica)
- **redis-service.yaml** - Redis service (internal access)

### Backend API
- **backend-deployment.yaml** - Express.js backend (2 replicas)
- **backend-service.yaml** - Backend service (internal access)

### Frontend
- **frontend-deployment.yaml** - React/Nginx frontend (2 replicas)
- **frontend-service.yaml** - Frontend service (LoadBalancer for external access)

### Networking
- **ingress.yaml** - HTTP routing rules

## Deployment Scripts

- **deploy.ps1** - Windows PowerShell deployment script
- **deploy.sh** - Linux/macOS bash deployment script

## Quick Start

### Prerequisites
```bash
# Install tools
choco install minikube kubernetes-cli  # Windows
brew install minikube kubectl          # macOS
# For Linux: Use your package manager

# Start Minikube
minikube start --cpus=4 --memory=4096
```

### Deploy with Script
```bash
# Windows
.\deploy.ps1

# Linux/macOS
bash deploy.sh
```

### Manual Deployment
```bash
# Apply all manifests
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml
```

## Access Application

### Port Forwarding (Recommended for local testing)
```bash
# In Terminal 1: Frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# In Terminal 2: Backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open: http://localhost:3000
```

### Minikube IP
```bash
# Get Minikube IP
minikube ip

# Access frontend
http://<minikube-ip>:<frontend-nodeport>
```

## Useful kubectl Commands

```bash
# View all resources
kubectl get all -n travel-booking

# View pods
kubectl get pods -n travel-booking
kubectl get pods -n travel-booking -w  # Watch mode

# View deployments
kubectl get deployments -n travel-booking

# View services
kubectl get services -n travel-booking

# View logs
kubectl logs -f deployment/backend -n travel-booking
kubectl logs -f deployment/frontend -n travel-booking

# Describe pod (troubleshooting)
kubectl describe pod <pod-name> -n travel-booking

# Scale deployment
kubectl scale deployment backend --replicas=3 -n travel-booking

# Delete all resources
kubectl delete namespace travel-booking

# Dashboard
kubectl dashboard
```

## Architecture

```
Kubernetes Cluster
├── Namespace: travel-booking
│   ├── Frontend (Nginx) - 2 replicas
│   │   ├─ Pod 1
│   │   └─ Pod 2
│   ├── Backend (Express) - 2 replicas
│   │   ├─ Pod 1
│   │   └─ Pod 2
│   ├── MongoDB - 1 replica
│   └── Redis - 1 replica
├── Services
│   ├── frontend (LoadBalancer) - External access
│   ├── backend (ClusterIP) - Internal access
│   ├── mongodb (ClusterIP) - Internal access
│   └── redis (ClusterIP) - Internal access
└── Ingress
    └── travel-booking-ingress
```

## Scaling

```bash
# Scale backend to 5 replicas
kubectl scale deployment backend --replicas=5 -n travel-booking

# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3 -n travel-booking

# Autoscaling (requires metrics-server)
kubectl autoscale deployment backend --min=2 --max=10 -n travel-booking
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n travel-booking
```

### View pod logs
```bash
kubectl logs -f <pod-name> -n travel-booking
```

### Execute command in pod
```bash
kubectl exec -it <pod-name> -n travel-booking -- /bin/bash
```

### Check resource usage
```bash
kubectl top nodes
kubectl top pods -n travel-booking
```

## Environment Variables

Edit `configmap.yaml` for non-sensitive variables:
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `NODE_ENV` - Node environment
- `PORT` - Backend port

Edit `secret.yaml` for sensitive variables:
- `JWT_SECRET` - JWT signing key
- `MONGODB_PASSWORD` - Database password
- `EMAIL_PASSWORD` - Email service password
- `STRIPE_SECRET` - Payment gateway secret

## Production Considerations

1. **Persistent Volumes**: Use PV/PVC instead of emptyDir for MongoDB
2. **Image Registry**: Push images to Docker Hub or private registry
3. **Secrets Management**: Use HashiCorp Vault or AWS Secrets Manager
4. **Resource Limits**: Adjust based on your needs
5. **Ingress Controller**: Install nginx-ingress or similar
6. **Network Policies**: Restrict traffic between services
7. **RBAC**: Set up role-based access control
8. **Monitoring**: Install Prometheus and Grafana

## Support

For more information, see:
- MINIKUBE_QUICK_START.md - Quick start guide
- KUBERNETES_GUIDE.md - Complete guide with examples
- KUBERNETES_CHEATSHEET.md - kubectl command reference
