import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './Login.css'; 

function Login() {
  // Khai báo state cho các trường nhập liệu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  // Kiểm tra form hợp lệ nếu email và password không rỗng
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Xử lý đăng nhập (gọi API, xử lý xác thực, v.v.)
      console.log('Đăng nhập với:', { email, password, remember });
    }
  };

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
          <h2>Đăng nhập</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>

        <div className="login-container">
          <div className="login-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group_email">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
              </div>

              <div className="form-group_pass">
                <label htmlFor="password">Mật khẩu</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Nhập mật khẩu" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
              </div>

              <div className="checkbox-group">
                <input 
                type="checkbox" 
                id="remember" 
                name="remember" 
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}/>
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
            
              <button type="submit" className="login-button" disabled={!isFormValid}>
                Đăng nhập
              </button>
            </form>

            <div className="forgot-password">
              <Link to="/forgot_password">Quên mật khẩu?</Link>
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