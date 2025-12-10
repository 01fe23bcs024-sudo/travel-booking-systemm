# 🚀 Minikube Quick Start - 3 Steps

Get Kubernetes running on your computer in 15 minutes!

## Step 1: Install Tools (5 minutes)

### Windows
```powershell
# Open PowerShell as Administrator
choco install minikube kubernetes-cli docker-desktop

# Verify
kubectl version
minikube version
```

### macOS
```bash
brew install minikube kubectl docker

# Verify
kubectl version
minikube version
```

### Linux (Ubuntu)
```bash
# Minikube
curl -Lo minikube https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
chmod +x minikube && sudo mv minikube /usr/local/bin/

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Verify
kubectl version
minikube version
```

## Step 2: Start Cluster (5 minutes)

```bash
# Start Minikube cluster
minikube start --cpus=4 --memory=4096

# Check cluster status
kubectl cluster-info

# View nodes
kubectl get nodes

# Optional: View dashboard
minikube dashboard
```

Status should show:
```
✓ minikube v1.31.0 on Windows
✓ Kubernetes v1.27.0
✓ Namespace 'default' created
```

## Step 3: Deploy Application (5 minutes)

```bash
# Navigate to project
cd travel-booking-systemm

# Configure Docker to use Minikube
minikube docker-env | Invoke-Expression  # Windows
eval $(minikube docker-env)              # Linux/macOS

# Build images
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# Deploy
cd k8s
.\deploy.ps1        # Windows
bash deploy.sh      # Linux/macOS
```

Wait for pods to be ready:
```
kubectl get pods -n travel-booking -w
```

## Access Application

### Option 1: Port Forwarding (Recommended)

```bash
# Terminal 1: Frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Terminal 2: Backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open browser: http://localhost:3000
```

### Option 2: Minikube Service

```bash
# View services
minikube service list -n travel-booking

# Access frontend
minikube service frontend -n travel-booking
```

## Verify Deployment

```bash
# Check all resources
kubectl get all -n travel-booking

# Check pod status
kubectl get pods -n travel-booking

# View logs
kubectl logs -f deployment/backend -n travel-booking

# Test API
kubectl exec <backend-pod> -n travel-booking -- curl http://localhost:5000/api
```

## Common Commands

```bash
# Stop cluster (keeps data)
minikube stop

# Start cluster (restores data)
minikube start

# Delete cluster (removes everything)
minikube delete

# SSH into Minikube
minikube ssh

# View resources
kubectl get pods -n travel-booking
kubectl get services -n travel-booking
kubectl get deployments -n travel-booking

# Scale deployment
kubectl scale deployment backend --replicas=3 -n travel-booking

# View logs
kubectl logs -f deployment/backend -n travel-booking

# Delete everything
kubectl delete namespace travel-booking
```

## Troubleshooting

### Minikube won't start
```bash
# Increase resources
minikube start --cpus=8 --memory=8192

# Check Docker
docker ps

# Restart Minikube
minikube stop
minikube delete
minikube start
```

### Pods not starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n travel-booking

# View logs
kubectl logs <pod-name> -n travel-booking

# Check resources
kubectl top pods -n travel-booking
```

### Can't access application
```bash
# Check port forwarding
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Check service
kubectl get services -n travel-booking

# Test endpoint
curl http://localhost:3000
```

## What's Next?

✅ Application is running!

1. **Explore the Dashboard**
   ```bash
   minikube dashboard
   ```

2. **Scale Applications**
   ```bash
   kubectl scale deployment backend --replicas=5 -n travel-booking
   ```

3. **View Logs**
   ```bash
   kubectl logs -f deployment/backend -n travel-booking
   ```

4. **Delete Pods** (watch them respawn)
   ```bash
   kubectl delete pod <pod-name> -n travel-booking
   ```

5. **Learn More**
   - Read: KUBERNETES_GUIDE.md
   - Reference: KUBERNETES_CHEATSHEET.md

## Resources

- [Minikube Docs](https://minikube.sigs.k8s.io/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Interactive Tutorial](https://kubernetes.io/docs/tutorials/)

---

**🎉 You're running Kubernetes! Congratulations!**

For detailed learning, see `KUBERNETES_GUIDE.md`
