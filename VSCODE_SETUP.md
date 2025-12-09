# How to Run in VS Code - Complete Guide

## 📋 Prerequisites

1. **VS Code Installed** - [Download here](https://code.visualstudio.com/)
2. **Node.js Installed** - [Download here](https://nodejs.org/)
3. **MongoDB** - Local installation OR MongoDB Atlas account
4. **Extensions (Recommended)**:
   - ESLint
   - Prettier
   - MongoDB for VS Code (optional)

---

## 🚀 Step-by-Step Setup in VS Code

### Step 1: Open Project in VS Code

1. Open VS Code
2. Click **File** → **Open Folder**
3. Navigate to: `C:\Users\Asus\Documents\travel booking system`
4. Click **Select Folder**

You should see the project structure in the Explorer panel.

---

### Step 2: Open Integrated Terminal

**Method 1:** Press `` Ctrl + ` `` (backtick key)

**Method 2:** Click **Terminal** → **New Terminal** from the menu

**Method 3:** Right-click in Explorer → **Open in Integrated Terminal**

---

### Step 3: Create Backend Environment File

1. In VS Code Explorer, navigate to `backend` folder
2. Right-click → **New File**
3. Name it: `.env`
4. Paste this content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_booking
JWT_SECRET=travel_booking_secret_key_change_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**💡 Tip:** If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

---

### Step 4: Install Backend Dependencies

In the integrated terminal:

```bash
cd backend
npm install
```

Wait for installation to complete. You'll see progress in the terminal.

---

### Step 5: Install Frontend Dependencies

**Open a NEW terminal** in VS Code:
- Press `` Ctrl + Shift + ` `` (opens new terminal)
- OR click the **+** button in terminal panel

Then run:

```bash
cd frontend
npm install
```

---

### Step 6: Start MongoDB

**If using Local MongoDB:**

Open a **NEW terminal** and run:

```bash
mongod
```

**If using MongoDB Atlas:**
- Skip this step
- Make sure your `.env` has the Atlas connection string

---

### Step 7: Seed Database (Optional)

In a terminal:

```bash
cd backend
npm run seed
```

This creates test users and sample data.

---

### Step 8: Start Backend Server

**Option A: Using Terminal**
In a terminal:
```bash
cd backend
npm run dev
```

**Option B: Using Debug Configuration** (Recommended)
1. Press `F5` OR click **Run and Debug** icon in sidebar
2. Select **"Debug Backend"** from dropdown
3. Click green play button

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### Step 9: Start Frontend

**Option A: Using Terminal**
Open a **NEW terminal**:
```bash
cd frontend
npm run dev
```

**Option B: Using Debug Configuration**
1. Press `F5` OR go to **Run and Debug**
2. Select **"Debug Frontend"** from dropdown
3. Click green play button

**Option C: Debug Both at Once**
1. Go to **Run and Debug**
2. Select **"Debug Full Stack"** from dropdown
3. This starts both backend and frontend!

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### Step 10: Open in Browser

1. Click the URL in the terminal: `http://localhost:5173`
2. OR manually navigate to: `http://localhost:5173`

---

## 🎯 VS Code Tips & Tricks

### Using Multiple Terminals

VS Code can have multiple terminals side-by-side:

1. Click the **split terminal** icon (⊞) in terminal panel
2. OR right-click terminal tab → **Split Terminal**
3. OR press `` Ctrl + Shift + ` `` to create new terminal

**Recommended Setup:**
- **Terminal 1:** MongoDB (`mongod`)
- **Terminal 2:** Backend (`npm run dev`)
- **Terminal 3:** Frontend (`npm run dev`)

---

### Using Debug Configurations

The project includes debug configurations:

1. **Debug Backend** - Starts backend with debugging
2. **Debug Frontend** - Starts frontend with debugging
3. **Debug Full Stack** - Starts both simultaneously
4. **Seed Database** - Runs seed script

**To use:**
1. Press `F5` or click Debug icon (▶️) in sidebar
2. Select configuration from dropdown
3. Click play button

**To add breakpoints:**
- Click left of line number (red dot appears)
- Code will pause when execution reaches that line

---

### Opening Files Quickly

- **Quick Open:** `Ctrl + P` - Type filename to open
- **Go to File:** `Ctrl + Shift + P` - Command palette
- **Search in Files:** `Ctrl + Shift + F`

---

### Terminal Shortcuts

- **New Terminal:** `` Ctrl + Shift + ` ``
- **Split Terminal:** `Ctrl + \`
- **Kill Terminal:** `Ctrl + Shift + \`
- **Clear Terminal:** Right-click → **Clear**

---

## 🔧 VS Code Workspace Setup

### Recommended Extensions

Install these for better development experience:

1. **ESLint** - Code linting
   - Extensions → Search "ESLint" → Install

2. **Prettier** - Code formatting
   - Extensions → Search "Prettier" → Install

3. **MongoDB for VS Code** (Optional)
   - Extensions → Search "MongoDB" → Install

4. **Thunder Client** (Optional - API Testing)
   - Extensions → Search "Thunder Client" → Install

---

### File Organization

The Explorer shows:
```
travel booking system/
├── 📁 backend/          (Backend code)
├── 📁 frontend/         (Frontend code)
├── 📄 README.md         (Documentation)
└── 📄 VSCODE_SETUP.md   (This file)
```

---

## 🐛 Debugging in VS Code

### Backend Debugging

1. Set breakpoints in `backend/server.js` or route files
2. Press `F5` → Select "Debug Backend"
3. Code will pause at breakpoints
4. Use Debug panel to:
   - View variables
   - Step through code
   - Inspect call stack

### Frontend Debugging

1. Set breakpoints in React components
2. Press `F5` → Select "Debug Frontend"
3. Open browser DevTools (F12) for additional debugging
4. Use VS Code debugger for server-side code

---

## 📝 Test Login Credentials

After running `npm run seed`:

- **Admin**: admin@travel.com / admin123
- **User**: john@example.com / password123
- **Agent**: agent@travel.com / agent123

---

## ⚡ Quick Command Reference

**In VS Code Terminal:**

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev         # Start backend
npm run seed        # Seed database

# Frontend
cd frontend
npm install         # Install dependencies
npm run dev         # Start frontend
```

---

## 🔍 Troubleshooting in VS Code

### Terminal Not Working
- Restart VS Code
- Check terminal settings: File → Preferences → Settings → Terminal

### Debug Not Starting
- Check `launch.json` exists in `.vscode` folder
- Verify Node.js is installed: `node --version`
- Check console for errors

### Port Already in Use
- Kill process using port 5000 (backend) or 5173 (frontend)
- OR change port in `.env` file

### Module Not Found
- Right-click on `backend` or `frontend` folder
- Select "Open in Integrated Terminal"
- Run `npm install`

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **API Documentation:** See `API_DOCUMENTATION.md`
- **Deployment Guide:** See `DEPLOYMENT.md`

---

## 🎉 You're All Set!

Your Travel Booking System should now be running in VS Code!

**Next Steps:**
1. Open `http://localhost:5173` in browser
2. Login with test credentials
3. Start developing! 🚀

---

**Happy Coding in VS Code! 💻**


