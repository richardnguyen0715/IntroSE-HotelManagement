import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/*Header*/}
      <header className="App-header">
        {/* Phần bên trái của header */}
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
        {/* Phần bên phải của header */}
        <nav className="header-right">
          <a href="#about">About Us</a>
          <img src="/icons/VietnamFlag.png" alt="Vietnam Flag" className="flag" width="100" height="auto"/>
          <button className="button-reg">Đăng ký</button>
          <button className="button-log">Đăng nhập</button>
        </nav>
      </header>

      {/* Main Content*/}
      <main className="main-content">
        <h2>Trang chủ</h2>
        <div className="function-grid">
  
          <div className="function-item">
            <img src="/icons/Catalogue.png" alt="Lập danh mục thuê phòng" />
            <p>LẬP DANH MỤC THUÊ PHÒNG</p>
          </div>

          <div className="function-item">
            <img src="/icons/List.png" alt="Lập phiếu thuê phòng" />
            <p>LẬP PHIẾU THUÊ PHÒNG</p>
          </div>

          <div className="function-item">
            <img src="/icons/Find.png" alt="Tra cứu phòng" />
            <p>TRA CỨU PHÒNG</p>
          </div>

          <div className="function-item">
            <img src="/icons/Receipt.png" alt="Lập hóa đơn thanh toán" />
            <p>LẬP HÓA ĐƠN THANH TOÁN</p>
          </div>

          <div className="function-item">
            <img src="/icons/Report.png" alt="Lập báo cáo tháng" />
            <p>LẬP BÁO CÁO THÁNG</p>
          </div>

          <div className="function-item">
            <img src="/icons/Regulation.png" alt="Thay đổi quy định" />
            <p>THAY ĐỔI QUY ĐỊNH</p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
