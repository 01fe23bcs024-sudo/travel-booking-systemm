import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Agent from '../models/Agent.js';
import { protect, authorize } from '../middleware/auth.js';
import { processPayment, processRefund } from '../utils/paymentGateway.js';
import { sendBookingConfirmation } from '../utils/emailService.js';
import { generateBookingInvoice } from '../utils/pdfGenerator.js';

const router = express.Router();

// @route   POST /api/bookings/flight
// @desc    Book a flight
// @access  Private
router.post('/flight', [
  protect,
  body('flightId').notEmpty().withMessage('Flight ID is required'),
  body('flightClass').isIn(['economy', 'business', 'first']).withMessage('Invalid flight class'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('seatNumbers').isArray({ min: 1 }).withMessage('At least one seat is required'),
  body('paymentMethod').isIn(['card', 'upi', 'netbanking']).withMessage('Invalid payment method')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { flightId, flightClass, passengers, seatNumbers, paymentMethod, agentId } = req.body;

    // Get flight
    const flight = await Flight.findById(flightId);
    if (!flight || flight.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Flight not found or not available'
      });
    }

    // Check seat availability
    const seatType = `${flightClass}Seats`;
    if (flight[seatType].available < seatNumbers.length) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Verify seats exist and are not booked
    for (const seatNum of seatNumbers) {
      const seat = flight.seats.find(s => s.seatNumber === seatNum && s.class === flightClass);
      if (!seat) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} not found in ${flightClass} class`
        });
      }
      if (seat.isBooked) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} is already booked`
        });
      }
    }

    // Calculate price
    const pricePerSeat = flight[`${flightClass}Price`];
    const totalAmount = pricePerSeat * seatNumbers.length;

    // Process payment
    const paymentResult = await processPayment(totalAmount, paymentMethod);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error || 'Payment failed'
      });
    }

    // Calculate commission if agent
    let commission = 0;
    let agentUserId = null;
    if (agentId) {
      const agent = await Agent.findById(agentId);
      if (agent && agent.isVerified) {
        agentUserId = agent.userId;
        commission = (totalAmount * agent.commissionRate) / 100;
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      agent: agentUserId,
      bookingType: 'flight',
      flight: flightId,
      seatNumbers,
      flightClass,
      passengers,
      totalAmount,
      commission,
      paymentStatus: 'completed',
      paymentMethod,
      paymentId: paymentResult.paymentId,
      bookingStatus: 'confirmed'
    });

    // Update flight seats
    seatNumbers.forEach(seatNum => {
      const seat = flight.seats.find(s => s.seatNumber === seatNum);
      if (seat) {
        seat.isBooked = true;
        seat.bookedBy = booking._id;
      }
    });

    flight[seatType].available -= seatNumbers.length;
    await flight.save();

    // Update agent earnings if applicable
    if (agentUserId) {
      const agent = await Agent.findOne({ userId: agentUserId });
      if (agent) {
        agent.totalEarnings += commission;
        await agent.save();
      }
    }

    // Send confirmation email
    await sendBookingConfirmation(booking, req.user, flight);

    // Populate booking details
    await booking.populate('flight');
    await booking.populate('user', 'name email');

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/bookings/hotel
// @desc    Book a hotel
// @access  Private
router.post('/hotel', [
  protect,
  body('hotelId').notEmpty().withMessage('Hotel ID is required'),
  body('roomType').isIn(['standard', 'deluxe', 'suite']).withMessage('Invalid room type'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('roomNumbers').isArray({ min: 1 }).withMessage('At least one room is required'),
  body('guests').isObject().withMessage('Guests information is required'),
  body('paymentMethod').isIn(['card', 'upi', 'netbanking']).withMessage('Invalid payment method')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { hotelId, roomType, checkIn, checkOut, roomNumbers, guests, paymentMethod, agentId } = req.body;

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Get hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || hotel.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found or not available'
      });
    }

    // Check room availability
    const roomTypeKey = `${roomType}Rooms`;
    if (hotel[roomTypeKey].available < roomNumbers.length) {
      return res.status(400).json({
        success: false,
        message: 'Not enough rooms available'
      });
    }

    // Verify rooms exist and are available for dates
    for (const roomNum of roomNumbers) {
      const room = hotel.rooms.find(r => r.roomNumber === roomNum && r.roomType === roomType);
      if (!room) {
        return res.status(400).json({
          success: false,
          message: `Room ${roomNum} not found in ${roomType} type`
        });
      }
      if (room.isBooked) {
        // Check if dates conflict
        if (room.bookedFrom <= checkOutDate && room.bookedTo >= checkInDate) {
          return res.status(400).json({
            success: false,
            message: `Room ${roomNum} is booked for the selected dates`
          });
        }
      }
    }

    // Calculate price (per night)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = hotel[`${roomType}Price`];
    const totalAmount = pricePerNight * nights * roomNumbers.length;

    // Process payment
    const paymentResult = await processPayment(totalAmount, paymentMethod);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error || 'Payment failed'
      });
    }

    // Calculate commission if agent
    let commission = 0;
    let agentUserId = null;
    if (agentId) {
      const agent = await Agent.findById(agentId);
      if (agent && agent.isVerified) {
        agentUserId = agent.userId;
        commission = (totalAmount * agent.commissionRate) / 100;
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      agent: agentUserId,
      bookingType: 'hotel',
      hotel: hotelId,
      roomNumbers,
      roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalAmount,
      commission,
      paymentStatus: 'completed',
      paymentMethod,
      paymentId: paymentResult.paymentId,
      bookingStatus: 'confirmed'
    });

    // Update hotel rooms
    roomNumbers.forEach(roomNum => {
      const room = hotel.rooms.find(r => r.roomNumber === roomNum);
      if (room) {
        room.isBooked = true;
        room.bookedFrom = checkInDate;
        room.bookedTo = checkOutDate;
        room.bookedBy = booking._id;
      }
    });

    hotel[roomTypeKey].available -= roomNumbers.length;
    await hotel.save();

    // Update agent earnings if applicable
    if (agentUserId) {
      const agent = await Agent.findOne({ userId: agentUserId });
      if (agent) {
        agent.totalEarnings += commission;
        await agent.save();
      }
    }

    // Send confirmation email
    await sendBookingConfirmation(booking, req.user, null, hotel);

    // Populate booking details
    await booking.populate('hotel');
    await booking.populate('user', 'name email');

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let query = { user: req.user._id };

    // Agents can see bookings made through them
    if (req.user.role === 'agent') {
      const Agent = (await import('../models/Agent.js')).default;
      const agent = await Agent.findOne({ userId: req.user._id });
      if (agent) {
        query = { agent: req.user._id };
      }
    }

    // Admins see all bookings
    if (req.user.role === 'admin') {
      query = {};
    }

    const { status, type } = req.query;
    if (status) query.bookingStatus = status;
    if (type) query.bookingType = type;

    const bookings = await Booking.find(query)
      .populate('flight', 'flightNumber airline source destination departureTime arrivalTime')
      .populate('hotel', 'name city address')
      .populate('user', 'name email')
      .populate('agent', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    // Users can only see their own bookings
    if (req.user.role === 'user') {
      query.user = req.user._id;
    }

    // Agents can see bookings made through them
    if (req.user.role === 'agent') {
      const Agent = (await import('../models/Agent.js')).default;
      const agent = await Agent.findOne({ userId: req.user._id });
      if (agent) {
        query = { _id: req.params.id, agent: req.user._id };
      }
    }

    const booking = await Booking.findOne(query)
      .populate('flight')
      .populate('hotel')
      .populate('user', 'name email phone')
      .populate('agent', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.post('/:id/cancel', [
  protect,
  body('reason').optional().trim()
], async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight')
      .populate('hotel');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role === 'user' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Calculate refund
    let refundAmount = 0;
    if (booking.bookingType === 'flight' && booking.flight) {
      const isRefundable = booking.flight.isRefundable;
      const cancellationFee = booking.flight.cancellationFee || 0;
      
      if (isRefundable) {
        refundAmount = Math.max(0, booking.totalAmount - cancellationFee);
      }
    } else if (booking.bookingType === 'hotel' && booking.hotel) {
      const isRefundable = booking.hotel.isRefundable;
      const cancellationFee = booking.hotel.cancellationFee || 0;
      
      if (isRefundable) {
        refundAmount = Math.max(0, booking.totalAmount - cancellationFee);
      }
    }

    // Process refund if applicable
    if (refundAmount > 0 && booking.paymentStatus === 'completed') {
      const refundResult = await processRefund(booking.paymentId, refundAmount);
      if (refundResult.success) {
        booking.refundAmount = refundAmount;
        booking.refundStatus = 'processed';
        booking.paymentStatus = 'refunded';
      }
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'User cancelled';

    // Free up seats/rooms
    if (booking.bookingType === 'flight' && booking.flight) {
      const flight = await Flight.findById(booking.flight._id);
      const seatType = `${booking.flightClass}Seats`;
      
      booking.seatNumbers.forEach(seatNum => {
        const seat = flight.seats.find(s => s.seatNumber === seatNum);
        if (seat) {
          seat.isBooked = false;
          seat.bookedBy = null;
        }
      });

      flight[seatType].available += booking.seatNumbers.length;
      await flight.save();
    } else if (booking.bookingType === 'hotel' && booking.hotel) {
      const hotel = await Hotel.findById(booking.hotel._id);
      const roomTypeKey = `${booking.roomType}Rooms`;
      
      booking.roomNumbers.forEach(roomNum => {
        const room = hotel.rooms.find(r => r.roomNumber === roomNum);
        if (room) {
          room.isBooked = false;
          room.bookedFrom = null;
          room.bookedTo = null;
          room.bookedBy = null;
        }
      });

      hotel[roomTypeKey].available += booking.roomNumbers.length;
      await hotel.save();
    }

    // Deduct commission from agent if refunded
    if (refundAmount > 0 && booking.agent) {
      const agent = await Agent.findOne({ userId: booking.agent });
      if (agent) {
        agent.totalEarnings = Math.max(0, agent.totalEarnings - booking.commission);
        await agent.save();
      }
    }

    await booking.save();

    res.json({
      success: true,
      booking,
      refundAmount
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/bookings/:id/invoice
// @desc    Download booking invoice PDF
// @access  Private
router.get('/:id/invoice', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight')
      .populate('hotel')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role === 'user' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this invoice'
      });
    }

    const pdfBuffer = await generateBookingInvoice(
      booking,
      booking.user,
      booking.flight,
      booking.hotel
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${booking.bookingNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

export default router;


