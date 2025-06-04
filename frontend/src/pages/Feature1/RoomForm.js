import React, { useState, useEffect } from "react";
import { useRooms } from "./RoomContext";
import { useRegulation } from "../Feature6/RegulationContext";
import "./Feature1.css";

function RoomForm({ room, onClose }) {
  const { addRoom, editRoom } = useRooms();
  const { maxCustomers } = useRegulation();
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "",
    capacity: 1,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber ?? "",
        type: room.type ?? "",
        capacity: room.capacity ?? 1,
      });
    } else {
      setFormData({
        roomNumber: "",
        type: "",
        capacity: 1,
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Xử lý đặc biệt cho trường capacity
    if (name === "capacity") {
      const capacityValue = parseInt(value, 10);

      // Kiểm tra nếu capacity vượt quá maxCustomers
      if (capacityValue > maxCustomers) {
        setError(
          `Số người không được vượt quá ${maxCustomers} (quy định hiện tại)`
        );
      } else if (isNaN(capacityValue) || capacityValue <= 0) {
        setError("Số người phải là số nguyên dương");
      } else {
        setError("");
      }

      setFormData((prev) => ({
        ...prev,
        capacity: value, // Giữ nguyên giá trị trong input để người dùng có thể chỉnh sửa
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form trước khi submit
    const capacityValue = parseInt(formData.capacity, 10);

    if (isNaN(capacityValue) || capacityValue <= 0) {
      setError("Số người phải là số nguyên dương");
      return;
    }

    if (capacityValue > maxCustomers) {
      setError(`Số người không được vượt quá ${maxCustomers}`);
      return;
    }

    try {
      // Chuyển đổi capacity thành số nguyên
      const roomData = {
        ...formData,
        capacity: capacityValue,
      };

      if (room) {
        editRoom(room._id, roomData);
      } else {
        addRoom(roomData);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{room ? "Sửa Phòng" : "Thêm Phòng Mới"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số Phòng:</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Loại Phòng:</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="A, B, C"
              required
            />
          </div>

          {/* <div className="form-group">
            <label>Đơn Giá:</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="VD: 150,000"
              required
            />
          </div> */}
          <div className="form-group">
            <label>Số người:</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              max={maxCustomers}
              placeholder={`Tối đa ${maxCustomers} người`}
              required
            />
            <small className="form-hint">
              Chú ý: Không được vượt quá {maxCustomers} người (quy định hiện
              tại)
            </small>
          </div>
          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" className="btn-save">
              {room ? "Cập Nhật" : "Thêm"}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomForm;
