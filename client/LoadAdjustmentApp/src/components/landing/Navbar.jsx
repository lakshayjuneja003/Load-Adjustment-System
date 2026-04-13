import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sf-nav">
      <a href="/" className="sf-logo">
        <div className="sf-logo-icon">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        ScheduleFlow
      </a>

      <ul className="sf-nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#roles">Roles</a></li>
        <li><a href="#">Docs</a></li>
      </ul>

      <button className="sf-nav-cta" onClick={() => navigate('/superadmin/signup')}>
        Get Started
      </button>
    </nav>
  );
}
