import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SemesterItem.css';
import SemesterItem from './SemsterItem';
import TopNavBar from '../../Admin/TopNav';
import { useNavigate } from 'react-router-dom';

const SemestersList = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:3004/api/v1/user/getActiveSemestersWithSubjects' , {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true, 
        });
        console.log(response);
        
        if(response.status == 200){
            setSemesters(response.data.data); 
            setLoading(false);
        }
        else{
            console.log("some error occured");
        }
      } catch (err) {
        setError('Failed to fetch semesters. Please try again later.');
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        navigate("/staff/login")
    }

  return (
    <>
    <TopNavBar role={"Staff"} handleLogout={handleLogout} />
    <div className="semesters-list">
      <h2>Active Semesters and Subjects</h2>
      {semesters.length === 0 ? (
        <div className="no-data">No active semesters found.</div>
      ) : (
        semesters.map((semesterItem) => (
          <SemesterItem key={semesterItem.semester} semesterDetails={semesterItem} />
        ))
      )}
      {/* {semesters.length > 0 && <SubmitButton semesters={semesters} />} */}
    </div>
    </>
  );
};

export default SemestersList;
