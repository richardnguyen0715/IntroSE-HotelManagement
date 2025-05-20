import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './Register.css';

function Register() {
  // Khai báo state cho các trường nhập liệu
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [acceptance, setAcceptance] = useState(false);

  const isFormValid = name.trim !== '' && email.trim() !== '' && password.trim() !== '' && repassword.trim() !== '' && acceptance === true;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Xử lý đăng ký (gọi API, xử lý xác thực, v.v.)
      console.log('Đăng ký với:', { name, email, password });
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
          <h2>Đăng ký</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>

        <div className="register-container">
          <div className="register-card">
            <form onSubmit={handleSubmit}>
              <div className='grid-container'>
                <div className="form-group_name">
                  <label htmlFor="name">Họ và tên</label>
                  <input 
                    type="name" 
                    id="name" 
                    name="name" 
                    placeholder="Nhập họ và tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
                </div>

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

                <div className="form-group_confirm_pass">
                  <label htmlFor="confirm_password">Xác nhận mật khẩu</label>
                  <input 
                    type="password" 
                    id="confirm_password" 
                    name="confirm_password" 
                    placeholder="Nhập lại mật khẩu"
                    value={repassword}
                    onChange={(e) => setRepassword(e.target.value)}/>
                </div>

              </div>

              <div className="checkbox-group">
                <input 
                type="checkbox" 
                id="acceptance" 
                name="acceptance" 
                checked={acceptance}
                onChange={(e) => setAcceptance(e.target.checked)}/>
                
                <label htmlFor="acceptance">Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật</label>
              </div>
            
              <button type="submit" className="register-button" disabled={!isFormValid}>
                Đăng ký
              </button>

            </form>
            
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