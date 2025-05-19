import { Link } from 'react-router-dom';
import '../App.css';

function Feature6b() {
  return (
    <div className="app">
      
      <header className="app-header">
        <div className="header-left">
          <Link to="/">
            <h1>HotelManager</h1>
          </Link>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Thay đổi quy định 2</h2>
          <Link to="/feature6" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>
      </main>

    </div>
  );
}

export default Feature6b;