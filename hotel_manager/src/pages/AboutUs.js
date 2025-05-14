import { Link } from 'react-router-dom';
import './App.css';
import './AboutUs.css'; 

function AboutUs() {
  return (
    <div className="app">
      
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Giới thiệu</h2>
          <Link to="/" className="back-button">
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