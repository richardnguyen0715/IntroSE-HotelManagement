const express = require('express');
const {
  getAllBookings,
  updateBooking,
  deleteBooking,
  createBooking
} = require('../controllers/bookingController');

const router = express.Router();

router
  .route('/:id')
  .put(updateBooking)
  .delete(deleteBooking);

router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

module.exports = router;