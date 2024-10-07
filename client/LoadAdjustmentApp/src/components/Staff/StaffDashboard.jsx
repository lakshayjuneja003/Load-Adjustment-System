import React, { useEffect, useState } from 'react';
import TopNavBar from '../Admin/TopNav.jsx';
import axios from 'axios';
import './StaffDashboard.css'; // Import CSS for additional styling

const StaffDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3004/api/v1/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/staff/login');
  };

  return (
    <div className="staff-dashboard-container">
      <TopNavBar role="Staff" handleLogout={handleLogout} /> {/* Use TopNavBar with role="Staff" */}
      <div className="staff-dashboard-content">
        <h1 className="dashboard-title">Staff Dashboard</h1>
        {user ? (
          <div className="greeting-card">
            <h2>Welcome, {user.fullname}!</h2>
            <p>We're glad to have you here. Below, you can view your assigned tasks and manage your preferences.</p>
          </div>
        ) : (
          <div className="loading-card">
            <p>Loading user details...</p>
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
