import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RoomProvider } from "./RoomContext";
import Feature1Main from "./Feature1Main";
import "./Feature1.css";

function Feature1() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userInfo =
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");

    if (token && userInfo) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    setIsLoggedIn(false);
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
          {!isLoggedIn ? (
            <>
              <Link to="/register">
                <button className="button-reg">Đăng ký</button>
              </Link>
              <Link to="/login">
                <button className="button-log">Đăng nhập</button>
              </Link>
            </>
          ) : (
            <button className="button-log" onClick={handleLogout}>
              Đăng xuất
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Quản lý phòng</h2>
          <Link to="/" className="back-button">
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
