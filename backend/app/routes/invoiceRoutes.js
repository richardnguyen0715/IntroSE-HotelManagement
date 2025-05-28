const express = require('express');
const { 
  getAllInvoices, 
  getInvoice, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice
} = require('../controllers/invoiceController');

const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');

// Base routes
// router
//   .route('/')
//   .get(protect, getAllInvoices)
//   .post(protect, createInvoice);

// router
//   .route('/:id')
//   .get(protect, getInvoice)
//   .put(protect, updateInvoice)
//   .delete(protect, authorize('admin'), deleteInvoice);

router
  .route('/')
  .get(getAllInvoices)
  .post(createInvoice);

router
  .route('/:id')
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice);

module.exports = router;
