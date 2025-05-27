import { Link } from 'react-router-dom';
import './App.css';

function Feature3() {
  return (
    <div className="app">
      
      <header className="app-header">
        <div className="header-left">
          <Link to="/HomePage">
            <h1>HotelManager</h1>
          </Link>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Tra cứu phòng</h2>
          <Link to="/HomePage" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>
      </main>

    </div>
  );
}

export default Feature3;