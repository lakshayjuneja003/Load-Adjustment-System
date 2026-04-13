const CheckIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const roles = [
  {
    type: 'super',
    badge: 'Super Admin',
    title: 'University Head',
    desc: 'One per institution. Has complete visibility and control over all departments, admins, and data.',
    checkColor: 'blue',
    perms: [
      'Invite & verify department admins',
      'Set granular admin permissions',
      'Approve cross-dept access requests',
      'View all timetables across departments',
    ],
  },
  {
    type: 'admin',
    badge: 'Admin',
    title: 'Department Admin',
    desc: 'Manages one department. Invites staff, adds subjects, activates semesters, and generates the timetable.',
    checkColor: 'green',
    perms: [
      'Add subjects, rooms & sections',
      'Invite & verify staff members',
      'Activate semesters for preference collection',
      'Trigger timetable generation',
    ],
  },
  {
    type: 'staff',
    badge: 'Staff',
    title: 'Teaching Staff',
    desc: 'Faculty members who log in to view their subjects and submit ranked preferences per semester.',
    checkColor: 'purple',
    perms: [
      'View subjects by their department admin',
      'Fill preferences within credit point limits',
      'Request cross-department access',
      'View their generated timetable',
    ],
  },
];

export default function RolesSection() {
  return (
    <div className="sf-roles-section" id="roles">
      <div className="sf-section-label">Roles</div>
      <div className="sf-section-title">Built for every level of your institution</div>

      <div className="sf-roles-grid">
        {roles.map((role) => (
          <div className={`sf-role-card ${role.type}`} key={role.type}>
            <div className={`sf-role-badge ${role.type}`}>{role.badge}</div>
            <div className="sf-role-title">{role.title}</div>
            <div className="sf-role-desc">{role.desc}</div>

            <div className="sf-role-perms">
              {role.perms.map((perm) => (
                <div className="sf-perm" key={perm}>
                  <div className={`sf-perm-check ${role.checkColor}`}>
                    <CheckIcon />
                  </div>
                  {perm}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
