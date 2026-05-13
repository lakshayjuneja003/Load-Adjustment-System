import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authAtom } from '../../store/authStore/authAtom';
import TopNavBar from '../Admin/TopNav';
import '../../css/SuperAdminDashboard.css';
import '../../css/Signup.css';
import './StaffPreferences.css';

const PRIORITY_LABELS = {
  '': 'Not set',
  '1': '1 — Low',
  '2': '2',
  '3': '3 — Medium',
  '4': '4',
  '5': '5 — High',
};

const StaffPreferences = () => {
  const { user }                          = useRecoilValue(authAtom);
  const navigate                          = useNavigate();

  const [semestersData, setSemestersData] = useState([]); // [{ semester, subjects: [] }]
  const [priorities, setPriorities]       = useState({});  // { subjectId: '1'|'2'|...|'5' }
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [toast, setToast]                 = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  };

  // ── Fetch active semesters with subjects ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3004/api/v1/user/getActiveSemestersWithSubjects',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          const raw = res.data?.data || [];
          setSemestersData(raw);
          console.log("Fetched data",res)
          // Pre-fill priorities as empty strings
          const initial = {};
          raw.forEach(({ subjects }) => {
            subjects?.forEach((s) => { initial[s._id] = ''; });
          });
          setPriorities(initial);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/staff/login');
        } else {
          showToast(err.response?.data?.message || 'Failed to load subjects.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handlePriorityChange = (subjectId, department, value) => {
  setPriorities((prev) => ({
    ...prev,
    [subjectId]: {
      department,
      value,
    },
  }));
};

  // ── Submit all filled priorities ─────────────────────────────────────────
  const handleSubmit = async () => {
    const filled = Object.entries(priorities).filter(
        ([, v]) => v?.value !== '');

    if (filled.length === 0) {
      showToast('Please set at least one priority before submitting.', 'error');
      return;
    }

    setSubmitting(true);
    const errors = [];
    await Promise.allSettled(
      filled.map(async ([subjectId , data]) => {
        const { department, value } = data || {};
        try {
          await axios.post(
            'http://localhost:3004/api/v1/user/mapTeacherSubject',
            {
              teacherId:  user._id,
              subjectId,
              department,
              priority : value
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              withCredentials: true,
            }
          );
        } catch (err) {
            console.log("FAILED:", subjectId, err.response?.data || err.message);
            errors.push(subjectId);
        }
      })
    );

    setSubmitting(false);

    if (errors.length === 0) {
      showToast(`${filled.length} preference${filled.length > 1 ? 's' : ''} saved successfully.`);
    } else {
      showToast(`${filled.length - errors.length} saved, ${errors.length} failed. Please try again.`, 'error');
    }
  };

  const totalFilled   = Object.values(priorities).filter((v) => v !== '').length;
  const totalSubjects = Object.keys(priorities).length;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="sf-dashboard">
      <TopNavBar role="Staff" userName={user?.name} />

      <div className="sf-dashboard-main">

        {/* Header */}
        <div className="sf-welcome-row">
          <div>
            <h1 className="sf-welcome-h">Subject Preferences</h1>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" />
              Set your priority (1–5) for each subject &nbsp;·&nbsp; Higher = stronger preference
            </div>
          </div>
          {!loading && totalSubjects > 0 && (
            <div className="pref-progress-badge">
              <div className="pref-progress-bar">
                <div
                  className="pref-progress-fill"
                  style={{ width: `${(totalFilled / totalSubjects) * 100}%` }}
                />
              </div>
              <span>{totalFilled}/{totalSubjects} filled</span>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast.msg && (
          <div className={`pr-toast ${toast.type}`} style={{ marginBottom: '20px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {toast.type === 'error'
                ? <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
                : <><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></>
              }
            </svg>
            {toast.msg}
          </div>
        )}

        {/* Loading */}
        {loading && <p className="sf-loading">Loading active semesters...</p>}

        {/* No active semesters */}
        {!loading && semestersData.length === 0 && (
          <div className="sf-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            No active semesters found. Your admin hasn't activated any semester yet.
          </div>
        )}

        {/* Semester sections */}
        {!loading && semestersData.map(({ semester, subjects }) => (
          <div className="pref-sem-block" key={semester}>

            {/* Semester header */}
            <div className="pref-sem-header">
              <div className="pref-sem-title">
                <div className="pref-sem-num">{semester}</div>
                Semester {semester}
              </div>
              <span className="pref-sem-count">
                {subjects?.length ?? 0} subject{subjects?.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Subjects grid */}
            <div className="pref-subjects-grid">
              {subjects?.map((subject) => {
                const priority = priorities[subject._id]?.value ?? '';
                const isSet    = priority !== '';

                return (
                  <div
                    className={`pref-subject-card ${isSet ? 'filled' : ''}`}
                    key={subject._id}
                  >
                    {/* Card top */}
                    <div className="pref-subject-top">
                      <span className={`subj-type-badge ${subject.subjectType === 'Theory' ? 'theory' : 'lab'}`}>
                        {subject.subjectType}
                      </span>
                      <span className="subj-code">{subject.subjectCode}</span>
                    </div>

                    {/* Subject name */}
                    <div className="pref-subject-name">{subject.subjectName}</div>

                    {/* Meta */}
                    <div className="subj-meta" style={{ marginBottom: 0 }}>
                      <div className="subj-meta-item">
                        <div className="subj-meta-label">Credits</div>
                        <div className="subj-meta-val accent">{subject.creditPoints}</div>
                      </div>
                      {subject.subjectType === 'Theory' && (
                        <div className="subj-meta-item">
                          <div className="subj-meta-label">Lectures</div>
                          <div className="subj-meta-val">{subject.numberOfClasses ?? subject.lecturesPerWeek ?? '—'}</div>
                        </div>
                      )}
                      {subject.subjectType === 'Lab' && (
                        <div className="subj-meta-item">
                          <div className="subj-meta-label">Lab hrs</div>
                          <div className="subj-meta-val">{subject.labHours ?? '—'}</div>
                        </div>
                      )}
                    </div>

                    {/* Priority select */}
                    <div className="pref-priority-row">
                      <label className="sa-label" style={{ marginBottom: 0 }}>Priority</label>
                      <select
                        className={`pref-priority-select ${isSet ? `p${priority}` : ''}`}
                        value={priority}
                        onChange={(e) => handlePriorityChange(subject._id, subject.department ,e.target.value)}
                      >
                        <option value="">Not set</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={String(n)}>{PRIORITY_LABELS[String(n)]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit footer */}
        {!loading && totalSubjects > 0 && (
          <div className="pref-footer">
            <div className="pref-footer-info">
              <span className="pref-count-text">
                {totalFilled} of {totalSubjects} preferences filled
              </span>
              {totalFilled < totalSubjects && (
                <span className="pref-footer-hint">
                  Unfilled subjects won't be submitted
                </span>
              )}
            </div>
            <button
              className="sa-btn"
              style={{ width: 'auto', padding: '12px 28px' }}
              onClick={handleSubmit}
              disabled={submitting || totalFilled === 0}
            >
              {submitting ? (
                <span className="sa-spinner" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {submitting ? 'Saving...' : `Submit ${totalFilled > 0 ? `(${totalFilled})` : ''} Preferences`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffPreferences;
