const Booking = require('../models/Booking');
const {Room} = require('../models/Room');
const User = require('../models/User');

// Get all bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    let query = Booking.find().populate('email').populate('room');
    
    // Filter by status
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }
    
    // Filter by email
    if (req.query.email) {
      query = query.find({ email: req.query.email });
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query = query.find({
        $or: [
          { checkInDate: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } },
          { checkOutDate: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } }
        ]
      });
    }
    
    const bookings = await query;
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// Get single booking
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('email')
      .populate('room');
    
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Create new booking
exports.createBooking = async (req, res, next) => {
  try {
    const { email, room, checkInDate, checkOutDate } = req.body;
    // const query = Booking.findById(req.params.id)
    // .populate('email')
    // .populate('room');
    // Check if email exists
    const emailData = await User.findOne({ email: email });
    if (!emailData) {
      const error = new Error('Email not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if room exists
    const roomData = await Room.findOne({ roomNumber: room });
    if (!roomData) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }
    // Check if room is available
    if (roomData.status !== 'available') {
      const error = new Error('Room is not available');
      error.statusCode = 400;
      throw error;
    }
    
    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      room,
      status: { $nin: ['checked-out', 'cancelled'] },
      $or: [
        { checkInDate: { $lte: new Date(checkOutDate), $gte: new Date(checkInDate) } },
        { checkOutDate: { $gte: new Date(checkInDate), $lte: new Date(checkOutDate) } },
        { 
          checkInDate: { $lte: new Date(checkInDate) },
          checkOutDate: { $gte: new Date(checkOutDate) }
        }
      ]
    });
    
    if (overlappingBookings.length > 0) {
      const error = new Error('Room is already booked for the selected dates');
      error.statusCode = 400;
      throw error;
    }
    
    // Create booking
    const booking = await Booking.create(req.body);
    
    // Update room status to occupied
    await Room.findByIdAndUpdate(roomData._id, { status: 'occupied' });
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      error.statusCode = 400;
      error.message = messages;
    }
    next(error);
  }
};

// Update booking
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }
    
    // If status is being updated to checked-out, update room status
    if (req.body.status === 'checked-out' && booking.status !== 'checked-out') {
      await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    }
    
    // If status is being updated to cancelled, update room status
    if (req.body.status === 'cancelled' && booking.status !== 'cancelled') {
      await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('email').populate('room');
    
    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      error.statusCode = 400;
      error.message = messages;
    }
    next(error);
  }
};

// // Delete booking
// exports.deleteBooking = async (req, res, next) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
    
//     if (!booking) {
//       const error = new Error('Booking not found');
//       error.statusCode = 404;
//       throw error;
//     }
    
//     // Update room status to available
//     await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    
//     await booking.remove();
    
//     res.status(200).json({
//       success: true,
//       data: {}
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Get bookings for a specific user
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ email: req.params.userId })
      .populate('room')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};
