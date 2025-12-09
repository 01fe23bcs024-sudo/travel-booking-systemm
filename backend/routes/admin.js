import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Agent from '../models/Agent.js';
import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const verifiedAgents = await Agent.countDocuments({ isVerified: true });
    const pendingAgents = await Agent.countDocuments({ isVerified: false });

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'cancelled' });

    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const flightBookings = await Booking.countDocuments({ bookingType: 'flight' });
    const hotelBookings = await Booking.countDocuments({ bookingType: 'hotel' });

    // Popular routes (flight)
    const popularRoutes = await Booking.aggregate([
      { $match: { bookingType: 'flight', bookingStatus: 'confirmed' } },
      { $lookup: { from: 'flights', localField: 'flight', foreignField: '_id', as: 'flightDetails' } },
      { $unwind: '$flightDetails' },
      {
        $group: {
          _id: {
            source: '$flightDetails.source',
            destination: '$flightDetails.destination'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Popular hotels
    const popularHotels = await Booking.aggregate([
      { $match: { bookingType: 'hotel', bookingStatus: 'confirmed' } },
      { $lookup: { from: 'hotels', localField: 'hotel', foreignField: '_id', as: 'hotelDetails' } },
      { $unwind: '$hotelDetails' },
      {
        $group: {
          _id: '$hotelDetails.name',
          city: { $first: '$hotelDetails.city' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          agents: totalAgents,
          verifiedAgents,
          pendingAgents
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          flights: flightBookings,
          hotels: hotelBookings
        },
        revenue: {
          total: totalRevenue[0]?.total || 0
        },
        popularRoutes,
        popularHotels
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/agents
// @desc    Get all agents
// @access  Private (Admin)
router.get('/agents', async (req, res, next) => {
  try {
    const agents = await Agent.find()
      .populate('userId', 'name email')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: agents.length,
      agents
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/agents/:id/verify
// @desc    Verify/Approve agent
// @access  Private (Admin)
router.put('/agents/:id/verify', async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    agent.isVerified = true;
    agent.verifiedAt = new Date();
    agent.verifiedBy = req.user._id;
    await agent.save();

    res.json({
      success: true,
      agent
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/agents/:id/unverify
// @desc    Unverify agent
// @access  Private (Admin)
router.put('/agents/:id/unverify', async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    agent.isVerified = false;
    agent.verifiedAt = null;
    agent.verifiedBy = null;
    await agent.save();

    res.json({
      success: true,
      agent
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;


