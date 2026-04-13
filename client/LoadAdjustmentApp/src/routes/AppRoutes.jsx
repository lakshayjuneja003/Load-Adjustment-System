import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../components/Admin/AdminDashboard";
import StaffDashboard from "../components/Staff/StaffDashboard";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import AddSubjects from "../components/Admin/AddSubjects"; // Import the AddSubjects component
import GetUrl from "../components/Common/GetInvitationUrl";
import AdminProfile from "../components/Admin/AdminProfile";
import PendingRequests from "../components/Admin/Pendingrequest";
import MakeNewVerificationRequest from "../components/Staff/MakeNewVerificationRequest,";
import SetSemesters from "../components/Admin/SetSemstersActive";
import SemestersList from "../components/Staff/Prefrences/SemstersList";
import SuperAdminSignup from "../components/SuperAdmin/SuperAdminSignup";
import SuperAdminLogin from "../components/SuperAdmin/SuperAdminLogin";
import SuperAdminDashboard from "../components/SuperAdmin/SuperAdminDashbaord";
import AdminsPendingRequests from "../components/SuperAdmin/AdminsPendingRequests";
import StaffProfile from "../components/Staff/StaffProfile";
import DepartmentForm from "../components/SuperAdmin/SetDepartmentForm";
import SetPermissions from "../components/SuperAdmin/SetPermissions";
import SuperAdminProfile from "../components/SuperAdmin/SuperAdminProfile";
import NotFound from "../pages/notFound";
import LandingPage from "../pages/LandingPage";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Super Admin Routes */}
      <Route path="/superAdmin">

        <Route path="signup" element={
          <SuperAdminSignup/>
        } />
        <Route path="login" element={
          <SuperAdminLogin role={"superAdmin"}/>
        } />
        <Route path="dashboard" element={
          <ProtectedRoute role={"SuperAdmin"} >
          <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        <Route
          path="getinvitationurl" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="SuperAdmin">
              <GetUrl role={"superAdmin"}/>
            </ProtectedRoute>
          }
        />
        <Route path="me" element={
          <ProtectedRoute role={"SuperAdmin"} >
          <SuperAdminProfile />
          </ProtectedRoute>
        } />
        <Route path="pendingrequests" element={
          <ProtectedRoute role={"SuperAdmin"}>
            <AdminsPendingRequests />
          </ProtectedRoute>
        } />
        <Route path="setPermissions" element={
          <ProtectedRoute role={"SuperAdmin"}>
            <SetPermissions />
          </ProtectedRoute>
        } /> // not added in nav bar
        <Route path="setdepartmentsdata" element={
          <ProtectedRoute role={"SuperAdmin"}>
            <DepartmentForm />
          </ProtectedRoute>
        } /> // not added in nav bar
        
        </Route>  
      {/* Admin Routes */}
      <Route path="/admin">
        <Route path="signup" element={<Signup role="Admin" />} />
        <Route path="login" element={<Login role="Admin" />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-subjects" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="Admin">
              <AddSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="Admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="setActiveSems" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="Admin">
              <SetSemesters />
            </ProtectedRoute>
          }
        />

        <Route
          path="getinvitatiourl" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="Admin">
              <GetUrl role={"admin"}/>
            </ProtectedRoute>
          }
        />

      <Route
          path="pendingrequests" // Add the route for the AddSubjects component
          element={
            <ProtectedRoute role="Admin">
              <PendingRequests />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Staff Routes */}
      <Route path="/Staff">
        <Route path="signup" element={<Signup role="Staff" />} />
        <Route path="login" element={<Login role="Staff" />} />
        <Route
          path="dashboard"
          element={
             <ProtectedRoute role="Staff">
               <StaffDashboard />
             </ProtectedRoute> 
          }
        />

          <Route
          path="preferences"
          element={
            <ProtectedRoute role="Staff">
              <SemestersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="PutAnotherVerificationRequest"
          element={
            <ProtectedRoute role="Staff">
              <MakeNewVerificationRequest />
            </ProtectedRoute>
          }
        />

          <Route path="profile" element={
            <ProtectedRoute role={"Staff"}>
              <StaffProfile />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
