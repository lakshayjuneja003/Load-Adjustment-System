import React from 'react';
import Sidebar from './Sidebar';

const StaffDashboard = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <h2>Staff Dashboard</h2>
        <p>Welcome, Staff! Here you can view your assigned tasks and manage your preferences.</p>
        {/* Add more staff-specific components or features here */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  content: {
    flex: 1,
    padding: '20px',
  },
};

export default StaffDashboard;
