# Travel Booking System - Deployment Ready ✓

This project is now configured for deployment on **Vercel** (frontend) and **serverless backends** (API).

## 📦 What's Ready

✅ **Frontend** (Vite + React)
- Pre-configured for Vercel
- Build command: `npm run build`
- Output: `frontend/dist`

✅ **Backend** (Express.js)
- Serverless function support (`/api`)
- MongoDB & Redis integration
- CORS & JWT authentication

✅ **Configuration Files**
- `vercel.json` - Vercel deployment config
- `.vercelignore` - Files to exclude from deployment
- `.env.example` - Environment template
- `VERCEL_DEPLOYMENT.md` - Detailed deployment guide

## 🚀 Quick Start: Deploy to Vercel

### Option A: Frontend Only (Simplest)
1. Push to GitHub: `git push origin main`
2. Go to https://vercel.com → **Import Project** → Select your repository
3. Build Command: `cd frontend && npm run build`
4. Output Directory: `frontend/dist`
5. Click **Deploy**

### Option B: Full-Stack (Frontend + API)
1. Deploy Frontend on Vercel (Option A)
2. Deploy Backend on:
   - **Railway.app** (recommended, free tier available)
   - **Heroku** (paid, $5+/month)
   - **AWS Lambda** (pay-as-you-go)
   - **Render.com** (free tier available)

### Option C: Monorepo on Vercel
- Vercel now supports monorepos
- Set Root Directory to `./`
- Vercel auto-detects `frontend/` and `api/` folders

## 🔑 Environment Variables (Set in Vercel Dashboard)

Required for production:
```
MONGODB_URI=<your-atlas-connection-string>
REDIS_URL=<your-redis-connection-string>
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://your-vercel-app.vercel.app
VITE_API_URL=https://your-api-url/api
NODE_ENV=production
```

## 📝 Step-by-Step Deployment

See **VERCEL_DEPLOYMENT.md** for complete instructions including:
- MongoDB Atlas setup (free)
- Redis Cloud setup (free)
- Environment variables configuration
- Troubleshooting guide

## 🧪 Test Locally Before Deployment

```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Create .env file
cp .env.example .env
# Edit .env with your local MongoDB & Redis URLs

# Start backend
cd backend && npm start

# In another terminal, start frontend
cd frontend && npm run dev
```

## 📊 Deployment Architecture

```
GitHub Repository
        ↓
    Vercel
  (Frontend)
        ↓
   Vercel.app (UI at https://your-app.vercel.app)


GitHub Repository
        ↓
  Railway/Heroku/Render
    (Backend API)
        ↓
   API Endpoint (https://your-api.railway.app/api)


  Both connect to:
  ├─ MongoDB Atlas (Database)
  └─ Redis Cloud (Cache)
```

## ✨ Features Included

- ✅ User authentication (JWT)
- ✅ Flight & hotel booking
- ✅ Admin & agent dashboards
- ✅ Email notifications (Nodemailer)
- ✅ PDF invoice generation
- ✅ Payment gateway integration
- ✅ Redis caching
- ✅ CORS handling

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails: "Cannot find module" | Run `npm install` and commit `package-lock.json` |
| API calls return 404 | Check `VITE_API_URL` environment variable |
| Database connection timeout | Whitelist Vercel IPs in MongoDB Atlas or allow all (0.0.0.0/0) |
| CORS errors | Verify `FRONTEND_URL` matches your Vercel domain |

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Redis Cloud Setup](https://redis.com/try-free/)
- [Railway Deployment](https://railway.app/docs)

---

**Ready to deploy?** Start with **VERCEL_DEPLOYMENT.md** →
