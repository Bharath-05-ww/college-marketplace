import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LogIn, UserPlus, LogOut, User, List } from "lucide-react";
import "../css/Navbar.css";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check auth state on mount and when storage changes
  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    // Listen for storage changes (in case of log in/out in other tabs/components)
    window.addEventListener("storage", checkAuth);
    // Custom event for local changes in same window
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Dispatch auth change event
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo-container">
        <div className="logo-icon">
          <ShoppingBag size={24} />
        </div>
        <span className="logo-text">
          CampusCart
          <span className="logo-badge">Beta</span>
        </span>
      </Link>



      <nav className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Home
        </NavLink>

        {user ? (
          <div className="nav-auth">
            <NavLink 
              to="/my-listings" 
              className={({ isActive }) => `nav-link-listings ${isActive ? "active" : ""}`}
            >
              <List size={14} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
              My Listings
            </NavLink>
            <div className="user-tag">
              <User size={14} />
              <span>{user.username}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={14} style={{ marginRight: "4px", display: "inline-block", verticalAlign: "middle" }} />
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-auth">
            <NavLink 
              to="/login" 
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <LogIn size={14} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <UserPlus size={14} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
              Register
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;