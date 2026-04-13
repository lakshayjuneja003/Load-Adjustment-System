import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <section className="sf-hero">
        <div className="sf-tag">
          <span className="sf-tag-dot" />
          Smart Timetable Generation
        </div>

        <h1>
          Build timetables that{' '}
          <span>actually work</span>{' '}
          for your institution
        </h1>

        <p className="sf-hero-sub">
          ScheduleFlow brings super admins, department heads, and staff together
          in one structured flow — collecting preferences, managing loads, and
          generating conflict-free timetables automatically.
        </p>

        <div className="sf-hero-btns">
          <button
            className="sf-btn-primary"
            onClick={() => navigate('/superadmin/signup')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Get Started as Super Admin
          </button>

          <button className="sf-btn-secondary" onClick={() => {
            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            See how it works
          </button>
        </div>
      </section>

      {/* Dashboard mockup */}
      <div className="sf-hero-visual">
        <div className="sf-dashboard-mock">
          <div className="sf-mock-bar">
            <div className="sf-mock-dot" style={{ background: '#ff5f57' }} />
            <div className="sf-mock-dot" style={{ background: '#febc2e' }} />
            <div className="sf-mock-dot" style={{ background: '#28c840' }} />
            <span className="sf-mock-title">scheduleflow.app / admin / dashboard</span>
          </div>

          <div className="sf-mock-body">
            <div className="sf-mock-sidebar">
              {['Dashboard', 'Staff', 'Subjects', 'Preferences', 'Timetable'].map((item, i) => (
                <div key={item} className={`sf-mock-nav-item ${i === 0 ? 'active' : ''}`}>
                  <div className="sf-mock-nav-icon" />
                  {item}
                </div>
              ))}
            </div>

            <div className="sf-mock-main">
              <div className="sf-mock-row">
                <div className="sf-mock-card">
                  <div className="sf-mock-card-label">Total Staff</div>
                  <div className="sf-mock-card-val blue">24</div>
                </div>
                <div className="sf-mock-card">
                  <div className="sf-mock-card-label">Subjects Added</div>
                  <div className="sf-mock-card-val cyan">38</div>
                </div>
                <div className="sf-mock-card">
                  <div className="sf-mock-card-label">Prefs Collected</div>
                  <div className="sf-mock-card-val green">91%</div>
                </div>
              </div>

              <div className="sf-mock-table">
                <div className="sf-mock-table-header">
                  <span>Staff Member</span>
                  <span>Designation</span>
                  <span>Load</span>
                  <span>Status</span>
                </div>
                {[
                  { name: 'Dr. Ramesh K.', role: 'Professor', load: '12 cr', status: 'active' },
                  { name: 'Ms. Priya S.', role: 'Asst. Prof', load: '20 cr', status: 'active' },
                  { name: 'Mr. Arjun T.', role: 'Assoc. Prof', load: '16 cr', status: 'pending' },
                ].map((row) => (
                  <div className="sf-mock-table-row" key={row.name}>
                    <span>{row.name}</span>
                    <span>{row.role}</span>
                    <span>{row.load}</span>
                    <span className={`sf-badge ${row.status}`}>
                      {row.status === 'active' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
