import React from 'react';
import { useRecoilValue } from 'recoil';
import { Navigate } from 'react-router-dom';
import { authAtom } from '../store/authStore/authAtom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useRecoilValue(authAtom);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
