import React, { useState } from "react";
import { useRooms } from "./RoomContext";
import { useNavigate } from "react-router-dom";
import RoomForm from "./RoomForm";
import "./Feature1.css";
import { getRoomPrice } from "../../services/rooms";

function Feature1Main() {
  const { rooms, deleteRooms } = useRooms();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (roomId) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toLocaleString("vi-VN");
  };

  const handleDelete = () => {
    if (selectedRooms.length === 0) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa các phòng đã chọn?")) {
      deleteRooms(selectedRooms);
      setSelectedRooms([]);
    }
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    if (selectedRooms.length !== 1) return;

    const roomToEdit = rooms.find((room) => room._id === selectedRooms[0]);
    if (roomToEdit) {
      setEditingRoom(roomToEdit);
      setShowForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRoom(null);
  };
  // Trong hàm handleBooking:

  const handleBooking = () => {
    if (selectedRooms.length === 0) return;

    // Lấy thông tin đầy đủ của các phòng đã chọn
    const selectedRoomsData = rooms.filter((room) =>
      selectedRooms.includes(room._id)
    );

    // Kiểm tra trạng thái phòng
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

    // Truyền thông tin phòng đầy đủ
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
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={room._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room._id)}
                    onChange={() => handleCheckboxChange(room._id)}
                  />
                  {index + 1}
                </td>
                <td>{room.roomNumber}</td>
                <td>{room.type}</td>
                <td>{formatPrice(room.price || getRoomPrice(room.type))}</td>
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
          className={`action-button edit ${
            selectedRooms.length === 1 ? "clickable" : "disabled"
          }`}
          onClick={handleEdit}
          disabled={selectedRooms.length !== 1}
        >
          Sửa
        </button>
        <button
          className="action-button delete"
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
