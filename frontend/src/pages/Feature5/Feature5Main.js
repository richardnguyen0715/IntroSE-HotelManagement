import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";
import "./Feature5.css";

function Feature5Main() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const handleGoBack = () => {
    // Thay vì navigate(-1), dùng đường dẫn rõ ràng đến trang chủ
    navigate("/");
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
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
            <button
              className="button-log"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userInfo");
                setIsLoggedIn(false);
                navigate("/login");
              }}
            >
              Đăng xuất
            </button>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Lập Báo cáo tháng</h2>
          <button onClick={handleGoBack} className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </button>
        </div>

        <div className="reports-container">
          <div className="report-types">
            <Link to="/feature5/revenue" className="report-type">
              <div className="report-icon">
                <img src="/icons/Money.png" alt="Revenue Report" />
              </div>
              <p>BÁO CÁO DOANH THU THEO LOẠI PHÒNG</p>
            </Link>

            <Link to="/feature5/occupancy" className="report-type">
              <div className="report-icon">
                <img src="/icons/Clock.png" alt="Occupancy Report" />
              </div>
              <p>BÁO CÁO MẬT ĐỘ SỬ DỤNG PHÒNG</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Feature5Main;
