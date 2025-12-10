# Multi-Deployment Menu - Windows PowerShell
# Run: powershell -ExecutionPolicy Bypass -File deploy-menu.ps1

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Travel Booking System - Deployment      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose deployment option:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1) 🐳 Docker (Local - 5 min)" -ForegroundColor Green
Write-Host "2) ☁️  Vercel (Cloud - 10 min)" -ForegroundColor Blue
Write-Host "3) ⚙️  Kubernetes (Advanced - 15 min)" -ForegroundColor Magenta
Write-Host "4) 📊 Check Status" -ForegroundColor Cyan
Write-Host "5) 🛑 Stop All" -ForegroundColor Red
Write-Host ""
$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
  "1" {
    Write-Host ""
    Write-Host "🐳 Starting Docker deployment..." -ForegroundColor Green
    Write-Host ""
    
    docker compose up -d
    
    Write-Host ""
    Write-Host "✅ Docker started!" -ForegroundColor Green
    Write-Host ""
    
    docker compose ps
    
    Write-Host ""
    Write-Host "🌐 Access at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📝 View logs: docker compose logs -f" -ForegroundColor Cyan
    Write-Host "🛑 Stop: docker compose down" -ForegroundColor Cyan
  }
  
  "2" {
    Write-Host ""
    Write-Host "☁️ Vercel deployment instructions:" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Step 1: Verify files are in repository" -ForegroundColor Yellow
    git status | Select-String -Pattern "vercel.json|vite.config"
    Write-Host ""
    Write-Host "Step 2: Visit https://vercel.com/new" -ForegroundColor Yellow
    Write-Host "Step 3: Connect your GitHub repository" -ForegroundColor Yellow
    Write-Host "Step 4: Deploy" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Pushing code to GitHub..." -ForegroundColor Green
    git push origin main
    Write-Host ""
    Write-Host "📖 See COMPLETE_DEPLOYMENT_GUIDE.md for detailed steps" -ForegroundColor Cyan
  }
  
  "3" {
    Write-Host ""
    Write-Host "⚙️ Kubernetes deployment..." -ForegroundColor Magenta
    Write-Host ""
    
    # Check if minikube is running
    $minikubeStatus = minikube status -q 2>$null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Starting Minikube..." -ForegroundColor Yellow
      minikube start --cpus=4 --memory=4096
    }
    
    Write-Host "Building Docker images..." -ForegroundColor Yellow
    $env:DOCKER_HOST = & minikube docker-env --shell powershell | Out-String | Invoke-Expression
    
    docker build -t travel-booking-systemm-frontend:latest ./frontend
    docker build -t travel-booking-systemm-backend:latest ./backend
    
    Write-Host "Deploying to Kubernetes..." -ForegroundColor Yellow
    Push-Location k8s
    & .\deploy.ps1
    Pop-Location
    
    Write-Host ""
    Write-Host "✅ Kubernetes deployed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access application (in new terminal):" -ForegroundColor Cyan
    Write-Host "   kubectl port-forward service/frontend 3000:80 -n travel-booking" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Monitor deployment:" -ForegroundColor Cyan
    Write-Host "   kubectl get all -n travel-booking -w" -ForegroundColor Cyan
  }
  
  "4" {
    Write-Host ""
    Write-Host "📊 Deployment Status:" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "🐳 Docker Status:" -ForegroundColor Green
    docker compose ps 2>$null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Docker not running" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "☁️ Vercel Status:" -ForegroundColor Blue
    Write-Host "Visit: https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "⚙️ Kubernetes Status:" -ForegroundColor Magenta
    kubectl get all -n travel-booking 2>$null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Kubernetes not running or namespace not found" -ForegroundColor Red
    }
  }
  
  "5" {
    Write-Host ""
    Write-Host "🛑 Stopping all deployments..." -ForegroundColor Red
    Write-Host ""
    
    Write-Host "Stopping Docker..." -ForegroundColor Yellow
    docker compose down 2>$null
    
    Write-Host "Stopping Kubernetes..." -ForegroundColor Yellow
    kubectl delete namespace travel-booking 2>$null
    
    Write-Host ""
    Write-Host "✅ All stopped!" -ForegroundColor Green
  }
  
  default {
    Write-Host ""
    Write-Host "❌ Invalid choice" -ForegroundColor Red
    exit 1
  }
}

Write-Host ""
