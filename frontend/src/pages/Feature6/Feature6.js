import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./Feature6.css";

function Feature6() {
  const regulations = [
    {
      id: 1,
      title: "QUY ĐỊNH 1",
      path: "/feature6/regulation1",
      icon: "/icons/Regulation.png",
    },
    {
      id: 2,
      title: "QUY ĐỊNH 2",
      path: "/feature6/regulation2",
      icon: "/icons/Regulation.png",
    },
    {
      id: 4,
      title: "QUY ĐỊNH 4",
      path: "/feature6/regulation4",
      icon: "/icons/Regulation.png",
    },
  ];

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
          <Link to="/register">
            <button className="button-reg">Đăng ký</button>
          </Link>
          <Link to="/login">
            <button className="button-log">Đăng nhập</button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Thay đổi quy định</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="regulations-grid">
          {regulations.map((regulation) => (
            <Link
              key={regulation.id}
              to={regulation.path}
              className="regulation-card"
            >
              <img src={regulation.icon} alt={regulation.title} />
              <h3>{regulation.title}</h3>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Feature6;
