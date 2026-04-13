const features = [
  {
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Multi-role access control',
    desc: 'Super admin, department admins, and staff each have scoped permissions. Admins cannot see outside their department.',
  },
  {
    color: 'cyan',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Conflict-free generation',
    desc: 'Timetables are generated automatically based on collected preferences, subject loads, and room availability.',
  },
  {
    color: 'green',
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: 'Staff preference collection',
    desc: 'Staff fill subject preferences per active semester. Credit point limits are enforced based on their designation automatically.',
  },
  {
    color: 'amber',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    title: 'Invite-based onboarding',
    desc: 'Super admins invite department admins. Admins invite staff. Each user is verified before gaining access to sensitive data.',
  },
  {
    color: 'purple',
    icon: (
      <svg viewBox="0 0 24 24">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    title: 'Granular permissions',
    desc: 'Super admins define exactly what each admin can do — add subjects, record preferences, manage timetables, and more.',
  },
  {
    color: 'pink',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Cross-department access',
    desc: 'Staff can be granted access to subjects from other departments with super admin approval, enabling flexible assignments.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="sf-section" id="features">
      <div className="sf-section-label">Features</div>
      <div className="sf-section-title">Everything you need, nothing you don't</div>
      <p className="sf-section-sub">
        Built specifically for academic institutions with complex scheduling needs
        and multi-role workflows.
      </p>

      <div className="sf-features-grid">
        {features.map((f) => (
          <div className="sf-feat-card" key={f.title}>
            <div className={`sf-feat-icon ${f.color}`}>{f.icon}</div>
            <div className="sf-feat-title">{f.title}</div>
            <div className="sf-feat-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
