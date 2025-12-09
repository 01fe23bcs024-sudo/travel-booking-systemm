import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Agent from '../models/Agent.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_booking');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Agent.deleteMany({});
    await Flight.deleteMany({});
    await Hotel.deleteMany({});
    await Booking.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@travel.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Created admin user');

    // Create sample users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+1234567891',
      role: 'user'
    });
    console.log('✅ Created sample users');

    // Create agent user
    const agentUser = await User.create({
      name: 'Travel Agent',
      email: 'agent@travel.com',
      password: 'agent123',
      phone: '+1234567892',
      role: 'agent'
    });

    // Create agent profile
    const agent = await Agent.create({
      userId: agentUser._id,
      companyName: 'World Travel Agency',
      licenseNumber: 'TL-2024-001',
      contactPhone: '+1234567892',
      address: {
        street: '123 Travel St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      isVerified: true,
      commissionRate: 10,
      verifiedAt: new Date(),
      verifiedBy: admin._id
    });
    console.log('✅ Created agent');

    // Create flights
    const flights = [
      {
        flightNumber: 'FL001',
        airline: 'Air Express',
        source: 'New York',
        destination: 'Los Angeles',
        departureTime: new Date(Date.now() + 86400000 * 2),
        arrivalTime: new Date(Date.now() + 86400000 * 2 + 6 * 60 * 60 * 1000),
        duration: 360,
        economyPrice: 299,
        businessPrice: 599,
        firstClassPrice: 999,
        economySeats: { total: 50, available: 50 },
        businessSeats: { total: 20, available: 20 },
        firstClassSeats: { total: 10, available: 10 },
        isRefundable: true,
        cancellationFee: 50,
        createdBy: agentUser._id,
        status: 'active'
      },
      {
        flightNumber: 'FL002',
        airline: 'Sky Airlines',
        source: 'London',
        destination: 'Paris',
        departureTime: new Date(Date.now() + 86400000 * 3),
        arrivalTime: new Date(Date.now() + 86400000 * 3 + 90 * 60 * 1000),
        duration: 90,
        economyPrice: 199,
        businessPrice: 399,
        firstClassPrice: 699,
        economySeats: { total: 60, available: 60 },
        businessSeats: { total: 30, available: 30 },
        firstClassSeats: { total: 15, available: 15 },
        isRefundable: true,
        cancellationFee: 30,
        createdBy: agentUser._id,
        status: 'active'
      },
      {
        flightNumber: 'FL003',
        airline: 'Ocean Airways',
        source: 'Tokyo',
        destination: 'Seoul',
        departureTime: new Date(Date.now() + 86400000 * 5),
        arrivalTime: new Date(Date.now() + 86400000 * 5 + 2 * 60 * 60 * 1000),
        duration: 120,
        economyPrice: 249,
        businessPrice: 499,
        firstClassPrice: 899,
        economySeats: { total: 70, available: 70 },
        businessSeats: { total: 25, available: 25 },
        firstClassSeats: { total: 10, available: 10 },
        isRefundable: true,
        cancellationFee: 40,
        createdBy: agentUser._id,
        status: 'active'
      }
    ];

    // Generate seats for each flight
    for (const flightData of flights) {
      const seats = [];
      
      // Economy seats
      for (let i = 1; i <= flightData.economySeats.total; i++) {
        seats.push({ seatNumber: `E${i}`, class: 'economy', isBooked: false });
      }
      
      // Business seats
      for (let i = 1; i <= flightData.businessSeats.total; i++) {
        seats.push({ seatNumber: `B${i}`, class: 'business', isBooked: false });
      }
      
      // First class seats
      for (let i = 1; i <= flightData.firstClassSeats.total; i++) {
        seats.push({ seatNumber: `F${i}`, class: 'first', isBooked: false });
      }
      
      flightData.seats = seats;
    }

    const createdFlights = await Flight.insertMany(flights);
    console.log(`✅ Created ${createdFlights.length} flights`);

    // Create hotels
    const hotels = [
      {
        name: 'Grand Hotel',
        city: 'New York',
        address: '456 Park Avenue, New York, NY 10022',
        description: 'Luxury hotel in the heart of Manhattan',
        rating: 4.5,
        amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant'],
        standardPrice: 150,
        deluxePrice: 250,
        suitePrice: 450,
        standardRooms: { total: 30, available: 30 },
        deluxeRooms: { total: 20, available: 20 },
        suiteRooms: { total: 10, available: 10 },
        isRefundable: true,
        cancellationFee: 25,
        images: [],
        createdBy: agentUser._id,
        status: 'active'
      },
      {
        name: 'Ocean View Resort',
        city: 'Los Angeles',
        address: '789 Beach Boulevard, Los Angeles, CA 90210',
        description: 'Beachfront resort with stunning ocean views',
        rating: 4.8,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar'],
        standardPrice: 200,
        deluxePrice: 350,
        suitePrice: 600,
        standardRooms: { total: 40, available: 40 },
        deluxeRooms: { total: 25, available: 25 },
        suiteRooms: { total: 15, available: 15 },
        isRefundable: true,
        cancellationFee: 50,
        images: [],
        createdBy: agentUser._id,
        status: 'active'
      },
      {
        name: 'City Center Hotel',
        city: 'London',
        address: '321 Main Street, London, UK SW1A 1AA',
        description: 'Modern hotel in the city center',
        rating: 4.2,
        amenities: ['WiFi', 'Gym', 'Restaurant', 'Business Center'],
        standardPrice: 120,
        deluxePrice: 200,
        suitePrice: 350,
        standardRooms: { total: 50, available: 50 },
        deluxeRooms: { total: 30, available: 30 },
        suiteRooms: { total: 10, available: 10 },
        isRefundable: true,
        cancellationFee: 20,
        images: [],
        createdBy: agentUser._id,
        status: 'active'
      }
    ];

    // Generate rooms for each hotel
    for (const hotelData of hotels) {
      const rooms = [];
      
      // Standard rooms
      for (let i = 1; i <= hotelData.standardRooms.total; i++) {
        rooms.push({ roomNumber: `S${i}`, roomType: 'standard', isBooked: false });
      }
      
      // Deluxe rooms
      for (let i = 1; i <= hotelData.deluxeRooms.total; i++) {
        rooms.push({ roomNumber: `D${i}`, roomType: 'deluxe', isBooked: false });
      }
      
      // Suite rooms
      for (let i = 1; i <= hotelData.suiteRooms.total; i++) {
        rooms.push({ roomNumber: `SU${i}`, roomType: 'suite', isBooked: false });
      }
      
      hotelData.rooms = rooms;
    }

    const createdHotels = await Hotel.insertMany(hotels);
    console.log(`✅ Created ${createdHotels.length} hotels`);

    console.log('\n📊 Seed Data Summary:');
    console.log(`- Admin: admin@travel.com / admin123`);
    console.log(`- User 1: john@example.com / password123`);
    console.log(`- User 2: jane@example.com / password123`);
    console.log(`- Agent: agent@travel.com / agent123`);
    console.log(`- Flights: ${createdFlights.length}`);
    console.log(`- Hotels: ${createdHotels.length}`);

    console.log('\n✅ Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();


