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
          <button className="button">Đăng ký</button>
          <button className="button">Đăng nhập</button>
        </nav>
      </header>

      {/* Main Content*/}
      <main className="main-content">
        <h2>Trang chủ</h2>
        <div className=".function-grid">
          <div className=".function-item">
            <img src="/icons/Catalogue.png" alt="Lập danh mục thuế phòng" />
            <p>Lập danh mục thuế phòng</p>
          </div>

          <div className=".function-item">
            <img src="/icons/List.png" alt="Lập phiếu thuế phòng" />
            <p>Lập phiếu thuế phòng</p>
          </div>

          <div className=".function-item">
            <img src="/icons/Find.png" alt="Tra cứu phòng" />
            <p>Tra cứu phòng</p>
          </div>

          <div className=".function-item">
            <img src="/icons/Receipt.png" alt="Lập hóa đơn thanh toán" />
            <p>Lập hóa đơn thanh toán</p>
          </div>
          
          <div className=".function-item">
            <img src="/icons/Report.png" alt="Lập báo cáo tháng" />
            <p>Lập báo cáo tháng</p>
          </div>

          <div className=".function-item">
            <img src="/icons/Regulation.png" alt="Thay đổi quy định" />
            <p>Thay đổi quy định</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
