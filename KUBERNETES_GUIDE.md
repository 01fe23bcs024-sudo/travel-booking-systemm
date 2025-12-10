# 🚀 Kubernetes for Teachers - Complete Guide

## What is Kubernetes?

Kubernetes is an **orchestration platform** that automatically manages containerized applications across multiple machines. Think of it as a "container manager" that:

- **Deploys** containers
- **Scales** applications up/down
- **Heals** failed containers
- **Updates** applications
- **Manages networking** between containers

---

## 📚 Core Concepts Explained

### 1. **Pod** 
A Pod is the smallest unit in Kubernetes. It's like a container wrapper.
```yaml
Pod = 1 or more containers sharing network
```

### 2. **Deployment**
Manages multiple Pod replicas and ensures they stay running.
```yaml
Deployment manages replicas (e.g., 2 frontend pods)
```

### 3. **Service**
Provides stable networking to Pods.
```yaml
Service = LoadBalancer or ClusterIP for pods
```

### 4. **ConfigMap**
Stores non-sensitive configuration data.
```yaml
ConfigMap = Environment variables (NODE_ENV, PORT, etc.)
```

### 5. **Secret**
Stores sensitive data (encrypted).
```yaml
Secret = Passwords, JWT secrets, connection strings
```

### 6. **Namespace**
Logical isolation for resources.
```yaml
Namespace = Container for related resources (travel-booking)
```

---

## 🏗️ Travel Booking System Architecture

```
┌─────────────────────────────────────────────┐
│        KUBERNETES CLUSTER                   │
│                                             │
│  Namespace: travel-booking                  │
│  ┌──────────────────────────────────────┐   │
│  │ Frontend (Nginx)      - 2 replicas   │   │
│  │ Backend (Express)     - 2 replicas   │   │
│  │ MongoDB               - 1 replica    │   │
│  │ Redis                 - 1 replica    │   │
│  │ ConfigMap + Secrets                  │   │
│  └──────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📁 Files Included

### Manifests (k8s/ directory)
```
namespace.yaml              ← Kubernetes namespace
configmap.yaml             ← Environment configuration
secret.yaml                ← Secrets (JWT, DB URIs)
frontend-deployment.yaml   ← Frontend pods
frontend-service.yaml      ← Frontend service
backend-deployment.yaml    ← Backend pods
backend-service.yaml       ← Backend service
mongodb-deployment.yaml    ← MongoDB pod
mongodb-service.yaml       ← MongoDB service
redis-deployment.yaml      ← Redis pod
redis-service.yaml         ← Redis service
ingress.yaml               ← HTTP routing (optional)
deploy.ps1                 ← PowerShell deployment
deploy.sh                  ← Bash deployment
```

---

## 🎓 Learning Steps for Students

### Step 1: Install Required Tools
```bash
# Install kubectl (Kubernetes CLI)
choco install kubernetes-cli              # Windows
# brew install kubectl                     # macOS
# sudo apt-get install kubectl            # Linux

# Install Minikube (Local Kubernetes)
choco install minikube                    # Windows
# brew install minikube                    # macOS

# Verify installation
kubectl version --client
minikube version
```

### Step 2: Start Minikube (Local Cluster)
```bash
# Start with resources
minikube start --cpus=4 --memory=4096

# Verify it's running
minikube status
kubectl cluster-info
```

### Step 3: Build Docker Images
```bash
# Point Docker to Minikube
minikube docker-env | Invoke-Expression

# Build images
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# Verify
docker images
```

### Step 4: Deploy to Kubernetes

#### Option A: Using Script (Easiest)
```powershell
cd k8s
.\deploy.ps1
```

#### Option B: Manual Deployment
```bash
# Deploy everything
kubectl apply -f k8s/

# Verify
kubectl get all -n travel-booking
```

### Step 5: Access the Application
```bash
# Terminal 1: Port forward frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Terminal 2: Port forward backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open browser
http://localhost:3000
```

---

## 📖 Understanding Each YAML File

### namespace.yaml
```yaml
Defines: travel-booking namespace
Purpose: Isolate resources
Learn: kubectl get namespaces
```

### configmap.yaml
```yaml
Contains:
  - FRONTEND_URL
  - NODE_ENV
  - PORT
Purpose: Store non-sensitive configuration
Learn: kubectl get configmaps -n travel-booking
```

### secret.yaml
```yaml
Contains:
  - MONGODB_URI (database connection)
  - REDIS_URL (cache connection)
  - JWT_SECRET (authentication key)
  - VITE_API_URL (API endpoint)
Purpose: Store sensitive data securely
Learn: kubectl get secrets -n travel-booking
```

### frontend-deployment.yaml
```yaml
Creates: 2 Nginx pod replicas
Port: 80
Replicas: 2 (automatic failover)
Resources: 100m CPU, 128Mi memory
Learn: kubectl describe deployment frontend -n travel-booking
```

### backend-deployment.yaml
```yaml
Creates: 2 Express.js pod replicas
Port: 5000
Replicas: 2 (automatic failover)
Resources: 200m CPU, 256Mi memory
Health Checks: Liveness & Readiness probes
Learn: kubectl logs deployment/backend -n travel-booking
```

### mongodb-deployment.yaml
```yaml
Creates: 1 MongoDB pod
Port: 27017
Storage: emptyDir (temporary, for demo)
Purpose: Database for travel bookings
Learn: kubectl exec -it pod/mongodb -- mongosh
```

### redis-deployment.yaml
```yaml
Creates: 1 Redis pod
Port: 6379
Storage: emptyDir (temporary, for demo)
Purpose: Cache layer
Learn: kubectl exec -it pod/redis -- redis-cli
```

---

## 🛠️ Essential Kubectl Commands (For Students)

### View Resources
```bash
# View all resources
kubectl get all -n travel-booking

# View specific resource type
kubectl get pods -n travel-booking
kubectl get services -n travel-booking
kubectl get deployments -n travel-booking

# View with details
kubectl get pods -n travel-booking -o wide
kubectl get all -n travel-booking -o yaml
```

### Pod Management
```bash
# View pod logs
kubectl logs <pod-name> -n travel-booking
kubectl logs -f deployment/backend -n travel-booking

# Execute command in pod
kubectl exec -it <pod-name> -n travel-booking -- sh

# Describe pod
kubectl describe pod <pod-name> -n travel-booking

# Delete pod (will auto-restart)
kubectl delete pod <pod-name> -n travel-booking
```

### Deployment Management
```bash
# View deployment details
kubectl describe deployment backend -n travel-booking

# Scale deployment
kubectl scale deployment backend --replicas=5 -n travel-booking

# Restart deployment
kubectl rollout restart deployment/backend -n travel-booking

# Check rollout status
kubectl rollout status deployment/backend -n travel-booking
```

### Debugging
```bash
# Port forward (access locally)
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Check events
kubectl get events -n travel-booking

# Describe service
kubectl describe service frontend -n travel-booking

# Check endpoints
kubectl get endpoints -n travel-booking
```

---

## 🔍 Key Learning Points for Students

### 1. **Declarative vs Imperative**
- **YAML files** (Declarative): Describe desired state
- **kubectl commands** (Imperative): Execute actions
- Kubernetes maintains declarative state

### 2. **Replicas & Self-Healing**
```yaml
If 1 pod dies out of 2 replicas:
  → Kubernetes automatically creates a new pod
  → Application continues running
```

### 3. **Resource Requests & Limits**
```yaml
Requests:   Minimum guaranteed resources
Limits:     Maximum allowed resources
Purpose:    Fair resource distribution
```

### 4. **Probes (Health Checks)**
```yaml
Liveness Probe:   Is pod still running?
Readiness Probe:  Is pod ready to receive traffic?
Purpose:          Automatic restart & traffic management
```

### 5. **Services & Load Balancing**
```yaml
LoadBalancer:  External access (frontend)
ClusterIP:     Internal access (backend to database)
Purpose:       Stable networking
```

---

## 📊 Demo Workflow for Class

### Lesson 1: Installation & Setup
1. Install Minikube and kubectl
2. Show cluster information
3. Explain Minikube concept

### Lesson 2: YAML Fundamentals
1. Review namespace.yaml
2. Explain key-value structure
3. Show metadata section

### Lesson 3: Deployments
1. Show frontend-deployment.yaml
2. Explain replicas concept
3. Deploy and check pods

### Lesson 4: Services
1. Show service files
2. Explain LoadBalancer vs ClusterIP
3. Port forward and access app

### Lesson 5: Scaling & Monitoring
1. Scale deployment to 5 replicas
2. Show pod creation in real-time
3. View logs and metrics

### Lesson 6: Self-Healing
1. Delete a pod
2. Show Kubernetes recreating it
3. Explain auto-restart feature

---

## 🎯 Hands-On Exercises for Students

### Exercise 1: Explore Cluster
```bash
# Task: Find the number of pods
kubectl get pods -n travel-booking

# Task: Get pod IPs
kubectl get pods -n travel-booking -o wide
```

### Exercise 2: View Logs
```bash
# Task: View backend logs
kubectl logs deployment/backend -n travel-booking

# Task: Follow logs in real-time
kubectl logs -f deployment/backend -n travel-booking
```

### Exercise 3: Scale Application
```bash
# Task: Scale backend to 5
kubectl scale deployment backend --replicas=5 -n travel-booking

# Task: Verify scaling
kubectl get pods -n travel-booking

# Task: Scale back to 2
kubectl scale deployment backend --replicas=2 -n travel-booking
```

### Exercise 4: Port Forwarding
```bash
# Task: Port forward frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Task: Access http://localhost:3000 in browser
```

### Exercise 5: Pod Deletion
```bash
# Task: List pods
kubectl get pods -n travel-booking

# Task: Delete a pod
kubectl delete pod <pod-name> -n travel-booking

# Task: Observe new pod creation
kubectl get pods -n travel-booking
```

---

## 📈 Advanced Topics (Optional)

### Horizontal Pod Autoscaler (HPA)
```yaml
Automatically scales pods based on CPU usage
Use Case: Handle traffic spikes
```

### StatefulSets
```yaml
For databases that need stable identity
More suitable than Deployment for databases
```

### Persistent Volumes
```yaml
For data that persists across pod restarts
Current setup uses emptyDir (temporary)
```

### Network Policies
```yaml
Restrict traffic between pods
Example: Frontend can access backend, but not vice versa
```

---

## 🚀 Quick Start Commands Summary

```bash
# 1. Install tools
choco install minikube kubernetes-cli

# 2. Start cluster
minikube start --cpus=4 --memory=4096

# 3. Build images
minikube docker-env | Invoke-Expression
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# 4. Deploy
cd k8s
.\deploy.ps1

# 5. Check deployment
kubectl get all -n travel-booking

# 6. Port forward
kubectl port-forward service/frontend 3000:80 -n travel-booking

# 7. Access application
# Open: http://localhost:3000
```

---

## 🔗 Resources for Further Learning

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Interactive Kubernetes Tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Minikube Guide](https://minikube.sigs.k8s.io/docs/start/)
- [Kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [YAML Syntax Guide](https://kubernetes.io/docs/concepts/configuration/overview/)

---

## 📝 Summary

**What students will learn:**
- ✅ Container orchestration concepts
- ✅ Kubernetes architecture (Pod, Service, Deployment)
- ✅ YAML manifest syntax
- ✅ Deployment automation
- ✅ Scaling and self-healing
- ✅ Debugging tools
- ✅ Real-world deployment patterns

**Practical skills:**
- ✅ Use kubectl CLI
- ✅ Write Kubernetes manifests
- ✅ Deploy applications
- ✅ Monitor containers
- ✅ Scale applications
- ✅ Debug issues

---

**Happy learning! 🎓**
