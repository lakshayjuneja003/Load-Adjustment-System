import { assignToState } from "./assignmentState.js";
import { getCandidates } from "./candidateGen.js";
import { isTeacherFree , isRoomFree , isSectionFree} from "./helperfns.js";
import { resetState } from "./stateManager.js";
import { undoLastAssignment } from "./undoState.js";
export function generateTimetable({
  tasks,
  teachers,
  rooms,
  slots,
  state,
  teacherLoadMap,
  timeConfig,
  teacherSubjectMap,
  idealLoad
}) {

  // 🔥 sort tasks smartly
  tasks = [...tasks].sort((a, b) => {
  // LAB FIRST (CRITICAL)
  if (a.type === "Lab" && b.type !== "Lab") return -1;
  if (b.type === "Lab" && a.type !== "Lab") return 1;

  // longer duration first
  if (b.duration !== a.duration) return b.duration - a.duration;

  // stable
  return a.sectionId.localeCompare(b.sectionId);
});

  const timetable = [];
  let steps = 0;
  const MAX_STEPS = 200000;
  state.remainingLabs = {};

  for (let t of tasks) {
    if (t.type === "Lab") {
      state.remainingLabs[t.sectionId] =
        (state.remainingLabs[t.sectionId] || 0) + 1;
    }
  }

  function solve(index) {
    steps++;

    if (steps > MAX_STEPS) {
      return false;
    }
    // ✅ BASE CASE
    if (index === tasks.length) {
      return true;
    }

    const task = tasks[index];

    const candidates = getCandidates({
      task,
      state,
      teachers,
      rooms,
      slots,
      teacherLoadMap,
      timeConfig,
      teacherSubjectMap,
      idealLoad
    }) 
    candidates.sort((a, b) => {
    if (b.tier !== a.tier) return b.tier - a.tier;
    return b.score - a.score;
    });
    if (candidates.length === 0) {
      if (!state.loggedFailure) {
        console.log("❌ First failure at:", task);
        state.loggedFailure = true;
      }
      return false;
    }
      // 🔥 early failure detection
      if (task.type === "Lab") {
    let possible = false;

    for (let teacher of teachers) {
      if ((teacherSubjectMap[teacher]?.[task.subjectId] || 0) === 0) continue;

      for (let room of rooms) {
        for (let slot of slots) {
          const next = slot.slot + 1;

          if (
            next <= timeConfig.slotsPerDay &&
            isTeacherFree(state, teacher, slot.day, slot.slot) &&
            isTeacherFree(state, teacher, slot.day, next) &&
            isRoomFree(state, room, slot.day, slot.slot) &&
            isRoomFree(state, room, slot.day, next) &&
            isSectionFree(state, task.sectionId, slot.day, slot.slot) &&
            isSectionFree(state, task.sectionId, slot.day, next)
          ) {
            possible = true;
            break;
          }
        }
        if (possible) break;
      }
      if (possible) break;
    }

    if (!possible) return false;
      }
    // try each candidate
    for (let option of candidates) {

      const { teacherId, roomId, slot } = option;

      // assign
      assignToState(state, task, teacherId, roomId, slot.day, slot.slot);

      if (task.duration === 2) {
        assignToState(state, task, teacherId, roomId, slot.day, slot.slot + 1);
      }

      timetable.push({
        task,
        teacherId,
        roomId,
        day: slot.day,
        slot: slot.slot
      });

      // 🔁 recurse
      if (solve(index + 1)) {
        return true;
      }

      // ❌ BACKTRACK
      timetable.pop();

      if (task.duration === 2) undoLastAssignment(state);
      undoLastAssignment(state);
    }

    return false;
  }

  state.allowLowPriority = false;

  let success = solve(0);

  if (!success) {
  console.log("⚠️ Retrying with low-priority teachers...");

  state.allowLowPriority = true;

  // reset everything
  resetState(state);
  state.remainingLabs = {};

  for (let t of tasks) {
    if (t.type === "Lab") {
      state.remainingLabs[t.sectionId] =
        (state.remainingLabs[t.sectionId] || 0) + 1;
    }
  }

  timetable.length = 0;

  success = solve(0);
}

  if (!success) {
  console.log("⚠️ Relaxing priority...");

  state.priorityThreshold = 3;

  resetState(state);
  state.remainingLabs = {};

  for (let t of tasks) {
    if (t.type === "Lab") {
      state.remainingLabs[t.sectionId] =
        (state.remainingLabs[t.sectionId] || 0) + 1;
    }
  }

  success = solve(0);
}

if (!success) {
  console.log("⚠️ Relaxing further...");

  state.priorityThreshold = 0;

  resetState(state);

  success = solve(0);
}

  return timetable;
}