import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },
  // Flight booking details
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  seatNumbers: [{
    type: String
  }],
  flightClass: {
    type: String,
    enum: ['economy', 'business', 'first']
  },
  passengers: [{
    name: String,
    age: Number,
    passport: String
  }],
  // Hotel booking details
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  roomNumbers: [{
    type: String
  }],
  roomType: {
    type: String,
    enum: ['standard', 'deluxe', 'suite']
  },
  checkIn: Date,
  checkOut: Date,
  guests: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 }
  },
  // Common details
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking'],
    default: 'card'
  },
  paymentId: {
    type: String
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  cancelledAt: Date,
  cancellationReason: String,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Generate unique booking number
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const prefix = this.bookingType === 'flight' ? 'FL' : 'HT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingNumber = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ agent: 1 });
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });

export default mongoose.model('Booking', bookingSchema);


