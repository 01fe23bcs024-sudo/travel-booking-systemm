# Deployment Guide

This guide covers deploying the Travel Booking System to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (or local MongoDB)
- Render/Railway account (for backend)
- Vercel account (for frontend)
- Email service credentials (Gmail/SendGrid)

---

## Step 1: MongoDB Atlas Setup

### Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (Free tier is fine for development)
4. Create a database user:
   - Database Access → Add New Database User
   - Choose username and password
   - Save credentials securely

### Configure Network Access

1. Go to Network Access
2. Add IP Address
3. For Render/Railway, add `0.0.0.0/0` (allow all IPs)
   - For production, restrict to specific IPs

### Get Connection String

1. Go to Clusters → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database user password
5. Example: `mongodb+srv://username:password@cluster.mongodb.net/travel_booking`

---

## Step 2: Backend Deployment (Render)

### Option A: Render

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: `travel-booking-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<generate_a_strong_random_string>
   JWT_EXPIRE=7d
   NODE_ENV=production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your_email@gmail.com>
   EMAIL_PASS=<your_app_password>
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://travel-booking-backend.onrender.com`)

### Option B: Railway

1. **Push to GitHub** (same as above)

2. **Create Railway Project**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

3. **Configure Service**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables** (same as Render)

5. **Deploy**
   - Railway auto-detects and deploys
   - Get the service URL from the dashboard

---

## Step 3: Frontend Deployment (Vercel)

1. **Push Frontend to GitHub**
   - Ensure frontend code is in the repository

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Get the frontend URL (e.g., `https://travel-booking.vercel.app`)

6. **Update Backend CORS**
   - Go back to Render/Railway
   - Update `FRONTEND_URL` to your Vercel URL
   - Redeploy backend if needed

---

## Step 4: Email Configuration (Gmail)

### Generate App Password

1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not enabled)
3. App Passwords → Generate
4. Select "Mail" and "Other"
5. Copy the generated password
6. Use this password in `EMAIL_PASS` environment variable

### Alternative: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API Key
3. Verify sender email
4. Update environment variables:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=<your_sendgrid_api_key>
   ```

---

## Step 5: Seed Production Data

### Option 1: Via Render/Railway Console

1. SSH into your Render/Railway service
2. Run:
   ```bash
   cd backend
   npm run seed
   ```

### Option 2: Via Local Connection

1. Update local `.env` with production MongoDB URI
2. Run:
   ```bash
   cd backend
   npm run seed
   ```

---

## Step 6: Domain Configuration (Optional)

### Custom Domain for Backend

1. In Render/Railway, go to Settings
2. Add custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` and `VITE_API_URL` if needed

### Custom Domain for Frontend

1. In Vercel, go to Project Settings → Domains
2. Add custom domain
3. Update DNS records
4. SSL will be auto-configured

---

## Step 7: Environment Variables Checklist

### Backend (.env)
- ✅ `PORT=5000`
- ✅ `MONGODB_URI` (MongoDB Atlas connection string)
- ✅ `JWT_SECRET` (strong random string)
- ✅ `JWT_EXPIRE=7d`
- ✅ `NODE_ENV=production`
- ✅ `EMAIL_HOST`
- ✅ `EMAIL_PORT`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS`
- ✅ `FRONTEND_URL` (Vercel URL)

### Frontend (.env)
- ✅ `VITE_API_URL` (Backend API URL)

---

## Step 8: Testing Production

1. **Test Backend**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Try logging in with seeded accounts
   - Test booking flow

3. **Check Logs**
   - Render: Dashboard → Logs
   - Railway: Deployments → View Logs
   - Vercel: Dashboard → Deployments → View Function Logs

---

## Troubleshooting

### Backend Issues

**Connection Refused**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check network access settings

**CORS Errors**
- Verify `FRONTEND_URL` in backend env vars
- Check CORS middleware configuration
- Ensure frontend URL matches exactly

**JWT Errors**
- Verify `JWT_SECRET` is set
- Check token expiration settings
- Ensure token is sent in Authorization header

### Frontend Issues

**API Calls Failing**
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Verify backend is running

**Build Errors**
- Check Node version compatibility
- Verify all dependencies are in package.json
- Check build logs in Vercel

### MongoDB Issues

**Connection Timeout**
- Verify IP whitelist includes Render/Railway IPs
- Check cluster status in Atlas
- Verify connection string format

**Database Not Found**
- Database is created on first connection
- Verify database name in connection string

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB Atlas configured and connected
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Email service configured
- [ ] Seed data loaded
- [ ] Test user registration
- [ ] Test login flow
- [ ] Test flight/hotel search
- [ ] Test booking creation
- [ ] Test PDF invoice generation
- [ ] Test email sending (check spam folder)
- [ ] Monitor logs for errors

---

## Security Checklist

- [ ] Use strong `JWT_SECRET`
- [ ] Enable MongoDB Atlas authentication
- [ ] Restrict IP access where possible
- [ ] Use HTTPS (automatic with Render/Railway/Vercel)
- [ ] Don't commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (consider adding)
- [ ] Regular security updates

---

## Monitoring

### Render
- View logs in dashboard
- Set up alerts for deployments
- Monitor resource usage

### Railway
- View logs in deployments
- Set up notifications
- Monitor metrics

### Vercel
- View function logs
- Monitor analytics
- Set up webhooks

---

## Backup Strategy

1. **MongoDB Atlas Backups**
   - Enable automated backups in Atlas
   - Schedule regular snapshots

2. **Code Backups**
   - All code in GitHub
   - Tag releases for rollback

3. **Environment Variables**
   - Document all env vars securely
   - Keep backup of configuration

---

## Scaling Considerations

- MongoDB Atlas: Upgrade cluster tier as needed
- Backend: Render/Railway auto-scales, monitor usage
- Frontend: Vercel CDN handles scaling automatically
- Consider Redis for caching if needed
- Implement rate limiting for production

---

## Support

For issues:
1. Check logs first
2. Verify environment variables
3. Test endpoints with Postman/curl
4. Check MongoDB Atlas status
5. Review deployment logs

---

Congratulations! Your Travel Booking System is now deployed! 🚀


