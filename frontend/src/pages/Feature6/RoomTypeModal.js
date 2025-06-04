import React from "react";
import "./Feature6.css";

const RoomTypeModal = ({
  visible,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
}) => {
  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{isEditing ? "Sửa loại phòng" : "Thêm loại phòng mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Loại phòng:</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Đơn giá (VND):</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseInt(e.target.value) })
              }
              min="0"
              step="1000"
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className="confirm-button">
              {isEditing ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomTypeModal;