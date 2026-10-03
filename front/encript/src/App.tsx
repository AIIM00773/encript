import {
  Link,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./PublicArea/Landing";
import HowItWorks from "./PublicArea/HowItWorks";
import Signup from "./PublicArea/SignUp";
import Login from "./PublicArea/SignIn";
import UserDashboard from "./AuthenticatedArea/Dashboard";



// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
     <Route path="/" element={<LandingPage />} />
     <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/me" element={<UserDashboard />} />
      <Route path="/sp" element={<UserDashboard/>} />
               {/* 

        <Route path="*" element={<NotFound />} />*/}
      </Routes>
    </>
  );
}

export default App;
