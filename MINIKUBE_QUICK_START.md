# 🐳 Minikube Quick Start Guide

## What is Minikube?
Minikube is a tool that runs a single-node Kubernetes cluster locally on your machine. Perfect for learning Kubernetes without needing cloud infrastructure!

---

## 📥 Installation

### Windows (Recommended: Chocolatey)
```powershell
# Install Minikube
choco install minikube

# Install kubectl
choco install kubernetes-cli

# Verify installation
minikube version
kubectl version --client
```

### macOS (Homebrew)
```bash
brew install minikube
brew install kubectl
```

### Linux
```bash
# Download and install Minikube
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Download and install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

---

## ▶️ Getting Started

### Step 1: Start Minikube
```bash
# Basic start
minikube start

# Start with custom resources
minikube start --cpus=4 --memory=4096

# Use specific driver (default: hyperv on Windows, hyperkit on macOS)
minikube start --driver=docker
```

### Step 2: Verify Cluster is Running
```bash
# Check status
minikube status

# View cluster info
kubectl cluster-info

# View nodes
kubectl get nodes
```

### Step 3: Build Docker Images
```powershell
# Point to Minikube's Docker daemon
minikube docker-env | Invoke-Expression

# Build images (they'll be stored in Minikube)
cd travel-booking-systemm
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# Verify images are in Minikube
docker images
```

---

## 🚀 Deploy Travel Booking System

### Option 1: Quick Deploy (Recommended)
```powershell
# Navigate to k8s directory
cd travel-booking-systemm\k8s

# Run deployment script
.\deploy.ps1

# Watch deployments
kubectl get deployments -n travel-booking -w
```

### Option 2: Manual Deploy
```bash
# Create all resources
kubectl apply -f k8s/

# Monitor status
kubectl get all -n travel-booking
```

---

## 🌐 Access Your Application

### Port Forward (Easiest)
```bash
# Terminal 1: Forward frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Terminal 2: Forward backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open browser: http://localhost:3000
```

### Via Minikube IP
```bash
# Get Minikube IP
minikube ip

# View frontend at: http://<MINIKUBE_IP>:30000
# (if using NodePort service)
```

---

## 📊 Monitor Your Deployment

### View Dashboard
```bash
minikube dashboard
```

### Check Pod Status
```bash
# All pods in travel-booking namespace
kubectl get pods -n travel-booking

# Watch pods in real-time
kubectl get pods -n travel-booking -w

# Detailed pod info
kubectl describe pod <pod-name> -n travel-booking
```

### View Logs
```bash
# Backend logs
kubectl logs -f deployment/backend -n travel-booking

# Frontend logs
kubectl logs -f deployment/frontend -n travel-booking

# Database logs
kubectl logs -f deployment/mongodb -n travel-booking
```

---

## 🔧 Common Tasks

### Restart a Pod
```bash
# Delete pod (it will auto-restart)
kubectl delete pod <pod-name> -n travel-booking

# Or restart deployment
kubectl rollout restart deployment/backend -n travel-booking
```

### Scale Deployment
```bash
# Scale to 3 replicas
kubectl scale deployment backend --replicas=3 -n travel-booking
```

### View Resource Usage
```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n travel-booking
```

### Execute Command in Pod
```bash
# Open shell in pod
kubectl exec -it <pod-name> -n travel-booking -- sh

# Run command
kubectl exec <pod-name> -n travel-booking -- curl http://localhost:5000/api/health
```

---

## 🛑 Cleanup

### Delete Everything
```bash
# Delete namespace (deletes all resources)
kubectl delete namespace travel-booking

# Delete Minikube cluster
minikube delete
```

### Stop Minikube (Keep It)
```bash
minikube stop

# Restart later
minikube start
```

---

## 📚 Useful Minikube Commands

```bash
# View Minikube status
minikube status

# Get Minikube IP address
minikube ip

# SSH into Minikube VM
minikube ssh

# View Minikube logs
minikube logs

# Update Minikube
minikube update-check

# View available addons
minikube addons list

# Enable addon (e.g., dashboard)
minikube addons enable dashboard

# Open service in browser (for LoadBalancer services)
minikube service frontend -n travel-booking
```

---

## 🎓 Minikube Basics Explained

### What Happens When You Run Minikube?
1. **Create VM** - Minikube creates a virtual machine on your computer
2. **Install Kubernetes** - Kubernetes is installed in the VM
3. **Start Components** - API Server, Controller, Scheduler, Kubelet all start
4. **Ready to Use** - Cluster is ready to deploy applications

### Kubectl Communication
```
Your Computer
    ↓
kubectl (CLI)
    ↓
API Server (in Minikube)
    ↓
Kubernetes Components
    ↓
Docker Containers
```

### Deployment Workflow
```
Pod (Container)
    ↑
Deployment (manages replicas)
    ↑
Service (exposes pods)
    ↑
Your Application
```

---

## ✅ Verification Checklist

After deployment, verify:
- [ ] Minikube is running: `minikube status`
- [ ] Kubectl is connected: `kubectl cluster-info`
- [ ] Namespace created: `kubectl get namespace travel-booking`
- [ ] Deployments running: `kubectl get deployments -n travel-booking`
- [ ] Pods are ready: `kubectl get pods -n travel-booking`
- [ ] Services created: `kubectl get services -n travel-booking`
- [ ] Frontend accessible: `http://localhost:3000`
- [ ] Backend health check: `curl http://localhost:5000/api/health`

---

## 🆘 Troubleshooting

### Minikube won't start
```bash
# Delete and recreate
minikube delete
minikube start

# Try with different driver
minikube start --driver=docker
```

### Pods stuck in Pending
```bash
# Check pod events
kubectl describe pod <pod-name> -n travel-booking

# Check node resources
kubectl top nodes
```

### Images not found
```bash
# Make sure Docker env is set
minikube docker-env | Invoke-Expression

# Rebuild and push images
docker build -t travel-booking-systemm-frontend:latest ./frontend
```

### Cannot access application
```bash
# Port forward
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Or use Minikube service
minikube service frontend -n travel-booking
```

---

## 📖 Next Steps

1. **Learn Kubectl** - Master key commands
2. **Explore ConfigMaps** - Manage configuration
3. **Study Services** - Understand networking
4. **Deploy Ingress** - Advanced routing
5. **Add Monitoring** - Prometheus + Grafana
6. **Learn Helm** - Package management

---

## 🔗 Quick Links

- [Minikube Docs](https://minikube.sigs.k8s.io/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Interactive Katacoda Labs](https://www.katacoda.com/courses/kubernetes)

---

**Happy learning! 🎉 Start with `minikube start` now!**
