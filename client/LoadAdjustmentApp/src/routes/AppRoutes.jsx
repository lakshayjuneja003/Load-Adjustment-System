import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../components/Admin/AdminDashboard";
import StaffDashboard from "../components/Staff/StaffDashboard";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import AddSubjects from "../components/Admin/AddSubjects"; // Import the AddSubjects component
import AdminProfile from "../components/Admin/AdminProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin">
        <Route path="signup" element={<Signup role="admin" />} />
        <Route path="login" element={<Login role="admin" />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-subjects" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="admin">
              <AddSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff">
        <Route path="signup" element={<Signup role="staff" />} />
        <Route path="login" element={<Login role="staff" />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="user">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
