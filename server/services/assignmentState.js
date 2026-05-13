export function assignToState(state, task, teacherId, roomId, day, slot) {
  const { sectionId, subjectId } = task;

  // schedules
  state.teacherSchedule[teacherId] ??= {};
  state.teacherSchedule[teacherId][day] ??= {};
  state.teacherSchedule[teacherId][day][slot] = true;

  state.roomSchedule[roomId] ??= {};
  state.roomSchedule[roomId][day] ??= {};
  state.roomSchedule[roomId][day][slot] = true;

  state.sectionSchedule[sectionId] ??= {};
  state.sectionSchedule[sectionId][day] ??= {};
  state.sectionSchedule[sectionId][day][slot] = true;

  // loads
  state.teacherLoad[teacherId] = (state.teacherLoad[teacherId] || 0) + 1;

  state.sectionDayLoad[sectionId] ??= {};
  state.sectionDayLoad[sectionId][day] =
    (state.sectionDayLoad[sectionId][day] || 0) + 1;

  // subject spread
  state.subjectDayMap[sectionId] ??= {};
  state.subjectDayMap[sectionId][day] ??= {};
  state.subjectDayMap[sectionId][day][subjectId] = true;

  if (!state.teacherLabLoad) state.teacherLabLoad = {};

  if (task.type === "Lab") {
    state.teacherLabLoad[teacherId] =
      (state.teacherLabLoad[teacherId] || 0) + 1;
  }
  if (task.type === "Lab") {
    state.remainingLabs[task.sectionId]--;
  }

  // history (CRITICAL for undo)
  state.history.push({ task, teacherId, roomId, day, slot });
}