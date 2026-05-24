import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* { <Route path='/home' element=/>} */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
