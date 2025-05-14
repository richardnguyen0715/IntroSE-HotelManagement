import { Link } from 'react-router-dom';
import './App.css';

function Feature5() {
  return (
    <div className="app">
      
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Lập Báo cáo tháng</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>

        <div className="function-grid_2">
  
          <Link to="/report1" className="function-item">
            <img src="/icons/Money.png" alt="Báo cáo doanh thu theo loại phòng" />
            <p>BÁO CÁO DOANH THU<br></br>THEO LOẠI PHÒNG</p>
          </Link>

          <Link to="/report2" className="function-item">
            <img src="/icons/Clock.png" alt="Báo cáo mật độ sử dụng phòng" />
            <p>BÁO CÁO MẬT ĐỘ<br></br>SỬ DỤNG PHÒNG</p>
          </Link>

        </div>
      </main>

    </div>
  );
}

export default Feature5;