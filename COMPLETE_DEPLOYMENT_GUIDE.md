# 🚀 Complete Deployment Guide - Travel Booking System

Your application is now configured for **3 deployment options**: Docker, Vercel, and Kubernetes. Choose based on your needs!

---

## 📊 Deployment Options Comparison

| Feature | Docker (Local) | Vercel (Cloud) | Kubernetes (Production) |
|---------|---|---|---|
| Setup Time | 5 min | 10 min | 15 min |
| Cost | Free | Free tier | Free (Minikube) / Paid (Cloud) |
| Scalability | Manual | Auto | Full |
| Best For | Development | Frontend/Demo | Production |
| Learning Value | Basic | Intermediate | Advanced |

---

## 🐳 Option 1: Docker (Local Development)

### Prerequisites
- Docker installed
- Docker Compose installed

### Quick Start
```powershell
cd travel-booking-systemm

# Start all services
docker compose up -d

# Check status
docker compose ps

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api

# Stop everything
docker compose down
```

### What's Running
- ✅ Frontend (Nginx) - Port 3000
- ✅ Backend (Express) - Port 5000
- ✅ MongoDB - Port 27017
- ✅ Redis - Port 6379

### Useful Commands
```bash
# View logs
docker compose logs -f backend

# Rebuild images
docker compose up -d --build

# Clean up
docker compose down -v
```

**Use this for:** Local development, testing changes quickly

---

## ☁️ Option 2: Vercel (Cloud Deployment)

### Prerequisites
- GitHub account
- Vercel account (free)

### Quick Start

#### Step 1: Push to GitHub (Already Done ✅)
```bash
git push origin main
```

#### Step 2: Deploy Frontend to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Configure:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
5. Click **Deploy**

#### Step 3: Add Environment Variables
In Vercel Project Settings → Environment Variables:
```
VITE_API_URL=https://your-api-url/api
```

### What Gets Deployed
- ✅ Frontend (Vite) → https://travel-booking-systemm.vercel.app
- ✅ Static hosting on Vercel Edge Network
- ✅ Auto-deploys on every push to main

### Access
```
Frontend: https://travel-booking-systemm.vercel.app
Backend: Deploy separately (Railway, Render, etc.)
```

**Use this for:** Frontend SPA hosting, demos, production frontend

---

## ⚙️ Option 3: Kubernetes (Production Scale)

### Prerequisites
```bash
# Install tools
choco install minikube kubernetes-cli docker

# Start Minikube
minikube start --cpus=4 --memory=4096
```

### Quick Start

#### Step 1: Build Docker Images
```powershell
# Point Docker to Minikube
minikube docker-env | Invoke-Expression

# Build images
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend
```

#### Step 2: Deploy with Script
```bash
cd k8s
.\deploy.ps1
```

#### Step 3: Access Application
```bash
# Terminal 1: Frontend
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Terminal 2: Backend
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open: http://localhost:3000
```

### What Gets Deployed
- ✅ Frontend (2 replicas) - Nginx
- ✅ Backend (2 replicas) - Express
- ✅ MongoDB (1 pod)
- ✅ Redis (1 pod)
- ✅ ConfigMap & Secrets
- ✅ Services & Ingress

### Monitor & Manage
```bash
# View all resources
kubectl get all -n travel-booking

# View logs
kubectl logs -f deployment/backend -n travel-booking

# Scale backend to 5 replicas
kubectl scale deployment backend --replicas=5 -n travel-booking

# View dashboard
minikube dashboard
```

**Use this for:** Production deployment, auto-scaling, self-healing, learning DevOps

---

## 🎯 Step-by-Step Implementation

### For Beginners: Start with Docker
```powershell
# 1. Install Docker
# Download from: https://www.docker.com/products/docker-desktop

# 2. Start application
cd travel-booking-systemm
docker compose up -d

# 3. Open browser
# http://localhost:3000

# 4. View logs
docker compose logs -f

# 5. Stop
docker compose down
```

**Time: 10 minutes** ⏱️

---

### For Frontend Developers: Use Vercel
```bash
# 1. Install Vercel CLI (optional)
npm i -g vercel

# 2. Deploy frontend
vercel --prod

# 3. Share URL
# https://travel-booking-systemm.vercel.app

# 4. Future deploys
git push origin main  # Auto-deploys!
```

**Time: 15 minutes** ⏱️

---

### For DevOps Engineers: Go Kubernetes
```powershell
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

# 5. Monitor
kubectl get all -n travel-booking -w

# 6. Access
kubectl port-forward service/frontend 3000:80 -n travel-booking
```

**Time: 20 minutes** ⏱️

---

## 📁 Project Structure Overview

```
travel-booking-systemm/
├── docker-compose.yml          ← Docker configuration
├── Dockerfile (root)           ← For custom builds
│
├── frontend/
│   ├── Dockerfile             ← Frontend container
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── Dockerfile             ← Backend container
│   ├── server.js
│   └── package.json
│
├── k8s/                        ← Kubernetes manifests
│   ├── namespace.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── mongodb-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── deploy.ps1
│   └── deploy.sh
│
├── vercel.json                 ← Vercel configuration
├── .vercelignore               ← Files to ignore
├── .env.example                ← Environment template
│
├── DEPLOYMENT_READY.md         ← Vercel guide
├── VERCEL_QUICK_START.md       ← Vercel quick start
├── KUBERNETES_GUIDE.md         ← K8s guide (for teacher)
├── KUBERNETES_CHEATSHEET.md    ← K8s commands
└── MINIKUBE_QUICK_START.md     ← Minikube guide
```

---

## 🔑 Environment Configuration

### For Docker (local)
```bash
# Create .env file
cp .env.example .env

# Edit with local values
MONGODB_URI=mongodb://mongo:27017/travel_booking
REDIS_URL=redis://redis:6379
JWT_SECRET=dev-secret-change-in-production
```

### For Vercel (production)
Set in Vercel Dashboard → Environment Variables:
```
VITE_API_URL=https://your-api-url/api
```

### For Kubernetes (production)
Edit `k8s/secret.yaml`:
```yaml
stringData:
  MONGODB_URI: "mongodb://mongodb:27017/travel_booking"
  REDIS_URL: "redis://redis:6379"
  JWT_SECRET: "strong-secret-key"
```

---

## 🚀 Recommended Deployment Flow

### Development
```
Local Code → Docker → Test → Git Push
```

### Staging
```
Git Push → Vercel → Frontend Demo
         → Kubernetes → Full Stack
```

### Production
```
Vercel (Frontend) + Cloud K8s (Backend/DB)
```

---

## 📊 Architecture Diagrams

### Docker Architecture
```
Your Computer
    ├─ Frontend (Port 3000)
    ├─ Backend (Port 5000)
    ├─ MongoDB (Port 27017)
    └─ Redis (Port 6379)

All in Docker Containers
```

### Vercel Architecture
```
GitHub
  ↓
Vercel (Frontend)
  ↓
https://travel-booking-systemm.vercel.app

External API (Backend deployed separately)
```

### Kubernetes Architecture
```
Kubernetes Cluster
├─ Frontend Service (LoadBalancer)
│  ├─ Pod 1 (Nginx)
│  └─ Pod 2 (Nginx)
├─ Backend Service (ClusterIP)
│  ├─ Pod 1 (Express)
│  └─ Pod 2 (Express)
├─ MongoDB Service
│  └─ Pod 1 (MongoDB)
└─ Redis Service
   └─ Pod 1 (Redis)
```

---

## ✅ Deployment Checklist

### Docker Setup
- [ ] Docker Desktop installed
- [ ] Repository cloned
- [ ] `docker compose up -d` works
- [ ] Access http://localhost:3000
- [ ] Docker Compose logs show no errors

### Vercel Setup
- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Build command configured: `cd frontend && npm run build`
- [ ] Output directory: `frontend/dist`
- [ ] Frontend deployed and accessible
- [ ] Environment variables set

### Kubernetes Setup
- [ ] Minikube installed
- [ ] kubectl installed
- [ ] Minikube cluster running
- [ ] Docker images built
- [ ] `deploy.ps1` executed successfully
- [ ] `kubectl get all -n travel-booking` shows 6+ pods
- [ ] Port forwarding works
- [ ] Application accessible at http://localhost:3000

---

## 🆘 Troubleshooting

### Docker Issues
```bash
# Port already in use
docker compose down
docker compose up -d

# Images not building
docker compose build --no-cache
docker compose up -d

# Clear everything
docker compose down -v
docker system prune -a
```

### Vercel Issues
```bash
# Build fails
# → Check build logs in Vercel dashboard
# → Ensure frontend/package.json has build script

# API calls fail
# → Set VITE_API_URL environment variable
# → Check CORS settings in backend
```

### Kubernetes Issues
```bash
# Pods not starting
kubectl describe pod <pod-name> -n travel-booking

# Port forward fails
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Images not found
minikube docker-env | Invoke-Expression
docker build -t travel-booking-systemm-frontend:latest ./frontend
```

---

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| **DEPLOYMENT_READY.md** | Vercel setup & overview | Frontend Devs |
| **VERCEL_QUICK_START.md** | Step-by-step Vercel | Beginners |
| **KUBERNETES_GUIDE.md** | Complete K8s learning | Teachers/Students |
| **KUBERNETES_CHEATSHEET.md** | Quick kubectl reference | DevOps Engineers |
| **MINIKUBE_QUICK_START.md** | 3-step Minikube start | Beginners |
| **README.md** | Project overview | Everyone |

---

## 🎓 Learning Resources

### Docker
- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)

### Vercel
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js & Vite Deployment](https://vercel.com/docs/frameworks)

### Kubernetes
- [Kubernetes Official](https://kubernetes.io/)
- [Minikube Guide](https://minikube.sigs.k8s.io/)
- [Interactive Tutorials](https://kubernetes.io/docs/tutorials/)

---

## 🔗 Quick Links

**Repository**: https://github.com/01fe23bcs024-sudo/travel-booking-systemm

**Deployed URLs** (after deployment):
- Frontend (Vercel): https://travel-booking-systemm.vercel.app
- Local Docker: http://localhost:3000
- Local Kubernetes: http://localhost:3000 (port-forward)

---

## 🎯 Next Steps

**Choose your path:**

1. **Just want to try it?** → Use Docker
2. **Need to deploy frontend?** → Use Vercel
3. **Learning DevOps?** → Use Kubernetes
4. **Production ready?** → Combine all three!

---

## ✨ Summary

Your Travel Booking System is now ready for:
- ✅ Local development with Docker
- ✅ Frontend hosting on Vercel
- ✅ Full-stack deployment on Kubernetes
- ✅ Production scaling and auto-healing
- ✅ Team collaboration and learning

**Pick one option and get started in 15 minutes!** 🚀
