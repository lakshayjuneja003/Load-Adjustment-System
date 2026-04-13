import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getAdminpermissions from '../../customHooks/GetAdminsPermissions';
import '../../css/SuperAdmin.css';
import '../../css/Signup.css';

const Signup = ({ role }) => {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [empId, setEmpId]                 = useState('');
  const [designation, setDesignation]     = useState('');
  const [invitationUrl, setInvitationUrl] = useState('');
  const [adminDept, setAdminDept]         = useState('');
  const [invitedBy, setInvitedBy]         = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [functionalities, setFunctionalities] = useState([]);
  const [error, setError]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const navigate                          = useNavigate();

  // Fetch permissions only when role is Admin and invitedBy is filled
  const {
    permissions,
    loading: permissionsLoading,
    error: permissionsError,
  } = getAdminpermissions(role === 'Admin' ? invitedBy : null);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const handleSignup = async () => {
    setError('');
    if (!name || !email || !password || !empId) {
      return setError('Please fill all the required fields.');
    }
    if (role === 'Admin' && (!adminDept || !invitedBy)) {
      return setError('Please fill in your department and invited by fields.');
    }
    if (role === 'Staff' && (!designation || !invitationUrl)) {
      return setError('Please select your designation and provide the invitation URL.');
    }

    setLoading(true);
    try {
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
        ...(role === 'Admin' && {
          adminDept,
          invitedBy,
          pendingFunctionalities: functionalities,
        }),
      };

      const response = await axios.post(endpoint, data);

      if (response.status === 201) {
        navigate(`/${role}/login`);
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a functionality from the dropdown (avoid duplicates)
  const handleFunctionalitiesChange = (e) => {
    const selected = e.target.value;
    if (selected && !functionalities.includes(selected)) {
      setFunctionalities((prev) => [...prev, selected]);
    }
    e.target.value = ''; // reset dropdown
  };

  // Remove a functionality tag
  const handleRemoveFunctionality = (index) => {
    setFunctionalities((prev) => prev.filter((_, i) => i !== index));
  };

  const badgeColor = role === 'Admin' ? 'blue' : 'purple';

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
        <div className={`sa-badge signup-badge-${badgeColor}`}>
          <span className={`sa-badge-dot dot-${badgeColor}`} />
          {roleLabel}
        </div>
        <h2 className="sa-heading">Create your account</h2>
        <p className="sa-sub">
          {role === 'Admin'
            ? 'Register as a department admin. Your super admin will verify you before you get access.'
            : 'Register as a staff member using the invitation link sent by your admin.'}
        </p>

        {/* Error */}
        {(error || permissionsError) && (
          <div className="sa-error">{error || permissionsError}</div>
        )}

        {/* ── Basic info row ── */}
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
            <label className="sa-label">Employee ID</label>
            <input
              type="text"
              className="sa-input"
              placeholder="MMU-EMP-0042"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-row">
          <div className="sa-field">
            <label className="sa-label">Email address</label>
            <input
              type="email"
              className="sa-input"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
        </div>

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

        {/* ── Staff-only fields ── */}
        {role === 'Staff' && (
          <>
            <div className="sa-divider">
              <div className="sa-divider-line" />
              <span className="sa-divider-label">staff info</span>
              <div className="sa-divider-line" />
            </div>

            <div className="sa-row">
              <div className="sa-field">
                <label className="sa-label">Designation</label>
                <select
                  className="sa-input signup-select"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                >
                  <option value="">Select designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                </select>
              </div>
              <div className="sa-field">
                <label className="sa-label">Invitation URL</label>
                <input
                  type="text"
                  className="sa-input"
                  placeholder="Paste your invitation link"
                  value={invitationUrl}
                  onChange={(e) => setInvitationUrl(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* ── Admin-only fields ── */}
        {role === 'Admin' && (
          <>
            <div className="sa-divider">
              <div className="sa-divider-line" />
              <span className="sa-divider-label">admin info</span>
              <div className="sa-divider-line" />
            </div>

            <div className="sa-row">
              <div className="sa-field">
                <label className="sa-label">Department</label>
                <input
                  type="text"
                  className="sa-input"
                  placeholder="e.g. CSE, ECE"
                  value={adminDept}
                  onChange={(e) => setAdminDept(e.target.value)}
                />
              </div>
              <div className="sa-field">
                <label className="sa-label">Invited by (Super Admin ID)</label>
                <input
                  type="text"
                  className="sa-input"
                  placeholder="Super Admin ID"
                  value={invitedBy}
                  onChange={(e) => setInvitedBy(e.target.value)}
                />
              </div>
            </div>

            {/* Permissions dropdown — only shown when invitedBy is filled */}
            {invitedBy && !permissionsLoading && permissions?.length > 0 && (
              <div className="sa-field">
                <label className="sa-label">
                  Request functionalities
                  <span className="signup-hint-inline">select all that apply</span>
                </label>
                <select
                  className="sa-input signup-select"
                  onChange={handleFunctionalitiesChange}
                  defaultValue=""
                >
                  <option value="" disabled>Select a permission</option>
                  {permissions.map((permission) => (
                    <option key={permission} value={permission}>
                      {permission}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected functionalities as tags */}
            {functionalities.length > 0 && (
              <div className="sa-field">
                <label className="sa-label">Selected functionalities</label>
                <div className="signup-tags">
                  {functionalities.map((func, i) => (
                    <div className="signup-tag" key={i}>
                      <span>{func}</span>
                      <button
                        className="signup-tag-del"
                        onClick={() => handleRemoveFunctionality(i)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Submit */}
        <button className="sa-btn" onClick={handleSignup} disabled={loading}>
          {loading ? (
            <span className="sa-spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
          {loading ? 'Creating account...' : `Create ${roleLabel} Account`}
        </button>

        <p className="sa-footer">
          Already have an account?{' '}
          <Link to={`/${role}/login`} className="sa-link">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
