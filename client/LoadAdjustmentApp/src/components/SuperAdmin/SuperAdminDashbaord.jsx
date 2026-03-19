import { useNavigate } from "react-router-dom";
import TopNavBar from "./SuperAdminTopNav.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import "./superAdminDashboard.css"; // Updated CSS file
import GetAdmins from "./GetAdmins.jsx";

const SuperAdminDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/superAdmin/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3004/api/v1/superadmin/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setUserDetails(response.data.user);
        } else {
          setError("Failed to fetch user details.");
        }
      } catch (error) {
        setError("Error in fetching details. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <TopNavBar />
      <div className="dashboard-container">
        {error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : userDetails ? (
          <div className="admin-info">
            <h2>Welcome, {userDetails.name}!</h2>
            <p>Email: {userDetails.email}</p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}

        <GetAdmins/>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
