import { useEffect, useState } from 'react';
import axios from 'axios';

const useUserVerification = () => {
  const [userInfo, setUserInfo] = useState(null); // To store user information
  const [isVerified, setIsVerified] = useState(null); // To store verification status
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3004/api/v1/user/me',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          }
        );
        if(response.status === 200){
            setUserInfo(response.data.user);
            setIsVerified(response.data.user.isVerified)
        }
      } catch (err) {
        setIsVerified(false);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return { userInfo, isVerified, loading, error }; // Return user info and verification status
};

export default useUserVerification;
