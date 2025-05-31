const { Booking } = require("../models/Booking");
const { Room } = require("../models/Room");
const Invoice = require("../models/Invoice");
const HotelPolicy = require("../models/hotelPolicy"); // <-- Thêm dòng này

// // Hàm helper để kiểm tra phòng có available không
// const isRoomAvailable = async (roomNumber, customerList) => {
//   // Kiểm tra trạng thái của phòng từ collection Room
//   const room = await Room.findOne({ roomNumber });
//   if (!room) {
//       throw new Error('Room not found');
//   }

//   // Kiểm tra số lượng khách có vượt quá capacity của phòng không
//   if (customerList && customerList.length > room.capacity) {
//       throw new Error(`Room capacity (${room.capacity}) exceeded. Cannot accommodate ${customerList.length} customers.`);
//   }

//   return room.status === 'available';
// };
// // Hàm helper để cập nhật trạng thái phòng
// const updateRoomStatus = async (roomNumber, status) => {
//   const room = await Room.findOneAndUpdate(
//       { roomNumber },
//       { status },
//       { new: true }
//   );
//   if (!room) {
//       throw new Error('Room not found');
//   }
//   return room;
// };
const isRoomAvailable = async (roomNumber, secondParam) => {
  // Kiểm tra trạng thái của phòng từ collection Room
  const room = await Room.findOne({ roomNumber });
  if (!room) {
    throw new Error("Room not found");
  }

  // Lấy policy về max user
  const policy = await HotelPolicy.findOne();
  const maxCapacity = policy ? policy.maxUser : 4; // Default to 4 if no policy

  // Kiểm tra nếu secondParam là mảng khách hàng
  if (secondParam && Array.isArray(secondParam)) {
    if (secondParam.length > maxCapacity) {
      throw new Error(
        `Room capacity (${maxCapacity}) exceeded. Cannot accommodate ${secondParam.length} customers.`
      );
    }
  }
  // Nếu không phải là mảng, giả định là startDate và bỏ qua kiểm tra capacity

  return room.status === "available";
};
// Hàm helper để cập nhật trạng thái phòng
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

    // Lọc theo ngày nếu có
    if (startDate) {
      query.$expr = {
        $regexMatch: {
          input: { $toString: "$startDate" },
          regex: startDate,
        },
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
      query["customerList.0"] = { $exists: true }; // Đảm bảo customerList không rỗng
      query.$expr = {
        $eq: [{ $size: "$customerList" }, parseInt(customerCount)],
      };
    }

    const bookings = await Booking.find(query);
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
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
        return res.status(404).json({ message: "Booking not found" });
      }
      return res.status(200).json(booking);
    } else if (req.params.roomNumber) {
      // If room number is provided, search by room number
      booking = await Booking.find({ roomNumber: req.params.roomNumber });
      return res.status(200).json(booking);
    } else {
      return res
        .status(400)
        .json({ message: "Please provide either booking ID or room number" });
    }
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

    // Nếu thay đổi phòng hoặc ngày, kiểm tra availability
    if (
      roomNumber !== currentBooking.roomNumber ||
      new Date(startDate).getTime() !==
        new Date(currentBooking.startDate).getTime()
    ) {
      // Kiểm tra cả availability và capacity trong một cuộc gọi
      // Gọi với tham số thứ hai là customerList để kiểm tra capacity
      try {
        await isRoomAvailable(roomNumber, customerList);
      } catch (error) {
        return res
          .status(400)
          .json({ message: error.message, status: "error" });
      }
    } else {
      // Nếu không đổi phòng thì chỉ cần kiểm tra capacity
      try {
        await isRoomAvailable(roomNumber, customerList);
      } catch (error) {
        // Nếu lỗi là "Room not found" thì trả về 404, còn các lỗi khác như capacity thì trả về 400
        if (error.message.includes("Room not found")) {
          return res
            .status(404)
            .json({ message: error.message, status: "error" });
        }
        return res
          .status(400)
          .json({ message: error.message, status: "error" });
      }
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        roomNumber,
        startDate,
        email,
        status,
        paymentStatus,
        totalPrice,
        customerList,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ message: "Booking not found", status: "error" });
    }

    // Respond with the updated booking
    return res.status(200).json({
      message: "Booking updated successfully",
      status: "success",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res.status(500).json({
      message: `Error updating booking: ${error.message}`,
      status: "error",
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

    // Kiểm tra xem có invoice pending cho phòng này không
    const pendingInvoice = await Invoice.findOne({
      "rentals.roomNumber": booking.roomNumber,
      status: "pending",
    });

    if (pendingInvoice) {
      return res.status(400).json({
        message: "Cannot delete booking with pending invoice",
        status: "error",
      });
    }

    // Nếu không có invoice pending, xóa booking
    await Booking.findByIdAndDelete(req.params.id);

    // Cập nhật trạng thái phòng về available
    await updateRoomStatus(booking.roomNumber, "available");

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
