import React from 'react';
import { Link } from 'react-router-dom';
import './Feature6.css';

const Feature6Main = () => {
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
                    <h2>Thiết lập quy định</h2>
                    <Link to="/" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="regulations-container">
                    <div className="regulations-grid">
                        <Link to="/feature6/regulation1" className="regulation-card">
                            <div className="card-icon">
                                <img src="/icons/pen-rule.png" alt="Quy định 1" />
                            </div>
                            <div className="card-content">
                                <h3>Quy định về các loại phòng</h3>
                                <p>Thiết lập và quản lý các loại phòng khác nhau trong khách sạn</p>
                            </div>
                        </Link>

                        <Link to="/feature6/regulation2" className="regulation-card">
                            <div className="card-icon">
                                <img src="/icons/pen-rule.png" alt="Quy định 2" />
                            </div>
                            <div className="card-content">
                                <h3>Quy định về số lượng khách</h3>
                                <p>Quy định số lượng khách tối đa cho mỗi loại phòng</p>
                            </div>
                        </Link>

                        <Link to="/feature6/regulation4" className="regulation-card">
                            <div className="card-icon">
                                <img src="/icons/pen-rule.png" alt="Quy định 4" />
                            </div>
                            <div className="card-content">
                                <h3>Quy định về phụ thu</h3>
                                <p>Thiết lập các quy định về phụ thu theo số lượng khách và khách nước ngoài</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feature6Main; 