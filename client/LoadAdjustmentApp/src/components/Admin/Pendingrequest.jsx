import axios from "axios";
import { useEffect, useState } from "react";
import "../StylingsSheets/pendingRequests.css";
import TopNavBar from "./TopNav";
import { useNavigate } from "react-router-dom";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [verifyState, setVerifyState] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3004/api/v1/admin/getPendingVerifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        console.log(response.data.pendingRequests);

        if (response.data && response.data.pendingRequests) {
          if (response.data.pendingRequests.length >= 1) {
            setRequests([...response.data.pendingRequests]);
            setStatus("Pending Requests:");
          } else {
            setStatus("No Pending requests");
          }
        } else {
          setStatus("Error occurred, please try again later");
        }
      } catch (error) {
        console.log("Error occurred:", error);
        setStatus("Unable to fetch requests");
      }
    };
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    console.log("Accepted user with id ", id);

    try {
      const response = await axios.post(
        `http://localhost:3004/api/v1/admin/verifyUser`,
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
    
      if (response.status === 200) {
        setVerifyState("Verified Successfully");

        // Remove the accepted user from the state
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.userId._id !== id)
        );
      } else {
        setVerifyState("Some error occurred, please try again.");
      }
    } catch (error) {
      setVerifyState("Some error occurred, try again later.");
    }
  };

  const handleReject = async (id) => {
    console.log(`Rejected request with ID: ${id}`);
    try {
        console.log("heelo from try block ");
        
      const response = await axios.post(
        `http://localhost:3004/api/v1/admin/rejectUser`,
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
  
      console.log(response);
      if (response.status === 200) {
        setVerifyState("Rejected Successfully");
  
        // Remove the rejected user from the state
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.userId._id !== id)
        );
      } else {
        setVerifyState("Some error occurred, please try again.");
      }
    } catch (error) {
      setVerifyState("Some error occurred, try again later.");
      console.log("Error occurred:", error);
    }
  };
  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/admin/login")
  }

  return (
    <>
    <TopNavBar role={"Admin"} handleLogout={handleLogout}/>
    <div className="pending-requests-container">
      <h2>{status}</h2>
      <div className="verify-status">{verifyState}</div>
      <div className="requests-list">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-details">
                <p><strong>Name:</strong> {request.userId.name}</p>
                <p><strong>Email:</strong> {request.userId.email}</p>
                <p><strong>Employee ID:</strong> {request.userId.empId}</p>
              </div>
              <div className="request-actions">
                <button className="accept-btn" onClick={() => handleAccept(request.userId._id)}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => handleReject(request.userId._id)}>
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No Pending Requests</p>
        )}
      </div>
    </div>
    </>
  );
};

export default PendingRequests;
