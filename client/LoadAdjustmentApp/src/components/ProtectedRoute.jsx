import React from 'react';
import { useRecoilValue } from 'recoil';
import { Navigate } from 'react-router-dom';
import { authAtom } from '../store/authStore/authAtom';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useRecoilValue(authAtom);

  // Check if the authentication state is still loading (undefined user or isAuthenticated)
  if (isAuthenticated === undefined || user === undefined) {
    // You can display a loading spinner or a placeholder if the state is not yet ready
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated or role mismatch
  if (!isAuthenticated || user.role !== role) {
    return <Navigate to={`/${role}/login`} />;
  }

  // If authenticated and role matches, render children
  return children;
};

export default ProtectedRoute;
