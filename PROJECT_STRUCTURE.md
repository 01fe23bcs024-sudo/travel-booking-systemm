# Project Structure

## Complete Directory Tree

```
travel-booking-system/
│
├── backend/
│   ├── models/
│   │   ├── User.js          # User model (user, agent, admin)
│   │   ├── Agent.js         # Agent profile model
│   │   ├── Flight.js        # Flight listing model
│   │   ├── Hotel.js         # Hotel listing model
│   │   └── Booking.js       # Booking model
│   │
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── flights.js       # Flight CRUD and search
│   │   ├── hotels.js        # Hotel CRUD and search
│   │   ├── bookings.js      # Booking management
│   │   ├── agents.js        # Agent-specific routes
│   │   └── admin.js         # Admin routes
│   │
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   │
│   ├── utils/
│   │   ├── generateToken.js # JWT token generation
│   │   ├── paymentGateway.js # Mock payment processing
│   │   ├── pdfGenerator.js  # PDF invoice generation
│   │   └── emailService.js  # Email sending service
│   │
│   ├── scripts/
│   │   └── seedData.js      # Database seeding script
│   │
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   └── PrivateRoute.jsx  # Route protection
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── FlightSearch.jsx  # Flight search page
│   │   │   ├── HotelSearch.jsx   # Hotel search page
│   │   │   ├── BookingDetails.jsx # Booking details page
│   │   │   ├── MyBookings.jsx    # User bookings page
│   │   │   ├── AgentDashboard.jsx # Agent dashboard
│   │   │   ├── AgentFlights.jsx  # Agent flight management
│   │   │   ├── AgentHotels.jsx   # Agent hotel management
│   │   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   │   ├── AdminUsers.jsx    # User management
│   │   │   └── AdminAgents.jsx   # Agent management
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   │
│   │   ├── utils/
│   │   │   └── api.js            # Axios configuration
│   │   │
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   │
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── postcss.config.js         # PostCSS configuration
│
├── README.md                     # Main documentation
├── API_DOCUMENTATION.md          # API endpoints documentation
├── DEPLOYMENT.md                 # Deployment guide
├── PROJECT_STRUCTURE.md          # This file
└── .gitignore                    # Git ignore rules
```

## Backend Architecture

### Models Layer
- **User.js**: Core user model with roles (user, agent, admin)
- **Agent.js**: Extended profile for travel agents with verification
- **Flight.js**: Flight listings with seat management
- **Hotel.js**: Hotel listings with room management
- **Booking.js**: Booking records linking users to flights/hotels

### Routes Layer
- **auth.js**: Registration, login, user profile
- **flights.js**: CRUD operations and search for flights
- **hotels.js**: CRUD operations and search for hotels
- **bookings.js**: Create, view, cancel bookings; invoice download
- **agents.js**: Agent-specific operations and statistics
- **admin.js**: Admin operations (user/agent management, stats)

### Middleware Layer
- **auth.js**: JWT verification, role-based authorization

### Utils Layer
- **generateToken.js**: JWT token creation
- **paymentGateway.js**: Mock payment processing (simulates Stripe)
- **pdfGenerator.js**: PDF invoice generation using PDFKit
- **emailService.js**: Email sending via Nodemailer

## Frontend Architecture

### Component Structure
- **Navbar**: Global navigation with role-based menu items
- **PrivateRoute**: Route protection based on authentication and roles

### Page Components
- **Public Pages**: Home, Login, Register, FlightSearch, HotelSearch
- **User Pages**: MyBookings, BookingDetails
- **Agent Pages**: AgentDashboard, AgentFlights, AgentHotels
- **Admin Pages**: AdminDashboard, AdminUsers, AdminAgents

### Context
- **AuthContext**: Global authentication state management

### Utils
- **api.js**: Axios instance with base URL and auth headers

## Data Flow

### Authentication Flow
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Token is included in all subsequent API requests
5. Backend middleware validates token on protected routes

### Booking Flow
1. User searches flights/hotels (public endpoint)
2. User selects item and initiates booking
3. Frontend sends booking request to `/api/bookings/flight` or `/api/bookings/hotel`
4. Backend:
   - Checks availability
   - Processes payment (mock)
   - Creates booking record
   - Updates seat/room availability
   - Calculates commission (if agent)
   - Sends confirmation email
5. Frontend displays confirmation

### Agent Flow
1. Agent registers with company details
2. Admin verifies agent account
3. Agent can create flight/hotel listings
4. Agent views bookings and statistics
5. Commission tracked automatically

## Key Features Implementation

### Search Functionality
- **Flights**: Filtered by source, destination, date, class, price range
- **Hotels**: Filtered by city, dates, room type, price range, rating

### Booking System
- Real-time availability checking
- Seat/room selection
- Payment simulation
- Automatic refund calculation on cancellation

### PDF Generation
- Server-side PDF creation using PDFKit
- Includes booking details, customer info, pricing
- Downloadable via API endpoint

### Email Service
- Booking confirmation emails
- HTML-formatted emails
- Fallback to console logging if not configured

### Commission Tracking
- Automatic calculation on booking creation
- Tracked per agent
- Deducted on refunds

## Security Considerations

- JWT tokens with expiration
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- Input validation with express-validator
- MongoDB injection prevention (Mongoose)

## Scalability Notes

- Indexed MongoDB queries for performance
- Optional Redis caching (mentioned but not implemented)
- Stateless authentication (JWT)
- Separate frontend/backend allows independent scaling


