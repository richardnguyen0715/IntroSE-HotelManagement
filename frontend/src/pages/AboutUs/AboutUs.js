import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import './AboutUs.css'; 

function AboutUs() {
  const navigate = useNavigate(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Kiểm tra token theo thứ tự ưu tiên
    let token = localStorage.getItem("token");
    let savedUserInfo = localStorage.getItem("userInfo");
  
    // Nếu không có trong localStorage, kiểm tra sessionStorage
    if (!token) {
      token = sessionStorage.getItem("token");
      savedUserInfo = sessionStorage.getItem("userInfo");
    }
  
    if (!token) {
      // Nếu không có token ở cả 2 nơi -> chuyển về login
      navigate("/login", { replace: true });
      return;
    }
  
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  
  const handleLogout = () => {
    // Xóa token và userInfo ở cả localStorage và sessionStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>

        <div className="header-right">
          <img
            src="/icons/VietnamFlag.png"
            alt="Vietnam Flag"
            className="flag"
          />
          <div className="user-menu">
            <div
              className="user-avatar"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="/icons/User.png" alt="User" />
            </div>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h3>Thông tin người dùng</h3>
                  <p>Họ tên: {userInfo?.name}</p>
                  <p>Email: {userInfo?.email}</p>
                  <p>Vai trò: {userInfo?.role}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Giới thiệu</h2>
          <Link to="/HomePage" className="back-button">
            <img src="/icons/Navigate.png" alt="Back"/>
          </Link>
        </div>

        <div className="project-description">
          <p>
            Đồ án IntroSE-HotelManagement là sản phẩm cuối kỳ của nhóm 13 trong môn Nhập môn Công nghệ Phần mềm - CSC2022/22.<br></br>
            Dự án hướng đến việc xây dựng một hệ thống quản lý khách sạn hiện đại, hỗ trợ đặt phòng, lập hóa đơn, quản lý khách hàng 
            và thống kê hiệu suất hoạt động. Nhóm đã áp dụng các kỹ thuật thiết kế phần mềm, phát triển giao diện và hệ thống backend 
            để tạo ra một sản phẩm hoàn thiện phục vụ nhu cầu thực tế.
          </p>
        </div>

        <div className="team-box">
          <h3>Thành viên nhóm</h3>

          <div className='team-member'>
            <img src="/icons/User.png" alt="User" className="user-icon"/>
            <div className="member-info">
              <p className='name'>NGUYỄN ANH TƯỜNG</p>
              <p className='info'>22120412 - Trưởng nhóm + Chịu trách nhiệm phần Backend</p>
            </div>
          </div>

          <div className='team-member'>
            <img src="/icons/User.png" alt="User" className="user-icon"/>
            <div className="member-info">
              <p className='name'>TRẦN ĐẮC THỊNH</p>
              <p className='info'>22120334 - Chịu trách nhiệm phần Backend</p>
            </div>
          </div>

          <div className='team-member'>
            <img src="/icons/User.png" alt="User" className="user-icon"/>
            <div className='member-info'>
              <p className='name'>VŨ HOÀNG NHẬT TRƯỜNG</p>
              <p className='info'>22120398 - Chịu trách nhiệm phần Frontend</p>
            </div>
          </div>

          <div className='team-member'>
            <img src="/icons/User.png" alt="User" className="user-icon"/>
            <div className="member-info">
              <p className='name'>NGUYỄN ĐÌNH TRÍ</p>
              <p className='info'>22120384 - Chịu trách nhiệm phần Frontend</p>
            </div>
          </div>

          <div className='team-member'>
            <img src="/icons/User.png" alt="User" className="user-icon"/>
            <div className="member-info">
              <p className='name'>PHẠM TUẤN VƯƠNG</p>
              <p className='info'>22120446 - Chịu trách nhiệm phần Frontend</p>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default AboutUs;