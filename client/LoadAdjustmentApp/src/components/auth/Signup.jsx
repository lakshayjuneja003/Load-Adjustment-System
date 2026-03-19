import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getAdminpermissions from '../../customHooks/GetAdminsPermissions';

const Signup = ({ role }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empId, setEmpId] = useState('');
  const [designation, setDesignation] = useState('');
  const [invitationUrl, setInvitationUrl] = useState('');
  const [adminDept, setAdminDept] = useState('');
  const [invitedBy, setInvitedBy] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [functionalities, setFunctionalities] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch permissions for the invited admin
  const { permissions, loading, error: permissionsError } = getAdminpermissions(invitedBy);

  // Handle Signup
  const handleSignup = async () => {
    try {
      // Validate required fields
      if (!name || !email || !password || !empId) {
        return setError('Please fill all the required fields.');
      }

      const endpoint = role === 'Admin' 
        ? 'http://localhost:3004/api/v1/admin/register'
        : 'http://localhost:3004/api/v1/user/register';

      const data = {
        name,
        empId,
        email,
        password,
        universityCode,
        ...(role === 'Staff' && { designation, invitationUrl }),
        ...(role === 'Admin' && { adminDept, invitedBy, pendingFunctionalities: functionalities })
      };

      const response = await axios.post(endpoint, data);

      if (response.status === 201) {
        navigate(`/${role}/login`);
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  // Handle functionalities change
  const handleFunctionalitiesChange = (e) => {
    const selectedFunctionality = e.target.value;
    if (!functionalities.includes(selectedFunctionality)) {
      setFunctionalities([...functionalities, selectedFunctionality]);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginContainer}>
        <h2 style={styles.heading}>{role.charAt(0).toUpperCase() + role.slice(1)} Signup</h2>
        {(error || permissionsError) && <p style={styles.errorText}>{error || permissionsError}</p>}
        
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
        <input type="text" placeholder="Employee ID" value={empId} onChange={(e) => setEmpId(e.target.value)} style={styles.input} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        <input type="text" placeholder="University Code" value={universityCode} onChange={(e) => setUniversityCode(e.target.value)} style={styles.input} />

        {role === 'Staff' && (
          <>
            <select value={designation} onChange={(e) => setDesignation(e.target.value)} style={styles.input}>
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
            </select>
            <input type="text" placeholder="Invitation URL" value={invitationUrl} onChange={(e) => setInvitationUrl(e.target.value)} style={styles.input} />
          </>
        )}

        {role === 'Admin' && (
          <>
            <input type="text" placeholder="Admin Department" value={adminDept} onChange={(e) => setAdminDept(e.target.value)} style={styles.input} />
            <input type="text" placeholder="Invited By" value={invitedBy} onChange={(e) => setInvitedBy(e.target.value)} style={styles.input} />
            
            {role === 'Admin' && invitedBy && !loading && (
              <>
                <select onChange={handleFunctionalitiesChange} style={styles.input}>
                  <option value="">Select Permission</option>
                  {permissions.map((permission) => (
                    <option key={permission} value={permission}>{permission}</option>
                  ))}
                </select>
              </>
            )}

            <input type="text" value={functionalities.join(', ')} readOnly style={styles.input} />
          </>
        )}

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
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '15px',
  },
};

export default Signup;
