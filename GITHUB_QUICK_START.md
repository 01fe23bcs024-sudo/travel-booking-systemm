# 🚀 Quick Guide: Push to GitHub in 5 Steps

## ✅ Already Done:
- ✅ Git repository initialized
- ✅ Files added and staged
- ✅ .gitignore configured (protecting .env files)

---

## 📝 Next Steps:

### Step 1: Create GitHub Repository

1. Go to: **https://github.com/new**
2. Repository name: `travel-booking-system`
3. Description: `Full-stack Travel Booking System with React, Node.js, and MongoDB`
4. Choose: **Public** or **Private**
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

**Copy the repository URL** (looks like: `https://github.com/YOUR_USERNAME/travel-booking-system.git`)

---

### Step 2: Commit Files

Run this command:

```powershell
git commit -m "Initial commit: Travel Booking System

- Complete full-stack application
- React frontend with Vite and Tailwind CSS
- Node.js/Express backend with MongoDB
- JWT authentication system
- Flight and hotel booking functionality
- Admin and agent dashboards
- PDF invoice generation
- Email notifications
- Complete documentation"
```

---

### Step 3: Add GitHub Remote

Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/travel-booking-system.git
```

**Verify it was added:**
```powershell
git remote -v
```

---

### Step 4: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

**⚠️ When prompted:**
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (see below)

---

### Step 5: Create Personal Access Token (If Needed)

If GitHub asks for authentication:

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token (classic)"**
3. Name: `Travel Booking System`
4. Expiration: `90 days` (or custom)
5. Select scope: ✅ **repo** (check this box)
6. Click **"Generate token"**
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
8. Use this token as your password when pushing

---

## 🎯 Complete Command Sequence

Copy-paste these commands one by one:

```powershell
# 1. Commit files
git commit -m "Initial commit: Travel Booking System - Full-stack booking application"

# 2. Add remote (REPLACE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/travel-booking-system.git

# 3. Push to GitHub
git branch -M main
git push -u origin main
```

---

## ✅ Verify Success

After pushing, visit:
**https://github.com/YOUR_USERNAME/travel-booking-system**

You should see all your files!

---

## 🆘 Troubleshooting

**"Repository not found"**
→ Check the URL is correct and repository exists

**"Authentication failed"**
→ Use Personal Access Token instead of password

**"Updates were rejected"**
→ Repository already has commits, pull first:
```powershell
git pull origin main --rebase
git push -u origin main
```

---

**Done! Your project is now on GitHub! 🎉**

