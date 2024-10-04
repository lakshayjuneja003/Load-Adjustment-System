import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>Dashboard</h3>
      <ul style={styles.list}>
        <li><Link to="/admin-dashboard">Admin Home</Link></li>
        <li><Link to="/admin/manage-users">Manage Users</Link></li>
        <li><Link to="/admin/settings">Settings</Link></li>
        {/* Add more admin links */}
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    borderRight: '1px solid #ccc',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
};

export default Sidebar;
