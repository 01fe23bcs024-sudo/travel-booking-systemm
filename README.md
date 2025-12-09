# Travel Booking System

A complete full-stack web application for booking flights and hotels with separate interfaces for users, travel agents, and administrators.

## Features

### Users
- ✈️ Search and book flights
- 🏨 Search and book hotels
- 📋 View upcoming & past bookings
- ❌ Cancel bookings with refund logic
- 📄 Download booking invoice (PDF)
- 📧 Email booking confirmation

### Travel Agents
- 🔐 Separate agent login/signup
- ✈️ Add/edit/delete flight listings
- 🏨 Add/edit/delete hotel listings
- 💰 Update prices, seat stock & room availability
- 📊 View all customer bookings made through them
- ✅ Confirm or cancel bookings
- 💵 Commission tracking

### Admin Panel
- 👥 Manage users & agents
- ✅ Approve/verify agents
- 📊 Dashboard with statistics:
  - Total bookings
  - Total revenue
  - Popular routes/hotels

### Search Engine
- ✈️ Flight search: source, destination, date, passengers, class
- 🏨 Hotel search: city, dates, rooms, guests
- 🔍 Filters: price range, rating, airline/hotel, refundable

### Booking System
- ⚡ Real-time availability check
- 🪑 Seat selection for flights
- 🏠 Room selection for hotels
- 💳 Payment simulation (Stripe-style mock gateway)
- 📄 Booking confirmation generator
- 💰 Commission calculation for agents

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js + Express
- JWT Authentication
- MongoDB + Mongoose
- PDF Generation (PDFKit)
- Email Service (Nodemailer)

## Project Structure

```
travel-booking-system/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   ├── scripts/         # Seed scripts
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # Utility functions
│   └── package.json
└── README.md
```

## Setup Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_booking
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Seed sample data (optional):
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Default Login Credentials

After running seed script:

- **Admin**: admin@travel.com / admin123
- **User**: john@example.com / password123
- **Agent**: agent@travel.com / agent123

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  name: string,
  email: string,
  password: string,
  phone?: string,
  role?: 'user' | 'agent'
}
```

#### Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Flight Endpoints

#### Search Flights
```
GET /api/flights/search
Query: source, destination, date, passengers, class, minPrice, maxPrice, airline, refundable
```

#### Get All Flights (Agent/Admin)
```
GET /api/flights
Headers: Authorization: Bearer <token>
```

#### Create Flight (Agent)
```
POST /api/flights
Headers: Authorization: Bearer <token>
Body: {
  flightNumber: string,
  airline: string,
  source: string,
  destination: string,
  departureTime: ISO8601,
  arrivalTime: ISO8601,
  economyPrice: number,
  businessPrice: number,
  firstClassPrice: number,
  economySeats: { total: number },
  businessSeats: { total: number },
  firstClassSeats: { total: number },
  isRefundable: boolean,
  cancellationFee: number
}
```

### Hotel Endpoints

#### Search Hotels
```
GET /api/hotels/search
Query: city, checkIn, checkOut, rooms, guests, roomType, minPrice, maxPrice, minRating, refundable
```

#### Create Hotel (Agent)
```
POST /api/hotels
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  city: string,
  address: string,
  description?: string,
  rating?: number,
  amenities: string[],
  standardPrice: number,
  deluxePrice: number,
  suitePrice: number,
  standardRooms: { total: number },
  deluxeRooms: { total: number },
  suiteRooms: { total: number },
  isRefundable: boolean,
  cancellationFee: number
}
```

### Booking Endpoints

#### Book Flight
```
POST /api/bookings/flight
Headers: Authorization: Bearer <token>
Body: {
  flightId: string,
  flightClass: 'economy' | 'business' | 'first',
  passengers: Array<{ name: string, age: number, passport?: string }>,
  seatNumbers: string[],
  paymentMethod: 'card' | 'upi' | 'netbanking',
  agentId?: string
}
```

#### Book Hotel
```
POST /api/bookings/hotel
Headers: Authorization: Bearer <token>
Body: {
  hotelId: string,
  roomType: 'standard' | 'deluxe' | 'suite',
  checkIn: ISO8601,
  checkOut: ISO8601,
  roomNumbers: string[],
  guests: { adults: number, children: number },
  paymentMethod: 'card' | 'upi' | 'netbanking',
  agentId?: string
}
```

#### Get Bookings
```
GET /api/bookings
Headers: Authorization: Bearer <token>
Query: status, type
```

#### Cancel Booking
```
POST /api/bookings/:id/cancel
Headers: Authorization: Bearer <token>
Body: {
  reason?: string
}
```

#### Download Invoice
```
GET /api/bookings/:id/invoice
Headers: Authorization: Bearer <token>
Response: PDF file
```

### Admin Endpoints

#### Get Statistics
```
GET /api/admin/stats
Headers: Authorization: Bearer <token> (Admin only)
```

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <token> (Admin only)
```

#### Verify Agent
```
PUT /api/admin/agents/:id/verify
Headers: Authorization: Bearer <token> (Admin only)
```

## Database Schema

### User Schema
- name, email, password, phone, role, createdAt

### Agent Schema
- userId, companyName, licenseNumber, contactPhone, address, isVerified, commissionRate, totalEarnings

### Flight Schema
- flightNumber, airline, source, destination, departureTime, arrivalTime, duration, prices (economy/business/first), seats (total/available), seat array, isRefundable, cancellationFee, createdBy, status

### Hotel Schema
- name, city, address, description, rating, amenities, prices (standard/deluxe/suite), rooms (total/available), room array, isRefundable, cancellationFee, images, createdBy, status

### Booking Schema
- bookingNumber, user, agent, bookingType, flight/hotel references, seatNumbers/roomNumbers, totalAmount, commission, paymentStatus, paymentMethod, paymentId, bookingStatus, cancelledAt, refundAmount

## Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd frontend && npm install && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=<your_backend_url>/api`

### MongoDB Atlas Setup

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`
4. Whitelist IP addresses (0.0.0.0/0 for Render/Railway)

## License

MIT


