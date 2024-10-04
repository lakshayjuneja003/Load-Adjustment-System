import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:3004/api/v1/admin/subjects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });

        // Updated to match the backend response structure
        if (response.data) {
          setSubjects(response.data.data); // handle the response data
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { subjects, loading, error };
};

export default useFetchSubjects;
