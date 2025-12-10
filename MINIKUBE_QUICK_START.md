# 📖 Quick Start Guide for Minikube (Teacher Demo)

## What is Minikube?
Minikube runs a single-node Kubernetes cluster locally on your computer. Perfect for learning!

---

## 🎯 3-Step Quick Start

### Step 1: Install (5 minutes)
```powershell
# Windows - Install tools
choco install minikube kubernetes-cli docker

# Verify
minikube version
kubectl version --client
```

### Step 2: Start Cluster (2 minutes)
```bash
# Start Minikube with 4 CPUs and 4GB RAM
minikube start --cpus=4 --memory=4096

# Verify it's running
minikube status
kubectl cluster-info
```

### Step 3: Deploy Application (5 minutes)
```bash
# Point Docker to Minikube
minikube docker-env | Invoke-Expression

# Build images
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# Deploy
cd k8s
.\deploy.ps1

# Check status
kubectl get all -n travel-booking
```

---

## 🌐 Access Your Application

### Port Forward (Simplest Method)
```bash
# Terminal 1: Frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Terminal 2: Backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open browser: http://localhost:3000
```

---

## 📊 Monitor in Real-Time
```bash
# Watch all resources
kubectl get pods -n travel-booking -w

# View logs
kubectl logs -f deployment/backend -n travel-booking

# Dashboard
minikube dashboard
```

---

## 🔄 Scale Up/Down
```bash
# Scale to 5 replicas
kubectl scale deployment backend --replicas=5 -n travel-booking

# Check
kubectl get pods -n travel-booking

# Scale back to 2
kubectl scale deployment backend --replicas=2 -n travel-booking
```

---

## 🧹 Cleanup
```bash
# Delete all
kubectl delete namespace travel-booking

# Stop Minikube
minikube stop

# Delete Minikube
minikube delete
```

---

**That's it! You're running Kubernetes! 🚀**
