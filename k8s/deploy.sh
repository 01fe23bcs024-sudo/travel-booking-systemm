#!/bin/bash
# Kubernetes Deployment Script - Bash
# Run: bash deploy.sh

echo ""
echo "🚀 Deploying Travel Booking System to Kubernetes..."
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first."
    exit 1
fi

# Check if minikube is installed
if ! command -v minikube &> /dev/null; then
    echo "❌ minikube not found. Please install minikube first."
    exit 1
fi

# Check if minikube is running
echo "Checking Minikube status..."
if ! minikube status &> /dev/null; then
    echo "⚠️  Minikube not running. Starting..."
    minikube start --cpus=4 --memory=4096
fi

# Configure Docker to use Minikube
echo ""
echo "Configuring Docker to use Minikube..."
eval $(minikube docker-env)

# Build Docker images
echo ""
echo "Building Docker images..."
echo "  📦 Building frontend image..."
docker build -t travel-booking-systemm-frontend:latest ./frontend

echo "  📦 Building backend image..."
docker build -t travel-booking-systemm-backend:latest ./backend

echo "✅ Images built successfully"
echo ""

# Deploy to Kubernetes
echo "Deploying to Kubernetes..."
echo ""

echo "  📝 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo "  📝 Creating ConfigMap..."
kubectl apply -f k8s/configmap.yaml

echo "  📝 Creating Secrets..."
kubectl apply -f k8s/secret.yaml

echo "  📦 Deploying MongoDB..."
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

echo "  📦 Deploying Redis..."
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml

echo "  📦 Deploying Backend..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

echo "  📦 Deploying Frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

echo "  📝 Creating Ingress..."
kubectl apply -f k8s/ingress.yaml

echo ""
echo "✅ Deployment complete!"
echo ""

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/frontend -n travel-booking --timeout=5m
kubectl rollout status deployment/backend -n travel-booking --timeout=5m

echo ""
echo "📊 Deployment Status:"
kubectl get all -n travel-booking

echo ""
echo "🌐 Access your application:"
echo "   Frontend: kubectl port-forward service/frontend 3000:80 -n travel-booking"
echo "   Backend:  kubectl port-forward service/backend 5000:5000 -n travel-booking"
echo ""
echo "   Then open: http://localhost:3000"
echo ""

# Show pod logs command
echo "📝 View logs:"
echo "   kubectl logs -f deployment/backend -n travel-booking"
echo "   kubectl logs -f deployment/frontend -n travel-booking"
echo ""
