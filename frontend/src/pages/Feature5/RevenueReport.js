import React, { useState, useEffect } from "react";
import { getRoomTypes, getRoomPrice } from "../../services/rooms";
import { Link, useNavigate } from "react-router-dom";
import { useReports } from "./ReportContext";
import "./Feature5.css";
import { formatCurrency } from "../../services/reports";

function RevenueReport() {
  const [roomTypes, setRoomTypes] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { revenueReport, loading, error, fetchRevenueReport } = useReports();
  const [yearMonth, setYearMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userInfo =
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");

    if (token && userInfo) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      // Redirect to login if not logged in
      navigate("/login");
    }
  }, [navigate]);
  // Fetch report when component mounts or year/month changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchRevenueReport(yearMonth.year, yearMonth.month);
    }
  }, [yearMonth, isLoggedIn]);

  const handleGoBack = () => {
    navigate("/feature5");
  };

  const handleMonthChange = (e) => {
    setYearMonth((prev) => ({ ...prev, month: parseInt(e.target.value) }));
  };

  const handleYearChange = (e) => {
    setYearMonth((prev) => ({ ...prev, year: parseInt(e.target.value) }));
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Generate month options
  const monthOptions = [];
  for (let i = 1; i <= 12; i++) {
    monthOptions.push(
      <option key={i} value={i}>
        {new Date(2000, i - 1, 1).toLocaleString("default", { month: "long" })}
      </option>
    );
  }

  // Generate year options (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const data = await getRoomTypes();
        console.log("Room types fetched:", data);
        setRoomTypes(data);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);
  const formatPrice = (price, type) => {
    return getRoomPrice(type, roomTypes).toLocaleString("vi-VN");
  };
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <Link to="/HomePage">
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
      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Báo cáo doanh thu theo loại phòng</h2>
          <Link to="/feature5" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="filter-container">
          <div className="filter-group">
            <label>Tháng:</label>
            <select value={yearMonth.month} onChange={handleMonthChange}>
              {monthOptions}
            </select>
          </div>
          <div className="filter-group">
            <label>Năm:</label>
            <select value={yearMonth.year} onChange={handleYearChange}>
              {yearOptions}
            </select>
          </div>
        </div>

        <div className="reports-container">
          {loading && (
            <div className="loading-message">Đang tải dữ liệu...</div>
          )}
          {error && <div className="error-message">{error}</div>}

          {!loading && !revenueReport ? (
            <div className="no-data">
              <p>Không có dữ liệu báo cáo cho thời gian đã chọn.</p>
            </div>
          ) : !loading && revenueReport ? (
            <div className="revenue-report">
              <div className="report-info">
                <p>
                  <strong>Tháng:</strong> {revenueReport.month}/
                  {revenueReport.year}
                </p>
                <p>
                  <strong>Mã báo cáo:</strong> {revenueReport.reportCode}
                </p>
              </div>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Loại phòng</th>
                    <th>Giá cơ bản</th>
                    <th>Doanh thu</th>
                    <th>Số ngày thuê</th>
                    <th>Tỷ lệ doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueReport?.data ? (
                    revenueReport.data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.roomType}</td>
                        <td>{formatPrice(0, item.roomType)} đ</td>
                        <td>{formatCurrency(item.revenue || 0)}</td>
                        <td>{item.occupiedDays || 0}</td>
                        <td>{item.percentage || 0}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "15px" }}
                      >
                        Không có dữ liệu cho các loại phòng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default RevenueReport;
