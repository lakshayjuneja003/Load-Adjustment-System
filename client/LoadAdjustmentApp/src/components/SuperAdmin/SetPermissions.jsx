import { useState } from "react";
import TopNavBar from "./SuperAdminTopNav.jsx";
import "../StylingsSheets/SetPermissions.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GetPermissions from "./GetPermissions.jsx";

const SetPermissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [editableIndex, setEditableIndex] = useState(null);  // Track which permission is being edited
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const value = e.target.value.trim();
        if (value && !permissions.includes(value)) {
            setPermissions([...permissions, value]);
        }
        e.target.value = "";  // Clear input after adding
    };

    const handlePermissionDoubleClick = (index) => {
        setEditableIndex(index);  // Set index to make the permission editable
    };

    const handlePermissionEdit = (e, index) => {
        const updatedPermissions = [...permissions];
        updatedPermissions[index] = e.target.value;
        setPermissions(updatedPermissions);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            setEditableIndex(null);  // Exit edit mode on pressing Enter
        }
    };

    const handleSubmit = async () => {
        if (!permissions || permissions.length === 0) {
            alert("Please add some permissions before submitting.");
            return;
        }
        
        console.log("Permissions being sent:", permissions);  // Debugging

        try {
            const response = await axios.put(
                'http://localhost:3004/api/v1/superadmin/setPermissions', 
                { permissions },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    withCredentials: true,
                }
            );
            
            if (response.status === 200) {
                alert("Permissions added successfully.");
                navigate("/superadmin/dashboard")
            } else { 
                alert("Error in setting permissions.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <TopNavBar />
            <div className="permissions">
                <h4 className="statictext">Set Permissions for Admins:</h4>
                <input 
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleInputChange(e);
                    }}
                    type="text" 
                    placeholder="Enter permission and press Enter"
                />
                <div className="see-permissions">
                    {permissions.map((val, index) => (
                        <div key={index} className="permission-item">
                            <input
                                type="text"
                                value={val}
                                readOnly={editableIndex !== index}
                                onDoubleClick={() => handlePermissionDoubleClick(index)}
                                onChange={(e) => handlePermissionEdit(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        </div>
                    ))}
                </div>
                <button 
                    className="btn"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>

            <GetPermissions/>
        </>
    );
};

export default SetPermissions;
