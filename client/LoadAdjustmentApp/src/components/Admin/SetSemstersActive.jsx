import React, { useState } from 'react';
import axios from 'axios';

const SetSemesters = () => {
  // State variables
  const [numberOfYears, setNumberOfYears] = useState(0); // Number of years input
  const [semesters, setSemesters] = useState([]); // Array representing each semester
  const [activeSemesters, setActiveSemesters] = useState([]); // Selected active semesters
  const [error, setError] = useState('');

  // Handle input change for number of years
  const handleYearsChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (value < 1 || value > 6) { // Ensure input is within a valid range
      setError('Please enter a valid number of years between 1 and 6.');
      return;
    }

    setNumberOfYears(value);
    const totalSemesters = value * 2; // Calculate total semesters (2 semesters per year)
    setSemesters(Array.from({ length: totalSemesters }, (_, index) => index + 1));
    setActiveSemesters([]); // Reset active semesters on change
    setError(''); // Clear error on change
  };

  // Handle semester selection
  const handleSemesterSelection = (semester) => {
    if (activeSemesters.includes(semester)) {
      // If already selected, remove it
      setActiveSemesters(activeSemesters.filter((sem) => sem !== semester));
    } else {
      if (activeSemesters.length < numberOfYears) { // Allow selection up to the specified number of years
        setActiveSemesters([...activeSemesters, semester]);
      } else {
        setError(`You can only activate up to ${numberOfYears} semesters.`);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (activeSemesters.length < 1 || activeSemesters.length !== numberOfYears) {
      setError(`Please select exactly ${numberOfYears} active semester(s) before submitting.`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3004/api/v1/admin/setCurrentSems', {
        totalSemesters: numberOfYears * 2, // Calculated total semesters
        activeSemesters,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Semester configuration updated:', response.data);
      alert('Semesters successfully configured.');
    } catch (err) {
      console.error('Error updating semester configuration:', err);
      setError('Failed to update semesters. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>Set Semester Configuration</h2>

      {/* Number of Years Input */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Number of Years:
          <input
            type="number"
            value={numberOfYears}
            onChange={handleYearsChange}
            min="1"
            max="6"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      {/* Display Semesters */}
      <div style={{ marginBottom: '20px' }}>
        {semesters.length > 0 && (
          <div>
            <h3>Select Active Semesters (Max: {numberOfYears})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {semesters.map((semester) => (
                <div
                  key={semester}
                  onClick={() => handleSemesterSelection(semester)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: activeSemesters.includes(semester) ? '#4caf50' : '#e0e0e0',
                    color: activeSemesters.includes(semester) ? '#fff' : '#000',
                  }}
                >
                  Semester {semester}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Warning Note for Admin */}
      <div style={{ marginBottom: '20px', color: activeSemesters.length !== numberOfYears ? 'red' : 'green' }}>
        {activeSemesters.length === 0 ? (
          <p>
            ** Warning: You haven't activated any semesters. Your staff members will not see any subjects in the preference form & also don't forget to add subjects for the sems you will be activating so that your users can see the activated subjects according to that sem!
          </p>
        ) : activeSemesters.length !== numberOfYears ? (
          <p>
            ** Note: You have activated only {activeSemesters.length} semester(s). Please ensure that the number of active semesters matches the number of years specified ({numberOfYears}).
          </p>
        ) : (
          <p>
            All set! You have activated the required {activeSemesters.length} semesters. Feel free to submit the configuration.
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        style={{ padding: '10px 20px', backgroundColor: activeSemesters.length !== numberOfYears ? 'grey' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        disabled={activeSemesters.length !== numberOfYears}
      >
        Submit
      </button>
    </div>
  );
};

export default SetSemesters;
