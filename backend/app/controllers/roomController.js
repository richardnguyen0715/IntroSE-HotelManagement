const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const HotelPolicy = require('../models/hotelPolicy');

// Get all rooms with filtering options
exports.getAllRooms = async (req, res) => {
  try {
    let query = Room.find();
    
    // Filter by room type if provided
    if (req.query.type) {
      query = query.find({ type: req.query.type });
    }
    
    // Filter by status if provided
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }
    
    // Filter by capacity if provided
    if (req.query.capacity) {
      query = query.find({ capacity: req.query.capacity });
    }
    
    const rooms = await query;
    
    res.status(200).json({
      message: 'Rooms retrieved successfully',
      status: 'success',
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error in getAllRooms:', error);
    res.status(500).json({
      message: error.message || 'Internal server error',
      status: 'error'
    });
  }
};

// Get a single room by room number
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({roomNumber: req.params.id}); 
    
    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
        status: 'error'
      });
    }
    
    res.status(200).json({
      message: 'Room retrieved successfully',
      status: 'success',
      data: room
    });
  } catch (error) {
    console.error('Error in getRoom:', error);
    res.status(500).json({
      message: error.message || 'Internal server error',
      status: 'error'
    });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    // Check if room type exists and is valid
    const roomType = req.body.type;
    const capacity = req.body.capacity;
    
    if (!roomType) {
      return res.status(400).json({
        message: 'Room type is required',
        status: 'error'
      });
    }
    
    const roomTypeExists = await RoomType.findOne({type: roomType});
    if (!roomTypeExists) {
      return res.status(400).json({
        message: 'Room type does not exist',
        status: 'error'
      });
    }

    const hotelPolicy = await HotelPolicy.findOne();
    if (hotelPolicy && hotelPolicy.maxCapacity && capacity > hotelPolicy.maxCapacity) {
      return res.status(400).json({
        message: `Room capacity (${capacity}) exceeds hotel policy maximum (${hotelPolicy.maxCapacity})`,
        status: 'error'
      });
    }
    
    // Create room with the validated type
    const room = await Room.create({
      ...req.body,
      type: roomType
    });
    
    res.status(201).json({
      message: 'Room created successfully',
      status: 'success',
      data: room
    });
  } catch (error) {
    console.error('Error in createRoom:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: messages,
        status: 'error'
      });
    } 
    // Handle duplicate key errors (room number already exists)
    else if (error.code === 11000) {
      return res.status(400).json({
        message: 'Room number already exists',
        status: 'error'
      });
    } 
    // Handle other errors
    else {
      return res.status(500).json({
        message: error.message || 'Internal server error',
        status: 'error'
      });
    }
  }
};

// Delete a room if it's available
exports.deleteRoom = async (req, res) => {
  try {
    // First find the room to check its status
    const room = await Room.findOne({roomNumber: req.params.id});
    
    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
        status: 'error'
      });
    }
    
    // Only allow deletion of available rooms
    if (room.status !== 'available') {
      return res.status(400).json({
        message: 'Only available rooms can be deleted',
        status: 'error'
      });
    }
    
    // Delete the room if it's available
    await Room.findOneAndDelete({roomNumber: req.params.id});
    
    res.status(200).json({
      message: 'Room deleted successfully',
      status: 'success',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteRoom:', error);
    res.status(500).json({
      message: error.message || 'Internal server error',
      status: 'error'
    });
  }
};

// Update room status to maintenance
exports.updateRoomToMaintenance = async (req, res) => {
  try {
    // Find rooms with available status
    const room = await Room.findOne({
      roomNumber: req.params.id, 
      status: 'available'
    });
    
    if (!room) {
      return res.status(404).json({
        message: 'Available room not found',
        status: 'error'
      });
    }
    
    // Update the room status to maintenance
    const updatedRoom = await Room.findOneAndUpdate(
      { roomNumber: req.params.id },
      { status: 'maintenance' },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Room status updated to maintenance successfully',
      status: 'success',
      data: updatedRoom
    });
  } catch (error) {
    console.error('Error in updateRoomToMaintenance:', error);
    res.status(500).json({
      message: error.message || 'Internal server error',
      status: 'error'
    });
  }
};

