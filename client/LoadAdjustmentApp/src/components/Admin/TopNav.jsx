import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../StylingsSheets/TopNavBar.css'; 

const TopNavBar = ({ role, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="top-nav">
      <div className="nav-logo">
        <h2>{role === 'Admin' ? 'Admin Panel' : 'Staff Panel'}</h2>
      </div>
      <div className="nav-links">
        <Link to={role === 'Admin' ? "/admin/dashboard" : "/staff/dashboard"} className="nav-link">Home</Link>
        <Link to={role === 'Admin' ? "/admin/profile" : "/staff/profile"} className="nav-link">Profile</Link>
        {/* Display additional links based on role */}
        {role === 'Admin' && (
          <>
            <Link to="/admin/add-subjects" className="nav-link">Add Subjects</Link>
            <Link to="/admin/show-subjects" className="nav-link">Show Subjects</Link>
          </>
        )}
        {role === 'Staff' && (
          <>
            <Link to="/staff/tasks" className="nav-link">Tasks</Link>
            <Link to="/staff/preferences" className="nav-link">Preferences</Link>
          </>
        )}
        <button className="logoutBtn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default TopNavBar;
