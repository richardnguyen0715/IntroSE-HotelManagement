const { Room, RoomType } = require("../models/Room");
const HotelPolicy = require("../models/hotelPolicy");
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
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// Get single room
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ roomNumber: req.params.id });

    if (!room) {
      const error = new Error("Room not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: room,
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
      data: room,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      error.statusCode = 400;
      error.message = messages;
    } else if (error.code === 11000) {
      error.statusCode = 400;
      error.message = "Room number already exists";
    }
    next(error);
  }
};

// Update room
exports.updateRoomCapacity = async (req, res, next) => {
  try {
    const { roomNumber, capacity } = req.body;

    // Kiểm tra xem roomNumber và capacity có được cung cấp không
    if (!roomNumber || !capacity) {
      const error = new Error("Room number and capacity are required");
      error.statusCode = 400;
      return next(error);
    }

    // Tìm và cập nhật phòng dựa trên roomNumber
    const room = await Room.findOneAndUpdate(
      { roomNumber: roomNumber },
      { $set: { capacity: capacity } },
      {
        new: true, // Trả về tài liệu đã cập nhật
        runValidators: true, // Chạy các quy tắc xác thực của schema
      }
    );

    // Kiểm tra xem phòng có tồn tại không
    if (!room) {
      const error = new Error("Room not found");
      error.statusCode = 404;
      return next(error);
    }

    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      data: room,
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
      const error = new Error("Room not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {},
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
      price,
    }));

    res.status(200).json({
      success: true,
      count: roomTypes.length,
      data: roomTypes,
    });
  } catch (error) {
    next(error);
  }
};
// Update room price
exports.updateRoomPrice = async (req, res, next) => {
  try {
    const { type, price } = req.body;

    // Validate input
    if (!type || !price) {
      const error = new Error("Room type and price are required");
      error.statusCode = 400;
      return next(error);
    }

    // Validate if room type exists
    if (!Object.keys(RoomType).includes(type)) {
      const error = new Error("Invalid room type");
      error.statusCode = 400;
      return next(error);
    }

    // Validate price is a positive number
    if (price <= 0 || !Number.isInteger(price)) {
      const error = new Error("Price must be a positive integer");
      error.statusCode = 400;
      return next(error);
    }

    // Update the price in RoomType
    RoomType[type] = price;

    // Return the updated room types
    const roomTypes = Object.entries(RoomType).map(([type, price]) => ({
      type,
      price,
    }));

    res.status(200).json({
      success: true,
      message: `Price updated successfully for room type ${type}`,
      data: roomTypes,
    });
  } catch (error) {
    next(error);
  }
};
