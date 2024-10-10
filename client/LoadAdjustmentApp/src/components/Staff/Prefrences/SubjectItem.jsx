import React, { useState } from 'react';
import './SubjectItem.css';

const SubjectItem = ({ subject }) => {
  const [selected, setSelected] = useState(false);

  const handleSelection = () => {
    setSelected((prev) => !prev);
  };

  return (
    <div className={`subject-item ${selected ? 'selected' : ''}`} onClick={handleSelection}>
      <h4>{subject.subjectName} ({subject.subjectCode})</h4>
      <p>Type: {subject.subjectType}</p>
      <p>Credit Points: {subject.creditPoints}</p>
    </div>
  );
};

export default SubjectItem;