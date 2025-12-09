import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    enum: ['standard', 'deluxe', 'suite'],
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedFrom: Date,
  bookedTo: Date,
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  amenities: [{
    type: String
  }],
  standardPrice: {
    type: Number,
    required: true,
    min: 0
  },
  deluxePrice: {
    type: Number,
    required: true,
    min: 0
  },
  suitePrice: {
    type: Number,
    required: true,
    min: 0
  },
  standardRooms: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  deluxeRooms: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  suiteRooms: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  rooms: [roomSchema],
  isRefundable: {
    type: Boolean,
    default: true
  },
  cancellationFee: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for search queries
hotelSchema.index({ city: 1, status: 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ name: 'text', city: 'text', description: 'text' });

export default mongoose.model('Hotel', hotelSchema);


