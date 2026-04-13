
import { useNavigate } from 'react-router-dom';
import '../css/NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-wrapper">
      <div className="grid" />
      <div className="blob" />
      <div className="container">
        <span className="label">Error</span>
        <h1 className="big-number">404</h1>
        <div className="divider" />
        <p className="message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="btn" onClick={() => navigate('/')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Go Back Home
        </button>
      </div>
    </div>
  );
}