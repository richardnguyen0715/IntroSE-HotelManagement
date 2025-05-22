import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import ForgotPassword from './pages/ForgotPassword';

import Feature1 from './pages/Feature1/Feature1';
import Feature2 from './pages/Feature2/Feature2';
import Feature3 from './pages/Feature3/Feature3';
import Feature4 from './pages/Feature4';

// Import Feature5 components directly
import Feature5Main from './pages/Feature5/Feature5Main';
import RevenueReport from './pages/Feature5/RevenueReport';
import RevenueReportForm from './pages/Feature5/RevenueReportForm';
import OccupancyReport from './pages/Feature5/OccupancyReport';
import OccupancyReportForm from './pages/Feature5/OccupancyReportForm';
import { ReportProvider } from './pages/Feature5/ReportContext';

import Feature6 from './pages/Feature6/Feature6';
import Regulation1 from './pages/Feature6/Regulation1';
import Regulation2 from './pages/Feature6/Regulation2';
import RoomTypeForm from './pages/Feature6/RoomTypeForm';
import { RegulationProvider } from './pages/Feature6/RegulationContext';

function App() {
  return (
    <ReportProvider>
      <RegulationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutUs />} />

          <Route path="/feature1" element={<Feature1 />} />
          <Route path="/feature2" element={<Feature2 />} />
          <Route path="/feature3" element={<Feature3 />} />
          <Route path="/feature4" element={<Feature4 />} />

          <Route path="/feature5" element={<Feature5Main />} />
          <Route path="/feature5/revenue" element={<RevenueReport />} />
          <Route path="/feature5/revenue/add" element={<RevenueReportForm />} />
          <Route path="/feature5/revenue/edit" element={<RevenueReportForm />} />
          <Route path="/feature5/occupancy" element={<OccupancyReport />} />
          <Route path="/feature5/occupancy/add" element={<OccupancyReportForm />} />
          <Route path="/feature5/occupancy/edit" element={<OccupancyReportForm />} />

          <Route path="/feature6" element={<Feature6 />} />
          <Route path="/feature6/regulation1" element={<Regulation1 />} />
          <Route path="/feature6/regulation1/add" element={<RoomTypeForm />} />
          <Route path="/feature6/regulation1/edit" element={<RoomTypeForm />} />
          <Route path="/feature6/regulation2" element={<Regulation2 />} />
        </Routes>
      </RegulationProvider>
    </ReportProvider>
  );
}

export default App;
