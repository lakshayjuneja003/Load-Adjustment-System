import { useNavigate } from 'react-router-dom';
import TopNavBar from '../Admin/TopNav';
import useUserVerification from '../../customHooks/UseUserVerification';
import '../../css/SuperAdminDashboard.css';
import '../../css/StaffDashboard.css';

const QUICK_ACTIONS = [
  {
    title: 'View Tasks',
    desc: 'Check your assigned tasks and track their progress.',
    to: '/staff/tasks',
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Manage Preferences',
    desc: 'Update your subject preferences and teaching priorities.',
    to: '/staff/preferences',
    color: 'cyan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    title: 'Contact Admin',
    desc: 'Need assistance? Get in touch with your department admin.',
    to: '/staff/profile',
    color: 'green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { userInfo, isVerified, loading, error } = useUserVerification();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/staff/login');
  };

  const firstName = userInfo?.name?.split(' ')[0] ?? 'there';

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="sf-dashboard">
        <TopNavBar role="Staff" handleLogout={handleLogout} />
        <div className="sf-dashboard-main">
          <p className="sf-loading">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="sf-dashboard">
        <TopNavBar role="Staff" handleLogout={handleLogout} />
        <div className="sf-dashboard-main">
          <div className="sf-error-box">{error}</div>
        </div>
      </div>
    );
  }

  // ── Not verified ─────────────────────────────────────────────────────────
  if (isVerified === false) {
    return (
      <div className="sf-dashboard">
        <TopNavBar role="Staff" handleLogout={handleLogout} userName={userInfo?.name} />
        <div className="sf-dashboard-main">
          <div className="staff-unverified-card">
            <div className="staff-unverified-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="staff-unverified-title">Verification pending</div>
            <div className="staff-unverified-sub">
              Your account is awaiting verification by your department admin.
              You'll get full access once they approve your request.
            </div>
            <div className="staff-unverified-badge">
              <span className="sf-online-dot" style={{ background: 'var(--amber)' }} />
              Pending admin approval
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Verified dashboard ───────────────────────────────────────────────────
  return (
    <div className="sf-dashboard">
      <TopNavBar role="Staff" handleLogout={handleLogout} userName={userInfo?.name} />

      <div className="sf-dashboard-main">

        {/* Welcome row */}
        <div className="sf-welcome-row">
          <div>
            <h1 className="sf-welcome-h">
              Welcome back, <span>{firstName}</span>
            </h1>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" />
              Staff Dashboard &nbsp;·&nbsp; {userInfo?.adminDept || 'Your Department'}
            </div>
          </div>
          <div className="sf-date-badge">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
            })}
          </div>
        </div>

        {/* Info cards row */}
        <div className="sf-stats-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '32px' }}>
          <div className="sf-stat-card blue">
            <div className="sf-stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="sf-stat-label">Designation</div>
            <div className="sf-stat-val blue" style={{ fontSize: '16px', fontWeight: 700 }}>
              {userInfo?.designation || '—'}
            </div>
          </div>

          <div className="sf-stat-card cyan">
            <div className="sf-stat-icon cyan">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="sf-stat-label">Teaching Load</div>
            <div className="sf-stat-val cyan">{userInfo?.teachingLoad ?? 0}</div>
          </div>

          <div className="sf-stat-card green">
            <div className="sf-stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="sf-stat-label">Status</div>
            <div className="sf-stat-val green" style={{ fontSize: '16px', fontWeight: 700 }}>
              Verified
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="sf-section-header">
          <div>
            <div className="sf-section-title">Quick actions</div>
            <div className="sf-section-sub">Jump straight to what you need</div>
          </div>
        </div>

        <div className="staff-actions-grid">
          {QUICK_ACTIONS.map((action) => (
            <div
              className={`staff-action-card staff-action-${action.color}`}
              key={action.title}
              onClick={() => navigate(action.to)}
            >
              <div className={`staff-action-icon ${action.color}`}>
                {action.icon}
              </div>
              <div className="staff-action-title">{action.title}</div>
              <div className="staff-action-desc">{action.desc}</div>
              <div className="staff-action-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;
