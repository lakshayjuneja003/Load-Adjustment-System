import axios from "axios";
import { useEffect, useState } from "react";
import "../StylingsSheets/PendingRequests.css";
import { useNavigate } from "react-router-dom";
import TopNavBar from "./SuperAdminTopNav";

const AdminsPendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("Loading pending requests...");
  const [verifyState, setVerifyState] = useState("");
  const [editingFunctionalityIndex, setEditingFunctionalityIndex] = useState(null);
  const [editedFunctionalities, setEditedFunctionalities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3004/api/v1/superadmin/getPendingRequests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        if (response.data && response.data.pendingRequests) {
          if (response.data.pendingRequests.length > 0) {
            setRequests(response.data.pendingRequests);
            setStatus("Pending Requests:");
          } else {
            setStatus("No pending requests.");
          }
        } else {
          setStatus("Error occurred, please try again later.");
        }
      } catch (error) {
        console.error("Error occurred while fetching requests:", error);
        if (error.response && error.response.status === 401) {
          handleLogout(); // If unauthorized, log out user
        } else {
          setStatus("Unable to fetch requests. Please try again later.");
        }
      }
    };

    fetchData();
  }, []);

  // Handle accept with modified functionalities
  const handleAccept = async (id, originalPendingFunctionalities) => {
    const updatedFunctionalities = editedFunctionalities[id] || originalPendingFunctionalities;
    
    try {
      const response = await axios.put(
        `http://localhost:3004/api/v1/superadmin/verifyAdmin`,
        { userId: id, assignedFunctionalities: updatedFunctionalities },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setVerifyState("Verified successfully.");
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.userId._id !== id)
        );
      } else {
        setVerifyState("Error: Could not verify user. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      setVerifyState("Error: Please try again later.");
    }
  };

  // Handle rejection
  const handleReject = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3004/api/v1/superadmin/rejectAdmin`,
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setVerifyState("Rejected successfully.");
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.userId._id !== id)
        );
      } else {
        setVerifyState("Error: Could not reject user. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      setVerifyState("Error: Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/superAdmin/login");
  };

  // Toggle edit functionality
  const toggleEdit = (userId, index) => {
    setEditingFunctionalityIndex(index);
    if (!editedFunctionalities[userId]) {
      setEditedFunctionalities((prev) => ({
        ...prev,
        [userId]: requests.find((request) => request.userId._id === userId)?.pendingFunctionalities || [],
      }));
    }
  };

  // Handle functionality input change
  const handleInputChange = (userId, index, value) => {
    setEditedFunctionalities((prev) => {
      const updated = [...(prev[userId] || [])];
      updated[index] = value;
      return { ...prev, [userId]: updated };
    });
  };

  // Handle delete functionality
  const handleDeleteFunctionality = (userId, index) => {
    setEditedFunctionalities((prev) => {
      const updated = [...(prev[userId] || [])];
      updated.splice(index, 1); // Remove the functionality
      return { ...prev, [userId]: updated };
    });
  };

  return (
    <>
    <TopNavBar />
    <div className="pending-requests-container">
      <h2>{status}</h2>
      <div className="verify-status">{verifyState}</div>
      <div className="requests-list">
        {requests.length > 0 ? (
          requests.map((request, requestIndex) => (
            <div key={request.userId?._id} className="request-card">
              <div className="request-details">
                <p>
                  <strong>Name:</strong> {request.userId?.name}
                </p>
                <p>
                  <strong>Email:</strong> {request.userId?.email}
                </p>
                <p>
                  <strong>Employee ID:</strong> {request.userId?.empId}
                </p>
                <p>
                  <strong>Requested Functionalities:</strong>
                  <ul className="edit-Functionalities">
                    {(editedFunctionalities[request.userId?._id] || request.pendingFunctionalities).map(
                      (func, index) => (
                        <li key={index}>
                          {editingFunctionalityIndex === requestIndex ? (
                            <input
                              type="text"
                              value={func}
                              className="editable-input"
                              onChange={(e) =>
                                handleInputChange(request.userId?._id, index, e.target.value)
                              }
                            />
                          ) : (
                            <span>{func}</span>
                          )}
                          {editingFunctionalityIndex === requestIndex && (
                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDeleteFunctionality(request.userId?._id, index)
                              }
                            >
                              Delete
                            </button>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                </p>
              </div>
              <div className="request-actions">
                {editingFunctionalityIndex === requestIndex ? (
                  <button
                    className="save-btn"
                    onClick={() => setEditingFunctionalityIndex(null)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => toggleEdit(request.userId?._id, requestIndex)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="accept-btn"
                  onClick={() =>
                    handleAccept(request.userId?._id, request.pendingFunctionalities)
                  }
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(request.userId?._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending requests</p>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminsPendingRequests;
