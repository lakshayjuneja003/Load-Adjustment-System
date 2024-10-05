import React, { useState } from 'react';
import axios from 'axios';
import '../StylingsSheets/ShowSubjects.css';

const ShowSubjects = ({ subjects, fetchSubjects }) => {
  const [editFormData, setEditFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Handle Edit Click
  const handleEditClick = (subject) => {
    setEditFormData({ ...subject });
    setShowModal(true);
  };

  // Handle Delete Click
  const handleDeleteClick = async (subjectId) => {
    try {
      // Delete request to the backend
      const response = await axios.delete(
        `http://localhost:3004/api/v1/admin/subject/delete/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.message) {
        alert(response.data.message);
        fetchSubjects(); // Fetch the updated list of subjects
      } else {
        alert('Subject deleted successfully.');
        fetchSubjects();
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Failed to delete subject. Please try again.');
    }
  };

  // Handle Field Change in the Edit Modal
  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // Automatically calculate credit points
      if (updatedData.subjectType === 'Theory') {
        updatedData.creditPoints =
          parseInt(updatedData.lecturesPerWeek || 0) +
          parseInt(updatedData.totalTutorials || 0);
      } else if (updatedData.subjectType === 'Lab') {
        updatedData.creditPoints = parseInt(updatedData.labHours || 0);
      }
      return updatedData;
    });
  };

  // Save Edited Subject
  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3004/api/v1/admin/subject/update/${editFormData._id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.message) {
        alert(response.data.message);
      } else {
        alert('Subject updated successfully.');
      }
      setShowModal(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error updating subject:', error);
      alert('Failed to update subject. Please try again.');
    }
  };

  return (
    <div>
      {/* Subject Cards */}
      <div className="subject-grid">
        {subjects.map(subject => (
          <div key={subject._id} className="subject-card">
            <div className="card-body">
              <p className="subject-name">
                <strong>{subject.subjectName}</strong> ({subject.subjectCode})
              </p>
              <p>Year: {subject.year}, Semester: {subject.semester}</p>
              <p>Credit Points: {subject.creditPoints}</p>

              {/* Edit Button */}
              <button className="edit-button" onClick={() => handleEditClick(subject)}>Edit</button>

              {/* Delete Button */}
              <button className="delete-button" onClick={() => handleDeleteClick(subject._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Subject</h2>
            <form className="modal-form">
              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  className="modal-input"
                  name="subjectName"
                  value={editFormData.subjectName || ''}
                  onChange={handleFieldChange}
                  placeholder="Enter Subject Name"
                />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  className="modal-input"
                  name="subjectCode"
                  value={editFormData.subjectCode || ''}
                  onChange={handleFieldChange}
                  placeholder="Enter Subject Code"
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  className="modal-input"
                  name="year"
                  value={editFormData.year || ''}
                  onChange={handleFieldChange}
                  placeholder="Enter Year"
                />
              </div>
              <div className="form-group">
                <label>Semester</label>
                <select
                  className="modal-input"
                  name="semester"
                  value={editFormData.semester || ''}
                  onChange={handleFieldChange}
                >
                  {/* Restrict Semesters Based on Year */}
                  {[...Array(2)].map((_, i) => (
                    <option key={i} value={(editFormData.year - 1) * 2 + i + 1}>
                      Semester {(editFormData.year - 1) * 2 + i + 1}
                    </option>
                  ))}
                </select>
              </div>
              {/* Conditional Fields for Theory and Lab */}
              {editFormData.subjectType === 'Theory' ? (
                <>
                  <div className="form-group">
                    <label>No. of Lectures per Week</label>
                    <input
                      type="number"
                      className="modal-input"
                      name="lecturesPerWeek"
                      value={editFormData.lecturesPerWeek || 0}
                      onChange={handleFieldChange}
                      placeholder="Enter Lectures per Week"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Tutorials</label>
                    <input
                      type="number"
                      className="modal-input"
                      name="totalTutorials"
                      value={editFormData.totalTutorials || 0}
                      onChange={handleFieldChange}
                      placeholder="Enter Total Tutorials"
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Number of Lab Hours</label>
                  <input
                    type="number"
                    className="modal-input"
                    name="labHours"
                    value={editFormData.labHours || 0}
                    onChange={handleFieldChange}
                    placeholder="Enter Lab Hours"
                  />
                </div>
              )}

              <div className="button-container">
                <button type="button" className="save-button" onClick={handleSaveClick}>Save</button>
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowSubjects;
