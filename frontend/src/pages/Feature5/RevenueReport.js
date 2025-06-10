import React, { useState, useEffect } from "react";
import { getRoomTypes, getRoomPrice } from "../../services/rooms";
import { Link } from "react-router-dom";
import { useReports } from "./ReportContext";
import { formatCurrency } from "../../services/reports";
import { useAuth } from "../AuthContext";
import "./Feature5.css";

function RevenueReport() {
  const { userInfo, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [roomTypes, setRoomTypes] = useState([]);
  const { revenueReport, loading, error, fetchRevenueReport } = useReports();

  const [yearMonth, setYearMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // Fetch report when component mounts or year/month changes
  useEffect(() => {
    fetchRevenueReport(yearMonth.year, yearMonth.month);
  }, [yearMonth, fetchRevenueReport]);

  const handleMonthChange = (e) => {
    setYearMonth((prev) => ({ ...prev, month: parseInt(e.target.value) }));
  };

  const handleYearChange = (e) => {
    setYearMonth((prev) => ({ ...prev, year: parseInt(e.target.value) }));
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
    return formatCurrency(getRoomPrice(type, roomTypes));
  };

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

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Báo cáo doanh thu theo loại phòng</h2>
          <Link to="/feature5" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>
      
        <div className="feature-content">
          <h3>Danh sách báo cáo</h3>
          <div className="filter-container-2">
            <div className="filter-group-2">
              <label>Tháng</label>
              <select value={yearMonth.month} onChange={handleMonthChange}>
                {monthOptions}
              </select>
            </div>
            <div className="filter-group-2">
              <label>Năm</label>
              <select value={yearMonth.year} onChange={handleYearChange}>
                {yearOptions}
              </select>
            </div>
          </div>

          <div className="report-container">
            {error && <div className="error-message">{error}</div>}

            {!loading && !revenueReport ? (
              <div className="no-data">
                <p>Không có dữ liệu báo cáo cho thời gian đã chọn.</p>
              </div>
            ) : !loading && revenueReport ? (
              <>
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
                      <th>Tỷ lệ doanh thu (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueReport?.data ? (
                      revenueReport.data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.roomType}</td>
                          <td>{formatPrice(0, item.roomType)}</td>
                          <td>{formatCurrency(item.revenue)}</td>
                          <td>{item.percentage}%</td>
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
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RevenueReport;
