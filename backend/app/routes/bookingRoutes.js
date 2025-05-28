const express = require('express');
const {
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  createBooking
} = require('../controllers/bookingController');

const router = express.Router();

router
  .route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

module.exports = router;