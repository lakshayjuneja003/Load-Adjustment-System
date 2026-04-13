import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNavBar from './SuperAdminTopNav.jsx';
import '../../css/superAdminDashboard.css';
import '../../css/Permissions.css';

const ManagePermissions = () => {
  const [permissions, setPermissions]     = useState([]);   // single source of truth
  const [isExisting, setIsExisting]       = useState(false); // true = permissions came from API
  const [editableIndex, setEditableIndex] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState({ msg: '', type: '' });
  const inputRef                          = useRef(null);
  const navigate                          = useNavigate();

  // ── Fetch existing permissions on mount ──────────────────────────────────
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3004/api/v1/superadmin/getPermissions',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          const fetched = res.data?.permissions?.permissions || [];
          setPermissions(fetched);
          setIsExisting(fetched.length > 0); // if data exists → update mode
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/superAdmin/login');
        }
        // No permissions yet — stay in create mode, empty state is fine
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [navigate]);

  // ── Auto-dismiss toast ───────────────────────────────────────────────────
  useEffect(() => {
    if (!toast.msg) return;
    const t = setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Add permission via Enter key ─────────────────────────────────────────
  const handleInputKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const value = e.target.value.trim();
    if (!value) return;
    if (permissions.includes(value)) {
      showToast('Permission already exists.', 'error');
      return;
    }
    setPermissions((prev) => [...prev, value]);
    e.target.value = '';
  };

  // ── Add via button ───────────────────────────────────────────────────────
  const handleAddClick = () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;
    if (permissions.includes(value)) {
      showToast('Permission already exists.', 'error');
      return;
    }
    setPermissions((prev) => [...prev, value]);
    inputRef.current.value = '';
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = (index) => {
    setPermissions((prev) => prev.filter((_, i) => i !== index));
    if (editableIndex === index) setEditableIndex(null);
  };

  // ── Inline edit ─────────────────────────────────────────────────────────
  const handleEdit = (e, index) => {
    const updated = [...permissions];
    updated[index] = e.target.value;
    setPermissions(updated);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') setEditableIndex(null);
  };

  // ── Submit: create or update ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (permissions.length === 0) {
      showToast('Add at least one permission before saving.', 'error');
      return;
    }

    // If data existed when we fetched → update, otherwise → set (create)
    const url = isExisting
      ? 'http://localhost:3004/api/v1/superadmin/updatePermissions'
      : 'http://localhost:3004/api/v1/superadmin/setPermissions';
    try {
      const response = await axios.put(url,
         isExisting ? { newPermissions: permissions } : { permissions }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsExisting(true); // now they exist, future saves are updates
        showToast('Permissions saved successfully.', 'success');
      } else {
        showToast('Failed to save permissions. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Error saving permissions:', err);
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const showToast = (msg, type) => setToast({ msg, type });

  return (
    <div className="sf-dashboard">
      <TopNavBar />

      <div className="sf-dashboard-main">

        {/* Header */}
        <div className="pr-page-header">
          <div>
            <div className="sf-welcome-h">Permissions</div>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" style={{ background: isExisting ? 'var(--amber)' : 'var(--green)' }} />
              Define what functionalities admins can request when signing up
            </div>
          </div>
          <span className={`perm-mode-badge ${isExisting ? 'update' : 'create'}`}>
            {loading ? 'loading...' : isExisting ? 'update mode' : 'create mode'}
          </span>
        </div>

        {/* Toast */}
        {toast.msg && (
          <div className={`pr-toast ${toast.type}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {toast.type === 'error'
                ? <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
                : <><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></>
              }
            </svg>
            {toast.msg}
          </div>
        )}

        {/* Main card */}
        <div className="perm-card">

          {/* Add input */}
          <div className="perm-section-label">Add a permission</div>
          <div className="perm-input-row">
            <input
              ref={inputRef}
              type="text"
              className="perm-text-input"
              placeholder="e.g. Add Subjects, Generate Timetable..."
              onKeyDown={handleInputKeyDown}
            />
            <button className="perm-add-btn" onClick={handleAddClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add
            </button>
          </div>

          {/* Permission tags */}
          <div className="perm-section-label">
            Current permissions
            <span className="perm-hint-inline">double-click to edit</span>
          </div>

          {loading ? (
            <p className="sf-loading">Loading permissions...</p>
          ) : (
            <div className="perm-tags-area">
              {permissions.length > 0 ? (
                permissions.map((val, index) => (
                  <div
                    key={index}
                    className={`perm-tag ${editableIndex === index ? 'editing' : ''}`}
                    onDoubleClick={() => setEditableIndex(index)}
                  >
                    {editableIndex === index ? (
                      <input
                        autoFocus
                        type="text"
                        value={val}
                        className="perm-tag-input"
                        onChange={(e) => handleEdit(e, index)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={() => setEditableIndex(null)}
                      />
                    ) : (
                      <span>{val}</span>
                    )}
                    <button
                      className="perm-tag-del"
                      onClick={() => handleDelete(index)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="perm-empty">
                  No permissions yet. Add some above to get started.
                </div>
              )}
            </div>
          )}

          <div className="perm-hint">
            Press <code>Enter</code> to add &nbsp;·&nbsp;
            <code>Double-click</code> a tag to edit &nbsp;·&nbsp;
            <code>Enter</code> again to confirm edit
          </div>

          {/* Footer */}
          <div className="perm-footer">
            <span className="perm-count">
              {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
            </span>
            <button className="perm-save-btn" onClick={handleSubmit} disabled={loading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Save Permissions
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagePermissions;
