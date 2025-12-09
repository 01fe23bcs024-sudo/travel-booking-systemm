# How to Run - Step by Step

## Prerequisites
✅ Node.js installed (check with: `node --version`)
✅ MongoDB installed OR MongoDB Atlas account

---

## 🚀 Quick Start (Windows PowerShell)

### Step 1: Install Backend Dependencies
```powershell
cd backend
npm install
```

### Step 2: Setup Environment
The `.env` file is already created. If using MongoDB Atlas, update `MONGODB_URI` in `backend/.env`

### Step 3: Start MongoDB
**Option A: Local MongoDB**
```powershell
mongod
```
*(Keep this terminal open)*

**Option B: MongoDB Atlas (Cloud)**
- No local setup needed
- Just update the connection string in `backend/.env`

### Step 4: Seed Database (Optional but Recommended)
```powershell
cd backend
npm run seed
```
This creates test users and sample data.

### Step 5: Start Backend Server
```powershell
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`
*(Keep this terminal open)*

### Step 6: Install Frontend Dependencies
**Open a NEW terminal window:**
```powershell
cd "C:\Users\Asus\Documents\travel booking system\frontend"
npm install
```

### Step 7: Start Frontend
```powershell
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Step 8: Open Browser
Navigate to: `http://localhost:5173`

---

## 🔑 Test Login Credentials

After running `npm run seed`, you can login with:

- **Admin**: 
  - Email: `admin@travel.com`
  - Password: `admin123`

- **User**: 
  - Email: `john@example.com`
  - Password: `password123`

- **Agent**: 
  - Email: `agent@travel.com`
  - Password: `agent123`

---

## 📋 What You Should See

**Terminal 1 (MongoDB):**
```
MongoDB running on port 27017
```

**Terminal 2 (Backend):**
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

**Terminal 3 (Frontend):**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## ⚠️ Troubleshooting

### MongoDB Not Running
**Error:** `MongoDB connection error`

**Solution:**
- Start MongoDB: `mongod`
- OR use MongoDB Atlas (cloud)
- Update `MONGODB_URI` in `backend/.env`

### Port Already in Use
**Error:** `Port 5000 already in use`

**Solution:**
1. Find what's using port 5000: `netstat -ano | findstr :5000`
2. Kill the process OR change port in `backend/.env`

### Dependencies Not Installed
**Error:** `Cannot find module`

**Solution:**
```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### Frontend Can't Connect to Backend
**Error:** `Network Error` or `CORS Error`

**Solution:**
1. Make sure backend is running on port 5000
2. Check `FRONTEND_URL` in `backend/.env` matches frontend URL
3. Verify `vite.config.js` proxy settings

---

## 🎯 Quick Commands Reference

```powershell
# Install all dependencies
cd backend; npm install
cd ..\frontend; npm install

# Start everything (in separate terminals)
cd backend; npm run dev
cd frontend; npm run dev

# Seed database
cd backend; npm run seed

# Check if MongoDB is running
mongod --version
```

---

## 📁 Project Structure
```
travel booking system/
├── backend/          ← Backend server (Node.js)
├── frontend/         ← Frontend app (React)
└── README.md         ← Full documentation
```

---

**Need more help?** Check `README.md` for detailed documentation!


