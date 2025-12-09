# Quick Start Guide

Get the Travel Booking System up and running in minutes!

## Prerequisites

- Node.js v18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Terminal/Command Prompt

## 5-Minute Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_booking
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**OR use MongoDB Atlas:**
- Create free cluster at mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Seed Sample Data

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@travel.com` / `admin123`
- Test user: `john@example.com` / `password123`
- Agent: `agent@travel.com` / `agent123`
- Sample flights and hotels

### 5. Start Backend Server

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

### 6. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 7. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

## Access the Application

1. Open browser: `http://localhost:5173`
2. Login with any test account:
   - **Admin**: admin@travel.com / admin123
   - **User**: john@example.com / password123
   - **Agent**: agent@travel.com / agent123

## Quick Test Flow

1. **As User:**
   - Search flights: `/flights`
   - Search hotels: `/hotels`
   - Book a flight/hotel
   - View bookings: `/my-bookings`
   - Download invoice

2. **As Agent:**
   - Login with agent account
   - Go to Agent Dashboard
   - Add flights: `/agent/flights`
   - Add hotels: `/agent/hotels`
   - View bookings

3. **As Admin:**
   - Login with admin account
   - View dashboard: `/admin/dashboard`
   - Manage users: `/admin/users`
   - Verify agents: `/admin/agents`

## Troubleshooting

**Port already in use?**
- Change `PORT` in backend `.env`
- Update frontend proxy in `vite.config.js`

**MongoDB connection error?**
- Check MongoDB is running
- Verify connection string in `.env`
- For Atlas: check IP whitelist includes `0.0.0.0/0`

**Frontend can't connect to backend?**
- Check backend is running on port 5000
- Verify CORS settings in `backend/server.js`
- Check `FRONTEND_URL` in backend `.env`

## Next Steps

- Read full [README.md](README.md) for detailed features
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API endpoints
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Need Help?

1. Check console logs for errors
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Review the detailed documentation files

---

**Happy Booking! 🚀**


