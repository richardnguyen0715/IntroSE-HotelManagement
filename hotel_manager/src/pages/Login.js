import { Link } from 'react-router-dom';
import './App.css';
import './Login.css'; 

function Login() {
  return (
    <div className="app">
      
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Đăng nhập</h2>
          <Link to="/" className="back-button">
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
                  placeholder="Nhập email của bạn"/>
              </div>

              <div className="form-group_pass">
                <label htmlFor="password">Mật khẩu</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Nhập mật khẩu" />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>

              <button type="submit" className="login-button">
                Đăng nhập
              </button>

            </form>
            <div className="forgot-password">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>

            <div className="register">
              <span>Chưa có tài khoản? </span>
              <Link to="/register">Đăng ký ngay</Link>
              
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

export default Login;