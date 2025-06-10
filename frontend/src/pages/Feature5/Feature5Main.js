import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import "../App.css";
import "./Feature5.css";

function Feature5Main() {
  const { userInfo, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                <button className="logout-button" onClick={logout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Lập Báo cáo tháng</h2>
          <Link to="/HomePage" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="function-grid_2">
  
          <Link to="/feature5/revenue" className="function-item">
            <img src="/icons/Money.png" alt="Báo cáo doanh thu theo loại phòng" />
            <p>BÁO CÁO DOANH THU<br></br>THEO LOẠI PHÒNG</p>
          </Link>

          <Link to="/feature5/occupancy" className="function-item">
            <img src="/icons/Clock.png" alt="Báo cáo mật độ sử dụng phòng" />
            <p>BÁO CÁO MẬT ĐỘ<br></br>SỬ DỤNG PHÒNG</p>
          </Link>

        </div>
      </main>
    </div>
  );
}

export default Feature5Main;
