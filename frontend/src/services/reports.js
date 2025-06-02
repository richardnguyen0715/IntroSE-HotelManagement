// Sử dụng API URL từ file config
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Lấy báo cáo doanh thu theo loại phòng
 * @param {number} year - Năm báo cáo
 * @param {number} month - Tháng báo cáo
 * @returns {Promise} Promise với dữ liệu báo cáo
 */
export const getRevenueReports = async (year, month) => {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("Token tồn tại:", !!token); // Log kiểm tra token

    if (!token) {
      return {
        success: false,
        message: "Vui lòng đăng nhập để xem báo cáo",
      };
    }

    if (!year || !month) {
      return { success: false, message: "Vui lòng chọn năm và tháng" };
    }

    const response = await fetch(
      `${API_URL}/reports/revenue?year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API response status:", response.status); // Log status code

    if (!response.ok) {
      if (response.status === 401) {
        // Xóa token không hợp lệ và báo lỗi
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        return {
          success: false,
          message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
        };
      }
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo doanh thu:", error);
    return {
      success: false,
      message: error.message || "Không thể tải báo cáo. Vui lòng thử lại.",
    };
  }
};

/**
 * Lấy báo cáo mật độ sử dụng phòng
 * @param {number} year - Năm báo cáo
 * @param {number} month - Tháng báo cáo
 * @returns {Promise} Promise với dữ liệu báo cáo
 */
export const getOccupancyReports = async (year, month) => {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("Token tồn tại:", !!token); // Log kiểm tra token

    if (!token) {
      return {
        success: false,
        message: "Vui lòng đăng nhập để xem báo cáo",
      };
    }

    if (!year || !month) {
      return { success: false, message: "Vui lòng chọn năm và tháng" };
    }

    const response = await fetch(
      `${API_URL}/reports/occupancy?year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API response status:", response.status); // Log status code

    if (!response.ok) {
      if (response.status === 401) {
        // Xóa token không hợp lệ và báo lỗi
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        return {
          success: false,
          message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
        };
      }

      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo mật độ sử dụng:", error);
    return {
      success: false,
      message: error.message || "Không thể tải báo cáo. Vui lòng thử lại.",
    };
  }
};

// Format giá trị tiền tệ
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Format phần trăm
export const formatPercentage = (value) => {
  if (value === undefined || value === null) return "0%";
  return `${value}%`;
};
