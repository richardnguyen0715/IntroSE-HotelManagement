import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegulation } from "./RegulationContext";
import "../App.css";
import "./Feature6.css";

const Feature6Main = () => {
  const { loading, error } = useRegulation();
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

  if (loading) {
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
          <div className="loading">Đang tải dữ liệu quy định...</div>
        </main>
      </div>
    );
  }

  if (error) {
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
          <div className="error">Lỗi: {error}</div>
        </main>
      </div>
    );
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
          <h2>Thiết lập quy định</h2>
          <Link to="/HomePage" className="back-button">
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
