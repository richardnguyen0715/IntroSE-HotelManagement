import { Link } from 'react-router-dom';
import './App.css';
import './Register.css';

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

          <div className="register-container">
          <div className="register-card">
            <form>
              <div className="form-group_name">
                <label htmlFor="email">Họ và tên</label>
                <input 
                  type="name" 
                  id="name" 
                  name="name" 
                  placeholder="Nhập họ và tên của bạn"/>
              </div>

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

              <div className="form-group_confirm_pass">
                <label htmlFor="password">Xác nhận mật khẩu</label>
                <input 
                  type="confirm_password" 
                  id="confirm_password" 
                  name="confirm_password" 
                  placeholder="Nhập lại mật khẩu" />
              </div>
            </form>
            
            <div className="checkbox-group">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật</label>
            </div>
            
            <button type="submit" className="register-button">
              Đăng ký
            </button>

            <div className="login">
              <span>Đã có tài khoản? </span>
              <Link to="/login">Đăng nhập</Link>
              
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

export default Register;