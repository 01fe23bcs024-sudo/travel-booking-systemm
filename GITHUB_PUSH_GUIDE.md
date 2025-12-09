# How to Push Project to GitHub

## 📋 Prerequisites

1. **Git Installed** - Check with: `git --version`
2. **GitHub Account** - Create at [github.com](https://github.com) if you don't have one
3. **GitHub CLI (Optional)** - Or use web interface

---

## 🚀 Step-by-Step Guide

### Step 1: Create GitHub Repository

#### Option A: Using GitHub Website (Recommended)

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `travel-booking-system` (or any name you prefer)
4. Description: `Full-stack Travel Booking System with React, Node.js, and MongoDB`
5. Choose visibility:
   - ✅ **Public** (anyone can see)
   - 🔒 **Private** (only you can see)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

**Copy the repository URL** (you'll need it later)
- Format: `https://github.com/YOUR_USERNAME/travel-booking-system.git`

#### Option B: Using GitHub CLI

```bash
gh repo create travel-booking-system --public --source=. --remote=origin --push
```

---

### Step 2: Initialize Git Repository (If Not Done)

Open VS Code Terminal or PowerShell in project folder:

```powershell
cd "C:\Users\Asus\Documents\travel booking system"
git init
```

---

### Step 3: Verify .gitignore

Make sure `.gitignore` file exists and includes:
- `node_modules/`
- `.env`
- `dist/`
- Other sensitive/unnecessary files

✅ Already configured!

---

### Step 4: Add All Files to Git

```powershell
git add .
```

This stages all files (except those in .gitignore)

**To see what will be committed:**
```powershell
git status
```

---

### Step 5: Create Initial Commit

```powershell
git commit -m "Initial commit: Travel Booking System

- Complete full-stack application
- React frontend with Vite
- Node.js/Express backend
- MongoDB database models
- JWT authentication
- Flight and hotel booking system
- Admin and agent dashboards
- PDF invoice generation
- Email notifications"
```

---

### Step 6: Add GitHub Remote

Replace `YOUR_USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/travel-booking-system.git
```

**To verify remote was added:**
```powershell
git remote -v
```

---

### Step 7: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

**First time pushing?** GitHub will ask for credentials:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your GitHub password)

#### How to Create Personal Access Token:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name: `Travel Booking System`
4. Select scopes: ✅ **repo** (full control)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

---

## ✅ Complete Command Sequence

Here's everything in one go (copy-paste ready):

```powershell
# Navigate to project
cd "C:\Users\Asus\Documents\travel booking system"

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Travel Booking System - Full-stack booking application with React, Node.js, and MongoDB"

# Add remote (REPLACE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/travel-booking-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔄 For Future Updates

After making changes to your code:

```powershell
git add .
git commit -m "Description of changes"
git push
```

---

## 🛠️ Troubleshooting

### Error: "Repository not found"
- Check repository URL is correct
- Verify repository exists on GitHub
- Check you have access (for private repos)

### Error: "Authentication failed"
- Use Personal Access Token instead of password
- Token might be expired (create new one)
- Check token has `repo` scope

### Error: "Updates were rejected"
- Someone else pushed changes
- Pull first: `git pull origin main --rebase`
- Then push again: `git push`

### Error: "Permission denied"
- Check you're using correct GitHub username
- Verify Personal Access Token has correct permissions

### Remove Wrong Remote
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/travel-booking-system.git
```

---

## 📝 What Gets Pushed

✅ **Will be pushed:**
- All source code
- Configuration files
- Documentation (README, API docs, etc.)
- VS Code launch.json and tasks.json (useful for team)

❌ **Will NOT be pushed** (in .gitignore):
- `node_modules/` (too large, users install locally)
- `.env` files (sensitive credentials)
- `dist/` build folders
- Log files
- OS-specific files

---

## 🌿 Branching Strategy (Optional)

For team collaboration:

```powershell
# Create new branch
git checkout -b feature/new-feature

# Make changes, then:
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub
```

---

## 📚 Next Steps After Pushing

1. **Add Repository Description** on GitHub
2. **Add Topics/Tags**: `travel`, `booking`, `react`, `nodejs`, `mongodb`
3. **Update README** with badges, screenshots
4. **Create LICENSE** file (MIT, Apache, etc.)
5. **Set up GitHub Actions** for CI/CD (optional)
6. **Enable Issues** for bug tracking
7. **Create Releases** for version tags

---

## 🔒 Security Reminder

**NEVER commit:**
- `.env` files
- API keys
- Passwords
- Database credentials
- Personal Access Tokens

Use `.env.example` files instead and document required variables.

---

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] Git initialized locally
- [ ] Files added and committed
- [ ] Remote added
- [ ] Successfully pushed to GitHub
- [ ] Repository visible on GitHub
- [ ] README displays correctly

---

**Need help?** Check GitHub documentation or create an issue in your repository!

**Happy Pushing! 🚀**

