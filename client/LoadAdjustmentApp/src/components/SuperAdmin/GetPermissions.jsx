import axios from "axios";
import { useEffect, useState } from "react";
import "../StylingsSheets/GetPermissions.css";

const GetPermissions = () => {
    const [data, setData] = useState([]);
    const [err, setErr] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("http://localhost:3004/api/v1/superadmin/getPermissions", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });

                if (res.status === 200) {
                    setData(res.data?.permissions?.permissions);
                } else {
                    setErr("No permissions found.");
                }
            } catch (error) {
                setErr("Some error occurred");
                console.error(error);
            }
        };
        getData();
    }, []);

    return (
        <div className="get-permissions">
            <h4>Your Added Permissions : </h4>
            {data.length > 0 ? (
                data.map((val, index) => (
                    <div key={index} className="value">{val}</div>
                ))
            ) : (
                <div className="no-permissions-message">No Permissions Found! Please set some permissions first.</div>
            )}
            {err && <div className="error-message">{err}</div>}
        </div>
    );
};

export default GetPermissions;
