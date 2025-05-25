import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './Register.css';

function Register() {
  // Khai báo state cho các trường nhập liệu
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [acceptance, setAcceptance] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  // Hàm kiểm tra form, cập nhật lỗi vào state errors
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    if (!repassword.trim()) {
      newErrors.repassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== repassword) {
      newErrors.repassword = 'Mật khẩu không khớp';
    }
    if (!acceptance) {
      newErrors.acceptance = 'Bạn cần đồng ý với điều khoản và chính sách bảo mật';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/users", {
          name,
          email,
          password,
          role: "admin"
        });

        if (response.status === 201) {
          console.log("Tạo người dùng mới thành công");
          localStorage.setItem("token", response.data.token);
        }
      }

      catch (error) {
        if (error.response.status === 400) {
          console.log("Email đã tồn tại");
          setMessage("Email đã tồn tại. Vui lòng chọn email khác");
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
          <h2>Đăng ký</h2>
          <Link to="/" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="register-container">
          <div className="register-card">
            <form onSubmit={handleSubmit}>
              <div className="grid-container">
                <div className="form-group_name_reg">
                  <label htmlFor="name">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nhập họ và tên của bạn"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                      setMessage("")
                    }}
                  />
                  {/* Luôn render span để dành chỗ */}
                  <span className="error-message_reg">{errors.name || "\u00A0"}</span>
                </div>

                <div className="form-group_email_reg">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
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
                  <span className="error-message_reg">{errors.email || "\u00A0"}</span>
                </div>

                <div className="form-group_pass_reg">
                  <label htmlFor="password">
                    Mật khẩu <span className="required">*</span>
                  </label>
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
                  <span className="error-message_reg">{errors.password || "\u00A0"}</span>
                </div>

                <div className="form-group_confirm_pass_reg">
                  <label htmlFor="confirm_password">
                    Xác nhận mật khẩu <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Nhập lại mật khẩu"
                    value={repassword}
                    onChange={(e) => {
                      setRepassword(e.target.value);
                      setErrors((prev) => ({ ...prev, repassword: '' }));
                      setMessage("")
                    }}
                  />
                  <span className="error-message_reg">{errors.repassword || "\u00A0"}</span>
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="acceptance"
                  name="acceptance"
                  checked={acceptance}
                  onChange={(e) => {
                    setAcceptance(e.target.checked);
                    setErrors((prev) => ({ ...prev, acceptance: '' }));
                    setMessage("")
                  }}
                />
                <label htmlFor="acceptance">
                  Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật <span className="required">*</span>
                </label>
              </div>
              <span className="error-message_reg">
                {errors.acceptance || "\u00A0"}
              </span>

              <button type="submit" className="register-button">
                Đăng ký
              </button>
              <span className="error-message">{message || "\u00A0"}</span>
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

