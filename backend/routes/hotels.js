import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Hotel from '../models/Hotel.js';
import { protect, authorize, checkAgent } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/hotels/search
// @desc    Search hotels
// @access  Public
router.get('/search', [
  query('city').optional().trim(),
  query('checkIn').optional(),
  query('checkOut').optional(),
  query('rooms').optional().isInt({ min: 1 }),
  query('guests').optional().isInt({ min: 1 }),
  query('roomType').optional().isIn(['standard', 'deluxe', 'suite']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('refundable').optional().isBoolean()
], async (req, res, next) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      rooms = 1,
      guests = 1,
      roomType,
      minPrice,
      maxPrice,
      minRating,
      refundable
    } = req.query;

    let query = { status: 'active' };

    if (city) query.city = new RegExp(city, 'i');
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (refundable !== undefined) query.isRefundable = refundable === 'true';

    let hotels = await Hotel.find(query)
      .populate('createdBy', 'name email')
      .sort({ rating: -1 });

    // Filter by price range and availability
    hotels = hotels.map(hotel => {
      const hotelObj = hotel.toObject();
      
      let price;
      let availableRooms = 0;
      
      if (roomType === 'standard') {
        price = hotel.standardPrice;
        availableRooms = hotel.standardRooms.available;
      } else if (roomType === 'deluxe') {
        price = hotel.deluxePrice;
        availableRooms = hotel.deluxeRooms.available;
      } else if (roomType === 'suite') {
        price = hotel.suitePrice;
        availableRooms = hotel.suiteRooms.available;
      } else {
        price = Math.min(hotel.standardPrice, hotel.deluxePrice, hotel.suitePrice);
        availableRooms = Math.max(
          hotel.standardRooms.available,
          hotel.deluxeRooms.available,
          hotel.suiteRooms.available
        );
      }

      // Check date availability if dates provided
      if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        // Simple availability check (in production, check actual room bookings)
        const conflictingBookings = hotel.rooms.filter(room => {
          if (!room.isBooked) return false;
          return (room.bookedFrom <= checkOutDate && room.bookedTo >= checkInDate);
        });

        availableRooms = availableRooms - conflictingBookings.length;
      }

      hotelObj.price = price;
      hotelObj.available = availableRooms >= parseInt(rooms);

      return hotelObj;
    }).filter(hotel => {
      const priceMatch = (!minPrice || hotel.price >= parseFloat(minPrice)) &&
                        (!maxPrice || hotel.price <= parseFloat(maxPrice));
      return priceMatch && hotel.available;
    });

    res.json({
      success: true,
      count: hotels.length,
      hotels
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/hotels
// @desc    Get all hotels (with filters for agents/admins)
// @access  Private (Agent/Admin)
router.get('/', protect, authorize('agent', 'admin'), async (req, res, next) => {
  try {
    let query = {};
    
    // Agents only see their own hotels
    if (req.user.role === 'agent') {
      query.createdBy = req.user._id;
    }

    const hotels = await Hotel.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: hotels.length,
      hotels
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/hotels/:id
// @desc    Get single hotel
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      hotel
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/hotels
// @desc    Create hotel (Agent only)
// @access  Private (Agent)
router.post('/', [
  protect,
  checkAgent,
  body('name').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('standardPrice').isFloat({ min: 0 }),
  body('deluxePrice').isFloat({ min: 0 }),
  body('suitePrice').isFloat({ min: 0 }),
  body('standardRooms.total').isInt({ min: 0 }),
  body('deluxeRooms.total').isInt({ min: 0 }),
  body('suiteRooms.total').isInt({ min: 0 })
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
      name,
      city,
      address,
      description,
      rating,
      amenities,
      standardPrice,
      deluxePrice,
      suitePrice,
      standardRooms,
      deluxeRooms,
      suiteRooms,
      isRefundable,
      cancellationFee,
      images
    } = req.body;

    // Generate rooms
    const rooms = [];
    const roomTypes = [
      { type: 'standard', count: standardRooms.total, price: standardPrice },
      { type: 'deluxe', count: deluxeRooms.total, price: deluxePrice },
      { type: 'suite', count: suiteRooms.total, price: suitePrice }
    ];

    roomTypes.forEach(({ type, count }) => {
      for (let i = 1; i <= count; i++) {
        rooms.push({
          roomNumber: `${type[0].toUpperCase()}${i}`,
          roomType: type,
          isBooked: false
        });
      }
    });

    const hotel = await Hotel.create({
      name,
      city,
      address,
      description,
      rating: rating || 0,
      amenities: amenities || [],
      standardPrice,
      deluxePrice,
      suitePrice,
      standardRooms: {
        total: standardRooms.total,
        available: standardRooms.total
      },
      deluxeRooms: {
        total: deluxeRooms.total,
        available: deluxeRooms.total
      },
      suiteRooms: {
        total: suiteRooms.total,
        available: suiteRooms.total
      },
      rooms,
      isRefundable: isRefundable !== undefined ? isRefundable : true,
      cancellationFee: cancellationFee || 0,
      images: images || [],
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      hotel
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/hotels/:id
// @desc    Update hotel
// @access  Private (Agent/Admin)
router.put('/:id', protect, checkAgent, async (req, res, next) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership
    if (req.user.role === 'agent' && hotel.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hotel'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'createdBy' && key !== 'createdAt') {
        hotel[key] = req.body[key];
      }
    });

    await hotel.save();

    res.json({
      success: true,
      hotel
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel
// @access  Private (Agent/Admin)
router.delete('/:id', protect, checkAgent, async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership
    if (req.user.role === 'agent' && hotel.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hotel'
      });
    }

    // Don't delete, just mark as inactive
    hotel.status = 'inactive';
    await hotel.save();

    res.json({
      success: true,
      message: 'Hotel deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

