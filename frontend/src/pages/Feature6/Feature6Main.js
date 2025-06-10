import React, { useState } from "react";
import { Link  } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Feature6.css";

const Feature6Main = () => {
  const { userInfo, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
