// Sử dụng API URL từ file .env
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Lấy danh sách tất cả phòng
 * @returns {Promise} Promise với dữ liệu danh sách phòng
 */
export const getRooms = async () => {
  try {
    const response = await fetch(`${API_URL}/rooms`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting rooms:", error);
    throw error;
  }
};

/**
 * Lấy thông tin của một phòng theo ID
 * @param {string} id ID của phòng
 * @returns {Promise} Promise với dữ liệu phòng
 */
export const getRoomById = async (_id) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${_id}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting room ${_id}:`, error);
    throw error;
  }
};

/**
 * Thêm phòng mới
 * @param {Object} roomData Dữ liệu phòng mới
 * @param {string} roomData.roomNumber Số phòng (bắt buộc)
 * @param {string} roomData.type Loại phòng (A, B hoặc C) (bắt buộc)
 * @param {string} roomData.status Tình trạng phòng (mặc định: available)
 * @param {number} roomData.price Giá phòng theo ngày (có thể tính tự động theo loại phòng)
 * @param {string} roomData.note Ghi chú (tùy chọn)
 * @returns {Promise} Promise với dữ liệu phòng đã tạo
 */
export const addRoom = async (roomData) => {
  try {
    const response = await fetch(`${API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin phòng
 * @param {string} id ID của phòng
 * @param {Object} roomData Dữ liệu phòng cần cập nhật
 * @returns {Promise} Promise với dữ liệu phòng đã cập nhật
 */
// export const updateRoom = async (_id, roomData) => {
//   try {
//     const response = await fetch(`${API_URL}/rooms/${_id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(roomData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || `Error: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(`Error updating room ${_id}:`, error);
//     throw error;
//   }
// };

/**
 * Xóa phòng
 * @param {string} id ID của phòng
 * @returns {Promise} Promise với kết quả xóa
 */
export const deleteRoom = async (_id) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting room ${_id}:`, error);
    throw error;
  }
};

export const deleteMultipleRooms = async (ids) => {
  try {
    // Tạo một mảng các promises cho mỗi lần gọi API xóa phòng
    const deletePromises = ids.map((_id) => deleteRoom(_id));

    // Thực hiện tất cả các promises song song
    await Promise.all(deletePromises);

    return {
      status: "success",
      message: `Đã xóa ${ids.length} phòng thành công`,
    };
  } catch (error) {
    console.error("Error deleting multiple rooms:", error);
    throw error;
  }
};

/**
 * Xóa nhiều phòng
 * @param {Array} ids Mảng ID các phòng cần xóa
 * @returns {Promise} Promise với kết quả xóa
 */
export const getRoomTypes = async () => {
  try {
    const response = await fetch(`${API_URL}/roomTypes`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về danh sách room types
  } catch (error) {
    console.error("Error getting room types:", error);
    throw error;
  }
};

export const getRoomPrice = (roomType, roomTypes) => {
  if (!Array.isArray(roomTypes) || roomTypes.length === 0) {
    console.warn("Room types data is not available or invalid:", roomTypes);
    return 0;
  }

  const roomTypeData = roomTypes.find((type) => type.type === roomType);

  if (!roomTypeData) {
    console.warn(`Room type "${roomType}" not found:`, roomTypes);
    return 0;
  }

  return roomTypeData.price;
};
