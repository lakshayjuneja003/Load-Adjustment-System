import axios from "axios";
import { useEffect, useState } from "react";
import "../StylingsSheets/GetAdmins.css"; // Add your custom CSS for styling

const GetAdmins = () => {
    const [adminsData, setAdminsData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state for better UX

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("http://localhost:3004/api/v1/superadmin/getadmins", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    withCredentials: true,
                });

                if (res.status === 200 && res.data.adminList.length > 0) {
                    setAdminsData(res.data.adminList);
                    console.log(res.data);
                    
                } else {
                    setErrorMessage("No admin found.");
                }
            } catch (error) {
                setErrorMessage("Something went wrong. Please try again later.");
            } finally {
                setLoading(false); // End loading state
            }
        };

        getData();
    }, []);

    return (
        <div className="admins-container">
            {loading ? (
                <div className="loading-message">Loading admins...</div>
            ) : (
                <>
                    {adminsData.length > 0 ? (
                        <div className="admins-list">
                            {adminsData.map((admin, index) => (
                                <div key={index} className="admin-item">
                                    <div className="admin-name">{admin.name}</div>
                                    <div className="admin-dept">{admin.adminDept}</div>
                                    <div className="isVerified">{admin?.isVerified}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="error-message">{errorMessage}</div>
                    )}
                </>
            )}
        </div>
    );
};

export default GetAdmins;
