# Kubernetes Deployment Script for Travel Booking System (PowerShell)
# This script deploys the application to a Kubernetes cluster

Write-Host "🚀 Starting Kubernetes Deployment..." -ForegroundColor Green
Write-Host ""

# Check if kubectl is installed
try {
    $kubectlVersion = kubectl version --client --short 2>$null
    Write-Host "✓ kubectl found: $kubectlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ kubectl not found. Please install kubectl first." -ForegroundColor Red
    Write-Host "   Download: https://kubernetes.io/docs/tasks/tools/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Get current context
$context = kubectl config current-context
Write-Host "📍 Current context: $context" -ForegroundColor Cyan
Write-Host ""

# Create namespace
Write-Host "📦 Creating namespace 'travel-booking'..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml

# Create ConfigMap and Secrets
Write-Host "⚙️  Creating ConfigMap..." -ForegroundColor Yellow
kubectl apply -f k8s/configmap.yaml

Write-Host "🔐 Creating Secrets..." -ForegroundColor Yellow
kubectl apply -f k8s/secret.yaml

# Deploy databases and cache
Write-Host "🗄️  Deploying MongoDB..." -ForegroundColor Yellow
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

Write-Host "🔴 Deploying Redis..." -ForegroundColor Yellow
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml

# Wait for databases to be ready
Write-Host "⏳ Waiting for databases to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Deploy backend
Write-Host "🔧 Deploying Backend..." -ForegroundColor Yellow
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Deploy frontend
Write-Host "🎨 Deploying Frontend..." -ForegroundColor Yellow
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Deploy Ingress
Write-Host "🌐 Deploying Ingress..." -ForegroundColor Yellow
kubectl apply -f k8s/ingress.yaml

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Checking deployment status..." -ForegroundColor Cyan
kubectl get deployments -n travel-booking
Write-Host ""

Write-Host "🔌 Services:" -ForegroundColor Cyan
kubectl get services -n travel-booking
Write-Host ""

Write-Host "📝 Pods:" -ForegroundColor Cyan
kubectl get pods -n travel-booking
Write-Host ""

Write-Host "🌐 Ingress:" -ForegroundColor Cyan
kubectl get ingress -n travel-booking
Write-Host ""

Write-Host "📚 Useful commands:" -ForegroundColor Green
Write-Host "   View logs: kubectl logs -f deployment/backend -n travel-booking"
Write-Host "   Port forward: kubectl port-forward service/frontend 3000:80 -n travel-booking"
Write-Host "   Describe pod: kubectl describe pod <pod-name> -n travel-booking"
Write-Host "   Dashboard: kubectl proxy (then http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)"
