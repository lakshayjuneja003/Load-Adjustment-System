import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAtom } from '../../store/authStore/authAtom';
import axios from 'axios';
import { useRecoilState } from 'recoil';

const SuperAdminLogin = ({ role }) => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async () => {
    try {
      const endpoint = 'http://localhost:3004/api/v1/superadmin/login';

      const data = {
        email,
        password,
        universityCode,
      };

      const response = await axios.post(endpoint, data);
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
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginContainer}>
        <h2 style={styles.heading}>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
        {error && <p style={styles.errorText}>{error}</p>}

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
        <input
          type="text"
          placeholder="University Code"
          value={universityCode}
          onChange={(e) => setUniversityCode(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p style={styles.footerText}>
          Don't have an account? <Link to={`/${role}/signup`} style={styles.link}>Signup</Link>
        </p>
      </div>
    </div>
  );
};

// Styles Object
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
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '24px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
    fontFamily: 'Arial, sans-serif',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '15px',
  },
};

export default SuperAdminLogin;
