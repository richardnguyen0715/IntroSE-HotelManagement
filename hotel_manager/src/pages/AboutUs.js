import './App.css';

function AboutUs() {
  return (
    <div className="app">
      
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>
      </header>

      <main className="main-content">
        <h2>Giới thiệu</h2>

        <div className="project-description">
          <p>
            Đồ án IntroSE-HotelManagement là sản phẩm cuối kỳ của nhóm 13 trong môn Nhập môn Công nghệ Phần mềm - CSC2022/22. 
            Dự án hướng đến việc xây dựng một hệ thống quản lý khách sạn hiện đại, hỗ trợ đặt phòng, lập hóa đơn, quản lý khách hàng 
            và thống kê hiệu suất hoạt động. Nhóm đã áp dụng các kỹ thuật thiết kế phần mềm, phát triển giao diện và hệ thống backend 
            để tạo ra một sản phẩm hoàn thiện phục vụ nhu cầu thực tế.
          </p>
        </div>

        <div className="team-box">
          <h3>Thành viên nhóm:</h3>
          <div><p>Thành viên 1: Nguyễn Văn A - Trưởng nhóm, chịu trách nhiệm phát triển hệ thống.</p></div>
          <div><p>Thành viên 2: Trần Thị B - Thiết kế giao diện người dùng.</p></div>
          <div><p>Thành viên 3: Lê Văn C - Phát triển backend và cơ sở dữ liệu.</p></div>
          <div><p>Thành viên 4: Phạm Thị D - Kiểm thử và đảm bảo chất lượng phần mềm.</p></div>
          <div><p>Thành viên 5: Hoàng Văn E - Viết tài liệu và hướng dẫn sử dụng.</p></div>
        </div>

      </main>

    </div>
  );
}

export default AboutUs;