import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRegulation } from "../Feature6/RegulationContext";
import "../Feature6/Feature6.css";

const Regulation2 = () => {
  const {
    customerTypes,
    maxCustomers,
    updateCustomerTypes,
    updateMaxCustomers,
    loading,
    error,
  } = useRegulation();
  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [maxCustomersValue, setMaxCustomersValue] = useState(3);
  const [editingCustomerTypes, setEditingCustomerTypes] = useState([]);

  // Khởi tạo dữ liệu khi component mount
  useEffect(() => {
    setMaxCustomersValue(maxCustomers);
    setEditingCustomerTypes(JSON.parse(JSON.stringify(customerTypes))); // Deep copy
  }, [maxCustomers, customerTypes]);

  // Xử lý thay đổi số khách tối đa
  const handleMaxCustomersChange = (e) => {
    setMaxCustomersValue(parseInt(e.target.value));
  };

  // Xử lý thay đổi hệ số loại khách
  const handleCoefficientChange = (id, value) => {
    const updatedTypes = editingCustomerTypes.map((type) =>
      type.id === id ? { ...type, coefficient: parseFloat(value) } : type
    );
    setEditingCustomerTypes(updatedTypes);
  };

  // Xử lý lưu thay đổi
  const handleSave = async () => {
    try {
      // Validate đầu vào
      if (maxCustomersValue < 1 || maxCustomersValue > 10) {
        alert("Số khách tối đa phải từ 1-10 người/phòng");
        return;
      }

      for (const type of editingCustomerTypes) {
        if (type.coefficient <= 0) {
          alert(`Hệ số cho ${type.type} phải lớn hơn 0`);
          return;
        }
      }

      console.log("Đang gửi dữ liệu:", {
        maxCustomers: maxCustomersValue,
        customerTypes: editingCustomerTypes,
      });

      await updateMaxCustomers(maxCustomersValue);
      await updateCustomerTypes(editingCustomerTypes);
      setEditMode(false);
      alert("Cập nhật quy định thành công!");
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      alert("Lỗi khi cập nhật quy định: " + (err.message || "Không xác định"));
    }
  };

  // Xử lý hủy thay đổi
  const handleCancel = () => {
    setMaxCustomersValue(maxCustomers);
    setEditingCustomerTypes(JSON.parse(JSON.stringify(customerTypes))); // Deep copy
    setEditMode(false);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <Link to="/">
            <h1>HotelManager</h1>
          </Link>
        </div>

        <nav className="header-right">
          <Link to="/about">Về chúng tôi</Link>
          <img
            src="/icons/VietnamFlag.png"
            alt="Vietnam Flag"
            className="flag"
          />
          <Link to="/register">
            <button className="button-reg">Đăng ký</button>
          </Link>
          <Link to="/login">
            <button className="button-log">Đăng nhập</button>
          </Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Quy định về số lượng khách</h2>
          <Link to="/feature6" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="regulation-container">
          <div className="regulation-header">
            <h3>Quy định 2: Số lượng khách tối đa và hệ số khách</h3>
            {!editMode && (
              <button className="edit-button" onClick={() => setEditMode(true)}>
                Chỉnh sửa
              </button>
            )}
          </div>

          <div className="customer-regulations">
            <div className="regulation-section">
              <h4>Số lượng khách tối đa trong một phòng</h4>
              <div className="max-customers-input">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxCustomersValue}
                  onChange={handleMaxCustomersChange}
                  disabled={!editMode}
                />
                <span className="input-label">người/phòng</span>
              </div>
              <p className="regulation-description">
                Số người tối đa được phép ở trong một phòng. Nếu vượt quá sẽ áp
                dụng phụ thu.
              </p>
            </div>

            <div className="regulation-section">
              <h4>Hệ số loại khách</h4>
              <table className="customer-types-table">
                <thead>
                  <tr>
                    <th>Loại khách</th>
                    <th>Hệ số</th>
                  </tr>
                </thead>
                <tbody>
                  {editMode
                    ? // Edit mode
                      editingCustomerTypes.map((type) => (
                        <tr key={type.id}>
                          <td>{type.type}</td>
                          <td>
                            <input
                              type="number"
                              step="0.1"
                              min="0.1"
                              value={type.coefficient}
                              onChange={(e) =>
                                handleCoefficientChange(type.id, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    : // View mode
                      customerTypes.map((type) => (
                        <tr key={type.id}>
                          <td>{type.type}</td>
                          <td>{type.coefficient}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
              <p className="regulation-description">
                Hệ số này sẽ được nhân với đơn giá thuê phòng tương ứng với từng
                loại khách.
              </p>
            </div>

            {editMode && (
              <div className="button-container">
                <button className="cancel-button" onClick={handleCancel}>
                  Hủy bỏ
                </button>
                <button className="save-button" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Regulation2;
