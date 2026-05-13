import { useNavigate } from 'react-router-dom';
import '../../css/UnderConstruction.css';
import TopNavBar from '../Admin/TopNav';
const UnderConstruction = () => {
  const navigate = useNavigate();
  return (
    <>
    <TopNavBar  role={"staff"}/>
    <div className="uc-wrapper">
      
      <div className="uc-grid" />

      <div className="uc-container">
        <div className="uc-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>

        <span className="uc-label">// in progress</span>

        <h1 className="uc-heading">
          Under
          <span className="uc-heading-accent"> Construction</span>
        </h1>

        <p className="uc-desc">
          This feature is being built.<br />Check back soon.
        </p>

        <div className="uc-progress-wrap">
          <div className="uc-progress-label">
            <span>Build progress</span>
            <span>68%</span>
          </div>
          <div className="uc-progress-bar">
            <div className="uc-progress-fill" />
          </div>
        </div>

        <button className="uc-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          go back
        </button>
      </div>
    </div>
    </>
  );
};

export default UnderConstruction;
