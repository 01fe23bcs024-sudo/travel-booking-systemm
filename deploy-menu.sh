#!/bin/bash
# Multi-Deployment Menu - Works on macOS/Linux

echo "╔═══════════════════════════════════════════╗"
echo "║   Travel Booking System - Deployment      ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Choose deployment option:"
echo ""
echo "1) 🐳 Docker (Local - 5 min)"
echo "2) ☁️  Vercel (Cloud - 10 min)"
echo "3) ⚙️  Kubernetes (Advanced - 15 min)"
echo "4) 📊 Check Status"
echo "5) 🛑 Stop All"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo ""
    echo "🐳 Starting Docker deployment..."
    echo ""
    docker compose up -d
    echo ""
    echo "✅ Docker started!"
    echo ""
    docker compose ps
    echo ""
    echo "🌐 Access at: http://localhost:3000"
    echo "📝 View logs: docker compose logs -f"
    ;;
  
  2)
    echo ""
    echo "☁️ Vercel deployment instructions:"
    echo ""
    echo "Step 1: Verify files are in repository"
    git status | grep -E "vercel.json|vite.config"
    echo ""
    echo "Step 2: Visit https://vercel.com/new"
    echo "Step 3: Connect your GitHub repository"
    echo "Step 4: Deploy"
    echo ""
    echo "✅ Push code to GitHub:"
    git push origin main
    ;;
  
  3)
    echo ""
    echo "⚙️ Kubernetes deployment..."
    echo ""
    
    # Check if minikube is running
    if ! minikube status &>/dev/null; then
      echo "Starting Minikube..."
      minikube start --cpus=4 --memory=4096
    fi
    
    echo "Building Docker images..."
    eval $(minikube docker-env)
    docker build -t travel-booking-systemm-frontend:latest ./frontend
    docker build -t travel-booking-systemm-backend:latest ./backend
    
    echo "Deploying to Kubernetes..."
    cd k8s
    ./deploy.sh
    cd ..
    
    echo ""
    echo "✅ Kubernetes deployed!"
    echo ""
    echo "🌐 Port forward frontend:"
    echo "   kubectl port-forward service/frontend 3000:80 -n travel-booking"
    echo ""
    echo "🌐 Port forward backend:"
    echo "   kubectl port-forward service/backend 5000:5000 -n travel-booking"
    ;;
  
  4)
    echo ""
    echo "📊 Deployment Status:"
    echo ""
    
    echo "🐳 Docker Status:"
    docker compose ps 2>/dev/null || echo "Docker not running"
    echo ""
    
    echo "☁️ Vercel Status:"
    echo "Visit: https://vercel.com/dashboard"
    echo ""
    
    echo "⚙️ Kubernetes Status:"
    kubectl get all -n travel-booking 2>/dev/null || echo "Kubernetes not running"
    ;;
  
  5)
    echo ""
    echo "🛑 Stopping all deployments..."
    echo ""
    
    echo "Stopping Docker..."
    docker compose down 2>/dev/null
    
    echo "Stopping Kubernetes..."
    kubectl delete namespace travel-booking 2>/dev/null
    
    echo "✅ All stopped!"
    ;;
  
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
