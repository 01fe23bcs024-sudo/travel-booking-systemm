#!/bin/bash
# Kubernetes Deployment Script - Bash
# For: Travel Booking System
# Teacher Demo

echo ""
echo "================================"
echo "🚀 KUBERNETES DEPLOYMENT SCRIPT"
echo "================================"
echo ""

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Install from: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

echo "✓ kubectl installed"
echo ""

# Step 1: Create namespace
echo "Step 1: Creating namespace..."
kubectl apply -f namespace.yaml

# Step 2: Create ConfigMap
echo ""
echo "Step 2: Creating ConfigMap..."
kubectl apply -f configmap.yaml

# Step 3: Create Secrets
echo ""
echo "Step 3: Creating Secrets..."
kubectl apply -f secret.yaml

# Step 4: Deploy databases
echo ""
echo "Step 4: Deploying MongoDB..."
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

echo ""
echo "Step 5: Deploying Redis..."
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml

# Step 5: Deploy backend
echo ""
echo "Step 6: Deploying Backend..."
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Step 6: Deploy frontend
echo ""
echo "Step 7: Deploying Frontend..."
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Step 7: Deploy Ingress
echo ""
echo "Step 8: Deploying Ingress..."
kubectl apply -f ingress.yaml

echo ""
echo "================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "================================"
echo ""

# Show status
echo "📊 Deployment Status:"
echo ""
kubectl get all -n travel-booking

echo ""
echo "📍 Services:"
echo ""
kubectl get services -n travel-booking

echo ""
echo "🌐 Ingress:"
echo ""
kubectl get ingress -n travel-booking

echo ""
echo "📝 Access Instructions:"
echo "   For Minikube: kubectl port-forward service/frontend 3000:80 -n travel-booking"
echo "   Then open: http://localhost:3000"
echo ""
