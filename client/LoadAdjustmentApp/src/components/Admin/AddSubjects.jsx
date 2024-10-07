import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddSubjects = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectData, setSubjectData] = useState({
    year: '',
    semester: '',
    subjectName: '',
    subjectCode: '',
    subjectType: '',
    numberOfClasses: '',
    numberOfTutorials: '',
    labHours: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditPoints, setCreditPoints] = useState(0);

  // Automatically generate semesters based on the number of years entered
  useEffect(() => {
    if (years) {
      const newSemesters = Array.from({ length: years * 2 }, (_, i) => i + 1);
      setSemesters(newSemesters);
    }
  }, [years]);

  // Calculate credit points dynamically based on subject type and input values
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
      console.log(response);
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
  );
};
const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#121212',
    color: '#E0E0E0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#00ADB5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#EEEEEE',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #00ADB5',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    outline: 'none',
  },
  subjectList: {
    padding: '20px',
    backgroundColor: '#1E1E1E',
    borderRadius: '8px',
    border: '1px solid #00ADB5',
  },
  subHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  emptyMessage: {
    fontSize: '16px',
    color: '#888888',
  },
  subjectItem: {
    margin: '5px 0',
    padding: '10px',
    backgroundColor: '#2E2E2E',
    borderRadius: '4px',
    border: '1px solid #00ADB5',
  },
  subjectText: {
    fontSize: '16px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#00ADB5',
    color: '#121212',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    margin: '20px 0',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#00ADB5',
    color: '#121212',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#E63946',
    color: '#121212',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#121212',
    padding: '30px',
    borderRadius: '8px',
    width: '600px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    color: '#E0E0E0',
  },
  modalHeading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#00ADB5',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  modalInput: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #00ADB5',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    outline: 'none',
  },
  creditDisplay: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#00ADB5',
    textAlign: 'center',
    marginTop: '10px',
  },
  modalButtonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  modalAddButton: {
    padding: '10px 20px',
    backgroundColor: '#00ADB5',
    color: '#121212',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  modalCancelButton: {
    padding: '10px 20px',
    backgroundColor: '#E63946',
    color: '#121212',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
};


export default AddSubjects;
