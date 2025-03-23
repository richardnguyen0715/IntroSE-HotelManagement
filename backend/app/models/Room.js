const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['standard', 'deluxe', 'suite', 'presidential']
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 2
  },
  amenities: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  images: {
    type: [String],
    default: []
  }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;