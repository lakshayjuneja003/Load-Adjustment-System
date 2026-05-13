import { useRecoilValue } from 'recoil';
import { authAtom } from '../../store/authStore/authAtom';
import TopNavBar from '../Admin/TopNav';
import '../../css/SuperAdminDashboard.css';
import '../../css/Profile.css';
import '../../css//Signup.css';
import '../../css/ShowSubjects.css';

const AVATAR_COLORS = [
  { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  { bg: 'rgba(6,182,212,0.15)',   color: '#06b6d4' },
  { bg: 'rgba(16,185,129,0.15)',  color: '#10b981' },
  { bg: 'rgba(139,92,246,0.15)',  color: '#8b5cf6' },
  { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
];

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const UserProfile = () => {
  const { user } = useRecoilValue(authAtom);

  if (!user) {
    return (
      <div className="sf-dashboard">
        <TopNavBar role="Staff" />
        <div className="sf-dashboard-main">
          <div className="sf-error-box">No user data found. Please log in again.</div>
        </div>
      </div>
    );
  }

  const isAdmin      = user.role === 'Admin';
  const avatarStyle  = AVATAR_COLORS[0];
  const initials     = getInitials(user.name);
  const joinedDate   = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  // Build detail cards based on role — shared fields + role-specific
  const detailCards = [
    { label: 'Email address',  value: user.email,           style: '' },
    { label: 'Employee ID',    value: user.empId || '—',    style: 'mono' },
    { label: 'University code',value: user.universityCode || '—', style: 'mono' },
    isAdmin
      ? { label: 'Department',   value: user.adminDept || '—', style: 'mono' }
      : { label: 'Designation',  value: user.designation || '—', style: 'mono' },
    { label: 'Teaching load',  value: user.teachingLoad ?? 0, style: 'accent' },
    { label: 'Joined on',      value: joinedDate,            style: '' },
  ];

  return (
    <div className="sf-dashboard">
      <TopNavBar role={user.role} userName={user.name} />

      <div className="sf-dashboard-main">

        {/* Hero card */}
        <div className="profile-hero-card">
          <div
            className="profile-avatar-lg"
            style={{ background: avatarStyle.bg, color: avatarStyle.color }}
          >
            {initials}
          </div>
          <div className="profile-hero-info">
            <div className="profile-hero-name">{user.name}</div>
            <div className="profile-hero-role" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Role badge */}
              <span
                className="sa-badge"
                style={{
                  marginBottom: 0,
                  background: isAdmin ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                  border: isAdmin ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(139,92,246,0.2)',
                  color: isAdmin ? '#3b82f6' : '#8b5cf6',
                }}
              >
                <span
                  className="sa-badge-dot"
                  style={{ background: isAdmin ? '#3b82f6' : '#8b5cf6' }}
                />
                {user.role}
              </span>

              {/* Verified badge */}
              {user.isVerified && (
                <span
                  className="sa-badge"
                  style={{
                    marginBottom: 0,
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    color: '#10b981',
                  }}
                >
                  <span className="sa-badge-dot" style={{ background: '#10b981' }} />
                  Verified
                </span>
              )}

              {/* Designation pill for staff */}
              {!isAdmin && user.designation && (
                <span
                  className="sa-badge"
                  style={{
                    marginBottom: 0,
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: '#f59e0b',
                  }}
                >
                  {user.designation}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="profile-details-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {detailCards.map(({ label, value, style }) => (
            <div className="profile-detail-card" key={label}>
              <div className="profile-detail-label">{label}</div>
              <div className={`profile-detail-val${style ? ` ${style}` : ''}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Functionalities — admin only */}
        {isAdmin && user.functionalities?.length > 0 && (
          <>
            <div className="profile-section-header">
              <div className="sf-section-title">Assigned functionalities</div>
              <div className="sf-section-sub">Permissions granted by your super admin</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {user.functionalities.map((func, i) => (
                <div key={i} className="perm-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ width: 13, height: 13, flexShrink: 0 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {func}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Cross-dept access — shown for both if present */}
        {user.crossDeptAccess?.length > 0 && (
          <>
            <div className="profile-section-header">
              <div className="sf-section-title">Cross-department access</div>
              <div className="sf-section-sub">Departments you have been granted access to</div>
            </div>
            <div className="profile-dept-grid">
              {user.crossDeptAccess.map((dept, i) => (
                <div className="profile-dept-card" key={i}>
                  <div
                    className="profile-dept-icon"
                    style={{
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length].bg,
                      color:      AVATAR_COLORS[i % AVATAR_COLORS.length].color,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                  <div className="profile-dept-name">{dept}</div>
                  <div className="profile-dept-index">Dept {String(i + 1).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
