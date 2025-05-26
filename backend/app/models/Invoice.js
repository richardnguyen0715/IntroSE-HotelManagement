const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
  },
  total: {
    type: Number,
  }
});

const invoiceSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // totalValue: {
  //   type: Number,
  //   required: true
  // },
  rentals: [rentalSchema],
  issueDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
});


const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
