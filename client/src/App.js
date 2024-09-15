import { useCookies } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Home from "./modules/Home";
import Cart from "./modules/Cart"; // Import the Cart component
import Dashboard from "./modules/Dashboard";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userRole = cookies.Role;

  return (
    <div className="w-full h-screen bg-[#fff]">
      <Router>
        {!authToken ? (
          <Auth />
        ) : (
          <>
            {userRole === "buyer" && <Navbar />}
            <Routes>
              {userRole === "seller" && (
                <>
                  <Route path="/dashboard/:user_id" element={<Dashboard />} />
                </>
              )}
              {userRole === "buyer" && (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart/:user_id" element={<Cart />} />
                </>
              )}
            </Routes>
          </>
        )}
      </Router>
      
    </div>
  );
}

export default App;
