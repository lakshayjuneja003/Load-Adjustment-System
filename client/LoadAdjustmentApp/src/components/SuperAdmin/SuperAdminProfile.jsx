import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from './SuperAdminTopNav';
import '../../css/superAdminDashboard.css';
import '../../css/Profile.css';

const AVATAR_COLORS = [
  { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  { bg: 'rgba(6,182,212,0.15)',   color: '#06b6d4' },
  { bg: 'rgba(16,185,129,0.15)',  color: '#10b981' },
  { bg: 'rgba(139,92,246,0.15)',  color: '#8b5cf6' },
  { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
];

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const SuperAdminProfile = () => {
  const [data, setData]   = useState(null);
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('http://localhost:3004/api/v1/superadmin/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        });
        if (res.status === 200) setData(res.data?.user);
      } catch (err) {
        console.error('Error fetching super admin data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/superAdmin/login');
        } else {
          setError('Failed to fetch profile. Please try again later.');
        }
      }
    };
    getData();
  }, [navigate]);

  const initials    = getInitials(data?.name);
  const avatarStyle = AVATAR_COLORS[0];

  return (
    <div className="sf-dashboard">
      <TopNavBar userName={data?.name} />

      <div className="sf-dashboard-main">

        {/* Error */}
        {error && <div className="sf-error-box">{error}</div>}

        {!error && !data && (
          <p className="sf-loading">Loading profile...</p>
        )}

        {data && (
          <>
            {/* Profile hero card */}
            <div className="profile-hero-card">
              <div
                className="profile-avatar-lg"
                style={{ background: avatarStyle.bg, color: avatarStyle.color }}
              >
                {initials}
              </div>

              <div className="profile-hero-info">
                <div className="profile-hero-name">{data.name}</div>
                <div className="profile-hero-role">
                  <span className="sa-badge" style={{ marginBottom: 0 }}>
                    <span className="sa-badge-dot" />
                    Super Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="profile-details-grid">

              <div className="profile-detail-card">
                <div className="profile-detail-label">Email address</div>
                <div className="profile-detail-val">{data.email}</div>
              </div>

              <div className="profile-detail-card">
                <div className="profile-detail-label">University code</div>
                <div className="profile-detail-val mono">{data.universityCode || '—'}</div>
              </div>

              <div className="profile-detail-card">
                <div className="profile-detail-label">University address</div>
                <div className="profile-detail-val">{data.universityAddress || '—'}</div>
              </div>

              <div className="profile-detail-card">
                <div className="profile-detail-label">Total departments</div>
                <div className="profile-detail-val accent">
                  {data.departmentNames?.length ?? 0}
                </div>
              </div>

            </div>

            {/* Departments */}
            <div className="profile-section-header">
              <div className="sf-section-title">Departments</div>
              <div className="sf-section-sub">All departments under your institution</div>
            </div>

            <div className="profile-dept-grid">
              {data.departmentNames?.length > 0 ? (
                data.departmentNames.map((dept, i) => (
                  <div className="profile-dept-card" key={i}>
                    <div
                      className="profile-dept-icon"
                      style={{
                        background: AVATAR_COLORS[i % AVATAR_COLORS.length].bg,
                        color: AVATAR_COLORS[i % AVATAR_COLORS.length].color,
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </div>
                    <div className="profile-dept-name">{dept}</div>
                    <div className="profile-dept-index">Dept {String(i + 1).padStart(2, '0')}</div>
                  </div>
                ))
              ) : (
                <div className="sf-empty-state">No departments added yet.</div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SuperAdminProfile;
