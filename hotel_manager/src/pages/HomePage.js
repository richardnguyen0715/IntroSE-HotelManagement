import { Link } from 'react-router-dom';
import './App.css';


function HomePage() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">

        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
        
        <nav className="header-right">
          <Link to="/about">Về chúng tôi</Link>
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
  
          <Link to="/feature1" className="function-item">
            <img src="/icons/Catalogue.png" alt="Lập danh mục thuê phòng" />
            <p>LẬP DANH MỤC THUÊ PHÒNG</p>
          </Link>

          <Link to="/feature2" className="function-item">
            <img src="/icons/List.png" alt="Lập phiếu thuê phòng" />
            <p>LẬP PHIẾU THUÊ PHÒNG</p>
          </Link>

          <Link to="/feature3" className="function-item">
            <img src="/icons/Find.png" alt="Tra cứu phòng" />
            <p>TRA CỨU PHÒNG</p>
          </Link>

          <Link to="/feature4" className="function-item">
            <img src="/icons/Receipt.png" alt="Lập hóa đơn thanh toán" />
            <p>LẬP HÓA ĐƠN THANH TOÁN</p>
          </Link>

          <Link to="/feature5" className="function-item">
            <img src="/icons/Report.png" alt="Lập báo cáo tháng" />
            <p>LẬP BÁO CÁO THÁNG</p>
          </Link>

          <Link to="/feature6" className="function-item">
            <img src="/icons/Regulation.png" alt="Thay đổi quy định" />
            <p>THAY ĐỔI QUY ĐỊNH</p>
          </Link>

        </div>
      </main>
    </div>
  );
}

export default HomePage;