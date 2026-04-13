import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/SuperAdmin.css';

const SuperAdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [departmentNames, setDepartmentNames] = useState([]);
  const [universityAddress, setUniversityAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDepartmentNamesChange = (e) => {
    setDepartmentNames(e.target.value.split(','));
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3004/api/v1/superadmin/register', {
        name,
        email,
        password,
        universityCode,
        departmentNames,
        universityAddress,
      });

      if (response.status === 200) {
        navigate('/superAdmin/login');
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sa-wrapper">
      <div className="sa-card">

        {/* Brand */}
        <div className="sa-brand">
          <div className="sa-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <span className="sa-brand-name">ScheduleFlow</span>
        </div>

        {/* Header */}
        <div className="sa-badge">
          <span className="sa-badge-dot" />
          Super Admin
        </div>
        <h2 className="sa-heading">Create your institution</h2>
        <p className="sa-sub">
          Set up your organization and get full control over departments, admins, and staff.
        </p>

        {/* Error */}
        {error && <div className="sa-error">{error}</div>}

        {/* Personal info row */}
        <div className="sa-row">
          <div className="sa-field">
            <label className="sa-label">Full name</label>
            <input
              type="text"
              className="sa-input"
              placeholder="Dr. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="sa-field">
            <label className="sa-label">Email address</label>
            <input
              type="email"
              className="sa-input"
              placeholder="admin@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-field">
          <label className="sa-label">Password</label>
          <input
            type="password"
            className="sa-input"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="sa-divider">
          <div className="sa-divider-line" />
          <span className="sa-divider-label">institution info</span>
          <div className="sa-divider-line" />
        </div>

        {/* Institution info row */}
        <div className="sa-row">
          <div className="sa-field">
            <label className="sa-label">University code</label>
            <input
              type="text"
              className="sa-input"
              placeholder="MMU2024"
              value={universityCode}
              onChange={(e) => setUniversityCode(e.target.value)}
            />
          </div>
          <div className="sa-field">
            <label className="sa-label">University address</label>
            <input
              type="text"
              className="sa-input"
              placeholder="Mullana, Haryana"
              value={universityAddress}
              onChange={(e) => setUniversityAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-field">
          <label className="sa-label">Department names</label>
          <input
            type="text"
            className="sa-input"
            placeholder="CSE, ECE, ME, Civil"
            value={departmentNames.join(',')}
            onChange={handleDepartmentNamesChange}
          />
          <p className="sa-hint">Separate multiple departments with commas</p>
        </div>

        {/* Submit */}
        <button className="sa-btn" onClick={handleSignup} disabled={loading}>
          {loading ? (
            <span className="sa-spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
          {loading ? 'Creating account...' : 'Create Super Admin Account'}
        </button>

        <p className="sa-footer">
          Already have an account?{' '}
          <Link to="/superAdmin/login" className="sa-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SuperAdminSignup;
