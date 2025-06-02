const express = require("express");
const router = express.Router();
const { getRevenueReportByRoomType, getOccupancyReportByRoom } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
// router.use(protect);

// Revenue report route - restricted to admin and staff
// router.get('/revenue', authorize(['admin', 'staff']), getRevenueReportByRoomType);
router.get('/revenue', getRevenueReportByRoomType);

// Occupancy report route - restricted to admin and staff
// router.get('/occupancy', authorize(['admin', 'staff']), getOccupancyReportByRoomType);
router.get('/occupancy', getOccupancyReportByRoom);

module.exports = router;
