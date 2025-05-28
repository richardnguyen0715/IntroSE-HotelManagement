const { Room, RoomType } = require('../models/Room');

// Get all rooms
exports.getAllRooms = async (req, res, next) => {
  try {
    let query = Room.find();
    // Filter by room type
    if (req.query.type) {
      query = query.find({ type: req.query.type });
    }
    
    // Filter by status
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }
    
    // Filter by capacity
    if (req.query.capacity) {
      query = query.find({ capacity: { $gte: req.query.capacity } });
    }
    
    const rooms = await query;
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// Get single room
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id); 
    if (!room) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Create new room
exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      error.statusCode = 400;
      error.message = messages;
    } else if (error.code === 11000) {
      error.statusCode = 400;
      error.message = 'Room number already exists';
    }
    next(error);
  }
};

// Update room
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!room) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Delete room
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get room types
exports.getRoomTypes = async (_, res, next) => {
  try {
    const roomTypes = Object.entries(RoomType).map(([type, price]) => ({
      type,
      price
    }));
    
    res.status(200).json({
      success: true,
      count: roomTypes.length,
      data: roomTypes
    });
  } catch (error) {
    next(error);
  }
}; 