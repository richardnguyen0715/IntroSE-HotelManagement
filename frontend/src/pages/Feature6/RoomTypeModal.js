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
    <div className="modal-overlay">
      <div className="modal-content regulation-modal-content">
        <h3>{isEditing ? "SỬA LOẠI PHÒNG" : "THÊM LOẠI PHÒNG MỚI"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Loại phòng <span className="required">*</span></label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              disabled={isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Đơn giá (VNĐ) <span className="required">*</span></label>
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
          <div className="button-group">
            <button type="button" className="cancel-button-rental" onClick={onClose}>
              HỦY
            </button>
            <button type="submit" className="save-button-rental">
              {isEditing ? "CẬP NHẬT" : "THÊM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomTypeModal;
