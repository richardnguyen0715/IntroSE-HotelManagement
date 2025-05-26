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
    if (!year || !month) {
      return { success: false, message: "Vui lòng chọn năm và tháng" };
    }

    const response = await fetch(
      `${API_URL}/reports/revenue?year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

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
    return { success: true, data };
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo doanh thu:", error);
    return { success: false, message: error.message };
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
    if (!year || !month) {
      return { success: false, message: "Vui lòng chọn năm và tháng" };
    }

    const response = await fetch(
      `${API_URL}/reports/occupancy?year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

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
    return { success: true, data };
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo mật độ sử dụng:", error);
    return { success: false, message: error.message };
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
