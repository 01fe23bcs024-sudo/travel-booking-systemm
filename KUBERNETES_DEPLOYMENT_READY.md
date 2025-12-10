# 🚀 Kubernetes Deployment Complete

Your Travel Booking System is now fully configured for Kubernetes deployment!

---

## 📁 What Was Created

### 📚 Documentation Files (Root Directory)
```
KUBERNETES_GUIDE.md          ← Complete Kubernetes deployment guide
KUBERNETES_CHEATSHEET.md     ← Quick command reference
MINIKUBE_QUICK_START.md      ← Local development with Minikube
```

### 🎯 Kubernetes Manifests (k8s/ Directory)
```
Core Configuration
├── namespace.yaml            ← travel-booking namespace
├── configmap.yaml            ← Environment variables
└── secret.yaml               ← JWT & connection strings

Frontend
├── frontend-deployment.yaml  ← Nginx pod replicas (2x)
└── frontend-service.yaml     ← LoadBalancer service (port 80)

Backend API
├── backend-deployment.yaml   ← Express.js pod replicas (2x)
└── backend-service.yaml      ← ClusterIP service (port 5000)

Databases
├── mongodb-deployment.yaml   ← MongoDB pod with storage
├── mongodb-service.yaml      ← MongoDB service
├── redis-deployment.yaml     ← Redis pod with storage
└── redis-service.yaml        ← Redis service

Networking
└── ingress.yaml              ← HTTP/HTTPS routing (optional)

Deployment Scripts
├── deploy.ps1                ← PowerShell deployment script (Windows)
├── deploy.sh                 ← Bash deployment script (Linux/macOS)
└── README.md                 ← K8s folder guide
```

---

## 🎓 Learning Path: Kubernetes Basics

### 1️⃣ **Start Here: Minikube**
```bash
# Install Minikube
choco install minikube              # Windows
# or brew install minikube          # macOS

# Start local cluster
minikube start --cpus=4 --memory=4096

# See: MINIKUBE_QUICK_START.md
```

### 2️⃣ **Build Docker Images**
```bash
# Point Docker to Minikube
minikube docker-env | Invoke-Expression

# Build your images
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend
```

### 3️⃣ **Deploy to Minikube**
```powershell
# Navigate to k8s folder
cd k8s

# Run deployment script
.\deploy.ps1

# Or manually:
kubectl apply -f .
```

### 4️⃣ **Access Your App**
```bash
# Terminal 1: Frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Terminal 2: Backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open browser: http://localhost:3000
```

### 5️⃣ **Learn Core Concepts**
See **KUBERNETES_GUIDE.md** for detailed explanations of:
- Pods
- Deployments
- Services
- ConfigMaps
- Secrets
- StatefulSets
- Ingress

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│           KUBERNETES CLUSTER                             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │        Namespace: travel-booking                    │ │
│  │                                                     │ │
│  │  Frontend Deployment (Nginx)                        │ │
│  │  ├─ Pod 1 (Replica 1)                             │ │
│  │  ├─ Pod 2 (Replica 2)                             │ │
│  │  └─ Service: LoadBalancer (Port 80)                │ │
│  │           ↓                                         │ │
│  │  Backend Deployment (Express)                      │ │
│  │  ├─ Pod 1 (Replica 1)                             │ │
│  │  ├─ Pod 2 (Replica 2)                             │ │
│  │  └─ Service: ClusterIP (Port 5000)                │ │
│  │           ↓↓↓                                      │ │
│  │  ┌────────────────────────────────────────────┐   │ │
│  │  │         Supporting Services                │   │ │
│  │  │  • MongoDB (Port 27017) - 1 Pod           │   │ │
│  │  │  • Redis (Port 6379) - 1 Pod              │   │ │
│  │  │  • ConfigMap - Environment Variables      │   │ │
│  │  │  • Secrets - JWT & Connection Strings     │   │ │
│  │  └────────────────────────────────────────────┘   │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start Commands

### For Windows (PowerShell)
```powershell
# 1. Install tools
choco install minikube kubernetes-cli docker

# 2. Start cluster
minikube start --cpus=4 --memory=4096

# 3. Build images
minikube docker-env | Invoke-Expression
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# 4. Deploy
cd k8s
.\deploy.ps1

# 5. Access
kubectl port-forward service/frontend 3000:80 -n travel-booking
# Open: http://localhost:3000
```

### For Linux/macOS (Bash)
```bash
# 1. Install tools
brew install minikube kubernetes-cli docker

# 2. Start cluster
minikube start --cpus=4 --memory=4096

# 3. Build images
eval $(minikube docker-env)
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# 4. Deploy
cd k8s
bash deploy.sh

# 5. Access
kubectl port-forward service/frontend 3000:80 -n travel-booking
# Open: http://localhost:3000
```

---

## 📊 Key Kubernetes Concepts

### Pods
- Smallest deployable unit in Kubernetes
- Contains one or more containers
- Containers share network namespace (same IP)
- Example: Frontend pod = Nginx container

### Deployments
- Manages Pod replicas
- Ensures desired number of pods are running
- Handles rolling updates and rollbacks
- Example: 2 frontend replicas running simultaneously

### Services
- Provides stable network endpoint for pods
- **LoadBalancer**: External IP (frontend)
- **ClusterIP**: Internal only (backend, database)
- Example: Service routes traffic to pods

### ConfigMaps
- Store non-sensitive configuration data
- Key-value pairs
- Example: FRONTEND_URL, NODE_ENV

### Secrets
- Store sensitive data (encrypted)
- JWT secrets, connection strings
- Example: MONGODB_URI, JWT_SECRET

---

## 🛠️ Common Management Tasks

### Scale Application
```bash
# Increase backend replicas to 5
kubectl scale deployment backend --replicas=5 -n travel-booking
```

### View Logs
```bash
# Follow backend logs
kubectl logs -f deployment/backend -n travel-booking
```

### Restart Deployment
```bash
# Restart all backend pods
kubectl rollout restart deployment/backend -n travel-booking
```

### Update Application
```bash
# Update backend image
kubectl set image deployment/backend \
  backend=travel-booking-backend:v2 \
  -n travel-booking
```

### Port Forward
```bash
# Access frontend locally
kubectl port-forward service/frontend 3000:80 -n travel-booking
```

### Debug Pod
```bash
# Get shell access to pod
kubectl exec -it <pod-name> -n travel-booking -- sh
```

For more commands, see **KUBERNETES_CHEATSHEET.md**

---

## 📖 Documentation Map

| Document | Purpose |
|----------|---------|
| **MINIKUBE_QUICK_START.md** | Get started with Minikube (LOCAL DEVELOPMENT) |
| **KUBERNETES_GUIDE.md** | Complete guide + production deployment |
| **KUBERNETES_CHEATSHEET.md** | Quick command reference |
| **k8s/README.md** | Manifest folder guide |
| **KUBERNETES_DEPLOYMENT_READY.md** | This file |

---

## 🎯 Next Steps

### Immediate (Today)
- [ ] Install Minikube & kubectl
- [ ] Read MINIKUBE_QUICK_START.md
- [ ] Start Minikube cluster
- [ ] Build Docker images
- [ ] Deploy using deploy.ps1 or deploy.sh

### Short Term (This Week)
- [ ] Access application via port-forward
- [ ] Learn basic kubectl commands
- [ ] Understand Pods, Deployments, Services
- [ ] Scale deployments
- [ ] View logs and debug

### Medium Term (This Month)
- [ ] Deploy to production cluster (AWS EKS, GKE, AKS)
- [ ] Set up persistent volumes for databases
- [ ] Configure Ingress with TLS
- [ ] Add monitoring (Prometheus)
- [ ] Add logging (ELK stack)

### Long Term (Ongoing)
- [ ] Master Helm for templating
- [ ] Implement CI/CD pipelines
- [ ] Set up GitOps workflows
- [ ] Learn Istio service mesh
- [ ] Master Kubernetes security

---

## 🏢 Production Checklist

Before deploying to production:
- [ ] Change JWT_SECRET in secret.yaml
- [ ] Use external MongoDB (not pod)
- [ ] Use external Redis (not pod)
- [ ] Set resource requests/limits properly
- [ ] Enable RBAC
- [ ] Configure Network Policies
- [ ] Set up TLS certificates
- [ ] Enable pod autoscaling
- [ ] Configure monitoring & alerting
- [ ] Set up backup strategy
- [ ] Document runbooks
- [ ] Test disaster recovery

See **KUBERNETES_GUIDE.md** → Production Deployment section

---

## 🚀 Deploy Now!

```powershell
# Windows PowerShell
cd travel-booking-systemm
minikube start --cpus=4 --memory=4096
minikube docker-env | Invoke-Expression
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend
cd k8s
.\deploy.ps1
```

Then:
```bash
kubectl port-forward service/frontend 3000:80 -n travel-booking
# Visit: http://localhost:3000
```

---

## 📚 Learning Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Minikube Quick Start](https://minikube.sigs.k8s.io/docs/start/)
- [Kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Interactive Kubernetes Labs](https://www.katacoda.com/courses/kubernetes)
- [Linux Academy](https://linuxacademy.com)
- [Udemy Kubernetes Courses](https://www.udemy.com/topic/kubernetes/)

---

## ✅ Verification Checklist

After deployment:
- [ ] `kubectl get namespace` shows `travel-booking`
- [ ] `kubectl get pods -n travel-booking` shows all pods running
- [ ] `kubectl get svc -n travel-booking` shows all services
- [ ] Frontend pod is ready: `kubectl get pods -n travel-booking`
- [ ] Backend pod is ready: `kubectl get pods -n travel-booking`
- [ ] Port forward works: `kubectl port-forward service/frontend 3000:80`
- [ ] Application accessible: `http://localhost:3000`
- [ ] Backend health check: `curl http://localhost:5000/api/health`

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Pods stuck in Pending | Check: `kubectl describe pod <name> -n travel-booking` |
| CrashLoopBackOff | View logs: `kubectl logs <pod-name> -n travel-booking` |
| Service no endpoints | Ensure pods are running in deployment |
| Cannot access app | Port forward: `kubectl port-forward service/frontend 3000:80` |
| Database connection error | Check service DNS: `mongodb.travel-booking.svc.cluster.local` |

For detailed troubleshooting, see **KUBERNETES_GUIDE.md** → Troubleshooting

---

## 🎉 You're All Set!

Your travel booking system is now configured for Kubernetes. Start with Minikube to learn, then deploy to production when ready!

**Next: Read MINIKUBE_QUICK_START.md and run `minikube start` 🚀**
