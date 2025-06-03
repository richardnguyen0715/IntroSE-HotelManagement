import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegulation } from "./RegulationContext";
import "./Feature6.css";

const RegulationForm = () => {
  const navigate = useNavigate();
  const {
    maxCustomers,
    surchargeRate,
    customerTypes,
    updateMaxCustomers,
    updateSurchargeRate,
    updateCustomerTypes,
    loading,
    error,
  } = useRegulation();

  const [formData, setFormData] = useState({
    maxCustomers: 3,
    surchargeRate: 0.25,
    foreignCoefficient: 1.5,
  });

  // Khởi tạo dữ liệu từ context khi component mount
  useEffect(() => {
    if (!loading && !error) {
      const foreignType = customerTypes.find((ct) => ct.type === "Nước ngoài");
      setFormData({
        maxCustomers: maxCustomers || 3,
        surchargeRate: surchargeRate || 0.25,
        foreignCoefficient: foreignType?.coefficient || 1.5,
      });
    }
  }, [maxCustomers, surchargeRate, customerTypes, loading, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Cập nhật số khách tối đa
      await updateMaxCustomers(parseInt(formData.maxCustomers));

      // Cập nhật tỷ lệ phụ thu
      await updateSurchargeRate(parseFloat(formData.surchargeRate));

      // Cập nhật hệ số khách nước ngoài
      const updatedCustomerTypes = customerTypes.map((type) => {
        if (type.type === "Nước ngoài") {
          return {
            ...type,
            coefficient: parseFloat(formData.foreignCoefficient),
          };
        }
        return type;
      });
      await updateCustomerTypes(updatedCustomerTypes);

      alert("Cập nhật quy định thành công!");
      navigate("/feature6");
    } catch (error) {
      alert(`Lỗi khi cập nhật: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          <Link to="/HomePage">
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
          <h2>Quy định 4: Phụ thu theo số lượng khách</h2>
          <Link to="/feature6" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <form className="regulation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="maxCustomers">Số khách tối đa trong phòng:</label>
            <input
              type="number"
              id="maxCustomers"
              name="maxCustomers"
              value={formData.maxCustomers}
              onChange={handleChange}
              min="1"
              max="10"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="surchargeRate">
              Tỷ lệ phụ thu khách thứ 3 (thập phân):
            </label>
            <input
              type="number"
              id="surchargeRate"
              name="surchargeRate"
              value={formData.surchargeRate}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
              className="form-input"
            />
            <small>* Ví dụ: 0.25 tương đương với 25%</small>
          </div>

          <div className="form-group">
            <label htmlFor="foreignCoefficient">
              Hệ số phụ thu khách nước ngoài:
            </label>
            <input
              type="number"
              id="foreignCoefficient"
              name="foreignCoefficient"
              value={formData.foreignCoefficient}
              onChange={handleChange}
              min="1"
              step="0.1"
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <Link to="/feature6">
              <button type="button" className="action-button cancel">
                Hủy
              </button>
            </Link>
            <button type="submit" className="action-button confirm">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegulationForm;
