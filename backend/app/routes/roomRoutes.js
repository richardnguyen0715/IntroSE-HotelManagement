const express = require('express');
const {
  getAllRooms,
  getRoom,
  createRoom,
  deleteRoom,
  updateRoomToMaintenance
} = require('../controllers/roomController');

const router = express.Router();
// Routes for /api/rooms
router
  .route('/')
  .get(getAllRooms)
  .post(createRoom);

// Routes for /api/rooms/:id
router
  .route('/:id')
  .get(getRoom)
  .delete(deleteRoom)
  .put(updateRoomToMaintenance);

module.exports = router;