import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3004/api/v1/admin/subjects', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      if (response.data) {
        setSubjects(response.data.data); // handle the response data
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching subjects');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects initially when the component mounts
  useEffect(() => {
    fetchSubjects();
  }, []);

  return { subjects, loading, error, fetchSubjects };
};

export default useFetchSubjects;
