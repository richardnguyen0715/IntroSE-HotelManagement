const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { Room, RoomType } = require('../models/Room');

// @desc    Get revenue report by room type for a specific month
// @route   GET /api/reports/revenue?year=YYYY&month=MM
// @access  Private/Admin
exports.getRevenueReportByRoomType = async (req, res) => {
  try {
    const { year, month } = req.query;

    // Validate input
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month parameters are required' });
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: 'Invalid year or month format' });
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0); // Last day of the month
    const daysInMonth = endDate.getDate();

    // Find all bookings that overlap with the specified month
    const bookings = await Booking.find({
      $and: [
        { checkInDate: { $lte: endDate } },
        { checkOutDate: { $gte: startDate } }
      ],
      status: { $ne: 'cancelled' } // Exclude cancelled bookings
    });

    const rooms = await Room.find();

    // Group rooms by type
    const roomsByType = {};
    rooms.forEach(room => {
      if (!roomsByType[room.type]) {
        roomsByType[room.type] = [];
      }
      roomsByType[room.type].push(room.roomNumber);
    });

    // Initialize report
    const report = {};
    Object.keys(RoomType).forEach(type => {
      report[type] = {
        roomType: type,
        basePrice: RoomType[type],
        roomCount: roomsByType[type] ? roomsByType[type].length : 0,
        revenue: 0,
        occupiedDays: 0,
        totalAvailableDays: roomsByType[type] ? roomsByType[type].length * daysInMonth : 0,
        occupancyRate: 0
      };
    });

    // Track occupied room-days to avoid counting duplicates
    const occupiedSet = new Set();

    bookings.forEach(booking => {
      const room = rooms.find(r => r.roomNumber === booking.room);
      if (!room) return;

      const roomType = room.type;
      if (!report[roomType]) return;

      const checkIn = new Date(Math.max(new Date(booking.checkInDate), startDate));
      const checkOut = new Date(Math.min(new Date(booking.checkOutDate), endDate));

      const totalBookingDays = Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)) + 1;
      const revenuePerDay = booking.totalPrice / totalBookingDays;

      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const key = `${room.roomNumber}-${dateStr}`;

        // Đếm revenue mỗi ngày (cộng hết)
        report[roomType].revenue += revenuePerDay;

        // occupiedDays: chỉ đếm nếu chưa có key
        if (!occupiedSet.has(key)) {
          occupiedSet.add(key);
          report[roomType].occupiedDays += 1;
        }
      }
    });

    // Format output
    Object.keys(report).forEach(type => {
      const data = report[type];
      if (data.totalAvailableDays > 0) {
        data.occupancyRate = Math.round((data.occupiedDays / data.totalAvailableDays) * 1000) / 10; // round to 1 decimal
      }
      data.revenue = Math.round(data.revenue); // round to nearest VND
    });

    res.status(200).json({
      year: yearNum,
      month: monthNum,
      monthName: new Date(yearNum, monthNum - 1, 1).toLocaleString('en-US', { month: 'long' }),
      roomTypes: Object.values(report)
    });
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get occupancy report by room type for a specific month
// @route   GET /api/reports/occupancy?year=YYYY&month=MM
// @access  Private/Admin
exports.getOccupancyReportByRoomType = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    // Validate input
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month parameters are required' });
    }
    
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: 'Invalid year or month format' });
    }
    
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0); // Last day of month
    const daysInMonth = endDate.getDate();
    
    const bookings = await Booking.find({
      $and: [
        { checkInDate: { $lte: endDate } },
        { checkOutDate: { $gte: startDate } }
      ],
      status: { $ne: 'cancelled' } // exclude cancelled bookings
    });
    
    const rooms = await Room.find();
    
    const roomsByType = {};
    rooms.forEach(room => {
      if (!roomsByType[room.type]) {
        roomsByType[room.type] = [];
      }
      roomsByType[room.type].push(room.roomNumber);
    });
    
    const report = {};
    Object.keys(RoomType).forEach(type => {
      report[type] = {
        roomType: type,
        roomCount: roomsByType[type] ? roomsByType[type].length : 0,
        totalAvailableDays: roomsByType[type] ? roomsByType[type].length * daysInMonth : 0,
        occupiedDays: 0,
        occupancyRate: 0
      };
    });

    // ✅ Duy nhất: không đếm trùng phòng/ngày
    const occupiedSet = new Set();

    bookings.forEach(booking => {
      const room = rooms.find(r => r.roomNumber === booking.room);
      if (!room) return;

      const roomType = room.type;
      if (!report[roomType]) return;

      const checkIn = new Date(Math.max(new Date(booking.checkInDate), startDate));
      const checkOut = new Date(Math.min(new Date(booking.checkOutDate), endDate));

      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const key = `${room.roomNumber}-${dateStr}`;

        if (!occupiedSet.has(key)) {
          occupiedSet.add(key);
          report[roomType].occupiedDays += 1;
        }
      }
    });

    // Tính occupancy rate
    Object.keys(report).forEach(type => {
      if (report[type].totalAvailableDays > 0) {
        report[type].occupancyRate = (report[type].occupiedDays / report[type].totalAvailableDays) * 100;
        report[type].occupancyRate = Math.round(report[type].occupancyRate * 10) / 10;
      }
    });

    // Trả kết quả
    const response = {
      year: yearNum,
      month: monthNum,
      monthName: new Date(yearNum, monthNum - 1, 1).toLocaleString('en-US', { month: 'long' }),
      daysInMonth: daysInMonth,
      roomTypes: Object.values(report)
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating occupancy report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
