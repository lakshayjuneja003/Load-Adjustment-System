import React, { useEffect } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';
import { authAtom } from './store/authStore/authAtom';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </RecoilRoot>
  );
};

// Helper component to initialize Recoil state from localStorage
const AuthProvider = ({ children }) => {
  const setAuthState = useSetRecoilState(authAtom);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setAuthState({
        token,
        user,
        isAuthenticated: true,
      });
    }
  }, [setAuthState]);

  return children;
};

export default App;
