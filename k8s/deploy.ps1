# Kubernetes Deployment Script - PowerShell
# Run: .\deploy.ps1

Write-Host ""
Write-Host "🚀 Deploying Travel Booking System to Kubernetes..." -ForegroundColor Cyan
Write-Host ""

# Check if kubectl is installed
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl not found. Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Check if minikube is running
Write-Host "Checking Minikube status..." -ForegroundColor Yellow
$minikubeStatus = minikube status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Minikube not running. Starting..." -ForegroundColor Yellow
    minikube start --cpus=4 --memory=4096
}

# Configure Docker to use Minikube's Docker daemon
Write-Host ""
Write-Host "Configuring Docker to use Minikube..." -ForegroundColor Yellow
& minikube docker-env | Invoke-Expression

# Build Docker images
Write-Host ""
Write-Host "Building Docker images..." -ForegroundColor Yellow
Write-Host "  📦 Building frontend image..." -ForegroundColor Cyan
docker build -t travel-booking-systemm-frontend:latest ./frontend

Write-Host "  📦 Building backend image..." -ForegroundColor Cyan
docker build -t travel-booking-systemm-backend:latest ./backend

Write-Host "✅ Images built successfully" -ForegroundColor Green
Write-Host ""

# Deploy to Kubernetes
Write-Host "Deploying to Kubernetes..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  📝 Creating namespace..." -ForegroundColor Cyan
kubectl apply -f k8s/namespace.yaml

Write-Host "  📝 Creating ConfigMap..." -ForegroundColor Cyan
kubectl apply -f k8s/configmap.yaml

Write-Host "  📝 Creating Secrets..." -ForegroundColor Cyan
kubectl apply -f k8s/secret.yaml

Write-Host "  📦 Deploying MongoDB..." -ForegroundColor Cyan
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

Write-Host "  📦 Deploying Redis..." -ForegroundColor Cyan
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml

Write-Host "  📦 Deploying Backend..." -ForegroundColor Cyan
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

Write-Host "  📦 Deploying Frontend..." -ForegroundColor Cyan
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

Write-Host "  📝 Creating Ingress..." -ForegroundColor Cyan
kubectl apply -f k8s/ingress.yaml

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""

# Wait for deployments to be ready
Write-Host "Waiting for deployments to be ready..." -ForegroundColor Yellow
kubectl rollout status deployment/frontend -n travel-booking --timeout=5m
kubectl rollout status deployment/backend -n travel-booking --timeout=5m

Write-Host ""
Write-Host "📊 Deployment Status:" -ForegroundColor Cyan
kubectl get all -n travel-booking

Write-Host ""
Write-Host "🌐 Access your application:" -ForegroundColor Green
Write-Host "   Frontend: kubectl port-forward service/frontend 3000:80 -n travel-booking" -ForegroundColor Yellow
Write-Host "   Backend:  kubectl port-forward service/backend 5000:5000 -n travel-booking" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Then open: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

# Show pod logs command
Write-Host "📝 View logs:" -ForegroundColor Green
Write-Host "   kubectl logs -f deployment/backend -n travel-booking" -ForegroundColor Yellow
Write-Host "   kubectl logs -f deployment/frontend -n travel-booking" -ForegroundColor Yellow
Write-Host ""
