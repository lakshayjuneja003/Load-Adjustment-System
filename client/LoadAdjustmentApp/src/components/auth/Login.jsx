import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { authAtom } from '../../store/authStore/authAtom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ role }) => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async () => {
    try {
      const endpoint = role === 'admin' 
        ? 'http://localhost:3004/api/v1/admin/login'
        : 'http://localhost:3004/api/v1/user/login';
      const response = await axios.post(endpoint, {
        email,
        password,
      });
      console.log(response);
      
      if (response.status === 200 && response.data?.token) {
        const { token, user } = response.data;

        setAuth({
          token,
          user,
          isAuthenticated: true,
        });

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        document.cookie = `token=${token}; path=/; Secure; SameSite=Strict;`;

        // Redirect to the corresponding dashboard
        navigate(`/${role}/dashboard`);
      } else {
        alert('Invalid login credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginContainer}>
        <h2 style={styles.heading}>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Login</button>
        <p style={styles.footerText}>
          Don't have an account? <a href={`/${role}/signup`} style={styles.link}>Signup</a>
        </p>
      </div>
    </div>
  );
};

// ... Styles object remains unchanged ...
const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
  },
  loginContainer: {
    width: '400px',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '24px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '15px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '15px',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;
