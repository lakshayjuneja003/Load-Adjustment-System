export function undoLastAssignment(state) {
  const last = state.history.pop();
  if (!last) return;

  const { task, teacherId, roomId, day, slot } = last;

  delete state.teacherSchedule?.[teacherId]?.[day]?.[slot];
  delete state.roomSchedule?.[roomId]?.[day]?.[slot];
  delete state.sectionSchedule?.[task.sectionId]?.[day]?.[slot];

  // fix loads
  state.teacherLoad[teacherId]--;
  state.sectionDayLoad[task.sectionId][day]--;
  if (task.type === "Lab") {
    state.remainingLabs[task.sectionId]++;
  }
  // NOTE: subjectDayMap cleanup (simple version)
  delete state.subjectDayMap?.[task.sectionId]?.[day]?.[task.subjectId];
}