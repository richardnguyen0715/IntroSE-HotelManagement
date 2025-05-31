const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  }
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);
module.exports = RoomType; 