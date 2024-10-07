import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = ({ role }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  // Handle Signup
  const handleSignup = async () => {
    try {
      const endpoint = role === 'admin' 
        ? 'http://localhost:3004/api/v1/admin/register'
        : 'http://localhost:3004/api/v1/user/register';

      const response = await axios.post(endpoint, {
        fullname,
        username,
        email,
        password,
      });
      console.log(response);
      

      if (response.status === 201) {
        navigate(`${role}/login`);
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginContainer}>
        <h2 style={styles.heading}>{role.charAt(0).toUpperCase() + role.slice(1)} Signup</h2>
        {error && <p style={styles.errorText}>{error}</p>}
        <input
          type="text"
          placeholder="Fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
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
        <button onClick={handleSignup} style={styles.button}>
          Signup
        </button>

        <p style={styles.footerText}>
          Have an account? <Link to={`/${role}/login`} style={styles.link}>Signin</Link>

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

export default Signup;
