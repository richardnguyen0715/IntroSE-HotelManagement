// Sử dụng API URL từ file .env
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Lấy danh sách tất cả các booking
 * @param {Object} filters Các tham số lọc (tùy chọn)
 * @param {string} filters.status Lọc theo trạng thái booking
 * @param {string} filters.email Lọc theo email khách hàng
 * @param {string} filters.startDate Lọc theo ngày bắt đầu
 * @param {string} filters.endDate Lọc theo ngày kết thúc
 * @returns {Promise} Promise với dữ liệu danh sách booking
 */
export const getAllBookings = async (filters = {}) => {
  try {
    // Tạo query string từ các tham số lọc
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append("status", filters.status);
    if (filters.email) queryParams.append("email", filters.email);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    // Tạo URL với query parameters
    const url = `${API_URL}/bookings${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting bookings:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết của một booking theo ID
 * @param {string} id ID của booking
 * @returns {Promise} Promise với dữ liệu booking
 */
export const getBooking = async (id) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting booking ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo booking mới
 * @param {Object} bookingData Dữ liệu booking mới
 * @param {string} bookingData.roomNumber Số phòng
 * @param {string} bookingData.startDate Ngày bắt đầu thuê
 * @param {Array} bookingData.customers Danh sách khách hàng
 * @param {string} bookingData.roomType Loại phòng
 * @returns {Promise} Promise với dữ liệu booking đã tạo
 */
export const createBooking = async (bookingData) => {
  try {
    console.log("Sending booking data to API:", bookingData);

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    // Log raw response for debugging
    console.log("Raw API response status:", response.status);

    // Xử lý trường hợp API trả về lỗi nhưng không có JSON
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("API endpoint không tồn tại");
      }

      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
      } catch (jsonError) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Cập nhật thông tin booking
 * @param {string} id ID của booking
 * @param {Object} bookingData Dữ liệu booking cần cập nhật
 * @returns {Promise} Promise với dữ liệu booking đã cập nhật
 */
export const updateBooking = async (id, bookingData) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa booking
 * @param {string} id ID của booking
 * @returns {Promise} Promise với kết quả xóa
 */
export const deleteBooking = async (id) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting booking ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa nhiều booking
 * @param {Array} ids Mảng ID các booking cần xóa
 * @returns {Promise} Promise với kết quả xóa
 */
export const deleteMultipleBookings = async (ids) => {
  try {
    // Tạo một mảng các promises cho mỗi lần gọi API xóa booking
    const deletePromises = ids.map((id) => deleteBooking(id));

    // Thực hiện tất cả các promises song song
    await Promise.all(deletePromises);

    return {
      status: "success",
      message: `Đã xóa ${ids.length} booking thành công`,
    };
  } catch (error) {
    console.error("Error deleting multiple bookings:", error);
    throw error;
  }
};

/**
 * Lấy danh sách booking của một user cụ thể
 * @param {string} userId ID của user
 * @returns {Promise} Promise với dữ liệu danh sách booking
 */
export const getUserBookings = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting user bookings for ${userId}:`, error);
    throw error;
  }
};

/**
 * Chuyển đổi định dạng ngày từ DD/MM/YYYY sang YYYY-MM-DD (cho API)
 * @param {string} dateStr Ngày định dạng DD/MM/YYYY
 * @returns {string} Ngày định dạng YYYY-MM-DD
 */
export const formatDateForApi = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

/**
 * Chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY (cho UI)
 * @param {string} dateStr Ngày định dạng YYYY-MM-DD
 * @returns {string} Ngày định dạng DD/MM/YYYY
 */
export const formatDateForUI = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
