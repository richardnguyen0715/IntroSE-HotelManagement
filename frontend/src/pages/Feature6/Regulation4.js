import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Feature6/Feature6.css";

const API_URL = "http://localhost:5000/api";

const Regulation4 = () => {
  const [formData, setFormData] = useState({ extraGuestSurcharge: "25.0" });
  const [foreignGuestCoefficient, setForeignGuestCoefficient] = useState(1.5);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialFormData, setInitialFormData] = useState({ extraGuestSurcharge: "25.0" });
  // Các state để quản lý thông tin người dùng và trạng thái hiển thị dropdown
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra token và thông tin người dùng khi component được mount
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const savedUserInfo = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, [navigate]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login");
  };

  // Lấy dữ liệu quy định khi component được mount
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để tiếp tục");
      return;
    }

    // fetch(`${API_URL}/policy`)
    fetch(`${API_URL}/policy`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Thêm token vào header
      }
    })
    .then(res => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu quy định");
        return res.json();
      })
      .then(data => {
        const surcharge = (data.surchargePolicy * 100).toFixed(1);
        setFormData({ extraGuestSurcharge: (data.surchargePolicy * 100).toFixed(1) });
        setInitialFormData({ extraGuestSurcharge: surcharge });
        setForeignGuestCoefficient(data.foreignPolicy || 1.5);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để tiếp tục");
      return;
    }

    try {
      await fetch(`${API_URL}/policy/field/surchargePolicy`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Thêm token vào header
        },
        body: JSON.stringify({ fieldValue: parsed / 100 })
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

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

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
          <img src="/icons/VietnamFlag.png" alt="Vietnam Flag" className="flag" />

          <div className="user-menu">
            <div
              className="user-avatar"
              onClick={() => setShowUserDropdown(prev => !prev)}
            >
              <img src="/icons/User.png" alt="User" />
            </div>

            {showUserDropdown && userInfo && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h3>Thông tin người dùng</h3>
                  <p>Họ tên: {userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>Vai trò: {userInfo.role}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Quy định về phụ thu</h2>
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
              Đơn giá phòng cho 2 khách. Khách thứ 3 phụ thu theo tỷ lệ dưới đây. Phòng có khách nước ngoài (chỉ cần có 1 người) được nhân với hệ số 1.5
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
                  Khách thứ 3 trở đi sẽ bị tính thêm phụ phí theo tỷ lệ này so với giá phòng tiêu chuẩn.
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
                  Phòng có khách nước ngoài sẽ được tính giá theo hệ số này. Hệ số này được thiết lập trong quy định về loại khách.
                </p>
              </div>
            </div>

            <div className="button-container">
              {!editMode ? (
                <button type="button" className="action-button edit" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
              ) : (
                <>
                  <button type="button" className="cancel-button" onClick={handleCancel}>Hủy bỏ</button>
                  <button type="submit" className="save-button">Xác nhận</button>
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
