import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Feature6.css';

const RoomTypeForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roomType: '',
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý lưu dữ liệu
        navigate('/feature6/regulation1');
    };

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
                    <Link to="/register">
                        <button className="button-reg">Đăng ký</button>
                    </Link>
                    <Link to='/login'>
                        <button className="button-log">Đăng nhập</button>
                    </Link>
                </nav>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Thêm loại phòng</h2>
                    <Link to="/feature6/regulation1" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit} className="room-type-form">
                        <div className="form-group">
                            <label>Loại phòng:</label>
                            <input
                                type="text"
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                placeholder="Nhập loại phòng (A-Z)"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Đơn giá (VND):</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Nhập đơn giá"
                                min="0"
                                required
                            />
                        </div>

                        <div className="actions-container">
                            <Link to="/feature6/regulation1">
                                <button type="button" className="action-button delete">
                                    Hủy
                                </button>
                            </Link>
                            <button type="submit" className="action-button add">
                                Thêm
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default RoomTypeForm; 