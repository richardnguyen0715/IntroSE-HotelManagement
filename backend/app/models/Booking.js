const mongoose = require('mongoose');
const User = require('./User');
const Room = require('./Room');

const bookingSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;