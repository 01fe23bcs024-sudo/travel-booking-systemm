# Kubernetes Cheat Sheet

Quick reference for common Kubernetes commands.

## 🚀 Cluster Management

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes
kubectl describe node <node-name>

# Current context
kubectl config current-context
kubectl config get-contexts
kubectl config use-context <context-name>

# Create namespace
kubectl create namespace travel-booking
kubectl delete namespace travel-booking
```

## 📦 Deployment Management

```bash
# List deployments
kubectl get deployments -n travel-booking
kubectl get deployments --all-namespaces

# Create deployment
kubectl apply -f deployment.yaml
kubectl create deployment nginx --image=nginx

# Update deployment
kubectl set image deployment/backend backend=travel-booking-backend:v2
kubectl patch deployment backend -p '{"spec":{"replicas":3}}'

# Scale deployment
kubectl scale deployment backend --replicas=3

# View deployment details
kubectl describe deployment backend -n travel-booking
kubectl get deployment backend -n travel-booking -o yaml

# Delete deployment
kubectl delete deployment backend -n travel-booking

# Rollout management
kubectl rollout status deployment/backend -n travel-booking
kubectl rollout history deployment/backend -n travel-booking
kubectl rollout undo deployment/backend -n travel-booking
kubectl rollout restart deployment/backend -n travel-booking
```

## 🐳 Pod Management

```bash
# List pods
kubectl get pods -n travel-booking
kubectl get pods -n travel-booking -o wide
kubectl get pods --all-namespaces

# Watch pods in real-time
kubectl get pods -n travel-booking -w

# View pod details
kubectl describe pod <pod-name> -n travel-booking
kubectl get pod <pod-name> -n travel-booking -o yaml

# Execute command in pod
kubectl exec <pod-name> -n travel-booking -- <command>
kubectl exec -it <pod-name> -n travel-booking -- sh
kubectl exec <pod-name> -n travel-booking -- env

# View pod logs
kubectl logs <pod-name> -n travel-booking
kubectl logs -f <pod-name> -n travel-booking
kubectl logs <pod-name> -n travel-booking --tail=100
kubectl logs deployment/backend -n travel-booking

# Copy files from/to pod
kubectl cp travel-booking/<pod-name>:/path/to/file ./local-file
kubectl cp ./local-file travel-booking/<pod-name>:/path/to/file

# Delete pod
kubectl delete pod <pod-name> -n travel-booking
```

## 🔌 Service Management

```bash
# List services
kubectl get services -n travel-booking
kubectl get svc -n travel-booking

# View service details
kubectl describe service frontend -n travel-booking
kubectl get service frontend -n travel-booking -o yaml

# Port forward
kubectl port-forward service/frontend 3000:80 -n travel-booking
kubectl port-forward pod/<pod-name> 5000:5000 -n travel-booking

# Get service endpoints
kubectl get endpoints -n travel-booking

# Delete service
kubectl delete service frontend -n travel-booking
```

## ⚙️ ConfigMap & Secrets

```bash
# List ConfigMaps
kubectl get configmaps -n travel-booking
kubectl get configmap travel-booking-config -n travel-booking -o yaml

# View ConfigMap data
kubectl describe configmap travel-booking-config -n travel-booking

# Create ConfigMap
kubectl create configmap my-config --from-literal=key=value
kubectl create configmap my-config --from-file=./config.txt

# Delete ConfigMap
kubectl delete configmap travel-booking-config -n travel-booking

# List Secrets
kubectl get secrets -n travel-booking
kubectl get secret travel-booking-secrets -n travel-booking -o yaml

# View secret (base64 decoded)
kubectl get secret travel-booking-secrets -n travel-booking -o jsonpath='{.data.JWT_SECRET}' | base64 -d

# Create Secret
kubectl create secret generic my-secret --from-literal=password=mypass
kubectl create secret generic my-secret --from-file=./secret.txt

# Delete Secret
kubectl delete secret travel-booking-secrets -n travel-booking
```

## 📊 Resource Management

```bash
# View resource usage
kubectl top nodes
kubectl top pods -n travel-booking
kubectl top pod <pod-name> -n travel-booking

# Set resource requests/limits
kubectl set resources deployment backend -n travel-booking \
  --requests=cpu=200m,memory=256Mi \
  --limits=cpu=1000m,memory=1Gi

# Auto-scale deployment
kubectl autoscale deployment backend --min=2 --max=5 --cpu-percent=80 -n travel-booking

# View HPA status
kubectl get hpa -n travel-booking
kubectl describe hpa backend -n travel-booking
```

## 🌐 Ingress Management

```bash
# List Ingress
kubectl get ingress -n travel-booking
kubectl get ingress travel-booking-ingress -n travel-booking -o yaml

# View Ingress details
kubectl describe ingress travel-booking-ingress -n travel-booking

# Delete Ingress
kubectl delete ingress travel-booking-ingress -n travel-booking
```

## 🔍 Debugging & Troubleshooting

```bash
# Get cluster events
kubectl get events -n travel-booking
kubectl get events -n travel-booking --sort-by='.lastTimestamp'

# Describe problematic resource
kubectl describe pod <pod-name> -n travel-booking

# View detailed pod info
kubectl get pod <pod-name> -n travel-booking -o yaml

# Check pod readiness
kubectl get pod <pod-name> -n travel-booking -o jsonpath='{.status.conditions}'

# View previous logs (for crashed containers)
kubectl logs <pod-name> -n travel-booking --previous

# Debug with temporary pod
kubectl run debug-pod --image=busybox --it --restart=Never -- sh

# Port forward for debugging
kubectl port-forward pod/<pod-name> 5005:5005 -n travel-booking
```

## 📁 YAML & Manifest Management

```bash
# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f k8s/
kubectl apply -f k8s/ --recursive

# Create from manifest
kubectl create -f deployment.yaml

# Delete by manifest
kubectl delete -f deployment.yaml
kubectl delete -f k8s/

# Dry run (preview changes)
kubectl apply -f deployment.yaml --dry-run=client
kubectl apply -f k8s/ --dry-run=client -o yaml

# Edit resource directly
kubectl edit deployment backend -n travel-booking
kubectl edit configmap travel-booking-config -n travel-booking

# Get resource as YAML
kubectl get deployment backend -n travel-booking -o yaml
kubectl get all -n travel-booking -o yaml
```

## 🎯 Label & Selector

```bash
# View labels
kubectl get pods -n travel-booking --show-labels

# Label a resource
kubectl label pod <pod-name> app=backend -n travel-booking
kubectl label deployment backend tier=api -n travel-booking

# Remove label
kubectl label pod <pod-name> app- -n travel-booking

# Select by label
kubectl get pods -l app=backend -n travel-booking
kubectl get pods -l app!=frontend -n travel-booking
```

## 📋 Batch Operations

```bash
# Delete multiple resources
kubectl delete pod,deployment,service -l app=backend -n travel-booking

# Apply all YAMLs in directory
kubectl apply -f ./k8s/

# Get all resources in namespace
kubectl get all -n travel-booking

# Delete entire namespace
kubectl delete namespace travel-booking
```

## 🛠️ Advanced Commands

```bash
# Get API resources
kubectl api-resources

# Explain resource fields
kubectl explain pod
kubectl explain deployment.spec

# Get resource schemas
kubectl get crd

# Check resource quota
kubectl get resourcequota -n travel-booking

# Dry run with client-side validation
kubectl apply -f deployment.yaml --dry-run=client --validate=true

# Get pretty-printed output
kubectl get pods -n travel-booking -o json | jq .
kubectl get deployment backend -n travel-booking -o json | jq '.spec.replicas'
```

## 🌍 Multi-Cluster & Context

```bash
# Get all contexts
kubectl config get-contexts

# Current context
kubectl config current-context

# Switch context
kubectl config use-context minikube
kubectl config use-context eks-cluster

# Set namespace as default
kubectl config set-context --current --namespace=travel-booking

# Delete context
kubectl config delete-context minikube
```

## 📚 Help & Documentation

```bash
# General help
kubectl --help

# Command-specific help
kubectl get --help
kubectl apply --help
kubectl logs --help

# Explain resources
kubectl explain pod
kubectl explain deployment.spec.template.spec
```

---

**Remember:** Use `kubectl --help` for more info on any command! 📖
