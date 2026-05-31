import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage.jsx";
import Authentication from "./pages/authentication.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import VideoMeet from "./pages/videoMeet.jsx";
import JoinMeetingForm from "./pages/JoinMeetingForm.jsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* { <Route path='/home' element=/>} */}
            <Route path="/home" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/:url" element={<VideoMeet />} />
             <Route path="/join" element={<JoinMeetingForm />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
