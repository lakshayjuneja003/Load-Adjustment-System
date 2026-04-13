import axios from 'axios';
import { useEffect, useState } from 'react';

const AVATAR_COLORS = ['c0', 'c1', 'c2', 'c3', 'c4'];

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const GetAdmins = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3004/api/v1/superadmin/getadmins',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }
        );

        if (res.status === 200 && res.data.adminList?.length > 0) {
          setAdminsData(res.data.adminList);
        } else {
          setErrorMessage('No admins found under your institution.');
        }
      } catch {
        setErrorMessage('Something went wrong fetching admins. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <>
      <div className="sf-section-header">
        <div>
          <div className="sf-section-title">Department Admins</div>
          <div className="sf-section-sub">All admins registered under your institution</div>
        </div>
        <button className="sf-section-btn">
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Invite Admin
        </button>
      </div>

      <div className="sf-admins-grid">
        {loading ? (
          <p className="sf-loading">Loading admins...</p>
        ) : adminsData.length > 0 ? (
          adminsData.map((admin, index) => (
            <div className="sf-admin-card" key={admin._id || index}>
              <div className="sf-admin-card-top">
                <div className={`sf-admin-avatar ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
                  {getInitials(admin.name)}
                </div>
                <div>
                  <div className="sf-admin-name">{admin.name}</div>
                  <div className="sf-admin-email">{admin.email}</div>
                </div>
              </div>

              <div className="sf-admin-meta">
                <div className="sf-admin-dept">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  {admin.adminDept || 'No Department'}
                </div>
                <span
                  className={`sf-v-badge ${
                    admin.isVerified === true || admin.isVerified === 'true'
                      ? 'verified'
                      : admin.isVerified === 'rejected'
                      ? 'rejected'
                      : 'pending'
                  }`}
                >
                  {admin.isVerified === true || admin.isVerified === 'true'
                    ? 'Verified'
                    : admin.isVerified === 'rejected'
                    ? 'Rejected'
                    : 'Pending'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="sf-empty-state">{errorMessage}</div>
        )}
      </div>
    </>
  );
};

export default GetAdmins;
