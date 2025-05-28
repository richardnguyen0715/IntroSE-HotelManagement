const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    unitPrice: {
      type: Number, 
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'online_payment'],
    required: function() { return this.status === 'paid'; }
  },
  paymentDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    const prefix = 'INV';
    const year = new Date().getFullYear().toString().substr(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const sequence = (count + 1).toString().padStart(4, '0');
    this.invoiceNumber = `${prefix}-${year}${month}-${sequence}`;
  }
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
