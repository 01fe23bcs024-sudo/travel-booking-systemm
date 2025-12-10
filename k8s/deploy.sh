#!/bin/bash
# Kubernetes Deployment Script for Travel Booking System
# This script deploys the application to a Kubernetes cluster

set -e

echo "🚀 Starting Kubernetes Deployment..."
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first."
    echo "   Download: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

echo "✓ kubectl found: $(kubectl version --client --short)"
echo ""

# Get current context
CONTEXT=$(kubectl config current-context)
echo "📍 Current context: $CONTEXT"
echo ""

# Create namespace
echo "📦 Creating namespace 'travel-booking'..."
kubectl apply -f k8s/namespace.yaml

# Create ConfigMap and Secrets
echo "⚙️  Creating ConfigMap..."
kubectl apply -f k8s/configmap.yaml

echo "🔐 Creating Secrets..."
kubectl apply -f k8s/secret.yaml

# Deploy databases and cache
echo "🗄️  Deploying MongoDB..."
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

echo "🔴 Deploying Redis..."
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb -n travel-booking --timeout=300s 2>/dev/null || true
kubectl wait --for=condition=ready pod -l app=redis -n travel-booking --timeout=300s 2>/dev/null || true

sleep 10

# Deploy backend
echo "🔧 Deploying Backend..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Deploy frontend
echo "🎨 Deploying Frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Deploy Ingress
echo "🌐 Deploying Ingress..."
kubectl apply -f k8s/ingress.yaml

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking deployment status..."
kubectl get deployments -n travel-booking
echo ""
echo "🔌 Services:"
kubectl get services -n travel-booking
echo ""
echo "📝 Pods:"
kubectl get pods -n travel-booking
echo ""
echo "🌐 Ingress:"
kubectl get ingress -n travel-booking
echo ""

# Get frontend URL
FRONTEND_URL=$(kubectl get service frontend -n travel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")

if [ "$FRONTEND_URL" == "pending" ] || [ -z "$FRONTEND_URL" ]; then
    echo "⏳ Frontend LoadBalancer IP is still pending. Check with:"
    echo "   kubectl get service frontend -n travel-booking -w"
else
    echo "🎉 Frontend available at: http://$FRONTEND_URL"
fi

echo ""
echo "📚 Useful commands:"
echo "   View logs: kubectl logs -f deployment/backend -n travel-booking"
echo "   Port forward: kubectl port-forward service/frontend 3000:80 -n travel-booking"
echo "   Describe pod: kubectl describe pod <pod-name> -n travel-booking"
echo "   Dashboard: kubectl proxy (then http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)"
