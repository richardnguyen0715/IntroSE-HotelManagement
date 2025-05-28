const mongoose = require('mongoose');

const RoomType = {
  A: 150000,
  B: 170000,
  C: 200000
};

// Sử dụng
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
    enum: Object.keys(RoomType)
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

// Add a virtual property to get the price based on room type
roomSchema.virtual('price').get(function() {
  return RoomType[this.type];
});


const Room = mongoose.model('Room', roomSchema);
module.exports = {Room, RoomType}; 