const steps = [
  {
    num: '01',
    title: 'Super admin sets up',
    desc: 'Creates the institution, defines departments, and invites department admins with custom permissions.',
  },
  {
    num: '02',
    title: 'Admins add data',
    desc: 'Each admin adds rooms, subjects, sections, and invites their staff members to the platform.',
  },
  {
    num: '03',
    title: 'Staff fill preferences',
    desc: 'Staff log in, view their department subjects, and submit ranked preferences within their credit limit.',
  },
  {
    num: '04',
    title: 'Timetable generated',
    desc: 'Admin triggers generation. ScheduleFlow produces a conflict-free timetable based on all collected data.',
  },
];

export default function HowItWorks() {
  return (
    <div className="sf-flow-section" id="how-it-works">
      <div className="sf-flow-inner">
        <div style={{ textAlign: 'center', marginBottom: '12px' }} className="sf-section-label">
          How it works
        </div>
        <div className="sf-section-title" style={{ textAlign: 'center' }}>
          From setup to schedule in 4 steps
        </div>

        <div className="sf-flow-steps">
          {steps.map((s) => (
            <div className="sf-flow-step" key={s.num}>
              <div className="sf-step-num">{s.num}</div>
              <div className="sf-step-title">{s.title}</div>
              <div className="sf-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
