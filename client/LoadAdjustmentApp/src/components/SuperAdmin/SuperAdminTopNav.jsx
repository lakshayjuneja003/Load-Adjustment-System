import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./topNavBar.css"; // Add your styling file here

const TopNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/superAdmin/login");
  };

  return (
    <nav className="top-nav">
      <div className="nav-logo">
        <h2>Super Admin Panel</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/superAdmin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/superAdmin/pendingRequests">Pending Requests</Link>
        </li>
        <li>
          <Link to="/superAdmin/setPermissions">SetPermissionsForAdmins</Link>
        </li>
        <li>
          <Link to="/superAdmin/me">Profile</Link>
        </li>
        <li>
          <Link to="/superAdmin/getinvitatiourl">Invitation Url </Link>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default TopNavBar;
