import React from 'react';
import axios from 'axios';
import './Submitbtn.css';

const SubmitButton = ({ semesters }) => {
  const handleSubmit = async () => {
    // Collect selected subjects for each semester
    const selectedSubjects = semesters.map((sem) => ({
      semester: sem.semester,
      selectedSubjects: sem.subjects.filter((subj) => subj.selected), // Check SubjectItem's state for selection
    }));

    // Check if any active semester has no subjects selected
    if (selectedSubjects.some((sem) => sem.selectedSubjects.length === 0)) {
      alert('Please select at least one subject from each active semester.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3004/api/v1/user/submitPreferences', {
        selectedSubjects,
      });
      console.log('Preferences submitted successfully', response);
    } catch (error) {
      console.error('Failed to submit preferences', error);
    }
  };

  return (
    <button className="submit-btn" onClick={handleSubmit}>
      Submit Preferences
    </button>
  );
};

export default SubmitButton;
