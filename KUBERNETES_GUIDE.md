# ⚙️ Kubernetes Complete Guide

Welcome to Kubernetes! This guide will teach you everything about deploying containerized applications.

## 📚 Table of Contents
1. [Kubernetes Concepts](#concepts)
2. [Architecture Overview](#architecture)
3. [Installation & Setup](#setup)
4. [Deployment Guide](#deployment)
5. [Hands-On Exercises](#exercises)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Topics](#advanced)

---

## Kubernetes Concepts

### What is Kubernetes?
Kubernetes (K8s) is an open-source container orchestration platform that automates:
- Deployment of containers
- Scaling applications
- Managing resources
- Self-healing of failed containers
- Load balancing
- Storage orchestration

### Key Concepts

#### Pod
- Smallest deployable unit in Kubernetes
- Contains one or more containers (usually one)
- Containers in a pod share network namespace
- Ephemeral - can be created and destroyed
- Example: Express.js app running in a container

#### Deployment
- Manages replicas of pods
- Ensures desired number of pods are running
- Handles rolling updates
- Enables scaling
- Example: Backend with 2 replicas for high availability

#### Service
- Stable network identity for pods
- Load balances traffic to pods
- Types: ClusterIP, NodePort, LoadBalancer
- Example: Frontend service accessible externally

#### Namespace
- Virtual cluster within a cluster
- Isolates resources
- Allows multi-tenancy
- Example: `travel-booking` namespace for our app

#### ConfigMap
- Stores non-sensitive configuration
- Key-value pairs
- Injected as environment variables
- Example: Database URLs, port numbers

#### Secret
- Stores sensitive data
- Base64 encoded
- Similar to ConfigMap but for secrets
- Example: JWT secret, API keys, passwords

#### Volume
- Persistent storage for pods
- Survives pod restarts
- Types: emptyDir, persistentVolumeClaim, configMap, secret
- Example: MongoDB data storage

#### Ingress
- HTTP/HTTPS routing rules
- Manages external access
- Can route based on hostname or path
- Example: Route /api/* to backend, /* to frontend

---

## Architecture Overview

### Travel Booking System on Kubernetes

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Users                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼───────┐
                    │   LoadBalancer│
                    │   Service     │
                    └──────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼────┐        ┌───▼────┐        ┌───▼────┐
    │Frontend│        │Frontend│        │Ingress │
    │Pod 1   │        │Pod 2   │        │        │
    └────────┘        └────────┘        └────────┘
        │                  │
        └──────────────────┼──────────────────┐
                    ┌──────▼────────┐         │
                    │Frontend Service│        │
                    │ (LoadBalancer) │        │
                    └────────────────┘        │
                           │                  │
    ┌──────────────────────┼──────────────────┘
    │                      │
┌───▼────┐           ┌────▼────┐
│Backend │           │Backend  │
│Pod 1   │           │Pod 2    │
└────────┘           └────┬────┘
    │                     │
    └─────────┬───────────┘
         ┌────▼──────┐
         │Backend    │
         │Service    │
         │(ClusterIP)│
         └────┬──────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───▼──┐ ┌───▼──┐ ┌───▼──┐
│Redis │ │MongoDB   │
│Pod   │ │Pod   │
└──────┘ └──────┘
```

### Data Flow

1. User accesses http://localhost:3000
2. Request hits LoadBalancer Service
3. Routed to Frontend Pod (Round-robin)
4. Frontend serves React app
5. Browser makes API calls to backend
6. API calls routed through Backend Service to Backend Pods
7. Backend connects to MongoDB for data
8. Backend uses Redis for caching

---

## Installation & Setup

### Prerequisites

#### Windows
```powershell
# Install Minikube
choco install minikube

# Install kubectl
choco install kubernetes-cli

# Install Docker (required)
choco install docker-desktop

# Verify installation
kubectl version
minikube version
```

#### macOS
```bash
# Install Minikube
brew install minikube

# Install kubectl
brew install kubectl

# Install Docker (required)
brew install docker

# Verify installation
kubectl version
minikube version
```

#### Linux (Ubuntu)
```bash
# Install Minikube
curl -Lo minikube https://github.com/kubernetes/minikube/releases/download/latest/minikube-linux-amd64
chmod +x minikube
sudo mv minikube /usr/local/bin/

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Verify installation
kubectl version
minikube version
```

### Start Minikube

```bash
# Start cluster
minikube start --cpus=4 --memory=4096

# Verify cluster is running
kubectl cluster-info

# View cluster nodes
kubectl get nodes

# View Minikube dashboard
minikube dashboard
```

---

## Deployment Guide

### Step 1: Build Docker Images

```bash
# Point Docker to Minikube
minikube docker-env | Invoke-Expression  # Windows PowerShell
eval $(minikube docker-env)              # Linux/macOS

# Build images
docker build -t travel-booking-systemm-frontend:latest ./frontend
docker build -t travel-booking-systemm-backend:latest ./backend

# Verify images
docker images | grep travel-booking
```

### Step 2: Deploy with Script

```bash
# Windows
cd k8s
.\deploy.ps1

# Linux/macOS
cd k8s
bash deploy.sh
```

### Step 3: Verify Deployment

```bash
# Check namespace
kubectl get namespace

# Check all resources
kubectl get all -n travel-booking

# Watch pods starting
kubectl get pods -n travel-booking -w
```

### Step 4: Access Application

```bash
# Terminal 1: Frontend port forwarding
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Terminal 2: Backend port forwarding
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Open: http://localhost:3000
```

---

## Hands-On Exercises

### Exercise 1: View Pod Information

**Objective:** Understand pod structure

```bash
# List all pods
kubectl get pods -n travel-booking

# Get detailed pod info
kubectl get pods -n travel-booking -o wide

# Describe a pod
kubectl describe pod <pod-name> -n travel-booking

# View pod YAML
kubectl get pod <pod-name> -n travel-booking -o yaml
```

**Questions:**
- How many pods are running?
- Which node is each pod on?
- What are the pod's IP addresses?

---

### Exercise 2: View Pod Logs

**Objective:** Understand application logging

```bash
# View recent logs
kubectl logs <pod-name> -n travel-booking

# View logs with timestamps
kubectl logs <pod-name> -n travel-booking -f --timestamps=true

# View logs from multiple pods
kubectl logs -l app=backend -n travel-booking

# View previous logs (if pod restarted)
kubectl logs <pod-name> -n travel-booking --previous
```

**Observations:**
- What does the backend log show?
- Is MongoDB connecting successfully?
- Any errors or warnings?

---

### Exercise 3: Execute Commands in Pods

**Objective:** Debug pods interactively

```bash
# Connect to backend pod
kubectl exec -it <backend-pod> -n travel-booking -- /bin/bash

# Inside pod - check processes
ps aux

# Check environment variables
env | grep MONGO

# Exit pod
exit

# Run single command
kubectl exec <backend-pod> -n travel-booking -- curl http://localhost:5000/api
```

**Try:**
- Check what's running in the container
- List files in the app directory
- Check environment variables

---

### Exercise 4: Scale Deployments

**Objective:** Test horizontal scaling

```bash
# Current replica count
kubectl get deployment -n travel-booking

# Scale backend to 3 replicas
kubectl scale deployment backend --replicas=3 -n travel-booking

# Watch new pods starting
kubectl get pods -n travel-booking -w

# Scale back to 2
kubectl scale deployment backend --replicas=2 -n travel-booking

# Verify
kubectl get deployment -n travel-booking
```

**Observations:**
- How quickly do new pods start?
- Can you access the app during scaling?
- Traffic is distributed across all pods

---

### Exercise 5: Delete and Recreate Pods

**Objective:** Understand self-healing

```bash
# Find a backend pod
kubectl get pods -n travel-booking

# Delete the pod
kubectl delete pod <backend-pod> -n travel-booking

# Watch replacement pod starting
kubectl get pods -n travel-booking -w

# Verify app still works
# Access http://localhost:3000
```

**Observations:**
- How quickly is replacement pod created?
- Did you experience any downtime?
- Deployment ensured desired state maintained

---

### Exercise 6: View Resource Usage

**Objective:** Monitor resource consumption

```bash
# View node resource usage
kubectl top nodes

# View pod resource usage
kubectl top pods -n travel-booking

# If metrics unavailable:
# Install metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

**Information:**
- Which pod uses most CPU?
- Which pod uses most memory?
- Are pods within requested limits?

---

### Exercise 7: Check Services

**Objective:** Understand service networking

```bash
# List services
kubectl get services -n travel-booking

# Describe a service
kubectl describe service frontend -n travel-booking

# Get service endpoints
kubectl get endpoints -n travel-booking

# Test service connectivity (from pod)
kubectl exec <backend-pod> -n travel-booking -- curl http://mongodb:27017
```

**Understanding:**
- What's the service cluster IP?
- Which pods are endpoints?
- How is traffic distributed?

---

### Exercise 8: View Configuration

**Objective:** Understand ConfigMaps and Secrets

```bash
# List ConfigMaps
kubectl get configmap -n travel-booking

# View ConfigMap
kubectl describe configmap app-config -n travel-booking

# View ConfigMap YAML
kubectl get configmap app-config -n travel-booking -o yaml

# List Secrets
kubectl get secrets -n travel-booking

# View Secret (encoded)
kubectl describe secret app-secrets -n travel-booking

# Decode secret
kubectl get secret app-secrets -n travel-booking -o jsonpath='{.data.JWT_SECRET}' | base64 -d
```

**Learning:**
- What configuration is stored?
- How secrets are stored
- How to update configuration

---

## Troubleshooting

### Pod won't start

```bash
# Check pod status
kubectl describe pod <pod-name> -n travel-booking

# Common issues:
# - Image not found: Check image name
# - CrashLoopBackOff: Check logs
# - Pending: Check resource availability
```

### Pod stuck in pending

```bash
# Check node resources
kubectl describe nodes

# Check PVC status (if using volumes)
kubectl get pvc -n travel-booking

# Not enough resources: Allocate more to Minikube
minikube stop
minikube start --cpus=8 --memory=8192
```

### Pod crashed

```bash
# Check recent logs
kubectl logs <pod-name> -n travel-booking

# Check previous logs
kubectl logs <pod-name> -n travel-booking --previous

# Check pod events
kubectl describe pod <pod-name> -n travel-booking | grep Events -A 10
```

### Can't connect to service

```bash
# Check service exists
kubectl get service -n travel-booking

# Check endpoints
kubectl get endpoints -n travel-booking

# Test connectivity
kubectl exec <pod> -n travel-booking -- curl http://service-name:port

# Check network policy
kubectl get networkpolicy -n travel-booking
```

---

## Advanced Topics

### Rolling Updates

```bash
# Update image
kubectl set image deployment/backend backend=new-image:v2 -n travel-booking

# Watch rollout
kubectl rollout status deployment/backend -n travel-booking

# Rollback if needed
kubectl rollout undo deployment/backend -n travel-booking

# View rollout history
kubectl rollout history deployment/backend -n travel-booking
```

### Horizontal Pod Autoscaler

```bash
# Create autoscaler
kubectl autoscale deployment backend --min=2 --max=10 --cpu-percent=80 -n travel-booking

# View HPA status
kubectl get hpa -n travel-booking

# Describe HPA
kubectl describe hpa backend -n travel-booking
```

### Persistent Volumes

```bash
# View persistent volumes
kubectl get pv

# View persistent volume claims
kubectl get pvc -n travel-booking

# Describe PVC
kubectl describe pvc <pvc-name> -n travel-booking
```

### Network Policies

```bash
# View network policies
kubectl get networkpolicy -n travel-booking

# Create deny-all policy
kubectl create networkpolicy deny-all --pod-selector= -n travel-booking

# Create allow policy
kubectl apply -f network-policy.yaml
```

### Resource Quotas

```bash
# Create namespace with quota
kubectl create namespace limited
kubectl create quota compute-quota --hard=requests.cpu=5,limits.cpu=10,requests.memory=1Gi -n limited

# View quotas
kubectl get resourcequota -n limited
```

---

## Summary

### Key Takeaways

1. **Pods** are the smallest unit - usually 1 container per pod
2. **Deployments** manage replicas and rolling updates
3. **Services** provide stable networking and load balancing
4. **ConfigMaps** store configuration, **Secrets** store sensitive data
5. **Namespaces** provide isolation
6. **Volumes** provide persistent storage
7. **Ingress** provides external HTTP/HTTPS routing

### Common kubectl Commands

```bash
# Get resources
kubectl get <resource> -n travel-booking

# Describe resources
kubectl describe <resource> <name> -n travel-booking

# Create/update
kubectl apply -f file.yaml

# Delete
kubectl delete <resource> <name> -n travel-booking

# Logs
kubectl logs <pod> -n travel-booking

# Execute
kubectl exec <pod> -n travel-booking -- command

# Scale
kubectl scale deployment <name> --replicas=3 -n travel-booking

# Port forward
kubectl port-forward service/<service> <local>:<remote> -n travel-booking
```

### Next Steps

1. Complete all exercises
2. Try scaling and load testing
3. Explore production patterns
4. Learn about StatefulSets
5. Set up persistent storage
6. Configure autoscaling
7. Implement health checks
8. Set up monitoring

---

## Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Interactive Tutorials](https://kubernetes.io/docs/tutorials/)
- [Minikube Docs](https://minikube.sigs.k8s.io/)

---

**Happy learning! 🚀**
