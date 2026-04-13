import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/SuperAdmin.css';
import { useRecoilState } from 'recoil';
import { authAtom } from '../../store/authStore/authAtom';
import axios from 'axios';


const SuperAdminLogin = ({ role }) => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3004/api/v1/superadmin/login', {
        email,
        password,
        universityCode,
      });

      if (response.status === 200 && response.data?.token) {
        const { token, user } = response.data;

        setAuth({ token, user, isAuthenticated: true });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        document.cookie = `token=${token}; path=/; Secure; SameSite=Strict;`;

        navigate(`/${role}/dashboard`);
      } else {
        setError('Invalid login credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

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
          {roleLabel}
        </div>
        <h2 className="sa-heading">Welcome back</h2>
        <p className="sa-sub">
          Sign in to manage your institution, departments, and timetables.
        </p>

        {/* Error */}
        {error && <div className="sa-error">{error}</div>}

        {/* Email */}
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

        {/* Password + forgot */}
        <div className="sa-field">
          <div className="sa-label-row">
            <label className="sa-label">Password</label>
            <a href="#" className="sa-forgot-link">Forgot password?</a>
          </div>
          <input
            type="password"
            className="sa-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="sa-divider">
          <div className="sa-divider-line" />
          <span className="sa-divider-label">institution</span>
          <div className="sa-divider-line" />
        </div>

        {/* University code */}
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

        {/* Submit */}
        <button className="sa-btn" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span className="sa-spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="sa-footer">
          Don't have an account?{' '}
          <Link to={`/${role}/signup`} className="sa-link">Sign up</Link>
        </p>

      </div>
    </div>
  );
};

export default SuperAdminLogin;
