import { useState } from 'react';
import axios from 'axios';
import '../../css/SuperAdminDashboard.css';
import '../../css/ShowSubjects.css';

const ShowSubjects = ({ subjects, fetchSubjects }) => {
  const [editFormData, setEditFormData] = useState({});
  const [showModal, setShowModal]       = useState(false);
  const [toast, setToast]               = useState({ msg: '', type: '' });
  const [deleting, setDeleting]         = useState(null);
  const [saving, setSaving]             = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const handleEditClick = (subject) => {
    setEditFormData({ ...subject });
    setShowModal(true);
  };

  const handleDeleteClick = async (subjectId) => {
    setDeleting(subjectId);
    try {
      const response = await axios.delete(
        `http://localhost:3004/api/v1/admin/subject/delete/${subjectId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        }
      );
      showToast(response.data?.message || 'Subject deleted successfully.');
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      showToast('Failed to delete subject. Please try again.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (updated.subjectType === 'Theory') {
        updated.creditPoints =
          parseInt(updated.lecturesPerWeek || 0) +
          parseInt(updated.totalTutorials || 0);
      } else if (updated.subjectType === 'Lab') {
        updated.creditPoints = parseInt(updated.labHours || 0);
      }
      return updated;
    });
  };

  const handleSaveClick = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:3004/api/v1/admin/subject/update/${editFormData._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        }
      );
      showToast(response.data?.message || 'Subject updated successfully.');
      setShowModal(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error updating subject:', error);
      showToast('Failed to update subject. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (subjects.length === 0) {
    return (
      <div className="sf-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        No subjects found. Add some using the button above.
      </div>
    );
  }

  return (
    <div>
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

      {/* Subject grid */}
      <div className="subj-grid">
        {subjects.map((subject) => (
          <div key={subject._id} className="subj-card">

            {/* Type badge */}
            <div className="subj-card-top">
              <span className={`subj-type-badge ${subject.subjectType === 'Theory' ? 'theory' : 'lab'}`}>
                {subject.subjectType === 'Theory' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1-2-2H9z"/>
                  </svg>
                )}
                {subject.subjectType}
              </span>
              <span className="subj-code">{subject.subjectCode}</span>
            </div>

            {/* Subject name */}
            <div className="subj-name">{subject.subjectName}</div>

            {/* Meta row */}
            <div className="subj-meta">
              <div className="subj-meta-item">
                <div className="subj-meta-label">Year</div>
                <div className="subj-meta-val">{subject.year}</div>
              </div>
              <div className="subj-meta-item">
                <div className="subj-meta-label">Semester</div>
                <div className="subj-meta-val">{subject.semester}</div>
              </div>
              <div className="subj-meta-item">
                <div className="subj-meta-label">Credits</div>
                <div className="subj-meta-val accent">{subject.creditPoints}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="subj-actions">
              <button className="subj-btn edit" onClick={() => handleEditClick(subject)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button
                className="subj-btn delete"
                onClick={() => handleDeleteClick(subject._id)}
                disabled={deleting === subject._id}
              >
                {deleting === subject._id ? (
                  <span className="sa-spinner" style={{ width: 13, height: 13 }} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                )}
                {deleting === subject._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="subj-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="subj-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="subj-modal-header">
              <div>
                <div className="subj-modal-title">Edit Subject</div>
                <div className="subj-modal-sub">{editFormData.subjectName}</div>
              </div>
              <button className="subj-modal-close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal form */}
            <div className="subj-modal-body">
              <div className="sa-row">
                <div className="sa-field">
                  <label className="sa-label">Subject name</label>
                  <input
                    type="text"
                    className="sa-input"
                    name="subjectName"
                    value={editFormData.subjectName || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter subject name"
                  />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Subject code</label>
                  <input
                    type="text"
                    className="sa-input"
                    name="subjectCode"
                    value={editFormData.subjectCode || ''}
                    onChange={handleFieldChange}
                    placeholder="e.g. CS301"
                  />
                </div>
              </div>

              <div className="sa-row">
                <div className="sa-field">
                  <label className="sa-label">Year</label>
                  <input
                    type="number"
                    className="sa-input"
                    name="year"
                    value={editFormData.year || ''}
                    onChange={handleFieldChange}
                    placeholder="e.g. 2"
                    min={1} max={4}
                  />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Semester</label>
                  <select
                    className="sa-input signup-select"
                    name="semester"
                    value={editFormData.semester || ''}
                    onChange={handleFieldChange}
                  >
                    {[...Array(2)].map((_, i) => {
                      const sem = (editFormData.year - 1) * 2 + i + 1;
                      return (
                        <option key={i} value={sem}>Semester {sem}</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="sa-divider">
                <div className="sa-divider-line" />
                <span className="sa-divider-label">
                  {editFormData.subjectType === 'Theory' ? 'theory hours' : 'lab hours'}
                </span>
                <div className="sa-divider-line" />
              </div>

              {editFormData.subjectType === 'Theory' ? (
                <div className="sa-row">
                  <div className="sa-field">
                    <label className="sa-label">Lectures per week</label>
                    <input
                      type="number"
                      className="sa-input"
                      name="lecturesPerWeek"
                      value={editFormData.lecturesPerWeek || 0}
                      onChange={handleFieldChange}
                      min={0}
                    />
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Total tutorials</label>
                    <input
                      type="number"
                      className="sa-input"
                      name="totalTutorials"
                      value={editFormData.totalTutorials || 0}
                      onChange={handleFieldChange}
                      min={0}
                    />
                  </div>
                </div>
              ) : (
                <div className="sa-field">
                  <label className="sa-label">Lab hours</label>
                  <input
                    type="number"
                    className="sa-input"
                    name="labHours"
                    value={editFormData.labHours || 0}
                    onChange={handleFieldChange}
                    min={0}
                  />
                </div>
              )}

              {/* Auto-calculated credit points */}
              <div className="subj-credit-preview">
                <span className="subj-credit-label">Calculated credit points</span>
                <span className="subj-credit-val">{editFormData.creditPoints ?? 0}</span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="subj-modal-footer">
              <button className="pr-btn edit" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="pr-btn accept" onClick={handleSaveClick} disabled={saving}>
                {saving ? <span className="sa-spinner" style={{ width: 13, height: 13 }} /> : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShowSubjects;
