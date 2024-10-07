import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetchSubjects from '../../customHooks/UseFetchSubjects';
import ShowSubjects from './ShowSubjects';
import TopNavBar from "./TopNav" // Import TopNavBar component
import '../StylingsSheets/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { subjects, loading, error, fetchSubjects } = useFetchSubjects();
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [isTokenValid, setIsTokenValid] = useState(true);

  const filteredSubjects = selectedSemester === 'All'
    ? subjects
    : subjects.filter(subject => subject.semester.toString() === selectedSemester);

  const getTokenExpirationTime = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));
      return decodedPayload.exp ? decodedPayload.exp * 1000 : null;
    } catch (e) {
      console.error("Invalid token format", e);
      return null;
    }
  };

  const isTokenExpired = () => {
    const expirationTime = getTokenExpirationTime();
    if (!expirationTime) return true;
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  useEffect(() => {
    if (isTokenExpired()) {
      setIsTokenValid(false);
      setTimeout(() => {
        handleLogout();
      }, 1500);
    }
  }, []);

  if (!isTokenValid) {
    return <p className="error-text">Session expired. Redirecting to login...</p>;
  }

  return (
    <div className="admin-dashboard">
      {/* Use the new TopNavBar component */}
      <TopNavBar role="Admin" handleLogout={handleLogout} /> {/* Use TopNavBar with role="admin" */}

      <div className="admin-container">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <Link to="/admin/add-subjects" className="button no-underline">Add Subjects</Link>
        </div>

        <hr className="blue-line" />

        <div className="filter-box">
          <label>Filter by Semester: </label>
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="All">All</option>
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i + 1}>Semester {i + 1}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading subjects...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : (
          <ShowSubjects subjects={filteredSubjects} fetchSubjects={fetchSubjects} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
