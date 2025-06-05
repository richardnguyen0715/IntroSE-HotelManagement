import React, { useState, useEffect } from "react";
import { useRooms } from "./RoomContext";
//import { useRegulation } from "../Feature6/RegulationContext";
import "./Feature1.css";

function RoomForm({ room, onClose }) {
  const { addRoom, editRoom } = useRooms();
  const [maxCustomers, setMaxCustomers] = useState(4);
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "",
    capacity: 1,
  });

  useEffect(() => {
    const fetchMaxCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/policy/");
        const data = await response.json();
        setMaxCustomers(data.maxCapacity || 4);
      } catch (error) {
        console.error("Error fetching maxCustomers:", error);
      }
    };

    fetchMaxCustomers();
  }, []);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
      };

      if (room) {
        editRoom(room._id, roomData);
      } else {
        addRoom(roomData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{room ? "Sửa Phòng" : "Thêm Phòng Mới"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số phòng</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Loại phòng</label>
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
            <label>Số người</label>
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
              Chú ý: Không được vượt quá {maxCustomers} người (quy định hiện tại)
            </small>
          </div>

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
