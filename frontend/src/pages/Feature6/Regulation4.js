import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../Feature6/Feature6.css";

const API_URL = "http://localhost:5000/api";

const Regulation4 = () => {
  const [formData, setFormData] = useState({ extraGuestSurcharge: "25.0" });
  const [foreignGuestCoefficient, setForeignGuestCoefficient] = useState(1.5);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [initialFormData, setInitialFormData] = useState({
    extraGuestSurcharge: "25.0",
  });
  const { userInfo, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Lấy dữ liệu quy định khi component được mount
  const fetchPolicy = useCallback(async () => {
    try {
      const token = userInfo.token;
      const res = await fetch(`${API_URL}/policy`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Không thể tải dữ liệu quy định");
      const data = await res.json();
      
      const surcharge = (data.surchargePolicy * 100).toFixed(1);
      setFormData({
        extraGuestSurcharge: surcharge,
      });
      setInitialFormData({ extraGuestSurcharge: surcharge });
      setForeignGuestCoefficient(data.foreignPolicy || 1.5);
    } catch (err) {
      setError(err.message);
    }
  }, [userInfo.token]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(formData.extraGuestSurcharge);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      alert("Vui lòng nhập một số hợp lệ từ 0-100.");
      return;
    }

    const token = userInfo.token;
    try {
      await fetch(`${API_URL}/policy/field/surchargePolicy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fieldValue: parsed / 100 }),
      });
      alert("Cập nhật quy định phụ thu thành công!");
      setFormData({ extraGuestSurcharge: parsed.toFixed(1) });
      setEditMode(false);
    } catch (error) {
      alert(`Lỗi khi cập nhật: ${error.message}`);
    }
  };

  // Hàm hủy bỏ chỉnh sửa
  const handleCancel = () => {
    setFormData(initialFormData);
    setEditMode(false);
  };


  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <Link to="/HomePage">
            <h1>HotelManager</h1>
          </Link>
        </div>

        <div className="header-right">
          <Link to="/about">Về chúng tôi</Link>
          <img
            src="/icons/VietnamFlag.png"
            alt="Vietnam Flag"
            className="flag"
          />
          <div className="user-menu">
            <div
              className="user-avatar"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="/icons/User.png" alt="User" />
            </div>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h3>Thông tin người dùng</h3>
                  <p>Họ tên: {userInfo?.name}</p>
                  <p>Email: {userInfo?.email}</p>
                  <p>Vai trò: {userInfo?.role}</p>
                </div>
                <button className="logout-button" onClick={logout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Quy định 4</h2>
          <Link to="/feature6" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="regulation-container">
          <div className="regulation-header">
            <h3>Quy định 4: Phụ thu theo số lượng khách và khách nước ngoài</h3>
          </div>

          <form onSubmit={handleSubmit} className="surcharge-form">
            <p className="regulation-summary">
              Đơn giá phòng cho 2 khách. Khách thứ 3 phụ thu theo tỷ lệ dưới
              đây. Phòng có khách nước ngoài (chỉ cần có 1 người) được nhân với
              hệ số 1.5
            </p>

            <div className="regulation-section">
              <div className="form-group">
                <label>Tỷ lệ phụ thu khách thứ 3 trở đi:</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="extraGuestSurcharge"
                    value={formData.extraGuestSurcharge}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                  <span className="input-suffix">%</span>
                </div>
                <p className="regulation-description">
                  Khách thứ 3 trở đi sẽ bị tính thêm phụ phí theo tỷ lệ này so
                  với giá phòng tiêu chuẩn.
                </p>
              </div>

              <div className="form-group">
                <label>Hệ số khách nước ngoài:</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="foreignGuestCoefficient"
                    value={foreignGuestCoefficient.toFixed(1)}
                    disabled
                    className="disabled-input"
                  />
                  <span className="input-suffix">x</span>
                </div>
                <p className="regulation-description">
                  Phòng có khách nước ngoài sẽ được tính giá theo hệ số này. Hệ
                  số này được thiết lập trong quy định về loại khách.
                </p>
              </div>
            </div>

            <div className="button-container">
              {!editMode ? (
                <button
                  type="button"
                  className="action-button edit"
                  onClick={() => setEditMode(true)}
                >
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className="save-button">
                    Xác nhận
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Regulation4;
