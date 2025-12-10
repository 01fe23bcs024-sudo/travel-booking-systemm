# ⚡ Kubernetes Cheat Sheet - For Teachers & Students

## Installation

```bash
# Windows (Chocolatey)
choco install minikube kubernetes-cli docker

# macOS (Homebrew)
brew install minikube kubectl docker

# Linux
curl -LO https://dl.k8s.io/release/stable.txt
sudo apt-get install -y kubectl
```

## Cluster Management

```bash
# Start Minikube
minikube start --cpus=4 --memory=4096

# Check cluster info
kubectl cluster-info
kubectl get nodes

# Stop Minikube
minikube stop

# Delete cluster
minikube delete
```

## Deployment

```bash
# Deploy all manifests
kubectl apply -f k8s/

# Deploy specific file
kubectl apply -f k8s/backend-deployment.yaml

# Check deployment status
kubectl get deployments -n travel-booking
kubectl describe deployment backend -n travel-booking

# View deployment details
kubectl get deployment backend -n travel-booking -o yaml
```

## Pod Management

```bash
# List all pods
kubectl get pods -n travel-booking
kubectl get pods -n travel-booking -o wide

# Get pod details
kubectl describe pod <pod-name> -n travel-booking

# View pod logs
kubectl logs <pod-name> -n travel-booking
kubectl logs -f deployment/backend -n travel-booking

# Execute command in pod
kubectl exec -it <pod-name> -n travel-booking -- sh
kubectl exec <pod-name> -n travel-booking -- curl http://localhost:5000/api/health

# Delete pod (will auto-restart)
kubectl delete pod <pod-name> -n travel-booking
```

## Services

```bash
# List services
kubectl get services -n travel-booking
kubectl get svc -n travel-booking

# View service details
kubectl describe service frontend -n travel-booking

# Port forward
kubectl port-forward service/frontend 3000:80 -n travel-booking
kubectl port-forward service/backend 5000:5000 -n travel-booking

# Get service endpoints
kubectl get endpoints -n travel-booking
```

## Scaling

```bash
# Scale deployment
kubectl scale deployment backend --replicas=5 -n travel-booking

# Check replicas
kubectl get deployment backend -n travel-booking

# Auto-scale based on CPU
kubectl autoscale deployment backend --min=2 --max=5 --cpu-percent=80 -n travel-booking
```

## Debugging

```bash
# Check events
kubectl get events -n travel-booking

# Detailed pod info
kubectl get pod <pod-name> -n travel-booking -o yaml

# Pod logs
kubectl logs <pod-name> -n travel-booking
kubectl logs <pod-name> -n travel-booking --previous

# Check resource usage
kubectl top pods -n travel-booking
kubectl top nodes

# Port forward for debugging
kubectl port-forward pod/<pod-name> 5000:5000 -n travel-booking
```

## ConfigMap & Secrets

```bash
# View ConfigMap
kubectl get configmap -n travel-booking
kubectl describe configmap travel-booking-config -n travel-booking

# View Secrets
kubectl get secrets -n travel-booking
kubectl get secret travel-booking-secrets -n travel-booking -o yaml

# Edit ConfigMap
kubectl edit configmap travel-booking-config -n travel-booking
```

## Namespaces

```bash
# List namespaces
kubectl get namespaces

# Create namespace
kubectl create namespace test

# Get resources in namespace
kubectl get all -n travel-booking

# Delete namespace
kubectl delete namespace travel-booking
```

## Useful Options

```bash
# Watch real-time changes
kubectl get pods -n travel-booking -w

# Output as YAML
kubectl get deployment backend -n travel-booking -o yaml

# Output as JSON
kubectl get pod <pod-name> -n travel-booking -o json

# Show labels
kubectl get pods -n travel-booking --show-labels

# Pretty print
kubectl get pods -n travel-booking -o wide
```

## Rollout Management

```bash
# Check rollout status
kubectl rollout status deployment/backend -n travel-booking

# View rollout history
kubectl rollout history deployment/backend -n travel-booking

# Rollback to previous version
kubectl rollout undo deployment/backend -n travel-booking

# Restart deployment
kubectl rollout restart deployment/backend -n travel-booking
```

## Cleaning Up

```bash
# Delete all resources in namespace
kubectl delete all -n travel-booking

# Delete specific resource
kubectl delete deployment backend -n travel-booking

# Delete by file
kubectl delete -f k8s/

# Delete namespace (and all contents)
kubectl delete namespace travel-booking
```

## Helpful Commands

```bash
# Get cluster info
kubectl cluster-info

# Get API resources
kubectl api-resources

# Get current context
kubectl config current-context

# View dashboard (Minikube)
minikube dashboard

# SSH into Minikube
minikube ssh

# Get Minikube IP
minikube ip

# Check pod readiness
kubectl get pod <pod-name> -n travel-booking -o jsonpath='{.status.conditions}'

# Print all available commands
kubectl --help
```

---

**Tip:** Add `-n travel-booking` to most commands to scope to the namespace!
