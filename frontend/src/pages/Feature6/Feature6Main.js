import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Feature6.css";

const Feature6Main = () => {
  // State lưu trữ thông tin người dùng và trạng thái hiển thị dropdown
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra token và thông tin người dùng khi component được mount
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const savedUserInfo =
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");

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

          <div className="user-menu">
            <div
              className="user-avatar"
              onClick={() => setShowUserDropdown((prev) => !prev)}
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
                <button className="logout-button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Thiết lập quy định</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="function-grid">
          <Link to="regulation1" className="function-item">
            <img src="/icons/Pen.png" alt="Thay đổi quy định 1" />
            <p>THAY ĐỔI QUY ĐỊNH 1</p>
          </Link>

          <Link to="regulation2" className="function-item">
            <img src="/icons/Pen.png" alt="Thay đổi quy định 2" />
            <p>THAY ĐỔI QUY ĐỊNH 2</p>
          </Link>

          <Link to="regulation4" className="function-item">
            <img src="/icons/Pen.png" alt="Thay đổi quy định 4" />
            <p>THAY ĐỔI QUY ĐỊNH 4</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Feature6Main;
