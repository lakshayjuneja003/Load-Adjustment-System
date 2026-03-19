import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuperAdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [departmentNames, setDepartmentNames] = useState([]); // State for department names
  const [universityAddress, setUniversityAddress] = useState(''); // State for university address
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  // Handle department names input change
  const handleDepartmentNamesChange = (e) => {
    setDepartmentNames(e.target.value.split(',')); // Assuming input will be comma-separated values
  };

  // Handle Signup
  const handleSignup = async () => {
    try {
      const endpoint = 'http://localhost:3004/api/v1/superadmin/register';
      
      const data = {
        name,
        email,
        password,
        universityCode,
        departmentNames,
        universityAddress
      };

      const response = await axios.post(endpoint, data);
      console.log(response);

      if (response.status === 200) {
        navigate(`/superAdmin/login`);
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
        <h2 style={styles.heading}> SuperAdmin Signup</h2>
        {error && <p style={styles.errorText}>{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="University Code"
          value={universityCode}
          onChange={(e) => setUniversityCode(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="University Address"
          value={universityAddress}
          onChange={(e) => setUniversityAddress(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Department Names (comma separated)"
          value={departmentNames}
          onChange={handleDepartmentNamesChange}
          style={styles.input}
          required
        />

        <button onClick={handleSignup} style={styles.button}>
          Signup
        </button>

        <p style={styles.footerText}>
          Have an account? <Link to={`/superAdmin/login`} style={styles.link}>Signin</Link>
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

export default SuperAdminSignup;
