const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['domestic', 'foreign'],
    required: true
  },
  identityCard: {
    type: String,
    required: true
  },
  address: {
    type: String
  }
});

const BookingSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  customerList: [CustomerSchema],
  status: {
    type: String,
    enum: ['active', 'inactive','inPayment'],
    default: 'active'
  }
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = { Booking };