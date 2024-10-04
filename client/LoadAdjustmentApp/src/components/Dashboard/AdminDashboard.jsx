import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetchSubjects from '../../customHooks/UseFetchSubjects'; // Custom hook for fetching subjects

const AdminDashboard = () => {
  const { subjects, loading, error } = useFetchSubjects(); // Use custom hook to get subjects data
  const [selectedSemester, setSelectedSemester] = useState('All'); // State to track selected semester

  // Function to filter subjects based on the selected semester
  const filteredSubjects = selectedSemester === 'All' 
    ? subjects 
    : subjects.filter(subject => subject.semester.toString() === selectedSemester);

  // Function to handle semester selection change
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  return (
    <div style={styles.container}>
      {/* Dashboard Header */}
      <div style={styles.header}>
        <h2 style={styles.dashboardTitle}>Admin Dashboard</h2>
        <Link to="/admin/add-subjects" style={styles.button}>
          Add Subjects
        </Link>
      </div>

      {/* Welcome Box */}
      <div style={styles.welcomeBox}>
        <p>Welcome, Admin! Here you can manage all user accounts and system settings.</p>
      </div>

      {/* Semester Selection Dropdown */}
      <div style={styles.filterBox}>
        <label style={styles.filterLabel}>Filter by Semester: </label>
        <select style={styles.selectBox} value={selectedSemester} onChange={handleSemesterChange}>
          <option value="All">All</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>
      </div>

      {/* Display Subjects Created by Admin */}
      <div style={styles.subjectList}>
        <h3 style={styles.sectionTitle}>Subjects for {selectedSemester === 'All' ? 'All Semesters' : `Semester ${selectedSemester}`}</h3>
        {loading ? (
          <p>Loading subjects...</p>
        ) : error ? (
          <p style={styles.errorText}>Error: {error}</p>
        ) : filteredSubjects.length === 0 ? (
          <p>No subjects found for this semester. Use the 'Add Subjects' button above to add new subjects.</p>
        ) : (
          <div style={styles.subjectGrid}>
            {filteredSubjects.map((subject, index) => (
              <div key={index} style={styles.subjectCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.subjectName}>{subject.subjectName}</span>
                  <span style={styles.subjectCode}>{subject.subjectCode}</span>
                </div>
                <div style={styles.cardBody}>
                  <p><strong>Year:</strong> {subject.year}</p>
                  <p><strong>Semester:</strong> {subject.semester}</p>
                  <p><strong>Type:</strong> {subject.subjectType}</p>
                  <p><strong>Credit Points:</strong> {subject.creditPoints}</p>
                  {subject.subjectType === 'Theory' ? (
                    <>
                      <p><strong>Classes per Week:</strong> {subject.numberOfClasses}</p>
                      <p><strong>Tutorials per Week:</strong> {subject.numberOfTutorials}</p>
                    </>
                  ) : (
                    <p><strong>Lab Hours per Week:</strong> {subject.labHours}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Define styles for the component
const styles = {
  container: {
    display: 'block',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px 0',
    borderBottom: '2px solid #007bff',
  },
  dashboardTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  welcomeBox: {
    backgroundColor: '#f7f9fc',
    padding: '20px',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  filterBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filterLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  selectBox: {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
  },
  subjectList: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  errorText: {
    color: 'red',
  },
  subjectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  subjectCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
    paddingBottom: '8px',
  },
  subjectName: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  subjectCode: {
    color: '#555',
    fontSize: '14px',
  },
  cardBody: {
    fontSize: '16px',
    lineHeight: '1.5',
  },
};

export default AdminDashboard;
