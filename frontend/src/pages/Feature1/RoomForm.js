import React, { useState, useEffect } from "react";
import { useRooms } from "./RoomContext";
import "./Feature1.css";

function RoomForm({ room, onClose, roomTypes }) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{room ? "Sửa Phòng" : "THÊM PHÒNG MỚI"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số phòng <span className="required">*</span></label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="Nhập số phòng"
              required
            />
          </div>

          <div className="form-group">
            <label>Loại phòng <span className="required">*</span></label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Chọn loại phòng</option>
              {roomTypes && roomTypes.map((roomType) => (
                <option key={roomType._id} value={roomType.type}>
                  {roomType.type}
                </option>
              ))}
            </select>
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
            <label>Số người <span className="required">*</span></label>
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
            <button type="button" onClick={onClose} className="cancel-button-rental">
              HỦY
            </button>
            <button type="submit" className="save-button-rental">
              {room ? "Cập Nhật" : "THÊM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomForm;
