import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AboutUs from './pages/AboutUs/AboutUs';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

import Feature1 from './pages/Feature1';
import Feature2 from './pages/Feature2';
import Feature3 from './pages/Feature3';
import Feature4 from './pages/Feature4';

import Feature5 from './pages/Feature5';
import Feature5a from './pages/Feature5/Feature5a';
import Feature5b from './pages/Feature5/Feature5b';

import Feature6 from './pages/Feature6';
import Feature6a from './pages/Feature6/Feature6a';
import Feature6b from './pages/Feature6/Feature6b';
import Feature6c from './pages/Feature6/Feature6c';

function App() {
  return (
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

      <Route path="/feature5" element={<Feature5 />} />
      <Route path="/feature5/report1" element={<Feature5a />} />
      <Route path="/feature5/report2" element={<Feature5b />} />

      <Route path="/feature6" element={<Feature6 />} />
      <Route path="/feature6/regulation1" element={<Feature6a />} />
      <Route path="/feature6/regulation2" element={<Feature6b />} />
      <Route path="/feature6/regulation4" element={<Feature6c />} />

    </Routes>
  );
}

export default App;
