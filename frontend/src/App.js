import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AboutUs from './pages/AboutUs/AboutUs';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

import Feature1 from './pages/Feature1/Feature1';
import Feature2 from './pages/Feature2/Feature2';
import Feature3 from './pages/Feature3/Feature3';
import Feature4Main from './pages/Feature4/Feature4Main';
import Feature4Add from './pages/Feature4/Feature4Add';
import Feature4Edit from './pages/Feature4/Feature4Edit';

// Import Feature5 components directly
import Feature5Main from './pages/Feature5/Feature5Main';
import RevenueReport from './pages/Feature5/RevenueReport';
import RevenueReportForm from './pages/Feature5/RevenueReportForm';
import OccupancyReport from './pages/Feature5/OccupancyReport';
import OccupancyReportForm from './pages/Feature5/OccupancyReportForm';
import { ReportProvider } from './pages/Feature5/ReportContext';

import Regulation1 from './pages/Feature6/Regulation1';
import Regulation2 from './pages/Feature6/Regulation2';
import Regulation4 from './pages/Feature6/Regulation4';
import RoomTypeForm from './pages/Feature6/RoomTypeForm';
import RegulationForm from './pages/Feature6/RegulationForm';
import { RegulationProvider } from './pages/Feature6/RegulationContext';
import Feature6Main from './pages/Feature6/Feature6Main';

function App() {
  return (
    <RegulationProvider>
      <ReportProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/HomePage" element={<HomePage />} />

          <Route path="/feature1" element={<Feature1 />} />
          <Route path="/feature2" element={<Feature2 />} />
          <Route path="/feature3" element={<Feature3 />} />
          <Route path="/feature4" element={<Feature4Main />} />
          <Route path="/feature4/add" element={<Feature4Add />} />
          <Route path="/feature4/edit/:id" element={<Feature4Edit />} />

          {/* Feature 5 Routes */}
          <Route path="/feature5" element={<Feature5Main />} />
          <Route path="/feature5/revenue" element={<RevenueReport />} />
          <Route path="/feature5/revenue/add" element={<RevenueReportForm />} />
          <Route path="/feature5/revenue/edit" element={<RevenueReportForm />} />
          <Route path="/feature5/occupancy" element={<OccupancyReport />} />
          <Route path="/feature5/occupancy/add" element={<OccupancyReportForm />} />
          <Route path="/feature5/occupancy/edit" element={<OccupancyReportForm />} />

          {/* Feature 6 Routes */}
          <Route path="/feature6" element={<Feature6Main />} />
          <Route path="/feature6/regulation1" element={<Regulation1 />} />
          <Route path="/feature6/regulation1/add" element={<RoomTypeForm />} />
          <Route path="/feature6/regulation1/edit" element={<RoomTypeForm />} />
          <Route path="/feature6/regulation2" element={<Regulation2 />} />
          <Route path="/feature6/regulation4" element={<Regulation4 />} />
          <Route path="/feature6/room-type-form" element={<RoomTypeForm />} />
          <Route path="/feature6/regulation-form" element={<RegulationForm />} />
        </Routes>
      </ReportProvider>
    </RegulationProvider>
  );
}

export default App;
