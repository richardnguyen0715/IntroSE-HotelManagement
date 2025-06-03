import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./Feature4.css";

function Feature4Add() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
        customer: '',
        address: '',
        rooms: [{ roomNumber: '', roomType: '', days: '', price: '' }]
    });

    useEffect(() => {
        // Kiểm tra token theo thứ tự ưu tiên
        let token = localStorage.getItem("token");
        let savedUserInfo = localStorage.getItem("userInfo");
    
        // Nếu không có trong localStorage, kiểm tra sessionStorage
        if (!token) {
            token = sessionStorage.getItem("token");
            savedUserInfo = sessionStorage.getItem("userInfo");
        }
    
        if (!token) {
            // Nếu không có token ở cả 2 nơi -> chuyển về login
            navigate("/login", { replace: true });
            return;
        }
    
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);
    
    const handleLogout = () => {
        // Xóa token và userInfo ở cả localStorage và sessionStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userInfo");
        navigate("/login", { replace: true });
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newRooms = [...formData.rooms];
        newRooms[index] = {
            ...newRooms[index],
            [name]: value
        };
        setFormData({ ...formData, rooms: newRooms });
    };

    const addRoom = () => {
        setFormData({
            ...formData,
            rooms: [...formData.rooms, { roomNumber: '', roomType: '', days: '', price: '' }]
        });
    };

    const removeRoom = (index) => {
        const newRooms = formData.rooms.filter((_, i) => i !== index);
        setFormData({ ...formData, rooms: newRooms });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBill = {
            id: Date.now(),
            customer: formData.customer,
            address: formData.address,
            status: 'unpaid',
            totalAmount: formData.rooms.reduce((sum, room) => sum + room.days * room.price, 0).toLocaleString('vi-VN') + ' VND',
            rooms: formData.rooms
        };
        // Assuming setBills is a state or prop that manages bills
        // Replace this with the actual state management logic
        // For example:
        // setBills((prevBills) => [...prevBills, newBill]);
        navigate('/feature4');
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-left">
                    <h1>HotelManager</h1>
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
                                <button className="logout-button" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Thêm hóa đơn mới</h2>
                    <Link to="/feature4" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bill-form">
                    <div className="form-group">
                        <label>Khách hàng/Cơ quan:</label>
                        <input
                            type="text"
                            name="customer"
                            value={formData.customer}
                            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                    </div>

                    <div className="rooms-section">
                        <h3>Thông tin phòng</h3>
                        {formData.rooms.map((room, index) => (
                            <div key={index} className="room-inputs">
                                <div className="form-group">
                                    <label>Số phòng:</label>
                                    <input
                                        type="text"
                                        name="roomNumber"
                                        value={room.roomNumber}
                                        onChange={(e) => handleInputChange(e, index)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Loại phòng:</label>
                                    <input
                                        type="text"
                                        name="roomType"
                                        value={room.roomType}
                                        onChange={(e) => handleInputChange(e, index)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số ngày thuê:</label>
                                    <input
                                        type="number"
                                        name="days"
                                        value={room.days}
                                        onChange={(e) => handleInputChange(e, index)}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Đơn giá (VND):</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={room.price}
                                        onChange={(e) => handleInputChange(e, index)}
                                        min="0"
                                        required
                                    />
                                </div>
                                {formData.rooms.length > 1 && (
                                    <button type="button" onClick={() => removeRoom(index)}>
                                        Xóa phòng
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addRoom}>
                            + Thêm phòng
                        </button>
                    </div>

                    <button type="submit" className="submit-button">
                        Thêm hóa đơn
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Feature4Add;