import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./HomePage.css";

function HomePage() {
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
          <Link to="/about">Về chúng tôi</Link>
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

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>Trang chủ</h2>
        </div>

        <div className="function-grid">
          <Link to="/feature1" className="function-item">
            <img src="/icons/Catalogue.png" alt="Lập danh mục thuê phòng" />
            <p>LẬP DANH MỤC PHÒNG</p>
          </Link>

          <Link to="/feature2" className="function-item">
            <img src="/icons/List.png" alt="Lập phiếu thuê phòng" />
            <p>LẬP PHIẾU THUÊ PHÒNG</p>
          </Link>

          <Link to="/feature3" className="function-item">
            <img src="/icons/Find.png" alt="Tra cứu phòng" />
            <p>TRA CỨU PHÒNG</p>
          </Link>

          <Link to="/feature4" className="function-item">
            <img src="/icons/Receipt.png" alt="Lập hóa đơn thanh toán" />
            <p>LẬP HÓA ĐƠN THANH TOÁN</p>
          </Link>

          <Link to="/feature5" className="function-item">
            <img src="/icons/Report.png" alt="Lập báo cáo tháng" />
            <p>LẬP BÁO CÁO THÁNG</p>
          </Link>

          <Link to="/feature6" className="function-item">
            <img src="/icons/Regulation.png" alt="Thay đổi quy định" />
            <p>THAY ĐỔI QUY ĐỊNH</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
