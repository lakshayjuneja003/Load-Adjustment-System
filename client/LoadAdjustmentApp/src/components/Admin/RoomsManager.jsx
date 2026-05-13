import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { authAtom } from '../../store/authStore/authAtom';
import '../../css/SuperAdminDashboard.css';
import '../../css/Signup.css';
import '../../css/ShowSubjects.css';
import '../../css/RoomsSections.css';

const EMPTY_ROOM = { roomNumber: '', roomType: '', capacity: '' };

const RoomsManager = () => {
  const { user }                    = useRecoilValue(authAtom);
  const department                  = user?.adminDept || '';

  const [rooms, setRooms]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState({ msg: '', type: '' });
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingRoom, setEditingRoom] = useState(null); // null = create, obj = edit
  const [form, setForm]             = useState(EMPTY_ROOM);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true,
  });

  // ── Fetch rooms ───────────────────────────────────────────────────────────
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'http://localhost:3004/api/v1/admin/getRooms',
        authHeaders()
      );
      setRooms(res.data?.rooms || res.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch rooms.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreate = () => {
    setEditingRoom(null);
    setForm(EMPTY_ROOM);
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      roomNumber: room.roomNumber,
      roomType:   room.roomType,
      capacity:   room.capacity,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.roomNumber || !form.roomType || !form.capacity) {
      showToast('Please fill all fields.', 'error'); return;
    }
    setSaving(true);
    try {
      await axios.post(
        'http://localhost:3004/api/v1/admin/createroom',
        { ...form, department },
        authHeaders()
      );
      showToast('Room created successfully.');
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create room.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!form.roomNumber || !form.roomType || !form.capacity) {
      showToast('Please fill all fields.', 'error'); return;
    }
    setSaving(true);
    try {
      await axios.post(
        `http://localhost:3004/api/v1/admin/updateroom/${editingRoom._id}`,
        { ...form, department },
        authHeaders()
      );
      showToast('Room updated successfully.');
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update room.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(
        `http://localhost:3004/api/v1/admin/deleteroom/${id}`,
        authHeaders()
      );
      showToast('Room deleted.');
      fetchRooms();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete room.', 'error');
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
          <div className="sf-section-title">Rooms</div>
          <div className="sf-section-sub">Manage classrooms and labs in your department</div>
        </div>
        <button className="adm-add-btn" onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Room
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="sf-loading">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <div className="sf-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
          No rooms added yet. Click "Add Room" to get started.
        </div>
      ) : (
        <div className="rs-grid">
          {rooms.map((room) => (
            <div className="rs-card" key={room._id}>
              <div className="rs-card-top">
                <span className={`rs-type-badge ${room.roomType === 'Lab' ? 'lab' : 'class'}`}>
                  {room.roomType}
                </span>
                <span className="subj-code">#{room.roomName}</span>
              </div>
              <div className="rs-card-title">Room {room.roomName}</div>
              <div className="subj-meta">
                <div className="subj-meta-item">
                  <div className="subj-meta-label">Dept</div>
                  <div className="subj-meta-val mono" style={{ fontSize: 13 }}>{room.department || department}</div>
                </div>
                <div className="subj-meta-item">
                  <div className="subj-meta-label">Capacity</div>
                  <div className="subj-meta-val accent">{room.capacity}</div>
                </div>
              </div>
              <div className="subj-actions">
                <button className="subj-btn edit" onClick={() => openEdit(room)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button
                  className="subj-btn delete"
                  onClick={() => handleDelete(room._id)}
                  disabled={deletingId === room._id}
                >
                  {deletingId === room._id
                    ? <span className="sa-spinner" style={{ width: 13, height: 13 }} />
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                  }
                  {deletingId === room._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="subj-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="subj-modal" onClick={(e) => e.stopPropagation()}>
            <div className="subj-modal-header">
              <div>
                <div className="subj-modal-title">{editingRoom ? 'Edit Room' : 'Add Room'}</div>
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
                  <label className="sa-label">Room number</label>
                  <input type="text" name="roomNumber" className="sa-input" placeholder="e.g. 101" value={form.roomNumber} onChange={handleChange} />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Room type</label>
                  <select name="roomType" className="sa-input signup-select" value={form.roomType} onChange={handleChange}>
                    <option value="">Select type</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Seminar Hall">Seminar</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>
              <div className="sa-field">
                <label className="sa-label">Capacity</label>
                <input type="number" name="capacity" className="sa-input" placeholder="e.g. 60" value={form.capacity} onChange={handleChange} min={1} />
              </div>
            </div>
            <div className="subj-modal-footer">
              <button className="pr-btn edit" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="pr-btn accept" onClick={editingRoom ? handleUpdate : handleCreate} disabled={saving}>
                {saving ? <span className="sa-spinner" style={{ width: 13, height: 13 }} /> : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {saving ? 'Saving...' : editingRoom ? 'Save Changes' : 'Add Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsManager;
