import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { authAtom } from '../../store/authStore/authAtom';
import '../../css/SuperAdminDashboard.css';
import '../../css/Signup.css';
import '../../css/ShowSubjects.css';
import '../../css/RoomsSections.css';

const EMPTY_SECTION = {
  sectionName: '',
  semester: '',
  year: '',
  courseName: '',
  totalStudents: '',
};

const SectionsManager = () => {
  const { user }                      = useRecoilValue(authAtom);
  const department                    = user?.adminDept || '';

  const [sections, setSections]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState({ msg: '', type: '' });
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [form, setForm]               = useState(EMPTY_SECTION);
  const [saving, setSaving]           = useState(false);
  const [deletingId, setDeletingId]   = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true,
  });

  // ── Fetch sections ────────────────────────────────────────────────────────
  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'http://localhost:3004/api/v1/admin/getSections',
        authHeaders()
      );
      setSections(res.data?.sections || res.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch sections.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSections(); }, []);

  const openCreate = () => {
    setEditingSection(null);
    setForm(EMPTY_SECTION);
    setModalOpen(true);
  };

  const openEdit = (section) => {
    setEditingSection(section);
    setForm({
      sectionName:   section.sectionName,
      semester:      section.semester,
      year:          section.year,
      courseName:    section.courseName,
      totalStudents: section.totalStudents,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.sectionName || !form.semester || !form.year || !form.courseName || !form.totalStudents) {
      showToast('Please fill all fields.', 'error');
      return false;
    }
    return true;
  };

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await axios.put(
        'http://localhost:3004/api/v1/admin/addSections',
        {
          ...form,
          semester:      parseInt(form.semester),
          year:          parseInt(form.year),
          totalStudents: parseInt(form.totalStudents),
          department,
        },
        authHeaders()
      );
      showToast('Section added successfully.');
      setModalOpen(false);
      fetchSections();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await axios.put(
        `http://localhost:3004/api/v1/admin/updateSection/${editingSection._id}`,
        {
          ...form,
          semester:      parseInt(form.semester),
          year:          parseInt(form.year),
          totalStudents: parseInt(form.totalStudents),
          department,
        },
        authHeaders()
      );
      showToast('Section updated successfully.');
      setModalOpen(false);
      fetchSections();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(
        `http://localhost:3004/api/v1/admin/deleteSection/${id}`,
        authHeaders()
      );
      showToast('Section deleted.');
      fetchSections();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete section.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast.msg && (
        <div className={`pr-toast ${toast.type}`} style={{ marginBottom: '20px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {toast.type === 'error'
              ? <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
              : <><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></>}
          </svg>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="sf-section-header" style={{ marginBottom: '16px' }}>
        <div>
          <div className="sf-section-title">Sections</div>
          <div className="sf-section-sub">Manage student sections and batches in your department</div>
        </div>
        <button className="adm-add-btn" onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Section
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="sf-loading">Loading sections...</p>
      ) : sections.length === 0 ? (
        <div className="sf-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          No sections added yet. Click "Add Section" to get started.
        </div>
      ) : (
        <div className="rs-grid">
          {sections.map((section) => (
            <div className="rs-card" key={section._id}>
              <div className="rs-card-top">
                <span className="rs-type-badge section">Section {section.sectionName}</span>
                <span className="subj-code">Sem {section.semester}</span>
              </div>
              <div className="rs-card-title">{section.courseName}</div>
              <div className="subj-meta" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div className="subj-meta-item">
                  <div className="subj-meta-label">Year</div>
                  <div className="subj-meta-val">{section.year}</div>
                </div>
                <div className="subj-meta-item">
                  <div className="subj-meta-label">Students</div>
                  <div className="subj-meta-val accent">{section.totalStudents}</div>
                </div>
                <div className="subj-meta-item">
                  <div className="subj-meta-label">Dept</div>
                  <div className="subj-meta-val mono" style={{ fontSize: 12 }}>{section.department || department}</div>
                </div>
              </div>
              <div className="subj-actions">
                <button className="subj-btn edit" onClick={() => openEdit(section)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button
                  className="subj-btn delete"
                  onClick={() => handleDelete(section._id)}
                  disabled={deletingId === section._id}
                >
                  {deletingId === section._id
                    ? <span className="sa-spinner" style={{ width: 13, height: 13 }} />
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                  }
                  {deletingId === section._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="subj-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="subj-modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="subj-modal-header">
              <div>
                <div className="subj-modal-title">{editingSection ? 'Edit Section' : 'Add Section'}</div>
                <div className="subj-modal-sub">Department: {department}</div>
              </div>
              <button className="subj-modal-close" onClick={() => setModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="subj-modal-body">
              <div className="sa-row">
                <div className="sa-field">
                  <label className="sa-label">Section name</label>
                  <input type="text" name="sectionName" className="sa-input" placeholder="e.g. A, B, C" value={form.sectionName} onChange={handleChange} />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Course name</label>
                  <input type="text" name="courseName" className="sa-input" placeholder="e.g. BCA, BTECH" value={form.courseName} onChange={handleChange} />
                </div>
              </div>
              <div className="sa-row">
                <div className="sa-field">
                  <label className="sa-label">Year</label>
                  <input type="number" name="year" className="sa-input" placeholder="e.g. 2023" value={form.year} onChange={handleChange} min={2000} />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Semester</label>
                  <input type="number" name="semester" className="sa-input" placeholder="e.g. 1" value={form.semester} onChange={handleChange} min={1} max={8} />
                </div>
              </div>
              <div className="sa-field">
                <label className="sa-label">Total students</label>
                <input type="number" name="totalStudents" className="sa-input" placeholder="e.g. 60" value={form.totalStudents} onChange={handleChange} min={1} />
              </div>
            </div>
            <div className="subj-modal-footer">
              <button className="pr-btn edit" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="pr-btn accept" onClick={editingSection ? handleUpdate : handleCreate} disabled={saving}>
                {saving ? <span className="sa-spinner" style={{ width: 13, height: 13 }} /> : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {saving ? 'Saving...' : editingSection ? 'Save Changes' : 'Add Section'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionsManager;
