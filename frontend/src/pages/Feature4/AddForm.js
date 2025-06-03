import React, { useState } from 'react';

const AddForm = ({ onClose, onSave, initialRooms = [] }) => {
  const [formData, setFormData] = useState({
    customer: '',
    address: '',
    // rentals: [{ roomNumber: '', numberOfDays: '' }]
    rentals: initialRooms.length > 0
      ? initialRooms.map(roomNumber => ({ roomNumber, numberOfDays: '' }))
      : [{ roomNumber: '', numberOfDays: '' }]
  });

  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newRentals = [...formData.rentals];
    newRentals[index] = { ...newRentals[index], [name]: value };
    console.log(`Input ${name} at index ${index}:`, value);
    setFormData({ ...formData, rentals: newRentals });
  };

  const addRental = () => {
    setFormData({
      ...formData,
      rentals: [...formData.rentals, { roomNumber: '', numberOfDays: '' }]
    });
  };

  const removeRental = (index) => {
    const newRentals = formData.rentals.filter((_, i) => i !== index);
    setFormData({ ...formData, rentals: newRentals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg(null);
    setLoading(true);

    const payload = {
      customer: formData.customer,
      address: formData.address,
      rentals: formData.rentals.map(rental => ({
        roomNumber: rental.roomNumber,
        numberOfDays: parseInt(rental.numberOfDays, 10) || 0,
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi thêm hóa đơn');
      }

      const savedInvoice = await response.json();

      // Lấy đúng phần data trong response
      onSave(savedInvoice.data);

    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Thêm Hóa đơn mới</h2>
        <form onSubmit={handleSubmit} className="bill-form">
          <div className="form-group">
            <label>Khách hàng/Cơ quan:</label>
            <input
              type="text"
              value={formData.customer}
              onChange={e => setFormData({ ...formData, customer: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {/* {errorMsg && <p style={{ color: 'red', marginBottom: '1em' }}>{errorMsg}</p>} */}

          <div className="rooms-section">
            <h3>Thông tin phòng</h3>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            {formData.rentals.map((rental, index) => (
              <div key={index} className="room-inputs">
                <div className="form-group">
                  <label>Số phòng:</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={rental.roomNumber}
                    onChange={e => handleInputChange(e, index)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Số ngày thuê:</label>
                  <input
                    type="number"
                    name="numberOfDays"
                    min="1"
                    value={rental.numberOfDays}
                    onChange={e => handleInputChange(e, index)}
                    required
                    disabled={loading}
                  />
                </div>
                {formData.rentals.length > 1 && (
                  <button
                    type="button"
                    className="action-button delete small"
                    onClick={() => removeRental(index)}
                    disabled={loading}
                  >
                    Xóa phòng
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="action-button add small"
              onClick={addRental}
              disabled={loading}
            >
              + Thêm phòng
            </button>
          </div>

          <div className="actions-container">
            <button
              type="button"
              className="action-button delete"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="action-button add"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Thêm hóa đơn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
