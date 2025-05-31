const RoomType = require('../models/RoomType');
const Room = require('../models/Room');

// Get all room types
exports.getAllRoomTypes = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    let query = {};
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const roomTypes = await RoomType.find(query);
    res.status(200).json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new room type
exports.createRoomType = async (req, res) => {
  try {
    // Check if room type already exists
    const existingType = await RoomType.findOne({ type: req.body.type });
    if (existingType) {
      return res.status(400).json({ message: 'Room type already exists' });
    }
    
    const newRoomType = new RoomType(req.body);
    const savedRoomType = await newRoomType.save();
    res.status(201).json(savedRoomType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a room type
exports.updateRoomType = async (req, res) => {
  try {
    // Check if any rooms with this type are occupied
    const occupiedRooms = await Room.find({ type: req.params.id, status: 'occupied' }).countDocuments();
    
    if (occupiedRooms !== 0) {
      return res.status(400).json({ 
        message: 'Cannot update room type since there are rooms of this type that are currently occupied' 
      });
    }
    
    // Find the room type by type and update the price
    const updatedRoomType = await RoomType.findOneAndUpdate(
      { type: req.params.id },
      { price: req.body.price },
      { new: true, runValidators: true }
    );
    
    if (!updatedRoomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    res.status(200).json(updatedRoomType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a room type
exports.deleteRoomType = async (req, res) => {
  try {
    // Check if any rooms are using this room type, no need to see if it's occupied or not
    const roomsUsingType = await Room.find({ type: req.params.id}).countDocuments();
    if (roomsUsingType > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete room type because it is being used by existing rooms' 
      });
    }
    
    const deletedRoomType = await RoomType.findOneAndDelete({ type: req.params.id });
    
    if (!deletedRoomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};