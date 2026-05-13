import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNavBar from './TopNav';
import '../../css/SuperAdminDashboard.css';
import '../../css/Signup.css';
import '../../css/AddSubjects.css';

const EMPTY_SUBJECT = {
  year: '',
  semester: '',
  department: '',
  subjectName: '',
  subjectCode: '',
  subjectType: '',
  numberOfClasses: '',
  numberOfTutorials: '',
  labHours: '',
};

const AddSubjects = () => {
  const navigate                            = useNavigate();
  const [years, setYears]                   = useState('');
  const [semesters, setSemesters]           = useState([]);
  const [subjects, setSubjects]             = useState([]);
  const [subjectData, setSubjectData]       = useState(EMPTY_SUBJECT);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [creditPoints, setCreditPoints]     = useState(0);
  const [submitting, setSubmitting]         = useState(false);
  const [toast, setToast]                   = useState({ msg: '', type: '' });

  const userDetails = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  useEffect(() => {
    if (years) {
      setSemesters(Array.from({ length: years * 2 }, (_, i) => i + 1));
    }
  }, [years]);

  useEffect(() => {
    let pts = 0;
    if (subjectData.subjectType === 'Theory') {
      pts = parseInt(subjectData.numberOfClasses || 0) + parseInt(subjectData.numberOfTutorials || 0);
    } else if (subjectData.subjectType === 'Lab') {
      pts = parseInt(subjectData.labHours || 0);
    }
    setCreditPoints(pts);
  }, [subjectData.numberOfClasses, subjectData.numberOfTutorials, subjectData.labHours, subjectData.subjectType]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubject = () => {
    if (!subjectData.year || !subjectData.semester || !subjectData.subjectName || !subjectData.subjectCode || !subjectData.subjectType) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const newSubject = {
      year: subjectData.year,
      semester: subjectData.semester,
      department: subjectData.department,
      subjectName: subjectData.subjectName,
      subjectCode: subjectData.subjectCode,
      subjectType: subjectData.subjectType,
      creditPoints,
      ...(subjectData.subjectType === 'Theory' && {
        numberOfClasses: subjectData.numberOfClasses,
        numberOfTutorials: subjectData.numberOfTutorials,
      }),
      ...(subjectData.subjectType === 'Lab' && {
        labHours: subjectData.labHours,
      }),
    };

    setSubjects((prev) => [...prev, newSubject]);
    setSubjectData(EMPTY_SUBJECT);
    setIsModalOpen(false);
    showToast('Subject added to list.');
  };

  const handleRemoveSubject = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjects.length === 0) {
      showToast('Add at least one subject before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:3004/api/v1/admin/add-subjects',
        { years: parseInt(years), subjects },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        }
      );
      showToast(response.data.message || 'Subjects added successfully.');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to add subjects.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sf-dashboard">
      <TopNavBar role="Admin" userName={userDetails?.name} />

      <div className="sf-dashboard-main">

        {/* Header */}
        <div className="sf-welcome-row" style={{ marginBottom: '28px' }}>
          <div>
            <h1 className="sf-welcome-h">Add Subjects</h1>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" />
              Build your department's subject catalogue for each semester
            </div>
          </div>
          <button className="adm-add-btn" onClick={() => navigate('/admin/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Dashboard
          </button>
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

        <form onSubmit={handleSubmit}>

          {/* Years input card */}
          <div className="addsubj-card" style={{ marginBottom: '16px' }}>
            <div className="addsubj-card-header">
              <div className="addsubj-card-title">Course duration</div>
              <div className="addsubj-card-sub">Set the number of years to generate semesters</div>
            </div>
            <div style={{ maxWidth: '220px' }}>
              <label className="sa-label">Number of years</label>
              <input
                type="number"
                className="sa-input"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g. 4"
                min={1} max={6}
                required
              />
            </div>
          </div>

          {/* Added subjects card */}
          <div className="addsubj-card" style={{ marginBottom: '16px' }}>
            <div className="addsubj-card-header-row">
              <div>
                <div className="addsubj-card-title">Added subjects</div>
                <div className="addsubj-card-sub">
                  {subjects.length} subject{subjects.length !== 1 ? 's' : ''} in the list
                </div>
              </div>
              <button
                type="button"
                className="adm-add-btn"
                onClick={() => setIsModalOpen(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Subject
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="sf-empty-state" style={{ margin: '16px 0 0' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                No subjects added yet. Click "Add Subject" to get started.
              </div>
            ) : (
              <div className="addsubj-list">
                {subjects.map((subject, index) => (
                  <div className="addsubj-item" key={index}>
                    <div className="addsubj-item-left">
                      <span className={`subj-type-badge ${subject.subjectType === 'Theory' ? 'theory' : 'lab'}`}>
                        {subject.subjectType}
                      </span>
                      <div>
                        <div className="addsubj-item-name">{subject.subjectName}</div>
                        <div className="addsubj-item-meta">
                          {subject.subjectCode} &nbsp;·&nbsp; Year {subject.year} &nbsp;·&nbsp; Sem {subject.semester} &nbsp;·&nbsp; {subject.creditPoints} cr
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="addsubj-remove-btn"
                      onClick={() => handleRemoveSubject(index)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit / Cancel */}
          <div className="addsubj-footer">
            <button
              type="button"
              className="pr-btn edit"
              style={{ padding: '11px 24px', fontSize: '14px' }}
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sa-btn"
              style={{ width: 'auto', padding: '11px 28px' }}
              disabled={submitting || subjects.length === 0}
            >
              {submitting ? <span className="sa-spinner" /> : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {submitting ? 'Submitting...' : `Submit ${subjects.length > 0 ? `(${subjects.length})` : ''} Subjects`}
            </button>
          </div>
        </form>
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="subj-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="subj-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>

            <div className="subj-modal-header">
              <div>
                <div className="subj-modal-title">Add a subject</div>
                <div className="subj-modal-sub">Fill in the details below</div>
              </div>
              <button className="subj-modal-close" onClick={() => setIsModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="subj-modal-body">

              <div className="sa-row">
                <div className="sa-field">
                  <label className="sa-label">Subject name</label>
                  <input type="text" name="subjectName" className="sa-input" placeholder="e.g. Data Structures" value={subjectData.subjectName} onChange={handleInputChange} />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Subject code</label>
                  <input type="text" name="subjectCode" className="sa-input" placeholder="e.g. CS301" value={subjectData.subjectCode} onChange={handleInputChange} />
                </div>
              </div>

              <div className="sa-row">
                <div className="sa-field">
                  <label className="sa-label">Year</label>
                  <input type="number" name="year" className="sa-input" placeholder="e.g. 2" value={subjectData.year} onChange={handleInputChange} min={1} max={years || 6} />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Semester</label>
                  <select name="semester" className="sa-input signup-select" value={subjectData.semester} onChange={handleInputChange}>
                    <option value="">Select semester</option>
                    {semesters.map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sa-row">
                <div className="sa-field">
                  <label className="sa-label">Department</label>
                  <input type="text" name="department" className="sa-input" placeholder="e.g. CSE" value={subjectData.department} onChange={handleInputChange} />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Subject type</label>
                  <select name="subjectType" className="sa-input signup-select" value={subjectData.subjectType} onChange={handleInputChange}>
                    <option value="">Select type</option>
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
              </div>

              {subjectData.subjectType && (
                <>
                  <div className="sa-divider">
                    <div className="sa-divider-line" />
                    <span className="sa-divider-label">
                      {subjectData.subjectType === 'Theory' ? 'theory hours' : 'lab hours'}
                    </span>
                    <div className="sa-divider-line" />
                  </div>

                  {subjectData.subjectType === 'Theory' ? (
                    <div className="sa-row">
                      <div className="sa-field">
                        <label className="sa-label">Classes per week</label>
                        <input type="number" name="numberOfClasses" className="sa-input" placeholder="e.g. 3" value={subjectData.numberOfClasses} onChange={handleInputChange} min={0} />
                      </div>
                      <div className="sa-field">
                        <label className="sa-label">Number of tutorials</label>
                        <input type="number" name="numberOfTutorials" className="sa-input" placeholder="e.g. 1" value={subjectData.numberOfTutorials} onChange={handleInputChange} min={0} />
                      </div>
                    </div>
                  ) : (
                    <div className="sa-field">
                      <label className="sa-label">Lab hours per week</label>
                      <input type="number" name="labHours" className="sa-input" placeholder="e.g. 2" value={subjectData.labHours} onChange={handleInputChange} min={0} />
                    </div>
                  )}
                </>
              )}

              {/* Credit points preview */}
              <div className="subj-credit-preview">
                <span className="subj-credit-label">Calculated credit points</span>
                <span className="subj-credit-val">{creditPoints}</span>
              </div>

            </div>

            <div className="subj-modal-footer">
              <button type="button" className="pr-btn edit" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="pr-btn accept" onClick={handleAddSubject}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add to List
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AddSubjects;
