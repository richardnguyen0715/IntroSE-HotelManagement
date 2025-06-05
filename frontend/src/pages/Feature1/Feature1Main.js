import React, { useState, useEffect } from "react";
import { useRooms } from "./RoomContext";
import { useNavigate } from "react-router-dom";
import RoomForm from "./RoomForm";
import { getRoomPrice, getRoomTypes } from "../../services/rooms";
import "./Feature1.css";

function Feature1Main() {
  const { rooms, deleteRooms, syncRoomStatusWithBookings } = useRooms();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]); // Thêm state để lưu danh sách loại phòng
  const navigate = useNavigate();

  // Tải danh sách loại phòng khi component được mount
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const data = await getRoomTypes();
        console.log("Room types fetched:", data);
        setRoomTypes(data);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
    // Chỉ đồng bộ trạng thái phòng một lần khi component mount
    syncRoomStatusWithBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCheckboxChange = (roomId) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const formatPrice = (price, type) => {
    if (!price) {
      return getRoomPrice(type, roomTypes).toLocaleString("vi-VN");
    }
    return price.toLocaleString("vi-VN");
  };

  const handleDelete = async () => {
    if (selectedRooms.length === 0) return;

    // Kiểm tra xem có phòng nào đang occupied không
    const selectedRoomsData = rooms.filter((room) =>
      selectedRooms.includes(room._id)
    );

    const occupiedRooms = selectedRoomsData.filter(
      (room) => room.status === "occupied"
    );

    if (occupiedRooms.length > 0) {
      const occupiedRoomNumbers = occupiedRooms
        .map((room) => room.roomNumber)
        .join(", ");
      alert(
        `Không thể xóa các phòng đang được sử dụng: ${occupiedRoomNumbers}`
      );
      return;
    }

    // Nếu tất cả phòng đều available, tiến hành xóa
    if (window.confirm("Bạn có chắc chắn muốn xóa các phòng đã chọn?")) {
      const result = await deleteRooms(selectedRooms);
      if (result) {
        setSelectedRooms([]);
      }
    }
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  // const handleEdit = () => {
  //   if (selectedRooms.length !== 1) return;

  //   const roomToEdit = rooms.find((room) => room._id === selectedRooms[0]);
  //   if (roomToEdit) {
  //     setEditingRoom(roomToEdit);
  //     setShowForm(true);
  //   }
  // };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleBooking = () => {
    if (selectedRooms.length === 0) return;

    const selectedRoomsData = rooms.filter((room) =>
      selectedRooms.includes(room._id)
    );

    const unavailableRooms = selectedRoomsData.filter(
      (room) => room.status !== "available"
    );
    if (unavailableRooms.length > 0) {
      alert(
        `Không thể đặt phòng: ${unavailableRooms
          .map((r) => r.roomNumber)
          .join(", ")} không khả dụng.`
      );
      return;
    }

    navigate("/feature2", {
      state: {
        selectedRooms: selectedRooms,
        roomNumbers: selectedRoomsData.map((room) => room.roomNumber),
        roomTypes: selectedRoomsData.map((room) => room.type),
        selectedRoomsData: selectedRoomsData,
      },
    });
  };

  return (
    <div className="feature-content">
      <h3>Danh sách các phòng</h3>

      <div className="table-section">
        <table className="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Phòng</th>
              <th>Loại phòng</th>
              <th>Đơn giá</th>
              <th>Số người</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={room._id}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room._id)}
                    onChange={() => handleCheckboxChange(room._id)}
                  />
                  {index + 1}
                </td>
                <td>{room.roomNumber}</td>
                <td>{room.type}</td>
                <td>{formatPrice(room.price, room.type)}</td>
                <td>{room.capacity}</td>
                <td>{room.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-container">
        <button className="action-button add" onClick={handleAdd}>
          Thêm
        </button>

        <button
          className={`action-button delete ${
            selectedRooms.length > 0 ? "clickable" : ""
          }`}
          onClick={handleDelete}
          disabled={selectedRooms.length === 0}
        >
          Xóa
        </button>
        <button
          className={`action-button booking ${
            selectedRooms.length > 0 ? "clickable" : ""
          }`}
          onClick={handleBooking}
          disabled={selectedRooms.length === 0}
        >
          Đặt phòng
        </button>
      </div>

      {showForm && <RoomForm room={editingRoom} onClose={handleCloseForm} />}
    </div>
  );
}

export default Feature1Main;
