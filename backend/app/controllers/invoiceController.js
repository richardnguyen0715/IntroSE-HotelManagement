const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');

// Get all invoices
exports.getAllInvoices = async (req, res, next) => {
  try {
    let query = Invoice.find().populate('booking').populate('user');
    
    // Filter by status
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }
    
    // Filter by user
    if (req.query.user) {
      query = query.find({ user: req.query.user });
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query = query.find({
        createdAt: { 
          $gte: new Date(req.query.startDate), 
          $lte: new Date(req.query.endDate) 
        }
      });
    }
    
    const invoices = await query;
    
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// Get single invoice
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('booking')
      .populate('user');
    
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Create new invoice
exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    
    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      error.statusCode = 400;
      error.message = messages;
    }
    next(error);
  }
};

// Update invoice
exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      error.statusCode = 400;
      error.message = messages;
    }
    next(error);
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
