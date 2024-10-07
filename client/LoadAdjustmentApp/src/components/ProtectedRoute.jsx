import React from 'react';
import { useRecoilValue } from 'recoil';
import { Navigate } from 'react-router-dom';
import { authAtom } from '../store/authStore/authAtom';

const ProtectedRoute = ({ children  , role}) => {
  const { isAuthenticated } = useRecoilValue(authAtom);

  if (!isAuthenticated) {
    return <Navigate to={`${role}/login`} />;
  }

  return children;
};

export default ProtectedRoute;
