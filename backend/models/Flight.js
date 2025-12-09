import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first'],
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
}, { _id: false });

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    unique: true,
    trim: true
  },
  airline: {
    type: String,
    required: [true, 'Airline is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  economyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  businessPrice: {
    type: Number,
    required: true,
    min: 0
  },
  firstClassPrice: {
    type: Number,
    required: true,
    min: 0
  },
  economySeats: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  businessSeats: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  firstClassSeats: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  seats: [seatSchema],
  isRefundable: {
    type: Boolean,
    default: true
  },
  cancellationFee: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for search queries
flightSchema.index({ source: 1, destination: 1, departureTime: 1 });
flightSchema.index({ airline: 1 });
flightSchema.index({ status: 1 });

export default mongoose.model('Flight', flightSchema);


