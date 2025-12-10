# 🚀 Kubernetes Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Architecture](#architecture)
3. [Minikube Setup](#minikube-setup)
4. [Deployment](#deployment)
5. [Useful Commands](#useful-commands)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required Tools
- **kubectl** - Kubernetes command-line tool
- **Docker** - For building container images (optional for Minikube)
- **Minikube** (for local development) OR actual K8s cluster

### Installation Links
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Docker](https://docs.docker.com/get-docker/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│        Kubernetes Cluster                   │
├─────────────────────────────────────────────┤
│                                             │
│  Namespace: travel-booking                  │
│  ┌───────────────────────────────────────┐  │
│  │ Frontend (Nginx)                      │  │
│  │  - 2 Replicas                         │  │
│  │  - LoadBalancer Service (Port 80)     │  │
│  └───────────────────────────────────────┘  │
│           ↓                                  │
│  ┌───────────────────────────────────────┐  │
│  │ Backend (Express.js)                  │  │
│  │  - 2 Replicas                         │  │
│  │  - ClusterIP Service (Port 5000)      │  │
│  └───────────────────────────────────────┘  │
│           ↓↓↓                                │
│  ┌──────────────┐  ┌────────────────────┐  │
│  │ MongoDB      │  │ Redis              │  │
│  │ (Port 27017) │  │ (Port 6379)        │  │
│  └──────────────┘  └────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🐳 Minikube Setup (Local Development)

### Step 1: Install Minikube
```bash
# Windows (Chocolatey)
choco install minikube

# macOS (Homebrew)
brew install minikube

# Linux
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### Step 2: Start Minikube
```bash
# Start cluster with 4 CPUs and 4GB memory
minikube start --cpus=4 --memory=4096

# Verify cluster is running
kubectl cluster-info
kubectl get nodes
```

### Step 3: Build Docker Images for Minikube
```bash
# Point Docker to Minikube's Docker daemon
eval $(minikube docker-env)

# Build images (they'll be available in Minikube)
cd ../
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# Verify images
docker images | grep travel-booking
```

### Step 4: Enable Minikube Addons (Optional)
```bash
# Enable Kubernetes Dashboard
minikube addons enable dashboard

# Enable Ingress
minikube addons enable ingress

# Enable Metrics Server
minikube addons enable metrics-server

# List all addons
minikube addons list
```

---

## 🚀 Deployment

### Option 1: Using Deployment Scripts

#### PowerShell (Windows)
```powershell
cd k8s
.\deploy.ps1
```

#### Bash (Linux/macOS)
```bash
cd k8s
bash deploy.sh
```

### Option 2: Manual Deployment

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 3. Deploy databases
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml

# 4. Deploy backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# 5. Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# 6. Deploy Ingress
kubectl apply -f k8s/ingress.yaml

# 7. Verify deployment
kubectl get all -n travel-booking
```

### Option 3: Deploy All at Once
```bash
# Apply all manifests in k8s directory
kubectl apply -f k8s/
```

---

## 📍 Access Your Application

### For Minikube
```bash
# Get Minikube IP
minikube ip

# Port forward frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Port forward backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open in browser
http://localhost:3000
```

### For Cloud Clusters
```bash
# Get LoadBalancer IP (may take a few minutes)
kubectl get service frontend -n travel-booking

# Once external IP is assigned, access at:
http://<EXTERNAL-IP>
```

---

## ✨ Useful Commands

### Check Deployment Status
```bash
# View all resources in namespace
kubectl get all -n travel-booking

# View specific resource type
kubectl get deployments -n travel-booking
kubectl get services -n travel-booking
kubectl get pods -n travel-booking
kubectl get configmaps -n travel-booking
kubectl get secrets -n travel-booking
```

### View Logs
```bash
# View logs from a pod
kubectl logs <pod-name> -n travel-booking

# View logs from a deployment (all replicas)
kubectl logs -f deployment/backend -n travel-booking

# View last 100 lines
kubectl logs --tail=100 deployment/frontend -n travel-booking
```

### Debugging
```bash
# Describe a pod
kubectl describe pod <pod-name> -n travel-booking

# Get pod details in YAML
kubectl get pod <pod-name> -n travel-booking -o yaml

# Execute command inside pod
kubectl exec -it <pod-name> -n travel-booking -- /bin/sh

# Port forward to a specific pod
kubectl port-forward pod/<pod-name> 5000:5000 -n travel-booking
```

### Scaling
```bash
# Scale deployment to N replicas
kubectl scale deployment backend --replicas=3 -n travel-booking

# Auto-scale based on CPU
kubectl autoscale deployment backend --min=2 --max=5 --cpu-percent=80 -n travel-booking
```

### Update & Rollback
```bash
# Update image in deployment
kubectl set image deployment/backend backend=travel-booking-backend:v2 -n travel-booking

# Check rollout history
kubectl rollout history deployment/backend -n travel-booking

# Rollback to previous version
kubectl rollout undo deployment/backend -n travel-booking
```

### Delete Resources
```bash
# Delete a specific pod (it will be recreated)
kubectl delete pod <pod-name> -n travel-booking

# Delete a deployment
kubectl delete deployment backend -n travel-booking

# Delete entire namespace (deletes all resources)
kubectl delete namespace travel-booking
```

### View Kubernetes Dashboard
```bash
# For Minikube
minikube dashboard

# For other clusters
kubectl proxy
# Then visit: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

---

## 🔧 Troubleshooting

### Issue: Pods stuck in "Pending"
**Solution:**
```bash
kubectl describe pod <pod-name> -n travel-booking
# Check Events section for details
```

Common causes:
- Insufficient CPU/memory resources
- Docker image not available locally
- Persistent volume not available

### Issue: CrashLoopBackOff
**Solution:**
```bash
kubectl logs <pod-name> -n travel-booking
# Check application logs for errors
```

Common causes:
- Missing environment variables
- Database connection failures
- Application crashes on startup

### Issue: Service has no endpoints
**Solution:**
```bash
# Check if pods are running
kubectl get pods -n travel-booking

# Check pod logs
kubectl logs <pod-name> -n travel-booking

# Check pod readiness
kubectl describe pod <pod-name> -n travel-booking
```

### Issue: Cannot reach application
**Solution:**
```bash
# Verify service is created
kubectl get service frontend -n travel-booking

# Port forward and test locally
kubectl port-forward service/frontend 3000:80 -n travel-booking
curl http://localhost:3000
```

### Issue: Database connection failures
**Solution:**
```bash
# Check if database pods are running
kubectl get pods -n travel-booking | grep mongodb

# Check database service
kubectl get service mongodb -n travel-booking

# Try connecting to database from backend pod
kubectl exec -it <backend-pod> -n travel-booking -- \
  mongosh --host mongodb --port 27017
```

### Issue: Out of memory errors
**Solution:**
```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n travel-booking

# Increase pod resource limits in deployment YAML
# Update memory limit in backend-deployment.yaml
```

---

## 📦 Production Deployment

For production, consider:

1. **Persistent Volumes** - Replace emptyDir with real storage
```yaml
volumes:
- name: mongodb-storage
  persistentVolumeClaim:
    claimName: mongodb-pvc
```

2. **Resource Limits** - Already set in manifests, adjust for production
3. **Horizontal Pod Autoscaler** - Auto-scale based on metrics
4. **Network Policies** - Restrict traffic between pods
5. **RBAC** - Role-based access control for security
6. **TLS Certificates** - Use cert-manager for automatic SSL
7. **Monitoring** - Add Prometheus + Grafana for metrics
8. **Logging** - Add ELK stack for centralized logging

---

## 🎓 Learning Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Minikube Official Guide](https://minikube.sigs.k8s.io/docs/)
- [Kubernetes by Google](https://www.kubernetes.dev/)
- [Interactive Tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)

---

## 🆘 Quick Help

```bash
# Create a quick test namespace
kubectl create namespace test
kubectl run nginx --image=nginx -n test

# Describe cluster info
kubectl cluster-info dump

# Get API resources
kubectl api-resources

# Get current context and cluster
kubectl config current-context
kubectl config get-clusters

# Switch context
kubectl config use-context <context-name>
```

---

**Happy deploying! 🚀**
