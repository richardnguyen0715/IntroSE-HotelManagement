import { Link } from "react-router-dom"
import "../styles/Header.css"
import vietnamFlag from "../assets/VietnamFlag.png"

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        HotelManager
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/about">About Us</Link>
          </li>
          <li className="nav-item flag">
            <img src={vietnamFlag} alt="Vietnam Flag" className="flag-icon" />
          </li>
          <li className="nav-item">
            <Link to="/register" className="btn btn-register">
              Đăng ký
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="btn btn-login">
              Đăng nhập
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header