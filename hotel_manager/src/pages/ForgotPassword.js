import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './Login.css';

function ForgotPassword() {
  // Khai báo state cho các trường nhập liệu
  const [email, setEmail] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [renewpassword, setRenewpassword] = useState('');

  const isFormValid = email.trim() !== '' && newpassword.trim() !== '' && renewpassword.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Xử lý thay đổi mật khẩu (gọi API, xử lý xác thực, v.v.)
      console.log('Thay đổi mật khẩu:', { email, newpassword });
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
          <h2>Khôi phục mật khẩu</h2>
          <Link to="/login" className="back-button">
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
                  placeholder="Nhập email khôi phục"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
              </div>

              <div className="form-group_pass">
                <label htmlFor="new_password">Mật khẩu mới <span className="required">*</span></label>
                <input 
                  type="password" 
                  id="new_password" 
                  name="new_password" 
                  placeholder="Nhập mật khẩu mới" 
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}/>
              </div>

              <div className="form-group_pass">
                <label htmlFor="confirm_new_password">Xác nhận mật khẩu <span className="required">*</span></label>
                <input 
                  type="password" 
                  id="confirm_new_password" 
                  name="confirm_new_password" 
                  placeholder="Nhập lại mật khẩu" 
                  value={renewpassword}
                  onChange={(e) => setRenewpassword(e.target.value)}/>
              </div>
            
              <button type="submit" className="login-button" disabled={!isFormValid}>
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