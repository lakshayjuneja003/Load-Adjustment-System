import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../css/SuperAdminDashboard.css'
import axios from 'axios';

import TopNavBar from './SuperAdminTopNav.jsx';
import GetAdmins from './GetAdmins.jsx';


const StatCard = ({ color, value, label, icon }) => (
  <div className={`sf-stat-card ${color}`}>
    <div className={`sf-stat-icon ${color}`}>{icon}</div>
    <div className="sf-stat-label">{label}</div>
    <div className={`sf-stat-val ${color}`}>{value ?? '—'}</div>
  </div>
);

const SuperAdminDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3004/api/v1/superadmin/me',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setUserDetails(response.data.user);
        } else {
          setError('Failed to fetch user details.');
        }
      } catch {
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/superAdmin/login'), 2000);
      }
    };
    fetchProfile();
  }, [navigate]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const firstName = userDetails?.name?.split(' ')[0] ?? '';

  return (
    <div className="sf-dashboard">
      <TopNavBar userName={userDetails?.name} />

      <div className="sf-dashboard-main">

        {/* Error banner */}
        {error && <div className="sf-error-box">{error}</div>}

        {/* Welcome */}
        <div className="sf-welcome-row">
          <div>
            <h1 className="sf-welcome-h">
              {userDetails ? (
                <>Welcome back, <span>{firstName}</span></>
              ) : (
                'Loading...'
              )}
            </h1>
            {userDetails && (
              <div className="sf-welcome-sub">
                <span className="sf-online-dot" />
                {userDetails.universityName || 'Your Institution'}
                &nbsp;·&nbsp;
                {userDetails.universityCode || ''}
              </div>
            )}
          </div>
          <div className="sf-date-badge">{today}</div>
        </div>

        {/* Stat Cards */}
        <div className="sf-stats-row">
          <StatCard
            color="blue"
            label="Total Admins"
            value={userDetails?.totalAdmins}
            icon={
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            color="cyan"
            label="Total Staff"
            value={userDetails?.totalStaff}
            icon={
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            }
          />
          <StatCard
            color="green"
            label="Verified Admins"
            value={userDetails?.verifiedAdmins}
            icon={
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            }
          />
          <StatCard
            color="amber"
            label="Pending Requests"
            value={userDetails?.pendingRequests}
            icon={
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>

        {/* Admins list */}
        <GetAdmins />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
