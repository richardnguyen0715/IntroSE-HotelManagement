import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const API_URL = 'http://localhost:5000/api';

const AddForm = ({ onClose, onSave, initialRooms = [] }) => {
  const { userInfo } = useAuth();
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
    if (formData.rentals.length <= 1) {
      setErrorMsg('Phải có ít nhất một phòng trong hóa đơn!');
      return;
    }
    const newRentals = formData.rentals.filter((_, i) => i !== index);
    setFormData({ ...formData, rentals: newRentals });
    setErrorMsg(null); // Clear any existing error message
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
      const token = userInfo.token;

      const response = await fetch(`${API_URL}/invoices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Thêm token vào headers
        },
        body: JSON.stringify(payload),
      }); 

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi thêm hóa đơn');
      }

      const savedInvoice = await response.json();
      alert('Thêm hóa đơn thành công!');
      onSave(savedInvoice.data);

    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" id="invoice-form" onClick={e => e.stopPropagation()}>
        <h3>THÊM HÓA ĐƠN MỚI</h3>
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        <form onSubmit={handleSubmit}>
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

          <div className="customers-section">
            <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "25px",
                }}
              >
              <h4>Thông tin phòng</h4>
            </div>
            <table className="customer-form-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Số phòng</th>
                  <th>Số ngày thuê</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.rentals.map((rental, index) => (
                  <tr key={index} className="customer-form-row">
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        name="roomNumber"
                        value={rental.roomNumber}
                        onChange={e => handleInputChange(e, index)}
                        required
                        disabled={loading}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        name="numberOfDays"
                        min="1"
                        value={rental.numberOfDays}
                        onChange={e => handleInputChange(e, index)}
                        required
                        disabled={loading}
                      />
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => removeRental(index)}
                        className="remove-button"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    
            <button
              type="button"
              className="add-customer-button"
              onClick={addRental}
              disabled={loading}
            >Thêm phòng
            </button>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button-rental"
              onClick={onClose}
              disabled={loading}
            >
              HỦY
            </button>
            <button
              type="submit"
              className="save-button-rental"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'THÊM HÓA ĐƠN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
