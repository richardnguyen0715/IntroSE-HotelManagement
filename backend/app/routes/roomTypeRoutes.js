const express = require('express');
const {
  getAllRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType
} = require('../controllers/roomTypeController');

const router = express.Router();

// Routes for /api/roomtypes
router
  .route('/')
  .get(getAllRoomTypes)
  .post(createRoomType);

// Routes for /api/roomtypes/:id
router
  .route('/:id')
  .put(updateRoomType)
  .delete(deleteRoomType);

module.exports = router; 