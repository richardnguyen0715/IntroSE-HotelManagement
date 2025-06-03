// Sử dụng API URL từ file config
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Lấy danh sách đặt phòng
 * @returns {Promise} Promise với dữ liệu danh sách đặt phòng
 */
// export const getBookings = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const response = await fetch(`${API_URL}/bookings`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }

//     const data = await response.json();

//     // Convert API bookings to UI rental format
//     const rentals = data.data.map((booking) => mapBookingToRental(booking));

//     return rentals;
//   } catch (error) {
//     console.error("Error getting bookings:", error);
//     throw error;
//   }
// };
export const getBookings = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");

    // Xây dựng query parameters từ filters
    const queryParams = new URLSearchParams();

    if (filters.status) {
      queryParams.append("active", filters.status);
    }

    if (filters.roomNumber) {
      queryParams.append("roomNumber", filters.roomNumber);
    }

    if (filters.customerCount) {
      queryParams.append("customerCount", filters.customerCount);
    }

    if (filters.startDate) {
      queryParams.append("startDate", filters.startDate);
    }

    const queryString = queryParams.toString();
    const url = `${API_URL}/bookings${queryString ? `?${queryString}` : ""}`;

    console.log("Fetching bookings from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    const rentals = data.data.map((booking) => mapBookingToRental(booking));
    return rentals;
  } catch (error) {
    console.error("Error getting bookings:", error);
    throw error;
  }
};
/**
 * Lấy thông tin một đặt phòng
 * @param {string} id ID của đặt phòng
 * @returns {Promise} Promise với dữ liệu đặt phòng
 */
export const getBookingById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return mapBookingToRental(data.data);
  } catch (error) {
    console.error(`Error getting booking with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo đặt phòng mới
 * @param {Object} rentalData Dữ liệu phiếu thuê mới
 * @returns {Promise} Promise với dữ liệu đặt phòng đã tạo
 */
// export const createBooking = async (rentalData) => {
//   try {
//     const token = localStorage.getItem("token");

//     // Chuyển từ dạng rental sang booking trước khi gửi lên API
//     const bookingData = rentalData;

//     console.log("Booking data being sent:", JSON.stringify(bookingData));

//     const response = await fetch(`${API_URL}/bookings`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(bookingData),
//     });

//     // Lấy response text để debug
//     const responseText = await response.text();
//     console.log("Raw API response:", responseText);

//     // Parse JSON nếu có thể
//     let data = {};
//     try {
//       if (responseText) {
//         data = JSON.parse(responseText);
//       }
//     } catch (e) {
//       console.error("Failed to parse response as JSON:", e);
//       return {
//         success: false,
//         message: `API response is not valid JSON: ${responseText.substring(
//           0,
//           100
//         )}...`,
//       };
//     }

//     if (!response.ok) {
//       return {
//         success: false,
//         message: data?.message || `Error: ${response.status}`,
//       };
//     }

//     // Đảm bảo data hoặc data.data tồn tại trước khi dùng mapBookingToRental
//     if (data && (data.booking || data.data || data._id)) {
//       const bookingToMap = data.booking || data.data || data;

//       return {
//         success: true,
//         data: mapBookingToRental(bookingToMap),
//       };
//     } else {
//       console.error(
//         "API returned success but missing expected data structure:",
//         data
//       );
//       return {
//         success: false,
//         message: "API trả về dữ liệu không đúng định dạng",
//         rawResponse: data,
//       };
//     }
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     return { success: false, message: error.message };
//   }
// };
export const createBooking = async (rentalData) => {
  try {
    const token = localStorage.getItem("token");

    // Kiểm tra dữ liệu đầu vào
    console.log("rentalData before processing:", rentalData);

    if (!rentalData || !rentalData.roomNumber) {
      return {
        success: false,
        message: "Thiếu thông tin phòng (room)",
      };
    }

    // Format dữ liệu theo định dạng API mới
    const bookingData = {
      roomNumber: rentalData.roomNumber, // Đảm bảo là string
      email: rentalData.email || "",
    };

    // QUAN TRỌNG: Đảm bảo startDate luôn có giá trị
    let startDate = formatDateForAPI(rentalData.checkInDate);
    if (!startDate) {
      // Nếu không có ngày check-in, sử dụng ngày hiện tại
      const today = new Date();
      startDate = today.toISOString();
    }
    bookingData.startDate = startDate;

    // Đảm bảo customerList luôn là mảng hợp lệ
    bookingData.customerList = Array.isArray(rentalData.customerList)
      ? rentalData.customerList
      : Array.isArray(rentalData.customers)
      ? rentalData.customers
          .filter((c) => c && c.name)
          .map((customer) => ({
            name: customer.name || "",
            type: convertCustomerTypeToAPI(customer.type || "Nội địa"),
            identityCard: customer.idNumber || "",
            address: customer.address || "",
          }))
      : [];

    // Đảm bảo customerList không rỗng
    if (bookingData.customerList.length === 0) {
      bookingData.customerList = [
        {
          name: "Khách hàng",
          type: "domestic",
          identityCard: "000000000",
          address: "",
        },
      ];
    }

    console.log("Booking data being sent:", JSON.stringify(bookingData));

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    let data = {};
    try {
      if (responseText) {
        data = JSON.parse(responseText);
      }
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      return {
        success: false,
        message: `API response is not valid JSON: ${responseText.substring(
          0,
          100
        )}...`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `Error: ${response.status}`,
      };
    }

    return {
      success: true,
      data: mapBookingToRental(data.booking || data.data || data),
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: error.message };
  }
};
/**
 * Cập nhật thông tin đặt phòng
 * @param {string} id ID của đặt phòng
 * @param {Object} rentalData Dữ liệu phiếu thuê cần cập nhật
 * @returns {Promise} Promise với dữ liệu đặt phòng đã cập nhật
 */
/**
 * Cập nhật thông tin đặt phòng
 * @param {string} id ID của đặt phòng
 * @param {Object} rentalData Dữ liệu phiếu thuê cần cập nhật
 * @returns {Promise} Promise với dữ liệu đặt phòng đã cập nhật
 */
export const updateBooking = async (id, rentalData) => {
  try {
    const token = localStorage.getItem("token");

    if (!rentalData.room) {
      console.error(
        "CRITICAL: Room is empty when updating booking",
        rentalData
      );
      return {
        success: false,
        message:
          "Không thể cập nhật khi thiếu thông tin phòng. Vui lòng chọn phòng.",
      };
    }

    // Format dữ liệu theo định dạng API mới
    const bookingData = {
      roomNumber: rentalData.room, // Đảm bảo là string, ví dụ "B02"
      startDate: formatDateForAPI(rentalData.checkInDate),
      customerList: rentalData.customers
        .filter((c) => c && c.name && c.idNumber)
        .map((customer) => ({
          name: customer.name,
          type: convertCustomerTypeToAPI(customer.type),
          identityCard: customer.idNumber,
          address: customer.address,
        })),
    };

    // Thêm email nếu có
    if (rentalData.email) {
      bookingData.email = rentalData.email;
    }

    // Kiểm tra lại sau khi tạo dữ liệu để đảm bảo đầy đủ
    if (!bookingData.roomNumber) {
      console.error("CRITICAL ERROR: roomNumber is empty!", bookingData);
      return {
        success: false,
        message:
          "Không thể cập nhật khi thiếu thông tin phòng. Dữ liệu không hợp lệ.",
      };
    }

    console.log(
      `Updating booking ${id} with data:`,
      JSON.stringify(bookingData)
    );

    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    // Lấy response để debug
    const responseText = await response.text();
    console.log("Update API response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("Non-JSON response:", responseText);
      return {
        success: false,
        message: `API không trả về JSON hợp lệ: ${responseText.substring(
          0,
          100
        )}...`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
      };
    }

    return {
      success: true,
      data: mapBookingToRental(data.booking || data.data || data),
    };
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Xóa đặt phòng
 * @param {string} id ID của đặt phòng
 * @returns {Promise} Promise với kết quả xóa
 */
export const deleteBooking = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting booking ${id}:`, error);
    return { success: false, message: error.message };
  }
};

// Giữ nguyên các hàm tiện ích, nhưng cập nhật mapping cho phù hợp
export const mapBookingToRental = (booking) => {
  if (!booking) {
    console.error("Booking data is undefined or null");
    return {
      id: "unknown",
      room: "",
      email: "",
      customers: [],
    };
  }

  // Xác định trạng thái phòng và trạng thái phiếu thuê
  let roomStatus = "occupied"; // Mặc định tất cả phòng trong phiếu thuê là "occupied"
  let bookingStatus = booking.status || "pending";

  console.log("API Booking status:", bookingStatus);

  return {
    id: booking._id || booking.id || "unknown",
    room: booking.roomNumber || "", // API trả về roomNumber
    email: booking.email || "",
    checkInDate: booking.startDate ? formatDateForUI(booking.startDate) : "", // API sử dụng startDate
    status: bookingStatus, // Hiển thị trạng thái phiếu thuê (inPayment, etc.)
    roomStatus: roomStatus, // Trạng thái phòng luôn là occupied
    createdAt: booking.createdAt || new Date().toISOString(),
    customers: (booking.customerList || []) // API sử dụng customerList
      .filter((customer) => customer)
      .map((customer) => ({
        id:
          customer._id ||
          customer.id ||
          Math.random().toString(36).substr(2, 9),
        name: customer.name || "",
        type: mapCustomerTypeToUI(customer.type),
        idNumber: customer.identityCard || "", // API sử dụng identityCard
        address: customer.address || "",
      })),
  };
};

// Cập nhật mapping để phù hợp với định dạng API mới
export const mapRentalToBooking = (rental) => {
  if (!rental) return {};

  // Đảm bảo roomNumber là string
  const roomNumber = typeof rental.room === "string" ? rental.room : "";

  if (!roomNumber) {
    console.error("CRITICAL ERROR: roomNumber is empty!", rental);
  }

  // Format ngày check-in thành YYYY-MM-DD
  let startDate = null;
  try {
    if (rental.checkInDate) {
      // Format DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = rental.checkInDate.split("/");
      startDate = `${year}-${month}-${day}`;
    } else {
      const now = new Date();
      startDate = now.toISOString().split("T")[0];
    }
  } catch (err) {
    console.error("Error formatting date:", err);
    startDate = new Date().toISOString().split("T")[0];
  }

  // Lọc thông tin khách hàng hợp lệ
  const customerList = (rental.customers || [])
    .filter((c) => c && c.name && c.idNumber)
    .map((customer) => ({
      name: customer.name || "",
      type: convertCustomerTypeToAPI(customer.type || "Nội địa"),
      identityCard: customer.idNumber || "",
      address: customer.address || "",
    }));

  // Tạo object booking đúng với API spec
  return {
    roomNumber: roomNumber,
    startDate: startDate,
    email: rental.email || "",
    customerList: customerList,
  };
};
/**
 * Chuyển đổi định dạng ngày từ API sang UI
 * @param {string} dateString Chuỗi ngày tháng từ API (ISO format)
 * @returns {string} Định dạng ngày DD/MM/YYYY
 */
export const formatDateForUI = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

/**
 * Chuyển đổi từ định dạng UI sang API format
 * @param {string} dateString Chuỗi ngày tháng từ UI (DD/MM/YYYY)
 * @returns {string} Định dạng ISO với timezone +07:00
 */
export const formatDateForAPI = (dateString) => {
  // Nếu không có dateString, trả về ngày hiện tại
  if (!dateString) {
    const now = new Date();
    now.setHours(14, 0, 0, 0); // Check-in vào 14:00
    return now.toISOString();
  }

  try {
    // Kiểm tra xem đây đã là ISO format chưa
    if (dateString.includes("T")) {
      return dateString; // Đã là ISO format, giữ nguyên
    }

    // Convert DD/MM/YYYY to YYYY-MM-DDThh:mm:ss.000+07:00
    const [day, month, year] = dateString.split("/");
    if (!day || !month || !year) {
      console.error("Invalid date format:", dateString);
      // Sử dụng ngày hiện tại nếu định dạng không đúng
      const now = new Date();
      now.setHours(14, 0, 0, 0); // Đặt giờ check-in mặc định là 14:00
      return now.toISOString();
    }

    // Chuyển đổi ngày tháng
    const numYear = parseInt(year, 10);
    const numMonth = parseInt(month, 10) - 1; // JS months are 0-indexed
    const numDay = parseInt(day, 10);

    if (isNaN(numYear) || isNaN(numMonth) || isNaN(numDay)) {
      console.error("Invalid date components:", { day, month, year });
      const now = new Date();
      now.setHours(14, 0, 0, 0);
      return now.toISOString();
    }

    const date = new Date(numYear, numMonth, numDay, 14, 0, 0); // Check-in vào 14:00

    if (isNaN(date.getTime())) {
      console.error("Created invalid date:", date);
      const now = new Date();
      now.setHours(14, 0, 0, 0);
      return now.toISOString();
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error formatting date:", error, "Input:", dateString);
    const now = new Date();
    now.setHours(14, 0, 0, 0);
    return now.toISOString();
  }
};

/**
 * Chuyển đổi loại khách từ UI sang API
 * @param {string} type Loại khách (Nội địa/Nước ngoài)
 * @returns {string} Loại khách theo định dạng API
 */
export const convertCustomerTypeToAPI = (type) => {
  switch (type) {
    case "Nội địa":
      return "domestic";
    case "Nước ngoài":
      return "foreign";
    default:
      return type.toLowerCase();
  }
};

/**
 * Chuyển đổi loại khách từ API sang UI
 * @param {string} type Loại khách theo API
 * @returns {string} Loại khách hiển thị trên UI
 */
export const mapCustomerTypeToUI = (type) => {
  if (!type) return "Nội địa";

  switch (type.toLowerCase()) {
    case "domestic":
      return "Nội địa";
    case "foreign":
      return "Nước ngoài";
    default:
      return type;
  }
};

/**
 * Hàm đổi định dạng từ API sang UI
 * @param {Object} booking Dữ liệu booking từ API
 * @returns {Object} Dữ liệu rental cho UI
 */
// export const mapBookingToRental = (booking) => {
//   if (!booking) {
//     console.error("Booking data is undefined or null");
//     return {
//       id: "unknown",
//       room: "",
//       email: "",
//       customers: [],
//     };
//   }

//   return {
//     id: booking._id || booking.id || "unknown",
//     room: booking.roomNumber || booking.room || "",
//     email: booking.email || "",
//     checkInDate: booking.startDate ? formatDateForUI(booking.startDate) : "",
//     checkOutDate: booking.endDate ? formatDateForUI(booking.endDate) : "",
//     totalPrice: booking.totalPrice || 0,
//     status: booking.status || "confirmed",
//     paymentStatus: booking.paymentStatus || "pending",
//     createdAt: booking.createdAt || new Date().toISOString(),
//     customers: (booking.customerList || booking.customers || [])
//       .filter((customer) => customer) // loại bỏ phần tử null/undefined
//       .map((customer) => ({
//         id:
//           customer._id ||
//           customer.id ||
//           Math.random().toString(36).substr(2, 9),
//         name: customer.name || "",
//         type: mapCustomerTypeToUI(customer.type),
//         idNumber: customer.identityCard || customer.idNumber || "",
//         address: customer.address || "",
//       })),
//   };
// };

/**
 * Hàm đổi định dạng từ UI sang API
 * @param {Object} rental Dữ liệu rental từ UI
 * @returns {Object} Dữ liệu booking cho API
 */
// export const mapRentalToBooking = (rental) => {
//   if (!rental) return {};

//   console.log("Input rental data for mapping:", rental);

//   // Xử lý roomNumber từ object hoặc string
//   let roomNumber = "";
//   if (typeof rental.room === "object" && rental.room.number) {
//     console.log("Room is an object with number property:", rental.room);
//     roomNumber = rental.room.number;
//   } else if (typeof rental.room === "string") {
//     roomNumber = rental.room;
//     console.log("Room is a string:", roomNumber);
//   }

//   if (!roomNumber) {
//     console.error("CRITICAL ERROR: roomNumber is empty!", rental);
//   }

//   // Format ngày check-in
//   let startDate = null;
//   try {
//     if (rental.checkInDate) {
//       startDate = formatDateForAPI(rental.checkInDate);
//       console.log("Formatted start date:", startDate);
//     } else {
//       const now = new Date();
//       now.setHours(14, 0, 0, 0);
//       startDate = now.toISOString();
//       console.log("Using default startDate:", startDate);
//     }
//   } catch (err) {
//     console.error("Error formatting date:", err);
//     startDate = new Date().toISOString();
//   }

//   // Lọc hợp lệ thông tin khách hàng - loại bỏ khách trống
//   const validCustomers = (rental.customers || [])
//     .filter((c) => c && c.name && c.idNumber)
//     .map((customer) => ({
//       name: customer.name || "",
//       type: convertCustomerTypeToAPI(customer.type || "Nội địa"),
//       identityCard: customer.idNumber || "",
//       address: customer.address || "",
//     }));

//   console.log(
//     `Valid customers to send: ${validCustomers.length}`,
//     validCustomers
//   );

//   // Tạo object booking đầy đủ
//   const bookingData = {
//     //room: { number: roomNumber }, // Đảm bảo là string, ví dụ "101"
//     roomNumber: roomNumber,
//     startDate: startDate,
//     email: rental.email || "",
//     status: rental.status === "confirmed" ? "active" : "inactive",
//     paymentStatus: rental.paymentStatus || "pending",
//     totalPrice: rental.totalPrice || 0,
//     customerList: validCustomers,
//   };

//   console.log("Final booking data to be sent:", bookingData);

//   return bookingData;
// };
