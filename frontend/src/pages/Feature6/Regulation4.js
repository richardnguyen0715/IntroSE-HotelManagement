import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature6.css';

const Regulation4 = () => {
    const [surchargeData, setSurchargeData] = useState({
        thirdGuestRate: 25,
        foreignGuestRate: 1.5
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý lưu dữ liệu
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
                    <h2>Quy định 4: Phụ thu theo số lượng khách</h2>
                    <Link to="/feature6" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="regulation-container">
                    <form onSubmit={handleSubmit}>
                        <div className="info-section">
                            <h3>Quy định về phụ thu</h3>
                            <div className="form-group">
                                <label>Tỷ lệ phụ thu cho khách thứ 3 (%):</label>
                                <input
                                    type="number"
                                    value={surchargeData.thirdGuestRate}
                                    onChange={(e) => setSurchargeData(prev => ({
                                        ...prev,
                                        thirdGuestRate: e.target.value
                                    }))}
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Hệ số phụ thu cho khách nước ngoài:</label>
                                <input
                                    type="number"
                                    value={surchargeData.foreignGuestRate}
                                    onChange={(e) => setSurchargeData(prev => ({
                                        ...prev,
                                        foreignGuestRate: e.target.value
                                    }))}
                                    min="1"
                                    step="0.1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Thông tin áp dụng:</h3>
                            <ul>
                                <li>Phụ thu {surchargeData.thirdGuestRate}% giá phòng cho khách thứ 3</li>
                                <li>Khách nước ngoài được tính với hệ số {surchargeData.foreignGuestRate}</li>
                                <li>Chỉ cần có 1 khách nước ngoài trong phòng</li>
                            </ul>
                        </div>

                        <div className="actions-container">
                            <button type="submit" className="action-button add">
                                Chỉnh sửa
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Regulation4; 