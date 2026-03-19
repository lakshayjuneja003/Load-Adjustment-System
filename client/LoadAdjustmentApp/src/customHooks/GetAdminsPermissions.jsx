import axios from "axios";
import { useEffect, useState } from "react";

const useGetAdminPermissions = (superAdminId) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!superAdminId) return;

    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3004/api/v1/admin/getpermissions", {
          params: { adminCreatedBy: superAdminId }
        });
        

        if (response.status === 200) {
          setPermissions(response.data?.permissionsList?.permissions || []);
          setError("");
        } else {
          setError("Error while fetching the permissions.");
          console.log(response);
          
        }
      } catch (err) {
        setError("Error occurred while fetching permissions.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [superAdminId]);

  return { permissions, loading, error };
};

export default useGetAdminPermissions;
