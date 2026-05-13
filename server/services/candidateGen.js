import { isSafe } from "./helperfns.js";
import {calculateScore} from "./calculateScore.js";


export function getCandidates({
  task,
  state,
  teachers,
  rooms,
  slots,
  teacherLoadMap,
  timeConfig,
  teacherSubjectMap,
  idealLoad
}) {
  const candidates = [];
  
  for (let teacherId of teachers) {
    for (let roomId of rooms) {
      for (let slot of slots) {
        const priority = teacherSubjectMap?.[teacherId]?.[task.subjectId] || 0;
        
        if (task.type !== "Lab") {
          if (priority < state.priorityThreshold) continue;
        }
          let tier = 0;

          if (priority >= 4) tier = 3;
          else if (priority === 3) tier = 2;
          else if (priority > 0) tier = 1;
          else tier = 0;
        if (!isSafe({ 
          task,
          teacherId,
          roomId,
          slot,
          state,
          teacherMaxLoad: teacherLoadMap[teacherId],
          timeConfig,
          idealLoad
        })) continue;

        const score = calculateScore({
          state,
          task,
          teacherId,
          roomId,
          slot,
          timeConfig,
          teacherSubjectMap
        });

        candidates.push({ teacherId, roomId, slot, score, tier });
      }
    }
  }
  

  if (task.type === "Lab") {
          const eligibleTeachers = teachers.filter(
            t => (teacherSubjectMap[t]?.[task.subjectId] || 0) > 0
          );

          if (eligibleTeachers.length === 0) {
            return [];
          }
  }

  if (candidates.length === 0) {
  // DEBUG ONLY ONCE
  if (!state.debugFailed) {
    console.log("❌ First failure at:", task);
    state.debugFailed = true;
  }
  return [];
}

  // 🔥 IMPORTANT: best-first ordering
  candidates.sort((a, b) => b.score - a.score);

  return candidates;
}