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
      </main>

    </div>
  );
}

export default Feature5;