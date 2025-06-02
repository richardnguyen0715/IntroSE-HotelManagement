import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoomTypeModal from "./RoomTypeModal";
import "./Feature6.css";

const API_URL = "http://localhost:5000/api";

const Regulation1 = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ id: null, type: "", price: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
    setIsLoggedIn(!!(token && userInfo));
  }, [navigate]);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const res = await fetch(`${API_URL}/roomtypes`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu loại phòng");
      const data = await res.json();
      setRoomTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleRoomTypeSelection = (roomTypeId) => {
    setSelectedRoomTypes(prev =>
      prev.includes(roomTypeId) ? prev.filter(id => id !== roomTypeId) : [...prev, roomTypeId]
    );
  };

  const handleAddRoomType = () => {
    setIsEditing(false);
    setFormData({ id: null, type: "", price: 0 });
    setShowForm(true);
  };

  const handleEditRoomType = () => {
    if (selectedRoomTypes.length === 1) {
      const roomType = roomTypes.find(rt => rt._id === selectedRoomTypes[0]);
      setIsEditing(true);
      setFormData({ id: roomType._id, type: roomType.type, price: roomType.price });
      setShowForm(true);
    }
  };

  const handleDeleteRoomType = async () => {
    if (selectedRoomTypes.length > 0 && window.confirm("Bạn có chắc chắn muốn xóa các loại phòng đã chọn?")) {
      for (const id of selectedRoomTypes) {
        const room = roomTypes.find(rt => rt._id === id);
        if (!room) continue;

        await fetch(`${API_URL}/roomtypes/${room.type}`, {
          method: "DELETE"
        });
      }
      await fetchRoomTypes();
      setSelectedRoomTypes([]);
    }
  };

  const handleSubmit = async () => {
    const isDuplicate = roomTypes.some(rt =>
      rt.type.toLowerCase() === formData.type.toLowerCase() && (!isEditing || rt._id !== formData.id)
    );
    if (isDuplicate) {
      alert("Loại phòng này đã tồn tại!");
      return;
    }

    if (isEditing) {
      await fetch(`${API_URL}/roomtypes/${formData.type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: formData.price })
      });
    } else {
      await fetch(`${API_URL}/roomtypes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: formData.type, price: formData.price })
      });
    }
    setShowForm(false);
    setSelectedRoomTypes([]);
    await fetchRoomTypes();
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

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
          <img src="/icons/VietnamFlag.png" alt="Vietnam Flag" className="flag" />
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
            <button className="button-log" onClick={handleLogout}>Đăng xuất</button>
          )}
        </nav>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Quy định 1</h2>
          <Link to="/feature6" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="regulation-container">
          <h3>Danh sách loại phòng</h3>
          <div className="room-types-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>STT</th>
                  <th>Loại phòng</th>
                  <th>Đơn giá (VND)</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((roomType, index) => (
                  <tr key={roomType._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRoomTypes.includes(roomType._id)}
                        onChange={() => handleRoomTypeSelection(roomType._id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{roomType.type}</td>
                    <td>{roomType.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-container">
            <button className="action-button add clickable" onClick={handleAddRoomType}>THÊM</button>
            <button
              className={`action-button edit ${selectedRoomTypes.length === 1 ? "clickable" : "disabled"}`}
              onClick={handleEditRoomType}
              disabled={selectedRoomTypes.length !== 1}
            >
              SỬA
            </button>
            <button
              className={`action-button delete ${selectedRoomTypes.length > 0 ? "clickable" : "disabled"}`}
              onClick={handleDeleteRoomType}
              disabled={selectedRoomTypes.length === 0}
            >
              XÓA
            </button>
          </div>

          <RoomTypeModal
            visible={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
          />
        </div>
      </main>
    </div>
  );
};

export default Regulation1;