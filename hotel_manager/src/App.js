import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import Feature1 from './pages/Feature1';
import Feature2 from './pages/Feature2';
import Feature3 from './pages/Feature3';
import Feature4 from './pages/Feature4';
import Feature5 from './pages/Feature5';
import Feature6 from './pages/Feature6';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/feature1" element={<Feature1 />} />
      <Route path="/feature2" element={<Feature2 />} />
      <Route path="/feature3" element={<Feature3 />} />
      <Route path="/feature4" element={<Feature4 />} />
      <Route path="/feature5" element={<Feature5 />} />
      <Route path="/feature6" element={<Feature6 />} />
    </Routes>
  );
}

export default App;
