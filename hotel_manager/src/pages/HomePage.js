import { Link } from 'react-router-dom';
import './App.css';


function HomePage() {
  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">

        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
        
        <nav className="header-right">
          <a href="about.html">About Us</a>
          <img src="/icons/VietnamFlag.png" alt="Vietnam Flag" className="flag"/>
          <Link to="/register">
            <button className="button-reg">Đăng ký</button>
          </Link>
          <Link to='/login'>
            <button className="button-log">Đăng nhập</button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h2>Trang chủ</h2>
        <div className="function-grid">
  
          <a href="catalogue.html" className="function-item">
            <img src="/icons/Catalogue.png" alt="Lập danh mục thuê phòng" />
            <p>LẬP DANH MỤC THUÊ PHÒNG</p>
          </a>

          <a href="list.html" className="function-item">
            <img src="/icons/List.png" alt="Lập phiếu thuê phòng" />
            <p>LẬP PHIẾU THUÊ PHÒNG</p>
          </a>

          <a href="find.html" className="function-item">
            <img src="/icons/Find.png" alt="Tra cứu phòng" />
            <p>TRA CỨU PHÒNG</p>
          </a>

          <a href="receipt.html" className="function-item">
            <img src="/icons/Receipt.png" alt="Lập hóa đơn thanh toán" />
            <p>LẬP HÓA ĐƠN THANH TOÁN</p>
          </a>

          <a href="report.html" className="function-item">
            <img src="/icons/Report.png" alt="Lập báo cáo tháng" />
            <p>LẬP BÁO CÁO THÁNG</p>
          </a>

          <a href="regulation.html" className="function-item">
            <img src="/icons/Regulation.png" alt="Thay đổi quy định" />
            <p>THAY ĐỔI QUY ĐỊNH</p>
          </a>

        </div>
      </main>
    </div>
  );
}

export default HomePage;