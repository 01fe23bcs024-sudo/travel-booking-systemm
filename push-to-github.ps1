# PowerShell Script to Push Travel Booking System to GitHub
# Run this script after creating your GitHub repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push Travel Booking System to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check if .env exists and warn
if (Test-Path "backend\.env") {
    Write-Host "⚠️  WARNING: backend\.env file detected!" -ForegroundColor Red
    Write-Host "   Make sure .env is in .gitignore (it should be)" -ForegroundColor Yellow
    Write-Host ""
}

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# Show status
Write-Host ""
Write-Host "Files staged for commit:" -ForegroundColor Green
git status --short

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create repository on GitHub (if not done):" -ForegroundColor White
Write-Host "   - Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   - Name: travel-booking-system" -ForegroundColor Gray
Write-Host "   - Click 'Create repository'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Commit changes:" -ForegroundColor White
Write-Host "   git commit -m 'Initial commit: Travel Booking System'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Add remote (replace YOUR_USERNAME):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/travel-booking-system.git" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Push to GitHub:" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 TIP: Use Personal Access Token as password when pushing!" -ForegroundColor Yellow
Write-Host ""

