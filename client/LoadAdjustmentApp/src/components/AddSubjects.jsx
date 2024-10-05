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
    const newSemesters = Array.from({ length: years * 2 }, (_, i) => i + 1);
    setSemesters(newSemesters);
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
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={subjectData.year}
                onChange={handleInputChange}
                required
                style={styles.modalInput}
              />
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
              <input
                type="text"
                name="subjectName"
                placeholder="Subject Name"
                value={subjectData.subjectName}
                onChange={handleInputChange}
                required
                style={styles.modalInput}
              />
              <input
                type="text"
                name="subjectCode"
                placeholder="Subject Code"
                value={subjectData.subjectCode}
                onChange={handleInputChange}
                required
                style={styles.modalInput}
              />
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
                  <input
                    type="number"
                    name="numberOfClasses"
                    placeholder="Classes per Week"
                    value={subjectData.numberOfClasses}
                    onChange={handleInputChange}
                    required
                    style={styles.modalInput}
                  />
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
                <input
                  type="number"
                  name="labHours"
                  placeholder="Lab Hours per Week"
                  value={subjectData.labHours}
                  onChange={handleInputChange}
                  required
                  style={styles.modalInput}
                />
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
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '800px',
    margin: '50px auto',
    backgroundColor: '#fafafa',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: '30px',
  },
  subHeading: {
    fontSize: '18px',
    color: '#2980b9',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginRight: '10px',
    fontWeight: '500',
    color: '#34495e',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
  },
  subjectList: {
    backgroundColor: '#ecf0f1',
    borderRadius: '10px',
    padding: '15px',
  },
  emptyMessage: {
    color: '#7f8c8d',
    textAlign: 'center',
  },
  subjectItem: {
    backgroundColor: '#3498db',
    borderRadius: '5px',
    padding: '12px',
    marginBottom: '10px',
  },
  subjectText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '500px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  modalHeading: {
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '20px',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  modalInput: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  modalButtonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  modalAddButton: {
    backgroundColor: '#2980b9',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  modalCancelButton: {
    backgroundColor: '#c0392b',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default AddSubjects;
