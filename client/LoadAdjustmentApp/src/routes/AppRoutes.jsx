import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
const AdminDashboard = lazy(() => import("../components/Admin/AdminDashboard"));
const StaffDashboard = lazy(() => import("../components/Staff/StaffDashboard"));
const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));
const AddSubjects = lazy(() => import("../components/Admin/AddSubjects"));
const GetUrl = lazy(() => import("../components/Common/GetInvitationUrl"));
const PendingRequests = lazy(() => import("../components/Admin/Pendingrequest"));
const MakeNewVerificationRequest = lazy(() =>
  import("../components/Staff/MakeNewVerificationRequest")
);

const SetSemesters = lazy(() => import("../components/Admin/SetSemstersActive"));
const SuperAdminSignup = lazy(() =>
  import("../components/SuperAdmin/SuperAdminSignup")
);
const SuperAdminLogin = lazy(() =>
  import("../components/SuperAdmin/SuperAdminLogin")
);
const SuperAdminDashboard = lazy(() =>
  import("../components/SuperAdmin/SuperAdminDashbaord")
);
const AdminsPendingRequests = lazy(() =>
  import("../components/SuperAdmin/AdminsPendingRequests")
);
const StaffProfile = lazy(() => import("../components/Staff/StaffProfile"));
const DepartmentForm = lazy(() =>
  import("../components/SuperAdmin/SetDepartmentForm")
);
const SetPermissions = lazy(() =>
  import("../components/SuperAdmin/SetPermissions")
);
const SuperAdminProfile = lazy(() =>
  import("../components/SuperAdmin/SuperAdminProfile")
);
const NotFound = lazy(() => import("../pages/notFound"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const StaffPreferences = lazy(() =>
  import("../components/Staff/StaffPreferences")
);
const UnderConstruction = lazy(() =>
  import("../components/Common/UnderConstruction")
);
const UserProfile = lazy(() =>
  import("../components/Common/UserProfile")
);
const RoomsSectionsPage = lazy(() =>
  import("../components/Admin/RoomsSectionsPage")
);


const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
              <UserProfile/>
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
              <GetUrl role={"Admin"}/>
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
        <Route
          path="setDepartmentInfraData"
          element={
            <ProtectedRoute role="Admin">
              <RoomsSectionsPage />
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
              <StaffPreferences />
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
        <Route
          path="tasks"
          element={
            <ProtectedRoute role="Staff">
              <UnderConstruction />
            </ProtectedRoute>
          }
        />

          <Route path="profile" element={
            <ProtectedRoute role={"Staff"}>
              <UserProfile />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
