# 🚀 Hello Minikube - Travel Booking Edition

Learn Kubernetes basics by running your Travel Booking application on Minikube!

## What You'll Learn

This tutorial teaches you how to:
- ✅ Start a local Kubernetes cluster (Minikube)
- ✅ Build container images for your app
- ✅ Deploy apps to Kubernetes
- ✅ Access applications via port forwarding
- ✅ Scale deployments
- ✅ View logs and debug issues

## Prerequisites

```bash
# Check Docker is installed
docker --version

# Check kubectl is installed
kubectl version --client

# Verify Minikube is available
minikube version
```

If any are missing, install them first.

---

## Step 1: Start Minikube (5 minutes)

### Start the cluster
```bash
minikube start --driver=docker --cpus=4 --memory=4096
```

Output should show:
```
✓ minikube v1.35.0 on Windows
✓ Kubernetes v1.27.0 is now running
✓ Cluster started successfully
```

### Verify cluster is running
```bash
# Check cluster info
kubectl cluster-info

# List nodes
kubectl get nodes

# Expected output:
# NAME       STATUS   ROLES           AGE   VERSION
# minikube   Ready    control-plane   1m    v1.27.0
```

### View Minikube Dashboard (Optional)
```bash
# Opens dashboard in browser
minikube dashboard
```

---

## Step 2: Build Docker Images (10 minutes)

### Point Docker to Minikube
This tells Docker to use Minikube's Docker daemon instead of your local Docker.

**Windows (PowerShell):**
```powershell
& minikube docker-env | Invoke-Expression
```

**Linux/macOS (Bash):**
```bash
eval $(minikube docker-env)
```

### Build frontend image
```bash
cd frontend
docker build -t travel-booking-frontend:latest .
cd ..
```

Output:
```
[+] Building 45.2s (15/15) FINISHED
 => => naming to docker.io/library/travel-booking-frontend:latest
```

### Build backend image
```bash
cd backend
docker build -t travel-booking-backend:latest .
cd ..
```

### Verify images were built
```bash
docker images | grep travel-booking
```

Output:
```
travel-booking-frontend   latest   a1b2c3d4e5f6   2 minutes ago   150MB
travel-booking-backend    latest   x9y8z7w6v5u4   1 minute ago    200MB
```

---

## Step 3: Deploy Backend (5 minutes)

### Create deployment for backend
```bash
kubectl create deployment backend --image=travel-booking-backend:latest
```

### Expose backend as service
```bash
kubectl expose deployment backend --type=ClusterIP --port=5000
```

### Verify deployment
```bash
# Check deployment
kubectl get deployments

# Check pods
kubectl get pods

# Check service
kubectl get services
```

Expected output:
```
NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/backend       1/1     1            1           30s

NAME                     READY   STATUS    RESTARTS   AGE
pod/backend-abc123-xyz   1/1     Running   0          30s

NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
backend      ClusterIP   10.96.0.100   <none>        5000/TCP   30s
```

### View backend logs
```bash
kubectl logs deployment/backend

# Follow logs
kubectl logs deployment/backend -f
```

---

## Step 4: Deploy Frontend (5 minutes)

### Create deployment for frontend
```bash
kubectl create deployment frontend --image=travel-booking-frontend:latest
```

### Expose frontend as service
```bash
kubectl expose deployment frontend --type=LoadBalancer --port=80 --target-port=80
```

### Verify deployment
```bash
kubectl get deployments
kubectl get pods
kubectl get services
```

Expected output:
```
NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/frontend      1/1     1            1           30s
deployment.apps/backend       1/1     1            1           5m

NAME                      TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
frontend                  LoadBalancer   10.96.0.101   <pending>     80:31234/TCP   30s
backend                   ClusterIP      10.96.0.100   <none>        5000/TCP       5m
```

---

## Step 5: Access Your Application (5 minutes)

### Option 1: Port Forwarding (Recommended for local testing)

**Terminal 1 - Access Frontend:**
```bash
kubectl port-forward service/frontend 3000:80
```

Then open: **http://localhost:3000**

**Terminal 2 - Access Backend (Optional):**
```bash
kubectl port-forward service/backend 5000:5000
```

API endpoint: **http://localhost:5000/api**

### Option 2: Minikube Service (Auto-opens browser)
```bash
minikube service frontend
```

---

## Step 6: Scale Your Application

### Scale backend to 3 replicas
```bash
kubectl scale deployment backend --replicas=3
```

### Watch new pods starting
```bash
kubectl get pods -w
```

You should see 3 backend pods running:
```
NAME                       READY   STATUS    RESTARTS   AGE
backend-abc123-xyz         1/1     Running   0          5m
backend-def456-uvw         1/1     Running   0          30s
backend-ghi789-rst         1/1     Running   0          30s
```

### Scale back to 1
```bash
kubectl scale deployment backend --replicas=1
```

---

## Step 7: Test Self-Healing

### Delete a pod
```bash
kubectl delete pod <pod-name>
```

Example:
```bash
kubectl delete pod backend-abc123-xyz
```

### Watch Kubernetes automatically recreate it
```bash
kubectl get pods -w
```

You'll see the pod being deleted and a new one created automatically! This is self-healing in action.

---

## Step 8: View Application Logs

### See what's happening
```bash
# Backend logs
kubectl logs deployment/backend

# Frontend logs
kubectl logs deployment/frontend

# Follow logs in real-time
kubectl logs deployment/backend -f

# See previous logs (if pod crashed)
kubectl logs deployment/backend --previous
```

---

## Step 9: Execute Commands in Pods

### Run a command inside a pod
```bash
# Find a pod name
kubectl get pods

# Run command
kubectl exec <pod-name> -- ls -la

# Open shell
kubectl exec -it <pod-name> -- /bin/bash
```

Example - check MongoDB connection:
```bash
kubectl exec -it backend-abc123-xyz -- curl http://localhost:5000/api
```

---

## Step 10: Clean Up

### Delete everything
```bash
# Delete services
kubectl delete service frontend backend

# Delete deployments
kubectl delete deployment frontend backend

# Stop Minikube (keeps data)
minikube stop

# Delete Minikube cluster
minikube delete
```

### Restart Minikube
```bash
# Start cluster again
minikube start --driver=docker
```

---

## Useful Commands Summary

```bash
# Cluster management
minikube start --driver=docker --cpus=4 --memory=4096
minikube stop
minikube delete
minikube dashboard

# Kubernetes resources
kubectl get pods
kubectl get services
kubectl get deployments
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- /bin/bash

# Scaling
kubectl scale deployment backend --replicas=3

# Port forwarding
kubectl port-forward service/frontend 3000:80

# Delete resources
kubectl delete pod <pod-name>
kubectl delete deployment backend
kubectl delete service frontend

# Watch real-time changes
kubectl get pods -w
kubectl rollout status deployment/backend
```

---

## Common Issues & Fixes

### Minikube won't start
```bash
# Try with different driver
minikube start --driver=hyperv
# or
minikube start --driver=virtualbox

# Check Docker is running
docker ps
```

### Pods stuck in "Pending"
```bash
# Check cluster resources
kubectl describe nodes

# Increase Minikube memory
minikube stop
minikube start --memory=8192
```

### Can't access application
```bash
# Check service is created
kubectl get services

# Check pods are running
kubectl get pods

# Try port-forward again
kubectl port-forward service/frontend 3000:80
```

### Pod keeps crashing
```bash
# Check logs
kubectl logs <pod-name>

# Check pod description
kubectl describe pod <pod-name>

# See previous logs
kubectl logs <pod-name> --previous
```

---

## Architecture Visualization

```
Your Computer
    │
    ├─── Docker (Container Runtime)
    │        │
    │        └─── Minikube Cluster
    │             │
    │             ├─── Frontend Pod (Nginx)
    │             │     └─ Port 80
    │             │
    │             ├─── Backend Pod (Express)
    │             │     └─ Port 5000
    │             │
    │             └─── Services (Internal Networking)
    │                   ├─ frontend (LoadBalancer)
    │                   └─ backend (ClusterIP)
    │
    └─── kubectl (Command-line tool)
         └─ Manages Minikube cluster
```

---

## What Happens When You Deploy

1. **Build Images**: Docker creates container images from your code
2. **Push to Minikube**: Images are available to Kubernetes
3. **Create Deployment**: Kubernetes creates pods from images
4. **Create Service**: Kubernetes creates networking for pods
5. **Port Forward**: You connect locally to the service
6. **Traffic Flow**: 
   - Browser → Port Forward → Service → Pod → Your App
   - Your App → Pod → Service → Database (if connected)

---

## Learning Outcomes

After completing this tutorial, you understand:

✅ How to start a Kubernetes cluster locally
✅ How to build and deploy containerized applications
✅ How to expose applications via services
✅ How to scale deployments
✅ How Kubernetes provides self-healing
✅ How to monitor and debug running applications
✅ How networking works in Kubernetes
✅ Real-world Kubernetes patterns

---

## Next Steps

1. **Add MongoDB & Redis** - Deploy databases to Kubernetes
2. **Use YAML Manifests** - Replace imperative commands with declarative YAML
3. **Set Resource Limits** - Specify CPU and memory limits
4. **Configure Health Checks** - Add liveness and readiness probes
5. **Rolling Updates** - Update images without downtime
6. **Persistent Storage** - Make data survive pod restarts

---

## Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Hello Minikube](https://kubernetes.io/docs/tutorials/hello-minikube/)
- [Minikube Docs](https://minikube.sigs.k8s.io/)
- [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

---

**🎉 Congratulations! You're now running your Travel Booking app on Kubernetes!**

Happy learning! 🚀
