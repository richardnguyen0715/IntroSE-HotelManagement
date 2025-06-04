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
  const [formData, setFormData] = useState({ id: null, type: "", price: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Các state để quản lý thông tin người dùng và trạng thái hiển thị dropdown
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra token và thông tin người dùng khi component được mount
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const savedUserInfo =
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, [navigate]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login");
  };

  // Hàm lấy danh sách loại phòng từ API
  const fetchRoomTypes = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await fetch(`${API_URL}/roomtypes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      });
      if (!res.ok) throw new Error("Không thể tải dữ liệu loại phòng");
      const data = await res.json();
      setRoomTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // Hàm xử lý chọn loại phòng
  const handleRoomTypeSelection = (roomTypeId) => {
    setSelectedRoomTypes((prev) =>
      prev.includes(roomTypeId)
        ? prev.filter((id) => id !== roomTypeId)
        : [...prev, roomTypeId]
    );
  };

  // Hàm xử lý thêm phòng
  const handleAddRoomType = () => {
    setIsEditing(false);
    setFormData({ id: null, type: "", price: 0 });
    setShowForm(true);
  };

  // Hàm xử lý sửa loại phòng
  const handleEditRoomType = () => {
    if (selectedRoomTypes.length === 1) {
      const roomType = roomTypes.find((rt) => rt._id === selectedRoomTypes[0]);
      setIsEditing(true);
      setFormData({
        id: roomType._id,
        type: roomType.type,
        price: roomType.price,
      });
      setShowForm(true);
    }
  };

  // Hàm xử lý xóa loại phòng
  const handleDeleteRoomType = async () => {
    if (
      selectedRoomTypes.length > 0 &&
      window.confirm("Bạn có chắc chắn muốn xóa các loại phòng đã chọn?")
    ) {
      // Kiểm tra token trước khi thực hiện xóa
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để tiếp tục");
        return;
      }

      let errorMessages = []; // Danh sách các lỗi nếu có

      // Gửi yêu cầu xóa từng loại phòng đã chọn
      for (const id of selectedRoomTypes) {
        const room = roomTypes.find((rt) => rt._id === id);
        if (!room) continue;

        try {
          const response = await fetch(`${API_URL}/roomtypes/${room.type}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Thêm token vào headers
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            errorMessages.push(
              `Xóa loại phòng "${room.type}" thất bại: ${
                errorData.message || "Lỗi không xác định"
              }`
            );
          } else {
            console.log(`Loại phòng "${room.type}" đã được xóa thành công.`);
          }
        } catch (error) {
          errorMessages.push(
            `Lỗi khi xóa loại phòng "${room.type}": ${error.message}`
          );
        }
      }

      if (errorMessages.length > 0) {
        alert(errorMessages.join("\n"));
      } else {
        alert("Xóa loại phòng thành công!");
      }

      // Tải lại danh sách phòng dù có lỗi hay không
      await fetchRoomTypes();
      setSelectedRoomTypes([]);
    }
  };

  // Hàm xử lý gửi form
  const handleSubmit = async () => {
    const isDuplicate = roomTypes.some(
      (rt) =>
        rt.type.toLowerCase() === formData.type.toLowerCase() &&
        (!isEditing || rt._id !== formData.id)
    );
    if (isDuplicate) {
      alert("Loại phòng này đã tồn tại!");
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để tiếp tục");
      return;
    }

    if (isEditing) {
      await fetch(`${API_URL}/roomtypes/${formData.type}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: formData.price }),
      });
    } else {
      await fetch(`${API_URL}/roomtypes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: formData.type, price: formData.price }),
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
          <img
            src="/icons/VietnamFlag.png"
            alt="Vietnam Flag"
            className="flag"
          />

          <div className="user-menu">
            <div
              className="user-avatar"
              onClick={() => setShowUserDropdown((prev) => !prev)}
            >
              <img src="/icons/User.png" alt="User" />
            </div>

            {showUserDropdown && userInfo && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h3>Thông tin người dùng</h3>
                  <p>Họ tên: {userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>Vai trò: {userInfo.role}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
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
            <button
              className="action-button add clickable"
              onClick={handleAddRoomType}
            >
              THÊM
            </button>
            <button
              className={`action-button edit ${
                selectedRoomTypes.length === 1 ? "clickable" : "disabled"
              }`}
              onClick={handleEditRoomType}
              disabled={selectedRoomTypes.length !== 1}
            >
              SỬA
            </button>
            <button
              className={`action-button delete ${
                selectedRoomTypes.length > 0 ? "clickable" : "disabled"
              }`}
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
