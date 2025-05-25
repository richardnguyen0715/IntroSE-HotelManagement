import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './Login.css'; 

function Login() {
  // Khai báo state cho các trường nhập liệu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  // Hàm kiểm tra form
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password
        });
        
        if (response.status === 200) {
          console.log("Đăng nhập thành công");
          localStorage.setItem("token", response.data.token);
        }   
      } 

      catch (error) {
        if (error.response.status === 400) {
          console.log("Tài khoản hoặc mật khẩu không đúng");
          setMessage("Tài khoản hoặc mật khẩu không đúng");
        }
        
        else if (error.response.status === 500) {
          console.log("Lỗi từ server");
          setMessage("Lỗi từ server");
        }
      }
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
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                    setMessage("")
                  }}
                />
                <span className="error-message">{errors.email || "\u00A0"}</span>
              </div>

              <div className="form-group_pass">
                <label htmlFor="password">Mật khẩu <span className="required">*</span></label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Nhập mật khẩu" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: '' }));
                    setMessage("")
                  }}
                />
                <span className="error-message">{errors.password || "\u00A0"}</span>
              </div>

              <div className="checkbox-group">
                <input 
                type="checkbox" 
                id="remember" 
                name="remember" 
                checked={remember}
                onChange={(e) => {
                setRemember(e.target.checked);
                setMessage("");
                }}
                />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
            
              <button type="submit" className="login-button">
                Đăng nhập
              </button>
              <span className="error-message">{message || "\u00A0"}</span>
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
