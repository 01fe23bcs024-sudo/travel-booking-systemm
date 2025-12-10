# ⚡ Kubernetes Cheatsheet

Quick reference for kubectl commands.

## Getting Started

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes
kubectl version

# Context
kubectl config current-context
kubectl config use-context <context>
kubectl config get-contexts
```

## Viewing Resources

```bash
# Get resources
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get configmap
kubectl get secrets
kubectl get nodes
kubectl get namespaces

# With options
kubectl get pods -n travel-booking          # Namespace
kubectl get pods -o wide                    # More details
kubectl get pods -o yaml                    # YAML format
kubectl get pods -l app=backend             # Filter by label
kubectl get pods --all-namespaces          # All namespaces
kubectl get pods -w                         # Watch mode

# Describe (detailed info)
kubectl describe pod <pod-name>
kubectl describe service frontend
kubectl describe deployment backend
kubectl describe node <node-name>
```

## Creating & Updating

```bash
# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f k8s/                       # All files in folder
kubectl apply -f . -R                       # Recursive

# Create imperative
kubectl create deployment frontend --image=frontend:latest
kubectl create service loadbalancer web --tcp=80:8080
kubectl create configmap config --from-literal=key=value

# Edit resources
kubectl edit deployment backend
kubectl edit configmap app-config

# Patch
kubectl patch deployment backend -p '{"spec":{"replicas":3}}'
```

## Deleting Resources

```bash
# Delete
kubectl delete pod <pod-name>
kubectl delete deployment backend
kubectl delete service frontend
kubectl delete configmap app-config
kubectl delete secret app-secrets

# Delete file
kubectl delete -f deployment.yaml

# Delete by selector
kubectl delete pods -l app=backend

# Delete namespace (deletes all resources)
kubectl delete namespace travel-booking

# Force delete
kubectl delete pod <pod-name> --grace-period=0 --force
```

## Deployment Management

```bash
# Scale
kubectl scale deployment backend --replicas=5
kubectl scale deployment frontend --replicas=3

# Rollout status
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend -w

# View history
kubectl rollout history deployment/backend
kubectl rollout history deployment/backend --revision=2

# Undo/Rollback
kubectl rollout undo deployment/backend
kubectl rollout undo deployment/backend --to-revision=2

# Update image
kubectl set image deployment/backend backend=backend:v2
kubectl set image deployment/backend backend=backend:v2 --record

# Restart
kubectl rollout restart deployment/backend
```

## Working with Pods

```bash
# Pod info
kubectl get pod <pod-name>
kubectl describe pod <pod-name>
kubectl get pod <pod-name> -o yaml

# Logs
kubectl logs <pod-name>
kubectl logs <pod-name> -f                  # Follow
kubectl logs <pod-name> --tail=100          # Last 100 lines
kubectl logs <pod-name> -p                  # Previous (crashed)
kubectl logs deployment/backend             # All pod logs
kubectl logs -l app=backend                 # By label

# Execute command
kubectl exec <pod-name> -- command
kubectl exec <pod-name> -- ls -la
kubectl exec <pod-name> -- printenv

# Interactive shell
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it <pod-name> -- /bin/sh

# Port forward
kubectl port-forward pod/<pod-name> 8000:8080
kubectl port-forward service/frontend 3000:80
kubectl port-forward service/backend 5000:5000

# Copy files
kubectl cp <pod>:/path/to/file ./local-file
kubectl cp ./local-file <pod>:/path/to/file
```

## Services & Networking

```bash
# Services
kubectl get services
kubectl get svc
kubectl describe service frontend
kubectl get endpoints

# Expose pod/deployment
kubectl expose pod <pod-name> --port=5000 --type=LoadBalancer
kubectl expose deployment backend --port=5000 --type=LoadBalancer

# Port forward
kubectl port-forward service/frontend 3000:80
kubectl port-forward svc/backend 5000:5000

# DNS
kubectl exec <pod> -- nslookup backend.travel-booking.svc.cluster.local
kubectl exec <pod> -- curl http://backend:5000/api
```

## ConfigMaps & Secrets

```bash
# ConfigMaps
kubectl create configmap config --from-literal=key=value
kubectl create configmap config --from-file=config.json
kubectl get configmap
kubectl describe configmap app-config
kubectl edit configmap app-config
kubectl delete configmap app-config

# Secrets
kubectl create secret generic app-secret --from-literal=password=123456
kubectl create secret generic app-secret --from-file=secret.txt
kubectl get secrets
kubectl describe secret app-secrets
kubectl delete secret app-secrets

# View secret (base64 encoded)
kubectl get secret app-secrets -o yaml
kubectl get secret app-secrets -o jsonpath='{.data.JWT_SECRET}' | base64 -d
```

## Namespaces

```bash
# Create namespace
kubectl create namespace travel-booking
kubectl delete namespace travel-booking

# List namespaces
kubectl get namespaces
kubectl get ns

# Use namespace by default
kubectl config set-context --current --namespace=travel-booking

# View resources in namespace
kubectl get pods -n travel-booking
kubectl get all -n travel-booking
```

## Labels & Selectors

```bash
# Add label
kubectl label pods <pod-name> app=backend
kubectl label deployment backend environment=production

# Remove label
kubectl label pods <pod-name> app-

# Get by label
kubectl get pods -l app=backend
kubectl get pods -l app=backend,environment=production
kubectl get pods -l app!=backend

# Show labels
kubectl get pods --show-labels
```

## Resource Management

```bash
# Resource usage
kubectl top nodes
kubectl top pods
kubectl top pods -n travel-booking

# Set resource limits
kubectl set resources deployment backend --limits=cpu=1,memory=1Gi --requests=cpu=500m,memory=512Mi

# Create resource quota
kubectl create quota compute-quota --hard=requests.cpu=5,limits.cpu=10,requests.memory=1Gi

# View quotas
kubectl get resourcequota -n travel-booking
```

## Troubleshooting

```bash
# Pod status
kubectl get pods -n travel-booking
kubectl describe pod <pod-name> -n travel-booking

# Check events
kubectl get events -n travel-booking
kubectl describe pod <pod-name> | grep Events -A 10

# Logs
kubectl logs <pod-name>
kubectl logs <pod-name> --previous

# Debug pod
kubectl debug pod/<pod-name> -it --image=busybox

# Check node
kubectl describe node <node-name>
kubectl top node

# Network connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
  # Inside container: wget -O- http://backend:5000/api

# DNS
kubectl run -it --rm test --image=busybox --restart=Never -- nslookup backend
```

## Useful kubectl Options

```bash
# Output formats
-o yaml              # YAML output
-o json              # JSON output
-o wide              # More columns
-o custom-columns    # Custom columns
--show-labels        # Show labels

# Flags
-n <namespace>       # Namespace
-A, --all-namespaces # All namespaces
-l <selector>        # Label selector
--watch              # Watch for changes
-f                   # Follow (logs)
--sort-by            # Sort by field
```

## Quick Commands

```bash
# Check cluster health
kubectl cluster-info
kubectl get nodes

# Get all resources
kubectl get all -n travel-booking

# Watch deployment
kubectl get pods -n travel-booking -w

# View everything
kubectl get events -n travel-booking

# Quick scaling
kubectl scale deployment backend --replicas=5 -n travel-booking

# Restart deployment
kubectl rollout restart deployment/backend -n travel-booking

# Port forward
kubectl port-forward service/frontend 3000:80 -n travel-booking

# View logs
kubectl logs -f deployment/backend -n travel-booking

# Execute in pod
kubectl exec <pod> -n travel-booking -- curl http://localhost:5000/api

# SSH to pod
kubectl exec -it <pod> -n travel-booking -- /bin/bash

# Delete pod (will be recreated)
kubectl delete pod <pod-name> -n travel-booking
```

## Kubernetes Objects Hierarchy

```
Namespace
├── Deployment
│   └── ReplicaSet
│       └── Pods
├── Service
├── ConfigMap
├── Secret
├── PersistentVolumeClaim
└── Ingress
```

## Common Patterns

```bash
# Deploy application
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Monitor deployment
kubectl get pods -n travel-booking -w

# Access application
kubectl port-forward service/frontend 3000:80 -n travel-booking

# Scale if needed
kubectl scale deployment backend --replicas=5 -n travel-booking

# View logs
kubectl logs -f deployment/backend -n travel-booking

# Clean up
kubectl delete namespace travel-booking
```

## Tips & Tricks

```bash
# Short aliases
k = kubectl
kubectl config set-context --current --namespace=travel-booking

# Get last 10 events
kubectl get events -n travel-booking --sort-by='.lastTimestamp' | tail -10

# Find pod by label
kubectl get pods -l app=backend -o wide

# Watch pod status
watch kubectl get pods -n travel-booking

# Resource cleanup
kubectl delete all --all -n travel-booking

# Validate YAML
kubectl apply -f deployment.yaml --dry-run=client

# Get all resources
kubectl api-resources
```

---

**Keep this handy for quick reference!** 📋
