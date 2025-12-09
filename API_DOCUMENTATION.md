# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `<your_backend_url>/api`

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth Endpoints

#### POST /api/auth/register
Register a new user or agent.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "user"
}
```

**For Agents, also include:**
```json
{
  "companyName": "Travel Agency",
  "licenseNumber": "TL-2024-001",
  "contactPhone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### GET /api/auth/me
Get current authenticated user.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "agent": null
}
```

---

### Flight Endpoints

#### GET /api/flights/search
Search flights (Public).

**Query Parameters:**
- `source` (optional): Source city
- `destination` (optional): Destination city
- `date` (optional): Departure date (YYYY-MM-DD)
- `passengers` (optional): Number of passengers (default: 1)
- `class` (optional): Flight class (economy, business, first)
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `airline` (optional): Airline name
- `refundable` (optional): true/false

**Response:**
```json
{
  "success": true,
  "count": 10,
  "flights": [
    {
      "_id": "flight_id",
      "flightNumber": "FL001",
      "airline": "Air Express",
      "source": "New York",
      "destination": "Los Angeles",
      "departureTime": "2024-01-15T10:00:00Z",
      "arrivalTime": "2024-01-15T16:00:00Z",
      "price": 299,
      "available": true
    }
  ]
}
```

#### POST /api/flights
Create flight (Agent/Admin only).

**Request Body:**
```json
{
  "flightNumber": "FL001",
  "airline": "Air Express",
  "source": "New York",
  "destination": "Los Angeles",
  "departureTime": "2024-01-15T10:00:00Z",
  "arrivalTime": "2024-01-15T16:00:00Z",
  "economyPrice": 299,
  "businessPrice": 599,
  "firstClassPrice": 999,
  "economySeats": { "total": 50 },
  "businessSeats": { "total": 20 },
  "firstClassSeats": { "total": 10 },
  "isRefundable": true,
  "cancellationFee": 50
}
```

#### PUT /api/flights/:id
Update flight (Agent/Admin only).

#### DELETE /api/flights/:id
Delete/Deactivate flight (Agent/Admin only).

---

### Hotel Endpoints

#### GET /api/hotels/search
Search hotels (Public).

**Query Parameters:**
- `city` (optional): City name
- `checkIn` (optional): Check-in date (YYYY-MM-DD)
- `checkOut` (optional): Check-out date (YYYY-MM-DD)
- `rooms` (optional): Number of rooms (default: 1)
- `guests` (optional): Number of guests (default: 1)
- `roomType` (optional): Room type (standard, deluxe, suite)
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `minRating` (optional): Minimum rating (0-5)
- `refundable` (optional): true/false

**Response:**
```json
{
  "success": true,
  "count": 5,
  "hotels": [
    {
      "_id": "hotel_id",
      "name": "Grand Hotel",
      "city": "New York",
      "address": "456 Park Avenue",
      "rating": 4.5,
      "price": 150,
      "available": true
    }
  ]
}
```

#### POST /api/hotels
Create hotel (Agent/Admin only).

**Request Body:**
```json
{
  "name": "Grand Hotel",
  "city": "New York",
  "address": "456 Park Avenue",
  "description": "Luxury hotel",
  "rating": 4.5,
  "amenities": ["WiFi", "Pool", "Gym"],
  "standardPrice": 150,
  "deluxePrice": 250,
  "suitePrice": 450,
  "standardRooms": { "total": 30 },
  "deluxeRooms": { "total": 20 },
  "suiteRooms": { "total": 10 },
  "isRefundable": true,
  "cancellationFee": 25
}
```

---

### Booking Endpoints

#### POST /api/bookings/flight
Book a flight (User/Agent/Admin).

**Request Body:**
```json
{
  "flightId": "flight_id",
  "flightClass": "economy",
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "passport": "AB123456"
    }
  ],
  "seatNumbers": ["E1", "E2"],
  "paymentMethod": "card",
  "agentId": "agent_id_optional"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "_id": "booking_id",
    "bookingNumber": "FL-ABC123",
    "user": "user_id",
    "flight": { ... },
    "totalAmount": 598,
    "paymentStatus": "completed",
    "bookingStatus": "confirmed"
  }
}
```

#### POST /api/bookings/hotel
Book a hotel (User/Agent/Admin).

**Request Body:**
```json
{
  "hotelId": "hotel_id",
  "roomType": "standard",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-18",
  "roomNumbers": ["S1", "S2"],
  "guests": {
    "adults": 2,
    "children": 1
  },
  "paymentMethod": "card",
  "agentId": "agent_id_optional"
}
```

#### GET /api/bookings
Get user's bookings.

**Query Parameters:**
- `status` (optional): pending, confirmed, cancelled, completed
- `type` (optional): flight, hotel

#### GET /api/bookings/:id
Get single booking details.

#### POST /api/bookings/:id/cancel
Cancel a booking.

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

**Response:**
```json
{
  "success": true,
  "booking": { ... },
  "refundAmount": 548
}
```

#### GET /api/bookings/:id/invoice
Download booking invoice as PDF.

---

### Agent Endpoints

#### GET /api/agents/bookings
Get all bookings for agent.

#### PUT /api/agents/bookings/:id/confirm
Confirm a booking.

#### GET /api/agents/stats
Get agent statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBookings": 50,
    "confirmedBookings": 45,
    "cancelledBookings": 5,
    "totalRevenue": 15000,
    "totalCommission": 1500,
    "earnings": 1500
  }
}
```

---

### Admin Endpoints

#### GET /api/admin/stats
Get admin dashboard statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 100,
      "agents": 10,
      "verifiedAgents": 8,
      "pendingAgents": 2
    },
    "bookings": {
      "total": 500,
      "confirmed": 450,
      "cancelled": 50,
      "flights": 300,
      "hotels": 200
    },
    "revenue": {
      "total": 150000
    },
    "popularRoutes": [
      {
        "_id": {
          "source": "New York",
          "destination": "Los Angeles"
        },
        "count": 50
      }
    ],
    "popularHotels": [
      {
        "_id": "Grand Hotel",
        "city": "New York",
        "count": 30
      }
    ]
  }
}
```

#### GET /api/admin/users
Get all users.

#### GET /api/admin/agents
Get all agents.

#### PUT /api/admin/agents/:id/verify
Verify/Approve agent.

#### PUT /api/admin/agents/:id/unverify
Unverify agent.

#### DELETE /api/admin/users/:id
Delete user.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error


