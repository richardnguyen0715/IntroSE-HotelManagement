import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
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
