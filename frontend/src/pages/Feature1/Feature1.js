import React from "react";
import { Link } from "react-router-dom";
import "./Feature1.css";
import { RoomProvider } from "./RoomContext";
import Feature1Main from "./Feature1Main";

const Feature1 = () => {
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
        </nav>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Quản lý phòng</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <RoomProvider>
          <Feature1Main />
        </RoomProvider>
      </main>
    </div>
  );
};

export default Feature1;
