import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { authAtom } from '../store/authStore/authAtom.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async () => {
    console.log(email, password);

    try {
      const response = await axios.post('http://localhost:3004/api/v1/admin/login', {
        email,
        password,
      });
      console.log(response);

      if (response.status == 200) {
      //  Store the token and user info in Recoil state
          if(response.data?.token){
            setAuth({
              token: response.data.token,
              user: response.data.user,  // User details from the response
              isAuthenticated: true,
        });
        // Save the token in cookies/localStorage for persistent login
        document.cookie = `token=${response.data.accessToken}; path=/; Secure; SameSite=Strict;`;

        // Redirect to dashboard
          navigate('/dashboard');
      }
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
        <h2 style={styles.heading}>Admin Login</h2>
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
          Don't have an account? <a href="/signup" style={styles.link}>Signup</a>
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
    transition: 'transform 0.3s',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '24px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '15px',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default Login;
