import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReports } from "./ReportContext";
import { getRoomTypes, getRoomPrice } from "../../services/rooms";
import "./Feature5.css";

function OccupancyReport() {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { occupancyReport, loading, error, fetchOccupancyReport } =
    useReports();
  const [yearMonth, setYearMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

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
      // Redirect to login if not logged in
      navigate("/login");
    }
  }, [navigate]);
  // Fetch report when component mounts or year/month changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchOccupancyReport(yearMonth.year, yearMonth.month);
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
        // Tạo map để dễ dàng lấy thông tin loại phòng theo mã
        const roomTypeMap = {};
        data.forEach((type) => {
          roomTypeMap[type.type] = type;
        });
        setRoomTypes(roomTypeMap);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  // Nhóm phòng theo loại phòng (lấy chữ cái đầu của roomNumber)
  const groupByRoomType = (rooms) => {
    const grouped = {};

    if (rooms && Array.isArray(rooms)) {
      rooms.forEach((room) => {
        // Lấy loại phòng từ số phòng (ví dụ: 'A01' -> 'A')
        const roomType = room.roomNumber ? room.roomNumber[0] : "Unknown";

        if (!grouped[roomType]) {
          grouped[roomType] = {
            roomType: roomType,
            roomCount: 0,
            occupiedDays: 0,
            totalDays: 0,
            occupancyRate: 0,
          };
        }

        grouped[roomType].roomCount += 1;
        grouped[roomType].occupiedDays += room.daysRented || 0;
      });

      // Tính tỷ lệ sử dụng cho mỗi loại phòng
      const daysInMonth = new Date(
        occupancyReport.year,
        occupancyReport.month,
        0
      ).getDate();

      Object.keys(grouped).forEach((type) => {
        const group = grouped[type];
        group.totalDays = group.roomCount * daysInMonth;
        group.occupancyRate =
          group.totalDays > 0
            ? ((group.occupiedDays / group.totalDays) * 100).toFixed(1)
            : 0;
      });
    }

    return Object.values(grouped);
  };

  // Tính toán các thống kê tổng hợp
  const calculateStats = () => {
    if (!occupancyReport?.data || !Array.isArray(occupancyReport.data)) {
      return {
        totalRooms: 0,
        totalOccupiedDays: 0,
        totalDays: 0,
        overallOccupancyRate: 0,
      };
    }

    const totalRooms = occupancyReport.data.length;
    const totalOccupiedDays = occupancyReport.data.reduce(
      (sum, room) => sum + (room.daysRented || 0),
      0
    );
    const daysInMonth = new Date(
      occupancyReport.year,
      occupancyReport.month,
      0
    ).getDate();
    const totalDays = totalRooms * daysInMonth;
    const overallOccupancyRate =
      totalDays > 0 ? ((totalOccupiedDays / totalDays) * 100).toFixed(1) : 0;

    return {
      totalRooms,
      totalOccupiedDays,
      totalDays,
      overallOccupancyRate,
    };
  };

  const groupedData = occupancyReport?.data
    ? groupByRoomType(occupancyReport.data)
    : [];
  const stats = calculateStats();

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  if (!occupancyReport) {
    return <div className="no-data">Không có dữ liệu báo cáo</div>;
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
          <h2>Báo Cáo Mật Độ Sử Dụng Phòng</h2>
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
        <div className="report-container">
          <div className="report-info">
            <p>
              <strong>Tháng:</strong> {occupancyReport.month}/
              {occupancyReport.year}
            </p>
            <p>
              <strong>Mã báo cáo:</strong> {occupancyReport.reportCode}
            </p>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Loại phòng</th>
                <th>Số lượng phòng</th>
                <th>Số ngày đã thuê</th>
                <th>Tổng số ngày</th>
                <th>Tỷ lệ sử dụng (%)</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.length > 0 ? (
                groupedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.roomType}</td>
                    <td>{item.roomCount}</td>
                    <td>{item.occupiedDays}</td>
                    <td>{item.totalDays}</td>
                    <td>{item.occupancyRate}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "15px" }}
                  >
                    Không có dữ liệu cho các loại phòng
                  </td>
                </tr>
              )}
              <tr className="total-row">
                <td>
                  <strong>Tổng cộng</strong>
                </td>
                <td>
                  <strong>{stats.totalRooms}</strong>
                </td>
                <td>
                  <strong>{stats.totalOccupiedDays}</strong>
                </td>
                <td>
                  <strong>{stats.totalDays}</strong>
                </td>
                <td>
                  <strong>{stats.overallOccupancyRate}%</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default OccupancyReport;
