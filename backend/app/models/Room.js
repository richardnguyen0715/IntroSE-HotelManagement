const mongoose = require('mongoose');
const RoomType = require('./RoomType');

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
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 3
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  notes: {
    type: [String],
    default: []
  }
});

// Add a virtual property to get the price based on room type
// roomSchema.virtual('price').get(function() {
//   if (this.type && typeof this.type === 'object' && this.type.price) {
//     return this.type.price;
//   }
//   return 0; // Default value if type is not populated
// });

// Always populate the type field when fetching rooms
// roomSchema.pre(/^find/, function(next) {
//   this.populate('type');
//   next();
// });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room; 