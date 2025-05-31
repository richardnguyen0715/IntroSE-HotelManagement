const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Lấy thông tin chính sách khách sạn
 * @returns {Promise} Promise kèm dữ liệu policy
 */
export const getHotelPolicy = async () => {
  try {
    const response = await fetch(`${API_URL}/policy`);

    if (!response.ok) {
      throw new Error(`Lỗi khi lấy quy định: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response data:", data);

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin quy định khách sạn:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin chính sách khách sạn
 * @param {string} id - ID của policy cần cập nhật
 * @param {Object} policyData - Dữ liệu cần cập nhật
 * @returns {Promise} Promise kèm dữ liệu đã cập nhật
 */
export const updateHotelPolicy = async (id, policyData) => {
  try {
    const response = await fetch(`${API_URL}/policy/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policyData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi cập nhật quy định: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật quy định khách sạn:", error);
    throw error;
  }
};

/**
 * Cập nhật một phần thông tin chính sách khách sạn
 * @param {string} id - ID của policy cần cập nhật
 * @param {Object} policyData - Các trường cần cập nhật
 * @returns {Promise} Promise kèm dữ liệu đã cập nhật
 */
/**
 * Cập nhật thông tin chính sách khách sạn
 * @param {string} id - ID của policy cần cập nhật
 * @param {Object} policyData - Dữ liệu cần cập nhật
 * @returns {Promise} Promise kèm dữ liệu đã cập nhật
 */
export const partialUpdateHotelPolicy = async (id, policyData) => {
  try {
    // Đầu tiên lấy dữ liệu hiện tại để đảm bảo đủ các trường
    const currentPolicy = await getHotelPolicy();

    // Kết hợp dữ liệu hiện tại với dữ liệu mới cần cập nhật
    const updatedPolicy = {
      maxUser: currentPolicy.maxUser,
      domesticPolicy: currentPolicy.domesticPolicy,
      foreignPolicy: currentPolicy.foreignPolicy,
      surchargePolicy: currentPolicy.surchargePolicy,
      ...policyData, // Ghi đè các giá trị mới
    };

    console.log("Sending full policy data:", updatedPolicy);

    const response = await fetch(`${API_URL}/policy/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPolicy),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Lỗi khi cập nhật quy định (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật quy định khách sạn:", error);
    throw error;
  }
};

/**
 * Khôi phục quy định về giá trị mặc định
 * @returns {Promise} Promise kèm dữ liệu quy định mặc định
 */
export const resetHotelPolicy = async () => {
  try {
    const response = await fetch(`${API_URL}/policy/reset`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Lỗi khi khôi phục quy định mặc định: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi khôi phục quy định mặc định:", error);
    throw error;
  }
};
