window.global = window;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Register";
import CaseRegister from "./Pages/CaseRegister";
import Cases from "./Pages/Cases";
import CaseSchedule from "./Pages/CaseSchedule";
import VideoCall from "./Pages/VideoCall";
function App() {
  return (
    
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/case-register" element={<CaseRegister />} />
        <Route path="/judge-cases" element={<Cases />} />
        <Route path="/case-schedule" element={<CaseSchedule />} />
        <Route path="/video-call/:roomId" element={<VideoCall />} /> 
      </Routes>
    
  );
}

export default App;
