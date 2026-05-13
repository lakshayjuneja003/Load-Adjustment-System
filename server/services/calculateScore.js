export function calculateScore({
  state,
  task,
  teacherId,
  roomId,
  slot,
  timeConfig,
  teacherSubjectMap = {}
}) {
  let score = 0;

  // small randomness
  score += Math.random() * 2;

  const sectionId = task.sectionId;

  // ================= LOAD BALANCING =================
  const dayLoad = state.sectionDayLoad?.[sectionId]?.[slot.day] || 0;
  score -= dayLoad * 3;

  const totalLoad = Object.values(
    state.sectionDayLoad?.[sectionId] || {}
  ).reduce((a, b) => a + b, 0);

  score -= totalLoad * 2;

  // ================= SUBJECT SPREAD =================
  if (state.subjectDayMap?.[sectionId]?.[slot.day]?.[task.subjectId]) {
    score -= 3;
  }

  // ================= LAB LOGIC =================
  if (task.duration === 2) {
    score += 5; // encourage labs early
  }


  // ================= TEACHER LOAD =================
  const teacherLoad = state.teacherLoad?.[teacherId] || 0;
  score -= teacherLoad * 2;


  const ideal = state.idealLoad || 5;

  if (teacherLoad > ideal) {
    score -= 10;
  }
  // ================= PRIORITY =================
  const priority =
    teacherSubjectMap?.[teacherId]?.[task.subjectId] ?? 0;

  if (priority >= 4 && (state.teacherLoad?.[teacherId] || 0) < 2) {
    score += 25;
  } 
  if (priority <= 2) {
    score -= 15;
  }
  if (priority === 0) {
  score -= state.allowLowPriority ? 10 : 100;
  }

  if (task.type === "Lab") {
    const teacherLoad = state.teacherLoad?.[teacherId] || 0;

    if (teacherLoad > 1) {
      score -= 15;
    }

    if (priority >= 3) {
      score += 10;
    }
  }
  // ================= SAME TEACHER SPAM =================
  if (state.teacherSchedule?.[teacherId]?.[slot.day]) {
    score -= 3;
  }
  const remainingLoadPressure = teacherLoad / (state.idealLoad || 5);

  score -= remainingLoadPressure * 10;
  // ================= ADJACENT SLOT PENALTY =================
  const prev = slot.slot - 1;
  const next = slot.slot + 1;

  if (state.sectionSchedule?.[sectionId]?.[slot.day]?.[prev]) score -= 2;
  if (state.sectionSchedule?.[sectionId]?.[slot.day]?.[next]) score -= 2;

  // ================= ROOM BALANCE =================
  const roomUsage =
    Object.values(state.roomSchedule?.[roomId] || {}).reduce(
      (acc, day) => acc + Object.keys(day).length,
      0
    );

  score -= roomUsage * 0.3;

  // ================= EDGE SLOT PENALTY =================
  if (slot.slot === 1 || slot.slot === timeConfig.slotsPerDay) {
    score -= 1;
  }

  return score;
}