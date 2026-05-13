export function isTeacherFree(state, teacherId, day, slot) {
  return !state.teacherSchedule?.[teacherId]?.[day]?.[slot];
}

export function isRoomFree(state, roomId, day, slot) {
  return !state.roomSchedule?.[roomId]?.[day]?.[slot];
}

export function isSectionFree(state, sectionId, day, slot) {
  return !state.sectionSchedule?.[sectionId]?.[day]?.[slot];
}
// fn to check if a task can be assigned to a teacher in a given slot without clashes
export function isSafe({
  task,
  teacherId,
  roomId,
  slot,
  state,
  teacherMaxLoad,
  timeConfig
}) {
  if (!task || !slot || !timeConfig) return false;

  const { breakSlots = [], slotsPerDay } = timeConfig;

  // ❌ invalid slot
  if (slot.day === undefined || slot.slot === undefined) return false;

  // ❌ break slot
  if (breakSlots.includes(slot.slot)) return false;

  const currentLoad = state.teacherLoad?.[teacherId] || 0;
  const maxLoad = teacherMaxLoad ?? Infinity;

  // ✅ ONLY enforce if not relaxed
  if (!state.allowOverload && currentLoad >= maxLoad) {
    return false;
  }

  // ✅ basic clashes
  if (!isTeacherFree(state, teacherId, slot.day, slot.slot)) return false;
  if (!isRoomFree(state, roomId, slot.day, slot.slot)) return false;
  if (!isSectionFree(state, task.sectionId, slot.day, slot.slot)) return false;

  // 🚨 prevent killing future labs
  if (task.type === "Theory" && !state.allowOverload) {
  const labsLeft = state.remainingLabs?.[task.sectionId] || 0;

  if (labsLeft > 0) {
    const nextSlot = slot.slot + 1;

    if (
      nextSlot <= timeConfig.slotsPerDay &&
      !state.sectionSchedule?.[task.sectionId]?.[slot.day]?.[nextSlot]
    ) {
      // only block if MANY labs still pending
      if (labsLeft > 2) return false;
    }
  }
}

  // ================= LAB =================
  if (task.duration === 2) {
    const nextSlot = slot.slot + 1;

    if (nextSlot > slotsPerDay) return false;
    if (breakSlots.includes(nextSlot)) return false;

    if (!isTeacherFree(state, teacherId, slot.day, nextSlot)) return false;
    if (!isRoomFree(state, roomId, slot.day, nextSlot)) return false;
    if (!isSectionFree(state, task.sectionId, slot.day, nextSlot)) return false;
  }

  // ================= SOFT RULES =================
  // only enforce when NOT relaxed
  if (!state.allowOverload) {
    const sameSubject =
      state.subjectDayMap?.[task.sectionId]?.[slot.day]?.[task.subjectId];

    if (sameSubject) return false;
  }

  return true;
}