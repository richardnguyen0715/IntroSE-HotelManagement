const express = require('express');
const router = express.Router();
const { getRevenueReportByRoomType, getOccupancyReportByRoomType } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Revenue report route - restricted to admin and staff
router.get('/revenue', authorize(['admin', 'staff']), getRevenueReportByRoomType);

// Occupancy report route - restricted to admin and staff
router.get('/occupancy', authorize(['admin', 'staff']), getOccupancyReportByRoomType);

module.exports = router;