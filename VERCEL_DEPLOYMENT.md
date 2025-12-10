# Vercel Deployment Guide

## Prerequisites
1. Push your code to GitHub (if not already done)
2. Create a Vercel account at https://vercel.com
3. Have your MongoDB and Redis connection strings ready

## Step 1: Connect to GitHub on Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Connect your GitHub account and select the `travel-booking-systemm` repository

## Step 2: Configure Build Settings
When Vercel shows the project import screen:
- **Framework Preset**: Leave as "Other" (since it's a monorepo with Vite + Node.js)
- **Root Directory**: Leave blank (or set to `./`)
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install --legacy-peer-deps`

## Step 3: Set Environment Variables
In the Vercel dashboard, go to your project **Settings** → **Environment Variables** and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel_booking
REDIS_URL=redis://default:password@hostname:port
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=https://your-vercel-url.vercel.app
VITE_API_URL=https://your-api-url/api
NODE_ENV=production
```

**Note**: 
- For **MONGODB_URI**: Use MongoDB Atlas (https://www.mongodb.com/cloud/atlas) to create a free tier database
- For **REDIS_URL**: Use Redis Cloud (https://redis.com/try-free/) or similar
- Get your **API_URL** after the backend is deployed

## Step 4: Deploy Frontend Only (Recommended First Step)
1. In Vercel, during deployment configuration, set:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
2. Click **Deploy**
3. Wait for the build to complete (takes ~2-3 minutes)

## Step 5: Deploy Backend as Serverless Function
Alternatively, deploy backend as a separate Vercel project:
1. Create a new Vercel project specifically for `backend/`
2. Set **Root Directory** to `backend/`
3. Set **Build Command** to empty (leave blank)
4. Set **Output Directory** to `.`
5. Deploy

Or use a external backend service (Heroku, Railway, AWS Lambda, etc.)

## Step 6: Update Database & Cache Service
Since Vercel doesn't run MongoDB/Redis natively:
- **MongoDB**: Use MongoDB Atlas (free tier available)
- **Redis**: Use Redis Cloud or Upstash (free tier available)

Update your environment variables with the production connection strings.

## Step 7: Verify Deployment
1. Once deployed, your frontend will be live at `https://your-project.vercel.app`
2. Check the Vercel deployment logs for any errors
3. Test the application in production

## Troubleshooting

### Build fails with "Cannot find module"
- Ensure all dependencies in `package.json` are listed
- Run `npm install` locally to verify dependencies work

### API calls fail from frontend
- Check that `VITE_API_URL` environment variable is correctly set
- Verify backend is deployed and running
- Check CORS settings in `backend/server.js`

### Database connection errors
- Verify `MONGODB_URI` environment variable is correct
- Ensure IP whitelist on MongoDB Atlas includes Vercel's IPs (or allow all: `0.0.0.0/0`)
- Check Redis connection string format

## Quick Commands
```bash
# Push to GitHub (after committing)
git push origin main

# Local test before deployment
npm install
cd frontend && npm run build
cd ../backend && npm start

# Check environment locally
echo $MONGODB_URI
echo $REDIS_URL
```

## Deployment Flow Summary
```
GitHub Push
    ↓
Vercel Auto-Deploy Triggered
    ↓
Install Dependencies (npm install)
    ↓
Build Frontend (vite build → frontend/dist)
    ↓
Deploy Frontend to Vercel Edge Network
    ↓
Live at https://your-project.vercel.app
```

---

**For full-stack with separate backend deployment**, consider:
- Backend on Railway.app (free tier)
- Frontend on Vercel (free tier)
- MongoDB Atlas (free tier)
- Redis Cloud/Upstash (free tier)

This keeps API calls separate and allows independent scaling.
