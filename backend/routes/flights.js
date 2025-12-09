import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Flight from '../models/Flight.js';
import { protect, authorize, checkAgent } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/flights/search
// @desc    Search flights
// @access  Public
router.get('/search', [
  query('source').optional().trim(),
  query('destination').optional().trim(),
  query('date').optional(),
  query('passengers').optional().isInt({ min: 1 }),
  query('class').optional().isIn(['economy', 'business', 'first']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('airline').optional().trim(),
  query('refundable').optional().isBoolean()
], async (req, res, next) => {
  try {
    const {
      source,
      destination,
      date,
      passengers = 1,
      class: flightClass,
      minPrice,
      maxPrice,
      airline,
      refundable
    } = req.query;

    let query = { status: 'active' };

    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');
    if (airline) query.airline = new RegExp(airline, 'i');
    if (refundable !== undefined) query.isRefundable = refundable === 'true';

    if (date) {
      const searchDate = new Date(date);
      const startDate = new Date(searchDate.setHours(0, 0, 0, 0));
      const endDate = new Date(searchDate.setHours(23, 59, 59, 999));
      query.departureTime = { $gte: startDate, $lte: endDate };
    }

    let flights = await Flight.find(query)
      .populate('createdBy', 'name email')
      .sort({ departureTime: 1 });

    // Filter by price range and class
    if (minPrice || maxPrice || flightClass) {
      flights = flights.filter(flight => {
        let price;
        if (flightClass === 'economy') price = flight.economyPrice;
        else if (flightClass === 'business') price = flight.businessPrice;
        else if (flightClass === 'first') price = flight.firstClassPrice;
        else price = Math.min(flight.economyPrice, flight.businessPrice, flight.firstClassPrice);

        const priceMatch = (!minPrice || price >= parseFloat(minPrice)) &&
                          (!maxPrice || price <= parseFloat(maxPrice));

        return priceMatch;
      });
    }

    // Check availability
    flights = flights.map(flight => {
      const flightObj = flight.toObject();
      
      if (flightClass) {
        const seatType = `${flightClass}Seats`;
        flightObj.available = flight[seatType].available >= parseInt(passengers);
        flightObj.price = flight[`${flightClass}Price`];
      } else {
        flightObj.available = true;
        flightObj.price = flight.economyPrice;
      }

      return flightObj;
    });

    res.json({
      success: true,
      count: flights.length,
      flights
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/flights
// @desc    Get all flights (with filters for agents/admins)
// @access  Private (Agent/Admin)
router.get('/', protect, authorize('agent', 'admin'), async (req, res, next) => {
  try {
    let query = {};
    
    // Agents only see their own flights
    if (req.user.role === 'agent') {
      query.createdBy = req.user._id;
    }

    const flights = await Flight.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: flights.length,
      flights
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/flights/:id
// @desc    Get single flight
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      flight
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/flights
// @desc    Create flight (Agent only)
// @access  Private (Agent)
router.post('/', [
  protect,
  checkAgent,
  body('flightNumber').trim().notEmpty(),
  body('airline').trim().notEmpty(),
  body('source').trim().notEmpty(),
  body('destination').trim().notEmpty(),
  body('departureTime').isISO8601(),
  body('arrivalTime').isISO8601(),
  body('economyPrice').isFloat({ min: 0 }),
  body('businessPrice').isFloat({ min: 0 }),
  body('firstClassPrice').isFloat({ min: 0 }),
  body('economySeats.total').isInt({ min: 0 }),
  body('businessSeats.total').isInt({ min: 0 }),
  body('firstClassSeats.total').isInt({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      flightNumber,
      airline,
      source,
      destination,
      departureTime,
      arrivalTime,
      economyPrice,
      businessPrice,
      firstClassPrice,
      economySeats,
      businessSeats,
      firstClassSeats,
      isRefundable,
      cancellationFee
    } = req.body;

    // Calculate duration
    const duration = Math.round((new Date(arrivalTime) - new Date(departureTime)) / 60000);

    // Generate seats
    const seats = [];
    const seatTypes = [
      { type: 'economy', count: economySeats.total, price: economyPrice },
      { type: 'business', count: businessSeats.total, price: businessPrice },
      { type: 'first', count: firstClassSeats.total, price: firstClassPrice }
    ];

    seatTypes.forEach(({ type, count }) => {
      for (let i = 1; i <= count; i++) {
        seats.push({
          seatNumber: `${type[0].toUpperCase()}${i}`,
          class: type,
          isBooked: false
        });
      }
    });

    const flight = await Flight.create({
      flightNumber,
      airline,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      economyPrice,
      businessPrice,
      firstClassPrice,
      economySeats: {
        total: economySeats.total,
        available: economySeats.total
      },
      businessSeats: {
        total: businessSeats.total,
        available: businessSeats.total
      },
      firstClassSeats: {
        total: firstClassSeats.total,
        available: firstClassSeats.total
      },
      seats,
      isRefundable: isRefundable !== undefined ? isRefundable : true,
      cancellationFee: cancellationFee || 0,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      flight
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Flight number already exists'
      });
    }
    next(error);
  }
});

// @route   PUT /api/flights/:id
// @desc    Update flight
// @access  Private (Agent/Admin)
router.put('/:id', protect, checkAgent, async (req, res, next) => {
  try {
    let flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    // Check ownership (agents can only edit their own flights)
    if (req.user.role === 'agent' && flight.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this flight'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'createdBy' && key !== 'createdAt') {
        flight[key] = req.body[key];
      }
    });

    // Recalculate duration if times changed
    if (req.body.departureTime || req.body.arrivalTime) {
      const depTime = req.body.departureTime || flight.departureTime;
      const arrTime = req.body.arrivalTime || flight.arrivalTime;
      flight.duration = Math.round((new Date(arrTime) - new Date(depTime)) / 60000);
    }

    await flight.save();

    res.json({
      success: true,
      flight
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/flights/:id
// @desc    Delete flight
// @access  Private (Agent/Admin)
router.delete('/:id', protect, checkAgent, async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    // Check ownership
    if (req.user.role === 'agent' && flight.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this flight'
      });
    }

    // Don't delete, just mark as inactive
    flight.status = 'inactive';
    await flight.save();

    res.json({
      success: true,
      message: 'Flight deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;


