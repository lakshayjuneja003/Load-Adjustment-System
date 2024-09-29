import React from 'react';
import { useRecoilValue } from 'recoil';
import { Navigate } from 'react-router-dom';
import { isAuthenticatedSelector } from '../store/authStore/authAtom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
      Navigate("/login")
  }
  
  return children;
};

export default ProtectedRoute;
