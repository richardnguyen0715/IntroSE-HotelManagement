const {Booking} = require('../models/Booking');
const {Room} = require('../models/Room');
const Invoice = require('../models/Invoice');

// Hàm helper để kiểm tra phòng có available không
const isRoomAvailable = async (roomNumber, customerList) => {
  // Kiểm tra trạng thái của phòng từ collection Room
  const room = await Room.findOne({ roomNumber });
  if (!room) {
      throw new Error('Room not found');
  }
  
  // Kiểm tra số lượng khách có vượt quá capacity của phòng không
  if (customerList && customerList.length > room.capacity) {
      throw new Error(`Room capacity (${room.capacity}) exceeded. Cannot accommodate ${customerList.length} customers.`);
  }
  
  return room.status === 'available';
};
// Hàm helper để cập nhật trạng thái phòng
const updateRoomStatus = async (roomNumber, status) => {
  const room = await Room.findOneAndUpdate(
      { roomNumber },
      { status },
      { new: true }
  );
  if (!room) {
      throw new Error('Room not found');
  }
  return room;
};

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { roomNumber, startDate, customerList } = req.body;
        // Check if room is available
        const available = await isRoomAvailable(roomNumber, customerList);
        
        if (!available) {
            return res.status(400).json({ 
                message: 'Room is not available for the selected date',
                status: 'unavailable'
            });
        }
        
        // If room is available, create a new booking
        const booking = new Booking({
            roomNumber,
            startDate,
            customerList
        });

        const savedBooking = await booking.save();
        await updateRoomStatus(roomNumber, 'occupied');
        res.status(201).json({
            message: 'Booking created successfully',
            status: 'success',
            booking: savedBooking
        });
    } catch (error) {
        console.error('Error in createBooking:', error);
        res.status(400).json({ 
            message: error.message,
            status: 'error'
        });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
      const { startDate, roomNumber, customerCount, status } = req.query;
      let query = {};

      // Lọc theo ngày nếu có
      if (startDate) {
        query.$expr = {
            $regexMatch: {
                input: { $toString: "$startDate" },
                regex: startDate
            }
        };
      }

      // Lọc theo status nếu có
      if (status) {
          query.status = status;
      }

      // Lọc theo số phòng nếu có
      if (roomNumber) {
          query.roomNumber = roomNumber;
      }

      // Lọc theo số lượng khách nếu có
      if (customerCount) {
          query['customerList.0'] = { $exists: true };  // Đảm bảo customerList không rỗng
          query.$expr = { $eq: [{ $size: "$customerList" }, parseInt(customerCount)] };
      }

      const bookings = await Booking.find(query);
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Get booking by ID or room number
exports.getBooking = async (req, res) => {
    try {
        let booking;
        if (req.params.id) {
            // If ID is provided, search by ID
            booking = await Booking.findById(req.params.id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            return res.status(200).json(booking);
        } else if (req.params.roomNumber) {
            // If room number is provided, search by room number
            booking = await Booking.find({ roomNumber: req.params.roomNumber });
            return res.status(200).json(booking);
        } else {
            return res.status(400).json({ message: 'Please provide either booking ID or room number' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update booking
exports.updateBooking = async (req, res) => {
    try {
        const { roomNumber, startDate, customerList } = req.body;
        const bookingId = req.params.id;

        // Lấy booking hiện tại
        const currentBooking = await Booking.findById(bookingId);
        if (!currentBooking) {
            return res.status(404).json({ 
                message: 'Booking not found',
                status: 'error'
            });
        }

        // Nếu thay đổi phòng hoặc ngày, kiểm tra availability
        if (roomNumber !== currentBooking.roomNumber || 
            new Date(startDate).getTime() !== new Date(currentBooking.startDate).getTime()) {
            
            const available = await isRoomAvailable(roomNumber, startDate);
            if (!available) {
                return res.status(400).json({ 
                    message: 'Room is not available for the selected date',
                    status: 'unavailable'
                });
            }
        }

        // Nếu phòng available hoặc không thay đổi phòng/ngày, cập nhật booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                roomNumber,
                startDate,
                customerList
            },
            { new: true }
        );

        res.status(200).json({
            message: 'Booking updated successfully',
            status: 'success',
            booking: updatedBooking
        });
    } catch (error) {
        res.status(400).json({ 
            message: error.message,
            status: 'error'
        });
    }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Kiểm tra xem có invoice pending cho phòng này không
        const pendingInvoice = await Invoice.findOne({
            'rentals.roomNumber': booking.roomNumber,
            'status': 'pending'
        });

        if (pendingInvoice) {
            return res.status(400).json({ 
                message: 'Cannot delete booking with pending invoice',
                status: 'error'
            });
        }

        // Nếu không có invoice pending, xóa booking
        await Booking.findByIdAndDelete(req.params.id);
        
        // Cập nhật trạng thái phòng về available
        await updateRoomStatus(booking.roomNumber, 'available');

        res.status(200).json({ 
            message: 'Booking deleted successfully',
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            status: 'error'
        });
    }
};
