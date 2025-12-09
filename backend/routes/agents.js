import express from 'express';
import { body, validationResult } from 'express-validator';
import Agent from '../models/Agent.js';
import Booking from '../models/Booking.js';
import { protect, authorize, checkAgent } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/agents/bookings
// @desc    Get all bookings for agent
// @access  Private (Agent)
router.get('/bookings', protect, checkAgent, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ agent: req.user._id })
      .populate('user', 'name email phone')
      .populate('flight', 'flightNumber airline source destination')
      .populate('hotel', 'name city')
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

// @route   PUT /api/agents/bookings/:id/confirm
// @desc    Confirm a booking (agent action)
// @access  Private (Agent)
router.put('/bookings/:id/confirm', protect, checkAgent, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      agent: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.bookingStatus = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/agents/stats
// @desc    Get agent statistics
// @access  Private (Agent)
router.get('/stats', protect, checkAgent, async (req, res, next) => {
  try {
    const agent = await Agent.findOne({ userId: req.user._id });

    const bookings = await Booking.find({ agent: req.user._id });
    
    const stats = {
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter(b => b.bookingStatus === 'confirmed').length,
      cancelledBookings: bookings.filter(b => b.bookingStatus === 'cancelled').length,
      totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
      totalCommission: bookings.reduce((sum, b) => sum + b.commission, 0),
      earnings: agent.totalEarnings || 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
});

export default router;


