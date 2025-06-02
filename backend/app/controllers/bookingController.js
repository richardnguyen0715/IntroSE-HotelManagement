const {Booking} = require('../models/Booking');
const Room = require('../models/Room');
const Invoice = require('../models/Invoice');

// Helper function to check if the room is available
const isRoomAvailable = async (roomNumber, customerList) => {
  // Check the status of the room from the Room collection
  const room = await Room.findOne({ roomNumber });
  if (!room) {
    throw new Error("Room not found");
  }
  
  // Check if the number of customers exceeds the room capacity
  if (customerList && customerList.length > room.capacity) {
      throw new Error(`Room capacity (${room.capacity}) exceeded. Cannot accommodate ${customerList.length} customers.`);
  }
  
  return room.status === 'available';
};
// Helper function to update room status
const updateRoomStatus = async (roomNumber, status) => {
  const room = await Room.findOneAndUpdate(
    { roomNumber },
    { status },
    { new: true }
  );
  if (!room) {
    throw new Error("Room not found");
  }
  return room;
};
// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const {
      roomNumber,
      startDate,
      email,
      status,
      paymentStatus,
      totalPrice,
      customerList,
    } = req.body;

    // Validate input
    if (!roomNumber) {
      return res
        .status(400)
        .json({ message: "Room number is required", status: "error" });
    }

    if (!startDate) {
      return res
        .status(400)
        .json({ message: "Start date is required", status: "error" });
    }

    // Kiểm tra phòng có khả dụng không
    try {
      await isRoomAvailable(roomNumber, customerList);
    } catch (error) {
      return res.status(400).json({ message: error.message, status: "error" });
    }

    // Tạo booking mới
    const newBooking = new Booking({
      roomNumber,
      startDate,
      email,
      status: status || "confirmed", // Default status
      paymentStatus: paymentStatus || "pending", // Default payment status
      totalPrice: totalPrice || 0, // Default total price
      customerList,
    });

    const savedBooking = await newBooking.save();

    // Cập nhật trạng thái phòng thành "occupied"
    await updateRoomStatus(roomNumber, "occupied");

    // Trả về kết quả
    res.status(201).json({
      message: "Booking created successfully",
      status: "success",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      message: `Error creating booking: ${error.message}`,
      status: "error",
    });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { startDate, roomNumber, customerCount, status } = req.query;
    let query = {};

      // Filter by date
      if (startDate) {
        // Convert the input date string to a Date object
        const filterDate = new Date(startDate);
        
        // Check if the date is valid
        if (!isNaN(filterDate.getTime())) {
          // Filter bookings with startDate greater than or equal to the input date
          query.startDate = { $gte: filterDate };
        } else {
          // Keep the original regex search if date format is invalid
          query.$expr = {
              $regexMatch: {
                  input: { $toString: "$startDate" },
                  regex: startDate
              }
          };
        }
      }

      // Filter by status
      if (status) {
          query.status = status;
      }

      // Filter by room number
      if (roomNumber) {
          query.roomNumber = roomNumber;
      }

      // Filter by customer count
      if (customerCount) {
          query['customerList.0'] = { $exists: true };  // Ensure customerList is not empty
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

// Update booking
// exports.updateBooking = async (req, res) => {
//   try {
//     const { roomNumber, startDate, customerList } = req.body;
//     const bookingId = req.params.id;

//     // Lấy booking hiện tại
//     const currentBooking = await Booking.findById(bookingId);
//     if (!currentBooking) {
//       return res.status(404).json({
//         message: "Booking not found",
//         status: "error",
//       });
//     }

//     // Nếu thay đổi phòng hoặc ngày, kiểm tra availability
//     if (
//       roomNumber !== currentBooking.roomNumber ||
//       new Date(startDate).getTime() !==
//         new Date(currentBooking.startDate).getTime()
//     ) {
//       const available = await isRoomAvailable(roomNumber, startDate);
//       if (!available) {
//         return res.status(400).json({
//           message: "Room is not available for the selected date",
//           status: "unavailable",
//         });
//       }
//     }

//     // Nếu phòng available hoặc không thay đổi phòng/ngày, cập nhật booking
//     const updatedBooking = await Booking.findByIdAndUpdate(
//       bookingId,
//       {
//         roomNumber,
//         startDate,
//         customerList,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Booking updated successfully",
//       status: "success",
//       booking: updatedBooking,
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//       status: "error",
//     });
//   }
// };
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      roomNumber,
      startDate,
      email,
      status,
      paymentStatus,
      totalPrice,
      customerList,
    } = req.body;

    // Validate input
    if (!roomNumber) {
      return res
        .status(400)
        .json({ message: "Room number is required", status: "error" });
    }

    // Find the current booking
    const currentBooking = await Booking.findById(id);
    if (!currentBooking) {
      return res
        .status(404)
        .json({ message: "Booking not found", status: "error" });
    }

        // If change room or date, check availability
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
      return res.status(404).json({ message: "Booking not found" });
    }

        // Check if booking status is active
        if (booking.status !== 'active') {
            return res.status(400).json({ 
                message: 'Only active bookings can be deleted',
                status: 'error'
            });
        }

        // Delete the booking if it's active
        await Booking.findByIdAndDelete(req.params.id);
        
        // Update room status to available
        await updateRoomStatus(booking.roomNumber, 'available');

    res.status(200).json({
      message: "Booking deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};