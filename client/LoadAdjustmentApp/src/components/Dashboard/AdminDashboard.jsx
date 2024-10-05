import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetchSubjects from '../../customHooks/UseFetchSubjects';
import ShowSubjects from './ShowSubjects'; // Import the new component
import '../StylingsSheets/AdminDashboard.css';

const AdminDashboard = () => {
  const { subjects, loading, error, fetchSubjects } = useFetchSubjects();
  const [selectedSemester, setSelectedSemester] = useState('All');

  const filteredSubjects = selectedSemester === 'All'
    ? subjects
    : subjects.filter(subject => subject.semester.toString() === selectedSemester);

  return (
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

      {/* Pass filtered subjects to the ShowSubjects component */}
      {loading ? (
        <p>Loading subjects...</p>
      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : (
        <ShowSubjects subjects={filteredSubjects} fetchSubjects={fetchSubjects} />
      )}
    </div>
  );
};

export default AdminDashboard;
