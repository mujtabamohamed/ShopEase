import { useCookies } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Home from "./modules/Home";
import Cart from "./modules/Cart"; // Import the Cart component

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;

  return (
    <div className="w-full h-screen bg-[#191919]">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart/:user_id" element={<Cart />} />
            </Routes>
          </Router>
        </>
      )}
    </div>
  );
}

export default App;
