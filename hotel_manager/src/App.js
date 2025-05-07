import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage.js"
import AboutUs from "./pages/AboutUs.js"
//import Login from "./pages/Login"
//import Register from "./pages/Register"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
