# Kubernetes Deployment Script - PowerShell
# For: Travel Booking System
# Teacher Demo

Write-Host "`n================================" -ForegroundColor Green
Write-Host "🚀 KUBERNETES DEPLOYMENT SCRIPT" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

# Check kubectl
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl not found. Install from: https://kubernetes.io/docs/tasks/tools/" -ForegroundColor Red
    exit 1
}

Write-Host "✓ kubectl installed`n" -ForegroundColor Green

# Step 1: Create namespace
Write-Host "Step 1: Creating namespace..." -ForegroundColor Cyan
kubectl apply -f namespace.yaml

# Step 2: Create ConfigMap
Write-Host "`nStep 2: Creating ConfigMap..." -ForegroundColor Cyan
kubectl apply -f configmap.yaml

# Step 3: Create Secrets
Write-Host "`nStep 3: Creating Secrets..." -ForegroundColor Cyan
kubectl apply -f secret.yaml

# Step 4: Deploy databases
Write-Host "`nStep 4: Deploying MongoDB..." -ForegroundColor Cyan
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

Write-Host "`nStep 5: Deploying Redis..." -ForegroundColor Cyan
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml

# Step 5: Deploy backend
Write-Host "`nStep 6: Deploying Backend..." -ForegroundColor Cyan
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Step 6: Deploy frontend
Write-Host "`nStep 7: Deploying Frontend..." -ForegroundColor Cyan
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Step 7: Deploy Ingress
Write-Host "`nStep 8: Deploying Ingress..." -ForegroundColor Cyan
kubectl apply -f ingress.yaml

Write-Host "`n================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

# Show status
Write-Host "📊 Deployment Status:`n" -ForegroundColor Yellow
kubectl get all -n travel-booking

Write-Host "`n📍 Services:`n" -ForegroundColor Yellow
kubectl get services -n travel-booking

Write-Host "`n🌐 Ingress:`n" -ForegroundColor Yellow
kubectl get ingress -n travel-booking

Write-Host "`n📝 Access Instructions:`n" -ForegroundColor Green
Write-Host "   For Minikube: kubectl port-forward service/frontend 3000:80 -n travel-booking" -ForegroundColor White
Write-Host "   Then open: http://localhost:3000`n" -ForegroundColor White
