import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AboutUs from "./pages/AboutUs/AboutUs";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

import Feature1 from "./pages/Feature1/Feature1";
import Feature2 from "./pages/Feature2/Feature2";
import Feature3 from "./pages/Feature3/Feature3";
import Feature4Main from "./pages/Feature4/Feature4Main";

// Import Feature5 components directly
import Feature5Main from "./pages/Feature5/Feature5Main";
import RevenueReport from "./pages/Feature5/RevenueReport";
import OccupancyReport from "./pages/Feature5/OccupancyReport";
import { ReportProvider } from "./pages/Feature5/ReportContext";

import Regulation1 from "./pages/Feature6/Regulation1";
import Regulation2 from "./pages/Feature6/Regulation2";
import Regulation4 from "./pages/Feature6/Regulation4";
import Feature6Main from "./pages/Feature6/Feature6Main";

import { AuthProvider } from "./pages/AuthContext";

function App() {
  return (
    <Routes>
      {/* Public routes (không cần AuthProvider) */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <AuthProvider>
            <ReportProvider>
              <Routes>
                <Route path="/HomePage" element={<HomePage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/feature1" element={<Feature1 />} />
                <Route path="/feature2" element={<Feature2 />} />
                <Route path="/feature3" element={<Feature3 />} />
                <Route path="/feature4" element={<Feature4Main />} />

                {/* Feature 5 */}
                <Route path="/feature5" element={<Feature5Main />} />
                <Route path="/feature5/revenue" element={<RevenueReport />} />
                <Route path="/feature5/occupancy" element={<OccupancyReport />} />


                {/* Feature 6 */}
                <Route path="/feature6" element={<Feature6Main />} />
                <Route path="/feature6/regulation1" element={<Regulation1 />} />
                <Route path="/feature6/regulation2" element={<Regulation2 />} />
                <Route path="/feature6/regulation4" element={<Regulation4 />} />
              </Routes>
            </ReportProvider>
          </AuthProvider>
        }
      />
    </Routes>
  );
}

export default App;
