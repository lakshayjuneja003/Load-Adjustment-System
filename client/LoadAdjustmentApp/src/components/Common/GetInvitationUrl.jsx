import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/superAdminDashboard.css';
import './GetUrl.css';
import TopNavBar from '../SuperAdmin/SuperAdminTopNav';

const GetUrl = ({ role }) => {
  const [url, setUrl]       = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const navigate            = useNavigate();

  useEffect(() => {
    const getUrlFromBackend = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3004/api/v1/${role}/getinvitationurl`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setUrl(response.data.url);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate(`/${role}/login`);
        } else {
          setError('Failed to fetch invitation URL. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    getUrlFromBackend();
  }, [role, navigate]);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sf-dashboard">
    {role == 'superAdmin' ? <TopNavBar /> : null}
      <div className="sf-dashboard-main">

        {/* Header */}
        <div className="pr-page-header">
          <div>
            <div className="sf-welcome-h">Invitation URL</div>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" />
              Share this link to invite admins to your institution
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="sf-error-box">{error}</div>}

        {/* URL Card */}
        <div className="url-card">

          {/* Icon header */}
          <div className="url-card-top">
            <div className="url-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div>
              <div className="url-card-title">Admin Invitation Link</div>
              <div className="url-card-sub">Anyone with this link can register as an admin under your institution</div>
            </div>
          </div>

          {/* URL display */}
          {loading ? (
            <p className="sf-loading">Fetching your invitation URL...</p>
          ) : url ? (
            <>
              <div className="url-display-row">
                <div className="url-text">{url}</div>
                <button
                  className={`url-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy URL
                    </>
                  )}
                </button>
              </div>

              <div className="url-hint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                This URL is unique to your institution. Invited admins must be verified by you before they gain access.
              </div>
            </>
          ) : (
            <div className="sf-empty-state">
              <svg viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              No invitation URL found for your account.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GetUrl;
