import { Link } from 'react-router-dom';
import './App.css';
import './Login.css';

function ForgotPassword() {
  return (
    <div className="app">
      
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Khôi phục mật khẩu</h2>
          <Link to="/login" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>

        <div className="login-container">
          <div className="login-card">
            <form>
              <div className="form-group_email">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Nhập email khôi phục"/>
              </div>

              <div className="form-group_pass">
                <label htmlFor="password">Mật khẩu mới</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Nhập mật khẩu mới" />
              </div>

              <div className="form-group_pass">
                <label htmlFor="password">Xác nhận mật khẩu</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Nhập lại mật khẩu" />
              </div>

              <button type="submit" className="login-button">
                Khôi phục
              </button>

            </form>
          </div>
        </div>
      </main>

    </div>
  );
}

export default ForgotPassword;