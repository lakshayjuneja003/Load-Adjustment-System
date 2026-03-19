import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DepartmentForm.css';

const DepartmentForm = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [courses, setCourses] = useState([{ courseName: '' }]);
  const [addedDepartments, setAddedDepartments] = useState([]); // State to store added departments

  // Function to handle course addition
  const addCourse = () => {
    setCourses([...courses, { courseName: '' }]);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      departmentName,
      courses,
    };

    try {
      const response = await axios.put('http://localhost:3004/api/v1/superadmin/departmentsdata', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      console.log(response);
      alert('Department added successfully!');

      // Clear the input fields
      setDepartmentName('');
      setCourses([{ courseName: '' }]); // Reset courses to initial state

      // Update the addedDepartments state to show the new department
      setAddedDepartments((prevDepartments) => [
        ...prevDepartments,
        { departmentName, courses, numberOfAdmins: 0 }, // Include initial admin count
      ]);

    } catch (error) {
      console.error('Error saving department details', error);
      alert('Failed to save department details.');
    }
  };

  // Fetch added departments on component mount
  useEffect(() => {
    const fetchAddedDeps = async () => {
      try {
        const response = await axios.get('http://localhost:3004/api/v1/superadmin/getaddeddeps', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        console.log(response);
        
        if (response.data.deps) {
          setAddedDepartments(response.data.deps); // Update the state with fetched departments
        }
      } catch (error) {
        console.error('Error fetching added departments', error);
        alert('Failed to fetch added departments.');
      }
    };

    fetchAddedDeps(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="department-form-container">
      <form className="department-form" onSubmit={handleSubmit}>
        <h2>Set Department Details</h2>

        <div className="form-group">
          <label htmlFor="departmentName">Department Name:</label>
          <input
            id="departmentName"
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {/* Courses Section */}
        {courses.map((course, courseIndex) => (
          <div key={courseIndex} className="course-section">
            <h3>Course {courseIndex + 1}</h3>
            <div className="form-group">
              <label htmlFor={`courseName-${courseIndex}`}>Course Name:</label>
              <input
                id={`courseName-${courseIndex}`}
                type="text"
                value={course.courseName}
                onChange={(e) => {
                  const updatedCourses = [...courses];
                  updatedCourses[courseIndex].courseName = e.target.value;
                  setCourses(updatedCourses);
                }}
                required
                className="form-input"
              />
            </div>
          </div>
        ))}

        {/* Add More Courses */}
        <button type="button" onClick={addCourse} className="btn">
          Add Another Course
        </button>

        {/* Submit Form */}
        <button type="submit" className="btn btn-submit">Submit Department Details</button>
      </form>

      {/* Display Added Departments */}
      <div className="added-departments">
        <h2>Added Departments</h2>
        {addedDepartments.length > 0 ? (
          addedDepartments.map((dept, index) => (
            <div key={index} className="department-item">
              <h3>{dept.departmentName}</h3>
              <p><strong>Number of Admins:</strong> {dept?.admins || 0}</p>
              <p><strong>Courses Offered:</strong></p>
              <ul>
                {dept.courses.map((course, courseIndex) => (
                  <li key={courseIndex}>{course.courseName}</li>
                ))}
              </ul>
              {/* Add any additional important info here */}
              <hr />
            </div>
          ))
        ) : (
          <p>No departments added yet.</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentForm;
