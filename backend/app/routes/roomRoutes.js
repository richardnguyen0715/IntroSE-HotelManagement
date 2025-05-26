const express = require('express');
const {
  getAllRooms,
  getRoom,
  getRoomTypes,
  createRoom,
  updateRoomCapacity,
  deleteRoom,
  updateRoomPrice
} = require('../controllers/roomController');

const router = express.Router();

router
  .route('/')
  .get(getAllRooms)
  .post(createRoom);


router
  .route('/types')
  .get(getRoomTypes);

router
  .route('/price')
  .put(updateRoomPrice);

// router
//   .route('/capacity')
//   .put(updateRoomCapacity);
  
router
  .route('/:id')
  .get(getRoom)
  .delete(deleteRoom);

module.exports = router;