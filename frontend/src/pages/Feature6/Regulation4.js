import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegulation } from "./RegulationContext";
import "./Feature6.css";

const Regulation4 = () => {
  const { surcharges, updateSurcharge, customerTypes, loading, error } =
    useRegulation();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    extraGuestSurcharge: 28,
  });
  
  const navigate = useNavigate(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Kiểm tra token theo thứ tự ưu tiên
    let token = localStorage.getItem("token");
    let savedUserInfo = localStorage.getItem("userInfo");
  
    // Nếu không có trong localStorage, kiểm tra sessionStorage
    if (!token) {
      token = sessionStorage.getItem("token");
      savedUserInfo = sessionStorage.getItem("userInfo");
    }
  
    if (!token) {
      // Nếu không có token ở cả 2 nơi -> chuyển về login
      navigate("/login", { replace: true });
      return;
    }
  
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  
  const handleLogout = () => {
    // Xóa token và userInfo ở cả localStorage và sessionStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  // Lấy hệ số khách nước ngoài từ customerTypes
  const foreignGuestCoefficient =
    customerTypes.find((ct) => ct.type === "Nước ngoài")?.coefficient || 1.5;

  // Lấy dữ liệu từ context khi component mount
  useEffect(() => {
    if (surcharges) {
      setFormData({
        extraGuestSurcharge: surcharges.extraGuestSurcharge || 25,
      });
    }
  }, [surcharges]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedSurcharge = parseFloat(formData.extraGuestSurcharge);
    if (
      isNaN(parsedSurcharge) ||
      parsedSurcharge < 0 ||
      parsedSurcharge > 100
    ) {
      alert("Vui lòng nhập một số hợp lệ từ 0-100.");
      return;
    }

    try {
      console.log("Đang gửi dữ liệu phụ thu:", parsedSurcharge);
      await updateSurcharge({
        ...surcharges,
        extraGuestSurcharge: parsedSurcharge,
      });
      setEditMode(false);
      alert("Cập nhật quy định phụ thu thành công!");
    } catch (error) {
      alert(`Lỗi khi cập nhật: ${error.message}`);
    }
  };

  const handleCancel = () => {
    // Khôi phục dữ liệu ban đầu từ context
    setFormData({
      extraGuestSurcharge: surcharges.extraGuestSurcharge || 25,
    });
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
          <h1>HotelManager</h1>
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
                <button className="logout-button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
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
            {!editMode && (
              <button
                className="edit-button-small"
                onClick={() => setEditMode(true)}
              >
                Chỉnh sửa
              </button>
            )}
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
                    value={foreignGuestCoefficient}
                    disabled={true} // Luôn disable
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

            {editMode && (
              <div className="button-container">
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
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Regulation4;
