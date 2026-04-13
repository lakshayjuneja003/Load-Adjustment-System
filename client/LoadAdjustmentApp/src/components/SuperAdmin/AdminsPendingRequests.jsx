import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from './SuperAdminTopNav';
import '../../css/SuperAdmin.css';
import '../../css/PendingRequests.css';

const AVATAR_COLORS = [
  { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  { bg: 'rgba(6,182,212,0.15)',  color: '#06b6d4' },
  { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
  { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
];

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const AdminsPendingRequests = () => {
  const [requests, setRequests]                     = useState([]);
  const [status, setStatus]                         = useState('');
  const [verifyState, setVerifyState]               = useState('');
  const [editingIndex, setEditingIndex]             = useState(null);
  const [editedFunctionalities, setEditedFunctionalities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3004/api/v1/superadmin/getPendingRequests',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }
        );
        if (response.data?.pendingRequests?.length > 0) {
          setRequests(response.data.pendingRequests);
        } else {
          setStatus('No pending requests at the moment.');
        }
      } catch (error) {
        if (error.response?.status === 401) {
          handleLogout();
        } else {
          setStatus('Unable to fetch requests. Please try again later.');
        }
      }
    };
    fetchData();
  }, []);

  const handleAccept = async (id, originalFunctionalities) => {
    const updatedFunctionalities = editedFunctionalities[id] || originalFunctionalities;
    try {
      const response = await axios.put(
        'http://localhost:3004/api/v1/superadmin/verifyAdmin',
        { userId: id, assignedFunctionalities: updatedFunctionalities },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setVerifyState('Admin verified successfully.');
        setRequests((prev) => prev.filter((r) => r.userId._id !== id));
      } else {
        setVerifyState('Could not verify admin. Please try again.');
      }
    } catch {
      setVerifyState('Error verifying admin. Please try again later.');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(
        'http://localhost:3004/api/v1/superadmin/rejectAdmin',
        { userId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setVerifyState('Admin rejected.');
        setRequests((prev) => prev.filter((r) => r.userId._id !== id));
      } else {
        setVerifyState('Could not reject admin. Please try again.');
      }
    } catch {
      setVerifyState('Error rejecting admin. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/superAdmin/login');
  };

  const toggleEdit = (userId, index) => {
    setEditingIndex(index);
    if (!editedFunctionalities[userId]) {
      const funcs = requests.find((r) => r.userId._id === userId)?.pendingFunctionalities || [];
      setEditedFunctionalities((prev) => ({ ...prev, [userId]: [...funcs] }));
    }
  };

  const handleInputChange = (userId, index, value) => {
    setEditedFunctionalities((prev) => {
      const updated = [...(prev[userId] || [])];
      updated[index] = value;
      return { ...prev, [userId]: updated };
    });
  };

  const handleDeleteFunctionality = (userId, index) => {
    setEditedFunctionalities((prev) => {
      const updated = [...(prev[userId] || [])];
      updated.splice(index, 1);
      return { ...prev, [userId]: updated };
    });
  };

  const isEditing = (index) => editingIndex === index;

  return (
    <div className="sf-dashboard">
      <TopNavBar />

      <div className="sf-dashboard-main">

        {/* Page header */}
        <div className="pr-page-header">
          <div>
            <div className="sf-welcome-h">Pending Requests</div>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" style={{ background: requests.length > 0 ? 'var(--amber)' : 'var(--green)' }} />
              Review and manage admin registration requests
            </div>
          </div>
          {requests.length > 0 && (
            <div className="pr-count-badge">{requests.length} awaiting review</div>
          )}
        </div>

        {/* Verify state toast */}
        {verifyState && (
          <div className={`pr-toast ${verifyState.toLowerCase().includes('error') ? 'error' : 'success'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {verifyState.toLowerCase().includes('error')
                ? <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
                : <><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></>
              }
            </svg>
            {verifyState}
          </div>
        )}

        {/* Empty / error state */}
        {status && requests.length === 0 && (
          <div className="sf-empty-state" style={{ marginTop: '12px' }}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {status}
          </div>
        )}

        {/* Requests list */}
        <div className="pr-list">
          {requests.map((request, requestIndex) => {
            const user = request.userId;
            const userId = user?._id;
            const avatarStyle = AVATAR_COLORS[requestIndex % AVATAR_COLORS.length];
            const funcs = editedFunctionalities[userId] || request.pendingFunctionalities || [];
            const editing = isEditing(requestIndex);

            return (
              <div className="pr-card" key={userId}>
                <div className="pr-card-inner">

                  {/* Left: user info */}
                  <div className="pr-left">
                    <div className="pr-user-row">
                      <div
                        className="pr-avatar"
                        style={{ background: avatarStyle.bg, color: avatarStyle.color }}
                      >
                        {getInitials(user?.name)}
                      </div>
                      <div>
                        <div className="pr-name">{user?.name}</div>
                        <div className="pr-email">{user?.email}</div>
                      </div>
                    </div>

                    <div className="pr-meta">
                      <div className="pr-meta-item">
                        <div className="pr-meta-label">Employee ID</div>
                        <div className="pr-meta-val">{user?.empId || '—'}</div>
                      </div>
                      <div className="pr-meta-item">
                        <div className="pr-meta-label">Department</div>
                        <div className="pr-meta-val">{user?.adminDept || '—'}</div>
                      </div>
                    </div>

                    <div className="pr-func-section">
                      <div className="pr-func-label">
                        Requested Functionalities
                        {editing && <span className="pr-editing-pill">editing</span>}
                      </div>
                      <div className="pr-func-list">
                        {funcs.map((func, index) => (
                          <div className="pr-func-tag" key={index}>
                            {editing ? (
                              <input
                                type="text"
                                value={func}
                                className="pr-func-input"
                                onChange={(e) => handleInputChange(userId, index, e.target.value)}
                              />
                            ) : (
                              <span>{func}</span>
                            )}
                            {editing && (
                              <button
                                className="pr-func-delete"
                                onClick={() => handleDeleteFunctionality(userId, index)}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="pr-actions">
                    {editing ? (
                      <button className="pr-btn save" onClick={() => setEditingIndex(null)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12" /></svg>
                        Save
                      </button>
                    ) : (
                      <button className="pr-btn edit" onClick={() => toggleEdit(userId, requestIndex)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                    )}
                    <button
                      className="pr-btn accept"
                      onClick={() => handleAccept(userId, request.pendingFunctionalities)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12" /></svg>
                      Accept
                    </button>
                    <button className="pr-btn reject" onClick={() => handleReject(userId)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminsPendingRequests;
