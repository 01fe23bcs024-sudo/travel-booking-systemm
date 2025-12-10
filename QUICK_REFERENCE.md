# ⚡ Quick Reference Card

## 🐳 Docker - 3 Commands

```bash
docker compose up -d          # Start
docker compose ps             # Check
docker compose down           # Stop
```

**Access:** http://localhost:3000

---

## ☁️ Vercel - 3 Steps

```
1. Push code: git push origin main
2. Connect repo in Vercel dashboard
3. Deploy: Click "Deploy"
```

**Access:** https://travel-booking-systemm.vercel.app

---

## ⚙️ Kubernetes - 3 Steps

```powershell
minikube start --cpus=4 --memory=4096
cd k8s; .\deploy.ps1
kubectl port-forward service/frontend 3000:80 -n travel-booking
```

**Access:** http://localhost:3000

---

## 📊 Services & Ports

| Service | Local | Docker | K8s |
|---------|-------|--------|-----|
| Frontend | - | :3000 | 80 |
| Backend | - | :5000 | 5000 |
| MongoDB | - | :27017 | 27017 |
| Redis | - | :6379 | 6379 |

---

## 🔍 Monitoring Commands

```bash
# Docker
docker compose logs -f backend

# Kubernetes
kubectl logs -f deployment/backend -n travel-booking
kubectl get all -n travel-booking
kubectl top nodes
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Docker config |
| `vercel.json` | Vercel config |
| `k8s/*.yaml` | K8s manifests |
| `.env.example` | Environment vars |

---

## ✅ Status Checks

**Docker:**
```bash
docker compose ps  # All running?
```

**Vercel:**
Visit Vercel dashboard → Deployments → Status

**Kubernetes:**
```bash
kubectl get pods -n travel-booking  # All running?
```

---

## 🚀 Choose Your Path

→ **New to deployment?** Start with Docker
→ **Need cloud hosting?** Use Vercel
→ **Learning K8s?** Follow KUBERNETES_GUIDE.md
→ **Production ready?** Use all three!

---

**Repository:** https://github.com/01fe23bcs024-sudo/travel-booking-systemm
