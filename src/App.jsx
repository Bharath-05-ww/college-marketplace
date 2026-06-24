import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./Components/Navbar";
import MyListings from "./pages/MyListings";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-listings" element={<MyListings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;