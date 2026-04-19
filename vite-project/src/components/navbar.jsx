import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, BarChart3, LogOut } from "lucide-react";

function Navbar({ cartCount, setIsOpen }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    // Ensure both user and token exist, and aren't literal strings 'undefined' or 'null' from buggy saves
    if (
      storedUser && storedUser !== "undefined" && storedUser !== "null" &&
      token && token !== "undefined" && token !== "null"
    ) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header>
      <div className="container nav-content">

        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-icon" />
          </Link>
        </div>

        <div className="location-picker">
          <span>Delivery in 12 mins</span>
          <span>Home - Mumbai, 400001</span>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder='Search "organic soap"'
            className="search-bar"
          />
        </div>

        <div className="nav-actions">
          <Link to="/dashboard">
            <button className="nav-btn">
              <BarChart3 />
              <span>Dashboard</span>
            </button>
          </Link>

          {user ? (
            <button className="nav-btn" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/login">
              <button className="nav-btn">
                <User />
                <span>Login</span>
              </button>
            </Link>
          )}

          <button className="cart-btn" onClick={() => setIsOpen(true)}>
            <ShoppingCart />
            <span>Cart ({cartCount})</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;