import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RoomProvider } from "./RoomContext";
import { useAuth } from "../AuthContext";
import Feature1Main from "./Feature1Main";
import "../App.css";
import "./Feature1.css";


function Feature1() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userInfo, logout } = useAuth();
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
          <h2>Quản lý phòng</h2>
          <Link to="/HomePage" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <RoomProvider>
          <Feature1Main />
        </RoomProvider>
      </main>
    </div>
  );
}

export default Feature1;
