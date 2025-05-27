import { createContext, useState, useContext, useEffect } from "react";
import {
  getRooms,
  addRoom as addRoomAPI,
  updateRoom,
  deleteRoom,
  deleteMultipleRooms,
  getRoomPrice,
} from "../../services/rooms";

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tải dữ liệu phòng khi component được mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Hàm lấy danh sách phòng
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRooms();
      setRooms(response.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleFocus = () => {
      fetchRooms();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
  const validateRoom = (room) => {
    // Kiểm tra số phòng (không được để trống)
    if (!room.roomNumber?.trim()) {
      throw new Error("Số phòng không được để trống");
    }

    // Kiểm tra loại phòng (A-Z)
    const roomTypeRegex = /^[A-Z]$/;
    if (!roomTypeRegex.test(room.type)) {
      throw new Error(
        "Loại phòng không hợp lệ. Chỉ chấp nhận một ký tự từ A-Z"
      );
    }

    // Kiểm tra giá phòng (chỉ chứa số và dấu phẩy)
    if (room.price !== undefined) {
      const priceString = room.price.toString();
      const priceRegex = /^[0-9,]+$/;
      if (!priceRegex.test(priceString)) {
        throw new Error("Giá phòng không hợp lệ. Chỉ chấp nhận số và dấu phẩy");
      }
    }
  };

  // Thêm phòng mới
  const addRoom = async (newRoom) => {
    try {
      setLoading(true);
      setError(null);

      validateRoom(newRoom);

      // Kiểm tra số phòng đã tồn tại
      if (rooms.some((room) => room.roomNumber === newRoom.roomNumber)) {
        throw new Error("Số phòng này đã tồn tại");
      }

      // Nếu không nhập giá, tự động lấy giá theo loại phòng
      if (!newRoom.price) {
        newRoom.price = getRoomPrice(newRoom.type);
      }

      // Gọi API thêm phòng
      const response = await addRoomAPI(newRoom);

      // Cập nhật state khi API thành công
      setRooms([...rooms, response.data]);
      return true;
    } catch (error) {
      console.error("Error adding room:", error);
      setError(error.message || "Không thể thêm phòng. Vui lòng thử lại sau.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thông tin phòng
  const editRoom = async (id, updatedRoom) => {
    try {
      setLoading(true);
      setError(null);

      validateRoom(updatedRoom);

      // Kiểm tra số phòng đã tồn tại ở phòng khác
      const hasConflict = rooms.some(
        (room) => room._id !== id && room.roomNumber === updatedRoom.roomNumber
      );

      if (hasConflict) {
        throw new Error("Số phòng này đã tồn tại");
      }

      // Nếu không nhập giá, tự động lấy giá theo loại phòng
      if (!updatedRoom.price) {
        updatedRoom.price = getRoomPrice(updatedRoom._type);
      }

      // Gọi API cập nhật phòng
      const response = await updateRoom(id, updatedRoom);

      // Cập nhật state khi API thành công
      const updatedRooms = rooms.map((room) =>
        room._id === id ? response.data : room
      );

      setRooms(updatedRooms);
      return true;
    } catch (error) {
      console.error("Error updating room:", error);
      setError(
        error.message || "Không thể cập nhật phòng. Vui lòng thử lại sau."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa phòng
  const deleteRooms = async (selectedRooms) => {
    try {
      setLoading(true);
      setError(null);

      if (selectedRooms.length === 0) {
        return true;
      }

      // Xóa một phòng hoặc nhiều phòng
      if (selectedRooms.length === 1) {
        await deleteRoom(selectedRooms[0]);
      } else {
        await deleteMultipleRooms(selectedRooms);
      }

      // Cập nhật state sau khi xóa thành công
      const updatedRooms = rooms.filter(
        (room) => !selectedRooms.includes(room._id)
      );

      setRooms(updatedRooms);
      return true;
    } catch (error) {
      console.error("Error deleting rooms:", error);
      setError("Không thể xóa phòng. Vui lòng thử lại sau.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        loading,
        error,
        fetchRooms,
        addRoom,
        editRoom,
        deleteRooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  return useContext(RoomContext);
}
