import axios from "axios";
import { useEffect, useState } from "react";
import TopNavBar from "./SuperAdminTopNav";

const SuperAdminProfile = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("http://localhost:3004/api/v1/superadmin/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });

                if (res.status === 200) {
                    setData(res.data?.user);
                }
            } catch (err) {
                console.error("Error fetching super admin data:", err);
                setError("Failed to fetch data. Please try again later.");
            }
        };

        getData();
    }, []);

    return (
        <>
            <TopNavBar />
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
                {error ? (
                    <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
                ) : data ? (
                    <div style={{ backgroundColor: "#f9f9f9", borderRadius: "10px", padding: "20px" }}>
                        <h3 style={{ color: "#333", textAlign: "center" }}>
                            Hello! Super Admin <span style={{ color: "#007BFF" }}>{data?.name}</span>
                        </h3>
                        <h4 style={{ color: "#555", marginBottom: "10px" }}>Email: {data?.email}</h4>
                        <h6 style={{ color: "#666", fontSize: "16px", marginBottom: "10px" }}>Departments under you:</h6>
                        {data?.departmentNames?.length > 0 ? (
                            data.departmentNames.map((e, i) => (
                                <h5
                                    key={i}
                                    style={{
                                        color: "#007BFF",
                                        backgroundColor: "#e8f4ff",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        margin: "5px 0",
                                    }}
                                >
                                    {e}
                                </h5>
                            ))
                        ) : (
                            <p style={{ color: "#999" }}>No departments available.</p>
                        )}
                    </div>
                ) : (
                    <p style={{ color: "#555", textAlign: "center" }}>Loading...</p>
                )}
            </div>
        </>
    );
};

export default SuperAdminProfile;
