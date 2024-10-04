import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddSubjects = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState('');
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
    creditPoints: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      creditPoints: subjectData.creditPoints,
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
      creditPoints: '',
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
                  {`Year: ${subject.year}, Semester: ${subject.semester}, Name: ${subject.subjectName}, Code: ${subject.subjectCode}`}
                </span>
              </div>
            ))
          )}
        </div>

        <button type="button" onClick={() => setIsModalOpen(true)} style={styles.addButton}>
          + Add Subject
        </button>
        <button type="submit" style={styles.submitButton}>
          Submit All Subjects
        </button>
        <button type="button" style={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
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
              <input
                type="number"
                name="semester"
                placeholder="Semester"
                value={subjectData.semester}
                onChange={handleInputChange}
                required
                style={styles.modalInput}
              />
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
              <input
                type="number"
                name="creditPoints"
                placeholder="Credit Points"
                value={subjectData.creditPoints}
                onChange={handleInputChange}
                required
                style={styles.modalInput}
              />
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
    borderRadius: '10px',
    maxWidth: '700px',
    margin: 'auto',
    backgroundColor: '#f0f4f7',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  subHeading: {
    color: '#007bff',
    marginBottom: '10px',
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
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    flex: 1,
  },
  subjectList: {
    borderRadius: '5px',
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  emptyMessage: {
    color: '#999',
  },
  subjectItem: {
    backgroundColor: '#e3f2fd',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  },
  subjectText: {
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '400px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  modalHeading: {
    textAlign: 'center',
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
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalCancelButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AddSubjects;
