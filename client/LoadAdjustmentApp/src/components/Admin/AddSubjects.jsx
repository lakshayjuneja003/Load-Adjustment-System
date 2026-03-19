import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNavBar from './TopNav';

const AddSubjects = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectData, setSubjectData] = useState({
    year: '',
    semester: '',
    department: '',
    subjectName: '',
    subjectCode: '',
    subjectType: '',
    numberOfClasses: '',
    numberOfTutorials: '',
    labHours: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditPoints, setCreditPoints] = useState(0);

  useEffect(() => {
    if (years) {
      const newSemesters = Array.from({ length: years * 2 }, (_, i) => i + 1);
      setSemesters(newSemesters);
    }
  }, [years]);

  useEffect(() => {
    let calculatedCreditPoints = 0;
    if (subjectData.subjectType === 'Theory') {
      calculatedCreditPoints = parseInt(subjectData.numberOfClasses || 0) + parseInt(subjectData.numberOfTutorials || 0);
    } else if (subjectData.subjectType === 'Lab') {
      calculatedCreditPoints = parseInt(subjectData.labHours || 0);
    }
    setCreditPoints(calculatedCreditPoints);
  }, [subjectData.numberOfClasses, subjectData.numberOfTutorials, subjectData.labHours, subjectData.subjectType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSubject = () => {
    const newSubject = {
      year: subjectData.year,
      semester: subjectData.semester,
      department: subjectData.department,
      subjectName: subjectData.subjectName,
      subjectCode: subjectData.subjectCode,
      subjectType: subjectData.subjectType,
      creditPoints,
    };

    if (subjectData.subjectType === 'Theory') {
      newSubject.numberOfClasses = subjectData.numberOfClasses;
      newSubject.numberOfTutorials = subjectData.numberOfTutorials;
    } else if (subjectData.subjectType === 'Lab') {
      newSubject.labHours = subjectData.labHours;
    }

    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);

    setSubjectData({
      year: '',
      semester: '',
      department:'',
      subjectName: '',
      subjectCode: '',
      subjectType: '',
      numberOfClasses: '',
      numberOfTutorials: '',
      labHours: '',
    });
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjects.length === 0) {
      alert('Please add at least one subject before submitting.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3004/api/v1/admin/add-subjects',
        {
          years: parseInt(years),
          subjects,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to add subjects.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <>
      <TopNavBar role={"Admin"} />
      <div style={styles.container}>
        <h1 style={styles.heading}>Add Subjects</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Years:</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.subjectList}>
            <h2 style={styles.subHeading}>Added Subjects</h2>
            {subjects.length === 0 ? (
              <p style={styles.emptyMessage}>No subjects added yet.</p>
            ) : (
              subjects.map((subject, index) => (
                <div key={index} style={styles.subjectItem}>
                  <span style={styles.subjectText}>
                    {`Year: ${subject.year}, Semester: ${subject.semester}, Name: ${subject.subjectName}, Code: ${subject.subjectCode}, Credit Points: ${subject.creditPoints}`}
                  </span>
                </div>
              ))
            )}
          </div>

          <button type="button" onClick={() => setIsModalOpen(true)} style={styles.addButton}>
            + Add Subject
          </button>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              Submit All Subjects
            </button>
            <button type="button" style={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>

        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h2 style={styles.modalHeading}>Add Subject</h2>
              <div style={styles.modalForm}>
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  value={subjectData.year}
                  onChange={handleInputChange}
                  required
                  style={styles.modalInput}
                />
                <label>Semester</label>
                <select
                  name="semester"
                  value={subjectData.semester}
                  onChange={handleInputChange}
                  required
                  style={styles.modalInput}
                >
                  <option value="">Select Semester</option>
                  {semesters.map((semester, index) => (
                    <option key={index} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={subjectData.department}
                  onChange={handleInputChange}
                  required
                  style={styles.modalInput}
                />
                <label>Subject Name</label>
                <input
                  type="text"
                  name="subjectName"
                  placeholder="Subject Name"
                  value={subjectData.subjectName}
                  onChange={handleInputChange}
                  required
                  style={styles.modalInput}
                />
                <label>Subject Code</label>
                <input
                  type="text"
                  name="subjectCode"
                  placeholder="Subject Code"
                  value={subjectData.subjectCode}
                  onChange={handleInputChange}
                  required
                  style={styles.modalInput}
                />
                <label>Subject Type</label>
                <select
                  name="subjectType"
                  value={subjectData.subjectType}
                  onChange={handleInputChange}
                  required
                  style={styles.modalInput}
                >
                  <option value="">Select Type</option>
                  <option value="Theory">Theory</option>
                  <option value="Lab">Lab</option>
                </select>

                {subjectData.subjectType === 'Theory' && (
                  <>
                    <label>Classes per Week</label>
                    <input
                      type="number"
                      name="numberOfClasses"
                      placeholder="Classes per Week"
                      value={subjectData.numberOfClasses}
                      onChange={handleInputChange}
                      required
                      style={styles.modalInput}
                    />
                    <label>Number of Tutorials</label>
                    <input
                      type="number"
                      name="numberOfTutorials"
                      placeholder="Number of Tutorials"
                      value={subjectData.numberOfTutorials}
                      onChange={handleInputChange}
                      required
                      style={styles.modalInput}
                    />
                  </>
                )}

                {subjectData.subjectType === 'Lab' && (
                  <>
                    <label>Lab Hours per Week</label>
                    <input
                      type="number"
                      name="labHours"
                      placeholder="Lab Hours per Week"
                      value={subjectData.labHours}
                      onChange={handleInputChange}
                      required
                      style={styles.modalInput}
                    />
                  </>
                )}

                <p style={styles.creditDisplay}>Calculated Credit Points: {creditPoints}</p>
              </div>

              <div style={styles.modalButtonGroup}>
                <button type="button" onClick={handleAddSubject} style={styles.modalAddButton}>
                  Add Subject
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.modalCancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '80px 20px', // Adjusted padding to account for TopNavBar height
    margin: '0 auto',
    maxWidth: '800px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  heading: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
  },
  label: {
    fontSize: '1rem',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  subjectList: {
    marginTop: '20px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  subHeading: {
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  emptyMessage: {
    fontSize: '1rem',
    color: '#999',
  },
  subjectItem: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  subjectText: {
    fontSize: '1rem',
    color: '#333',
  },
  addButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
  },
  modalHeading: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  modalInput: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  modalButtonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  modalAddButton: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalCancelButton: {
    padding: '10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  creditDisplay: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default AddSubjects;
