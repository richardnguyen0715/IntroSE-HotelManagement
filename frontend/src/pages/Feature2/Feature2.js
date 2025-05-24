import React from 'react';
import { Link } from 'react-router-dom';
import { RentalProvider } from './RentalContext';
import Feature2Main from './Feature2Main';
import '../App.css';

function Feature2() {
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
                    <h2>Lập Phiếu thuê phòng</h2>
                    <Link to="/" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <RentalProvider>
                    <Feature2Main />
                </RentalProvider>
            </main>
        </div>
    );
}

export default Feature2; 