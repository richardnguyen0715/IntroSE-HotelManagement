import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import './ForgotPassword.css';

function ForgotPassword() {
  // Khai báo state cho các trường nhập liệu
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newpassword, setNewpassword] = useState('');
  const [renewpassword, setRenewpassword] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  
  // Refs cho các ô input OTP
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  // Hàm kiểm tra OTP
  const validateOTP = (otp) => {
    return otp.every(digit => /^\d$/.test(digit));
  };

  // Xử lý nhập OTP
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors(prev => ({ ...prev, otp: '' }));

    // Tự động focus vào ô tiếp theo
    if (value !== '' && index < 5) {
      otpRefs[index + 1].current.focus();
    }

    // Kiểm tra nếu đã nhập đủ 6 số
    if (newOtp.every(digit => digit !== '')) {
      // Tự động submit sau 500ms
      setTimeout(() => {
        if (validateOTP(newOtp)) {
          console.log('Xác thực OTP:', newOtp.join(''));
          setStep(3);
        }
      }, 500);
    }
  };

  // Xử lý khi nhấn backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Hàm kiểm tra form theo từng bước
  const validateForm = () => {
    const newErrors = {};

    if (step === 1) {
      if (!email.trim()) {
        newErrors.email = 'Vui lòng nhập email';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    } 

    else if (step === 3) {
      if (!newpassword.trim()) {
        newErrors.newpassword = 'Vui lòng nhập mật khẩu mới';
      }
      if (!renewpassword.trim()) {
        newErrors.renewpassword = 'Vui lòng xác nhận mật khẩu mới';
      } else if (newpassword !== renewpassword) {
        newErrors.renewpassword = 'Mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (step === 1) {
        // Xử lý gửi email
        console.log('Gửi mã OTP đến email:', email);
        setStep(2);
      } else if (step === 3) {
        // Xử lý đổi mật khẩu
        console.log('Thay đổi mật khẩu:', { email, otp: otp.join(''), newpassword });
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
      </header>

      <main className="forgot-main-content">
        <div className="forgot-header-container">
          <h2>Khôi phục mật khẩu</h2>
          <Link to="/login" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>

        <div className="forgot-container">
          {step === 1 && (
            <div className="forgot-card forgot-card-email">
              <form onSubmit={handleSubmit}>
                <div className="forgot-form-email">
                  <label htmlFor="email">Email <span className="forgot-required">*</span></label>
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
                  <span className="forgot-error-message">{errors.email || "\u00A0"}</span>
                </div>
                <button type="submit" className="forgot-button" id='email'>
                  Gửi mã OTP
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="forgot-card forgot-card-otp">
              <form>
                <div className="forgot-form-otp">
                  <label>Nhập mã OTP <span className="forgot-required">*</span></label>
                  <div className="forgot-warning-message">
                  Chức năng OTP đang được cải tiến. Vui lòng nhập đủ 6 chữ số bất kỳ
                  </div>
                  <div className="forgot-otp-container">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength="1"
                        className="forgot-otp-input"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                      />
                    ))}
                  </div>
                  <span className="forgot-error-message">{errors.otp || "\u00A0"}</span>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="forgot-card forgot-card-password">
              <form onSubmit={handleSubmit}>
                <div className="forgot-form-pass">
                  <label htmlFor="new_password">Mật khẩu mới <span className="forgot-required">*</span></label>
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
                  <span className="forgot-error-message">{errors.newpassword || "\u00A0"}</span>
                </div>

                <div className="forgot-form-pass">
                  <label htmlFor="confirm_new_password">Xác nhận mật khẩu <span className="forgot-required">*</span></label>
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
                  <span className="forgot-error-message">{errors.renewpassword || "\u00A0"}</span>
                </div>

                <button type="submit" className="forgot-button" id='password'>
                  Khôi phục mật khẩu
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
