import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RoomProvider, useRooms } from "../Feature1/RoomContext";
import "./Feature3.css";
import "../App.css";
import { getRoomPrice, getRoomTypes } from "../../services/rooms";

// Separate inner component to use context
function Feature3Content() {
  const navigate = useNavigate();
  const [searchRoom, setSearchRoom] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { rooms, loading, error, syncRoomStatusWithBookings } = useRooms();
  const [searchResults, setSearchResults] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]); // Thêm state để lưu roomTypes

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
  // Tải danh sách loại phòng KHI COMPONENT MOUNT (chỉ một lần)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy danh sách loại phòng
        const response = await getRoomTypes();
        if (response && response.data) {
          setRoomTypes(response.data);
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      }

      // Gọi API để đồng bộ trạng thái phòng
      await syncRoomStatusWithBookings();
    };
    fetchData();
  }, []); // Empty dependency array to run only once

  const handleSearch = () => {
    if (!searchRoom) {
      setSearchResults(null);
      return;
    }
    const results = rooms.filter((room) =>
      room.roomNumber.toLowerCase().includes(searchRoom.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const displayRooms = searchResults || rooms;

  // Format giá phòng giống như trong Feature1Main.js
  const formatPrice = (price, type) => {
    if (!price) {
      const calculatedPrice = getRoomPrice(type, roomTypes);
      return calculatedPrice.toLocaleString("vi-VN");
    }
    return price.toLocaleString("vi-VN");
  };

  return (
    <div className="app">
      {/* Header */}
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

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Tra cứu phòng</h2>
          <button onClick={handleGoBack} className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </button>
        </div>

        <div className="search-container">
          <h3 className="section-title">Nhập số phòng</h3>
          <div className="search-input">
            <input
              type="text"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              placeholder="Nhập số phòng..."
            />
            <button className="search-button" onClick={handleSearch}>
              Tra cứu
            </button>
          </div>

          {loading && <div>Đang tải dữ liệu phòng...</div>}
          {error && <div className="error-message">{error}</div>}

          <h3 className="section-title">
            {searchResults ? "Kết quả tra cứu" : "Danh sách các phòng"}
          </h3>
          <table className="room-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Phòng</th>
                <th>Loại phòng</th>
                <th>Đơn giá (VNĐ)</th>
                <th>Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              {displayRooms.map((room, index) => (
                <tr key={room._id || room.id || room.roomNumber || index}>
                  <td>{index + 1}</td>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>{formatPrice(room.price, room.type)}</td>
                  <td>{room.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// Wrapper component that provides the RoomContext
function Feature3() {
  return (
    <RoomProvider>
      <Feature3Content />
    </RoomProvider>
  );
}

export default Feature3;
