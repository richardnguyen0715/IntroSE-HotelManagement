const express = require('express');
const {
  getAllBookings,
  getBooking,
  updateBooking,
  // deleteBooking,
  createBooking
} = require('../controllers/bookingController');

const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');


// router
//   .route('/:id')
//   .get(protect, authorize('admin'),bookingController.getBooking)
//   .put(protect, bookingController.updateBooking)
//   .delete(protect, authorize('admin'), bookingController.deleteBooking);

// router
//   .route('/')
//   .get(protect, bookingController.getAllBookings)
//   .post(protect, bookingController.createBooking);

router
  .route('/:id')
  .get(getBooking)
  .put(updateBooking);
  // .delete(deleteBooking);

router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

module.exports = router;
