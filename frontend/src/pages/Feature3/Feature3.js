import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RoomProvider, useRooms } from "../Feature1/RoomContext";
import { getRoomPrice, getRoomTypes } from "../../services/rooms";
import { useAuth } from "../AuthContext";
import "../App.css";
import "./Feature3.css";

// Separate inner component to use context
function Feature3Content() {
  const [searchRoom, setSearchRoom] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userInfo, logout } = useAuth();
  const { rooms, loading, error, syncRoomStatusWithBookings } = useRooms();
  const [searchResults, setSearchResults] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]); // Thêm state để lưu roomTypes

  // Tải danh sách loại phòng KHI COMPONENT MOUNT (chỉ một lần)
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
    // Chỉ đồng bộ trạng thái phòng một lần khi component mount
    syncRoomStatusWithBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h2>Tra cứu phòng</h2>
          <Link to="/HomePage" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
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
                <th>Số người</th>
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
                  <td>{room.capacity}</td>
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
