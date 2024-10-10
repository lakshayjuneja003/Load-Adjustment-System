import React from 'react';
import SubjectItem from './SubjectItem';
import './SemesterItem.css';

const SemesterItem = ({ semesterDetails }) => {
  const { semester, subjects } = semesterDetails;

  return (
    <div className="semester-item">
      <h3>Semester {semester}</h3>
      {subjects.length > 0 ? (
        <div className="subjects-list">
          {subjects.map((subject) => (
            <SubjectItem key={subject._id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="no-subjects">No subjects available for this semester.</div>
      )}
    </div>
  );
};

export default SemesterItem;
