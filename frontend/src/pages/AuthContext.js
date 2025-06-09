import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Hàm kiểm tra token có quá 12 tiếng chưa
const isTokenExpired = () => {
  const tokenTime = localStorage.getItem("tokenTime");
  if (!tokenTime) return true;

  const ONE_DAY = 12 * 60 * 60 * 1000; // Tính bằng milliseconds
  return Date.now() - parseInt(tokenTime) > ONE_DAY;
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    let savedUserInfo = localStorage.getItem("userInfo");
    // Kiểm tra nếu token trong localStorage và đã quá 12 tiếng

    if (token && isTokenExpired()) {
      // Xóa token và thời gian lưu
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTime");
      localStorage.removeItem("userInfo");
      navigate("/login", { replace: true });
      return;
    }
  
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("tokenTime");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
