import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../../store/authStore/authAtom';
import TopNavBar from "./TopNav"
import RoomsManager from './RoomsManager';
import SectionsManager from './SectionsManager';
import '../../css/SuperAdminDashboard.css';
import '../../css/RoomsSections.css';

const TABS = [
  {
    key: 'rooms',
    label: 'Rooms',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    key: 'sections',
    label: 'Sections',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const RoomsSectionsPage = () => {
  const { user }        = useRecoilValue(authAtom);
  const [activeTab, setActiveTab] = useState('rooms');

  return (
    <div className="sf-dashboard">
      <TopNavBar role="Admin" userName={user?.name} />

      <div className="sf-dashboard-main">

        {/* Page header */}
        <div className="sf-welcome-row">
          <div>
            <h1 className="sf-welcome-h">Rooms & Sections</h1>
            <div className="sf-welcome-sub">
              <span className="sf-online-dot" />
              Manage your department's physical spaces and student batches
            </div>
          </div>
          <div className="sf-date-badge">
            {user?.adminDept || 'Department'}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="rs-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`rs-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'rooms' && <RoomsManager />}
        {activeTab === 'sections' && <SectionsManager />}

      </div>
    </div>
  );
};

export default RoomsSectionsPage;
