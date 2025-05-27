import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReports } from "./ReportContext";
import "./Feature5.css";

function OccupancyReport() {
  const navigate = useNavigate();
  const { occupancyReport, loading, error, fetchOccupancyReport } =
    useReports();
  const [yearMonth, setYearMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // Fetch report when component mounts or year/month changes
  useEffect(() => {
    fetchOccupancyReport(yearMonth.year, yearMonth.month);
  }, [yearMonth]);

  const handleGoBack = () => {
    navigate("/feature5");
  };

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
          <Link to="/register">
            <button className="button-reg">Đăng ký</button>
          </Link>
          <Link to="/login">
            <button className="button-log">Đăng nhập</button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Báo cáo mật độ sử dụng phòng</h2>
          <button onClick={handleGoBack} className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </button>
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

          {!loading && !occupancyReport ? (
            <div className="no-data">
              <p>Không có dữ liệu báo cáo cho thời gian đã chọn.</p>
            </div>
          ) : !loading && occupancyReport ? (
            <div className="occupancy-report">
              <h3>
                Tháng {occupancyReport.month}/{occupancyReport.year} -{" "}
                {occupancyReport.monthName}
              </h3>
              <p>Số ngày trong tháng: {occupancyReport.daysInMonth}</p>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Loại phòng</th>
                    <th>Số phòng</th>
                    <th>Ngày sử dụng</th>
                    <th>Tổng ngày có thể sử dụng</th>
                    <th>Mật độ sử dụng (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {occupancyReport.roomTypes.map((item, index) => (
                    <tr key={index}>
                      <td>{item.roomType}</td>
                      <td>{item.roomCount}</td>
                      <td>{item.occupiedDays}</td>
                      <td>{item.totalAvailableDays}</td>
                      <td>{item.occupancyRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default OccupancyReport;
