const mongoose = require('mongoose');
const { Booking } = require('../models/Booking'); // Fixed import to use named export
const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const Invoice = require('../models/Invoice');

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
    const endDate = new Date(yearNum, monthNum, 1); // Last day of month
    // Get all room types
    const roomTypes = await RoomType.find();
    
    // Find all invoices in the specified month
    const invoices = await Invoice.find({
      issueDate: {
        $gte: startDate,
        $lte: endDate
      },
      status: 'paid' // Only use paid since invoice can be deleted
    });
    
    // Get all rooms for type lookup
    const rooms = await Room.find();
    
    // Create a mapping of room numbers to room types
    const roomTypeMap = {};
    rooms.forEach(room => {
      roomTypeMap[room.roomNumber] = room.type;
    });
    
    // Calculate revenue by room type
    const revenueByType = {};
    let totalRevenue = 0;
    
    // Initialize revenue for each room type
    roomTypes.forEach(type => {
      revenueByType[type.type] = {
        roomType: type.type,
        revenue: 0,
        percentage: 0
      };
    });
    
    // Calculate revenue from invoices
    invoices.forEach(invoice => {
      invoice.rentals.forEach(rental => {
        const roomNumber = rental.roomNumber;
        const roomType = roomTypeMap[roomNumber];
        
        if (roomType && revenueByType[roomType]) {
          revenueByType[roomType].revenue += rental.total;
          totalRevenue += rental.total;
        }
      });
    });
    
    // Calculate percentages
    if (totalRevenue > 0) {
      Object.keys(revenueByType).forEach(type => {
        revenueByType[type].percentage = Math.round((revenueByType[type].revenue / totalRevenue) * 100 * 10) / 10;
      });
    }
    
    // Format report for response
    const reportData = Object.values(revenueByType).map(item => ({
      roomType: item.roomType,
      revenue: item.revenue,
      percentage: item.percentage
    }));
    
    // Return a formatted report matching the BM5.1 template
    const formattedReport = {
      reportCode: 'BM5.1',
      title: 'Báo Cáo Doanh Thu Theo Loại Phòng',
      month: monthNum,
      year: yearNum,
      data: reportData,
      totalRevenue: totalRevenue
    };
    
    res.status(200).json(formattedReport);
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get occupancy report by room for a specific month
// @route   GET /api/reports/occupancy?year=YYYY&month=MM
// @access  Private/Admin
exports.getOccupancyReportByRoom = async (req, res) => {
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
    const endDate = new Date(yearNum, monthNum, 1); // Last day of the month
    
    // Get all rooms
    const rooms = await Room.find().sort({ roomNumber: 1 });
    
    // Get all invoices for the month
    const invoices = await Invoice.find({
      issueDate: {
        $gte: startDate,
        $lt: endDate
      },
      status: 'paid'
    });
    
    // Create occupancy data by room and track total days rented
    const occupancyData = [];
    let totalDaysRented = 0;
    
    // First pass: calculate days rented for each room and total
    for (const room of rooms) {
      // Count the number of days this room was rented in the invoices
      let daysRented = 0;
      
      invoices.forEach(invoice => {
        const roomRental = invoice.rentals.find(rental => 
          rental.roomNumber === room.roomNumber
        );
        
        if (roomRental) {
          daysRented += roomRental.numberOfDays;
        }
      });
      
      totalDaysRented += daysRented;
      
      occupancyData.push({
        roomNumber: room.roomNumber,
        daysRented: daysRented,
        occupancyRate: 0 // Will calculate in second pass
      });
    }
    
    // Second pass: calculate occupancy rates based on total days rented
    if (totalDaysRented > 0) {
      occupancyData.forEach(item => {
        item.occupancyRate = Math.round((item.daysRented / totalDaysRented) * 100 * 10) / 10;
      });
    }
    
    // Return a formatted report matching the BM5.2 template
    const formattedReport = {
      reportCode: 'BM5.2',
      title: 'Báo Cáo Mật Độ Sử Dụng Phòng',
      month: monthNum,
      year: yearNum,
      data: occupancyData
    };
    
    res.status(200).json(formattedReport);
  } catch (error) {
    console.error('Error generating occupancy report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
