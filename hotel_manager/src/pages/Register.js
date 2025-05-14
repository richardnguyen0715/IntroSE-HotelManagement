import { Link } from 'react-router-dom';
import './App.css';

function Register() {
  return (
    <div className="app">
     
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Đăng ký</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>
      </main>

    </div>
  );
}

export default Register;