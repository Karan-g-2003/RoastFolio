import { Routes, Route, useLocation } from "react-router-dom";
import Navbar        from "./components/Navbar.jsx";
import LandingPage   from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RoastPage     from "./pages/RoastPage.jsx";
import ResultPage    from "./pages/ResultPage.jsx";

export default function App() {
  const location = useLocation();
  
  return (
    <>
      <div className="scanlines"></div>
      <Navbar />
      <div key={location.pathname} className="page-transition min-h-screen pt-24">
        <Routes location={location}>
          <Route path="/"           element={<LandingPage />}   />
          <Route path="/dashboard"  element={<DashboardPage />} />
          <Route path="/roast"      element={<RoastPage />}     />
          <Route path="/result/:id" element={<ResultPage />}    />
        </Routes>
      </div>
    </>
  );
}
