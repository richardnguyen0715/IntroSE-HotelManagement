const express = require('express');
const { 
  getAllInvoices,
  getInvoice, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice,
  getInvoiceByNumber,
  confirmInvoicePayment
} = require('../controllers/invoiceController');

const router = express.Router();

router
  .route('/')
  .get(getAllInvoices)
  .post(createInvoice);

router
  .route('/:id')
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice);

router
  .route('/:id/confirm-payment')
  .post(confirmInvoicePayment);


module.exports = router;
