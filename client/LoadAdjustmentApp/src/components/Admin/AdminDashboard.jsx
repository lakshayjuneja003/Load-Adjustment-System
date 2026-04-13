import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchSubjects from '../../customHooks/UseFetchSubjects';
import ShowSubjects from './ShowSubjects';
import TopNavBar from "./TopNav"
import '../../css/SuperAdmin.css';
import '../../css/AdminDashboard.css';

const SEMESTERS = [...Array(8)].map((_, i) => ({
  value: String(i + 1),
  label: `Sem ${i + 1}`,
}));

const getTokenExpiration = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(
      window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

const AdminDashboard = () => {
  const navigate                                    = useNavigate();
  const { subjects, loading, error, fetchSubjects } = useFetchSubjects();
  const [selectedSemester, setSelectedSemester]     = useState('All');
  const [isTokenValid, setIsTokenValid]             = useState(true);
  const [userDetails, setUserDetails]               = useState(null);

  useEffect(() => {
    const exp = getTokenExpiration();
    if (!exp || Date.now() > exp) {
      setIsTokenValid(false);
      setTimeout(handleLogout, 1500);
    }

    try {
      const stored = localStorage.getItem('user');
      if (stored) setUserDetails(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const filteredSubjects = selectedSemester === 'All'
    ? subjects
    : subjects.filter((s) => s.semester.toString() === selectedSemester);

  if (!isTokenValid) {
    return (
      <div className="sf-dashboard">
        <div className="sf-dashboard-main">
          <div className="sf-error-box">Session expired. Redirecting to login...</div>
        </div>
      </div>
    );
  }

  const firstName = userDetails?.name?.split(' ')[0] ?? 'Admin';

  return (
    <div className="sf-dashboard">
      <TopNavBar role="Admin" handleLogout={handleLogout} userName={userDetails?.name} />

      <div className="sf-dashboard-main">

        {/* Welcome row */}
        <div className="sf-welcome-row">
          <div>
            <h1 className="sf-welcome-h">
              Welcome back, <span>{firstName}</span>
            </h1>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" />
              Admin Dashboard &nbsp;·&nbsp; Manage your department's subjects
            </div>
          </div>
          <a href="/admin/add-subjects" className="adm-add-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Subjects
          </a>
        </div>

        {/* Semester filter */}
        <div className="adm-filter-bar">
          <span className="adm-filter-label">Filter by semester</span>
          <div className="adm-sem-tabs">
            <button
              className={`adm-sem-tab ${selectedSemester === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedSemester('All')}
            >
              All
            </button>
            {SEMESTERS.map((sem) => (
              <button
                key={sem.value}
                className={`adm-sem-tab ${selectedSemester === sem.value ? 'active' : ''}`}
                onClick={() => setSelectedSemester(sem.value)}
              >
                {sem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject count */}
        {!loading && !error && (
          <div className="adm-count-row">
            <span className="adm-count-text">
              {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''}
              {selectedSemester !== 'All' && ` in Semester ${selectedSemester}`}
            </span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <p className="sf-loading">Loading subjects...</p>
        ) : error ? (
          <div className="sf-error-box">{error}</div>
        ) : (
          <ShowSubjects subjects={filteredSubjects} fetchSubjects={fetchSubjects} />
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
