const Invoice = require('../models/Invoice');
const { Room } = require('../models/Room');
const { Booking } = require('../models/Booking');
const HotelPolicy = require('../models/hotelPolicy');
// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { customer, address, rentals } = req.body;

    // Get hotel policy for surcharges
    const hotelPolicy = await HotelPolicy.findOne();

    // Calculate totals for each rental
    const processedRentals = await Promise.all(rentals.map(async (rental) => {
      const room = await Room.findOne({ roomNumber: rental.roomNumber });
      if (!room) {
        throw new Error(`Room ${rental.roomNumber} not found`);
      }
      
      // Check if room exists in booking
      const booking = await Booking.findOne({ 
        roomNumber: rental.roomNumber,
        status: 'active'
      });
      
      if (!booking) {
        throw new Error(`Room ${rental.roomNumber} does not have an active booking`);
      }

      // Get base price per day
      let pricePerDay = room.price;
      
      // Check for third guest surcharge
      if (booking.customerList.length > 2) {
          // Apply surcharge for each guest beyond 2
          const extraGuests = booking.customerList.length - 2;
          pricePerDay += (pricePerDay * hotelPolicy.surchargePolicy * extraGuests);
        }
        
        // Check for foreign guests and apply surcharge
        const hasForeignGuest = booking.customerList.some(customer => customer.type === 'foreign');
        if (hasForeignGuest) {
          pricePerDay *= hotelPolicy.foreignPolicy; // Multiply by 1.5 for foreign guests
        }
        
      const total = pricePerDay * rental.numberOfDays;
      
      return {
        roomNumber: rental.roomNumber,
        numberOfDays: rental.numberOfDays,
        pricePerDay,
        total
      };
    }));

    // Calculate total value of all rentals
    const totalValue = processedRentals.reduce((sum, rental) => sum + rental.total, 0);

    const invoice = new Invoice({
      customer,
      address,
      rentals: processedRentals,
      totalValue,
      issueDate: new Date()
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const { customer, roomNumber, startDate, endDate } = req.query;
    let query = {};

    // Filter by customer if provided
    if (customer) {
      query.customer = { $regex: customer, $options: 'i' };
    }

    // Filter by room number if provided
    if (roomNumber) {
      query['rentals.roomNumber'] = roomNumber;
    }

    // Filter by issue date range if provided
    if (startDate || endDate) {
      query.issueDate = {};
      
      if (startDate) {
        query.issueDate.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.issueDate.$lte = new Date(endDate);
      }
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const invoices = await Invoice.find(query)
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Invoice.countDocuments(query);

    res.status(200).json({
      success: true,
      count: invoices.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      },
      data: invoices
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get a single invoice by ID
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get invoice by invoice number
exports.getInvoiceByNumber = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { name, address, items } = req.body;
    
    // Process items if they are being updated
    let processedItems;
    if (items && Array.isArray(items)) {
      processedItems = await Promise.all(items.map(async (item) => {
        const room = await Room.findOne({ roomNumber: item.roomNumber });
        if (!room) {
          throw new Error(`Room ${item.roomNumber} not found`);
        }
        
        const pricePerDay = room.price;
        const total = pricePerDay * item.numberOfDays;
        
        return {
          ...item,
          pricePerDay,
          total
        };
      }));
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(address && { address }),
        ...(processedItems && { items: processedItems })
      },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Invoice payment confirmation
exports.confirmInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find invoice by ID
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    // Check if invoice is already paid
    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Invoice already paid'
      });
    }
    
    // Update invoice status to paid
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        status: 'paid',
      },
      { new: true }
    );
    
    // Update booking status and room status
    for (const rental of invoice.rentals) {
      // Update booking status
      await Booking.findOneAndUpdate(
        { roomNumber: rental.roomNumber, status: 'active' },
        { status: 'inactive' },
        { new: true }
      );
      
      // Set status to available
      await Room.findOneAndUpdate(
        { roomNumber: rental.roomNumber },
        { status: 'available' },
        { new: true }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Paid successfully',
      data: updatedInvoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error: ${error.message}`
    });
  }
};