import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../StylingsSheets/AdminProfile.css';
import TopNavBar from './TopNav';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3004/api/v1/admin/me',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <TopNavBar role={"Admin"}/>
    <div className="profile-container">
      <h2>Admin Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    </>
  );
};

export default AdminProfile;
