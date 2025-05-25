import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './Login.css';

function ForgotPassword() {
  // Khai báo state cho các trường nhập liệu
  const [email, setEmail] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [renewpassword, setRenewpassword] = useState('');
  const [errors, setErrors] = useState({});

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

    if (!newpassword.trim()) {
      newErrors.newpassword = 'Vui lòng nhập mật khẩu mới';
    }

    if (!renewpassword.trim()) {
      newErrors.renewpassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (newpassword !== renewpassword) {
      newErrors.renewpassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Nếu form hợp lệ, xử lý thay đổi mật khẩu
      console.log('Thay đổi mật khẩu:', { email, newpassword });
    } else {
      console.log('Form có lỗi');
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
            <img src="/icons/Navigate.png" alt="Back" />
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                />
                <span className="error-message">{errors.email || "\u00A0"}</span>
              </div>

              <div className="form-group_pass">
                <label htmlFor="new_password">Mật khẩu mới <span className="required">*</span></label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  placeholder="Nhập mật khẩu mới"
                  value={newpassword}
                  onChange={(e) => {
                    setNewpassword(e.target.value);
                    setErrors((prev) => ({ ...prev, newpassword: '' }));
                  }}
                />
                <span className="error-message">{errors.newpassword || "\u00A0"}</span>
              </div>

              <div className="form-group_pass">
                <label htmlFor="confirm_new_password">Xác nhận mật khẩu <span className="required">*</span></label>
                <input
                  type="password"
                  id="confirm_new_password"
                  name="confirm_new_password"
                  placeholder="Nhập lại mật khẩu"
                  value={renewpassword}
                  onChange={(e) => {
                    setRenewpassword(e.target.value);
                    setErrors((prev) => ({ ...prev, renewpassword: '' }));
                  }}
                />
                <span className="error-message">{errors.renewpassword || "\u00A0"}</span>
              </div>

              <button type="submit" className="login-button" id="recover">
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
