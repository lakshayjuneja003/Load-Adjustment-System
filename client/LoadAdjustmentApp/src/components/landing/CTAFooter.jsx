import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <div className="sf-cta-section">
      <div className="sf-cta-title">
        Ready to streamline your{' '}
        <span>scheduling workflow?</span>
      </div>
      <p className="sf-cta-sub">
        Set up your institution in minutes. No spreadsheets, no manual conflicts, no chaos.
      </p>
      <div className="sf-cta-btns">
        <button
          className="sf-btn-primary"
          style={{ fontSize: '15px', padding: '14px 32px' }}
          onClick={() => navigate('/superadmin/signup')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Create Super Admin Account
        </button>
        <button
          className="sf-btn-secondary"
          style={{ fontSize: '15px', padding: '14px 32px' }}
        >
          Request a Demo
        </button>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="sf-footer">
      <a href="/" className="sf-logo" style={{ fontSize: '15px' }}>
        <div className="sf-logo-icon" style={{ width: '26px', height: '26px' }}>
          <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }} fill="none" stroke="#fff" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        ScheduleFlow
      </a>

      <p>© 2026 ScheduleFlow. All rights reserved.</p>

      <div className="sf-footer-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>
    </footer>
  );
}
