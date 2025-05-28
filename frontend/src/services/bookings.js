// Sử dụng API URL từ file config
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Lấy danh sách đặt phòng
 * @returns {Promise} Promise với dữ liệu danh sách đặt phòng
 */
export const getBookings = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/bookings`, {
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

    // Convert API bookings to UI rental format
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
 * @param {Object} bookingData Dữ liệu đặt phòng mới
 * @returns {Promise} Promise với dữ liệu đặt phòng đã tạo
 */
export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Booking data being sent:", JSON.stringify(bookingData));

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    // Lấy response text để debug
    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    // Parse JSON nếu có thể
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

    // Đảm bảo data hoặc data.data tồn tại trước khi dùng mapBookingToRental
    if (data && (data.booking || data.data || data._id)) {
      const bookingToMap = data.booking || data.data || data;

      return {
        success: true,
        data: mapBookingToRental(bookingToMap),
      };
    } else {
      console.error(
        "API returned success but missing expected data structure:",
        data
      );
      return {
        success: false,
        message: "API trả về dữ liệu không đúng định dạng",
        rawResponse: data,
      };
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: error.message };
  }
};
/**
 * Cập nhật thông tin đặt phòng
 * @param {string} id ID của đặt phòng
 * @param {Object} bookingData Dữ liệu đặt phòng cần cập nhật
 * @returns {Promise} Promise với dữ liệu đặt phòng đã cập nhật
 */
export const updateBooking = async (id, bookingData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return {
        success: false,
        message: `API không trả về JSON hợp lệ: ${text.substring(0, 100)}...`,
      };
    }

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
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
  if (!dateString) return null;

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
      now.setHours(14, 30, 0, 0);
      return now.toISOString();
    }

    // Chuyển đổi ngày tháng
    const numYear = parseInt(year, 10);
    const numMonth = parseInt(month, 10) - 1; // JS months are 0-indexed
    const numDay = parseInt(day, 10);

    if (isNaN(numYear) || isNaN(numMonth) || isNaN(numDay)) {
      console.error("Invalid date components:", { day, month, year });
      const now = new Date();
      now.setHours(14, 30, 0, 0);
      return now.toISOString();
    }

    const date = new Date(numYear, numMonth, numDay, 14, 30, 0);

    if (isNaN(date.getTime())) {
      console.error("Created invalid date:", date);
      const now = new Date();
      now.setHours(14, 30, 0, 0);
      return now.toISOString();
    }

    // Không cần thay đổi timezone trong chuỗi ISO
    return date.toISOString();
  } catch (error) {
    console.error("Error formatting date:", error, "Input:", dateString);
    const now = new Date();
    now.setHours(14, 30, 0, 0);
    return now.toISOString();
  }
};

// Chuyển đổi loại khách từ UI sang API
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

// Chuyển đổi loại khách từ API sang UI
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

// Hàm đổi định dạng từ API sang UI
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

  return {
    id: booking._id || booking.id || "unknown",
    room: booking.roomNumber || booking.room || "",
    email: booking.email || "",
    checkInDate: booking.startDate ? formatDateForUI(booking.startDate) : "",
    checkOutDate: booking.endDate ? formatDateForUI(booking.endDate) : "",
    totalPrice: booking.totalPrice || 0,
    status: booking.status || "confirmed",
    paymentStatus: booking.paymentStatus || "pending",
    createdAt: booking.createdAt || new Date().toISOString(),
    customers: (booking.customerList || booking.customers || []).map(
      (customer) => ({
        id:
          customer._id ||
          customer.id ||
          Math.random().toString(36).substr(2, 9),
        name: customer.name || "",
        type: mapCustomerTypeToUI(customer.type),
        idNumber: customer.identityCard || customer.idNumber || "",
        address: customer.address || "",
      })
    ),
  };
};

// Hàm đổi định dạng từ UI sang API
export const mapRentalToBooking = (rental) => {
  if (!rental) return {};

  // Đảm bảo định dạng ngày đúng
  let startDate = null;
  if (rental.checkInDate) {
    startDate = formatDateForAPI(rental.checkInDate);
    console.log("Formatted start date:", startDate);
  }

  return {
    roomNumber: rental.room || "",
    startDate: startDate,
    email: rental.email || "",
    status: rental.status || "confirmed",
    paymentStatus: rental.paymentStatus || "pending",
    totalPrice: rental.totalPrice || 0,
    customerList: (rental.customers || [])
      .filter((c) => c && c.name && c.idNumber)
      .map((customer) => ({
        name: customer.name || "",
        type: convertCustomerTypeToAPI(customer.type || "Nội địa"),
        identityCard: customer.idNumber || "",
        address: customer.address || "",
      })),
  };
};
