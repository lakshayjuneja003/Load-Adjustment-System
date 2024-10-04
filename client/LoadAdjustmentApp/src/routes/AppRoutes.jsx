import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import StaffDashboard from "../components/Dashboard/StaffDashboard";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import AddSubjects from "../components/AddSubjects"; // Import the AddSubjects component

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
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-subjects" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute>
              <AddSubjects />
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
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
