import { Link } from 'react-router-dom';
import './App.css';

function Feature6() {
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
          <h2>Thay đổi quy định</h2>
          <Link to="/HomePage" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>
        <div className="function-grid">
  
          <Link to="regulation1" className="function-item">
            <img src="/icons/Pen.png" alt="Thay đổi quy định 1" />
            <p>THAY ĐỔI QUY ĐỊNH 1</p>
          </Link>

          <Link to="regulation2" className="function-item">
            <img src="/icons/Pen.png" alt="Thay đổi quy định 2" />
            <p>THAY ĐỔI QUY ĐỊNH 2</p>
          </Link>

          <Link to="regulation4" className="function-item">
            <img src="/icons/Pen.png" alt="Thay đổi quy định 4" />
            <p>THAY ĐỔI QUY ĐỊNH 4</p>
          </Link>

        </div>
      </main>

    </div>
  );
}

export default Feature6;