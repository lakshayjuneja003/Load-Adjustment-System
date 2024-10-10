import React from 'react';
import TopNavBar from '../Admin/TopNav.jsx';
import './StaffDashboard.css'; // Import CSS for additional styling
import { useNavigate } from 'react-router-dom';
import useUserVerification from '../../customHooks/UseUserVerification.jsx';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { userInfo, isVerified, loading, error } = useUserVerification(); // Using the modified custom hook
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/staff/login');
  };

  if (loading) {
    return <p>Loading verification status...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (isVerified === false) {
    return (
      <div className="staff-dashboard-container">
        <TopNavBar role="Staff" handleLogout={handleLogout} />
        <div className="staff-dashboard-content">
          <h1 className="dashboard-title">Staff Dashboard</h1>
          <p>You must be verified to access this dashboard.</p>
          {/* You can include a button to request verification or contact admin */}
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard-container">
      <TopNavBar role="Staff" handleLogout={handleLogout} />
      <div className="staff-dashboard-content">
        <h1 className="dashboard-title">Staff Dashboard</h1>
        {userInfo && (
          <div className="greeting-card">
            <h2>Welcome, {userInfo.name}!</h2>
            <p>We're glad to have you here. Below, you can view your assigned tasks and manage your preferences.</p>
          </div>
        )}
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>View Tasks</h3>
            <p>Check your assigned tasks and track their progress.</p>
            <button className="action-button">Go to Tasks</button>
          </div>
          <div className="dashboard-card">
            <h3>Manage Preferences</h3>
            <p>Update your preferences for subject assignments and more.</p>
            <button className="action-button">Set Preferences</button>
          </div>
          <div className="dashboard-card">
            <h3>Contact Admin</h3>
            <p>Need assistance? Get in touch with the admin team.</p>
            <button className="action-button">Contact Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
