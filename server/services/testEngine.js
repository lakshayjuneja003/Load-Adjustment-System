import { generateTasks } from "../constants.js";
import { generateTimetable } from "./generateTImeTable.js";
import { generateAllSlots } from "./slotGenerator.js";
import { initializeState } from "./stateManager.js";

/* =========================
   ✅ SUBJECTS (REALISTIC 24)
========================= */
const subjects = [];

for (let i = 1; i <= 12; i++) {
  subjects.push({
    _id: `SUB_T_${i}`,
    semester: 1,
    department: "CSE",
    subjectName: `Theory_${i}`,
    subjectType: "Theory",
    numberOfClasses: 3,
    numberOfTutorials: 1,
    labHours: 0
  });

  subjects.push({
    _id: `SUB_L_${i}`,
    semester: 1,
    department: "CSE",
    subjectName: `Lab_${i}`,
    subjectType: "Lab",
    numberOfClasses: 0,
    numberOfTutorials: 0,
    labHours: 2
  });
}

/* =========================
   ✅ SECTIONS (3)
========================= */
const sections = [
  { _id: "SEC1", semester: 1, department: "CSE", sectionName: "A" },
  { _id: "SEC2", semester: 1, department: "CSE", sectionName: "B" },
  { _id: "SEC3", semester: 1, department: "CSE", sectionName: "C" }
];

/* =========================
   ✅ TEACHERS (18 realistic)
========================= */
const teachers = Array.from({ length: 18 }, (_, i) => `T${i + 1}`);

/* =========================
   ✅ ROOMS (balanced)
========================= */
const rooms = ["R1","R2","R3","R4","R5","R6","R7"];

/* =========================
   ✅ TEACHER LOAD (balanced)
========================= */
const teacherLoadMap = {};
teachers.forEach((t, i) => {
  teacherLoadMap[t] = 14 + (i % 5); // 14–18 range
});

/* =========================
   ✅ PRIORITY MAP (REALISTIC)
========================= */
const teacherSubjectMap = {};

teachers.forEach((teacher, index) => {
  teacherSubjectMap[teacher] = {};

  for (let i = 1; i <= 12; i++) {
    const theory = `SUB_T_${i}`;
    const lab = `SUB_L_${i}`;

    // specialization pattern (IMPORTANT)
    if (index % 3 === 0) {
      teacherSubjectMap[teacher][theory] = 5;
    } else if (index % 3 === 1) {
      teacherSubjectMap[teacher][theory] = 3;
    } else {
      teacherSubjectMap[teacher][theory] = 2;
    }

    // labs → only some teachers
    if (index % 4 === 0) {
      teacherSubjectMap[teacher][lab] = 5;
    } else if (index % 4 === 1) {
      teacherSubjectMap[teacher][lab] = 3;
    } else {
      teacherSubjectMap[teacher][lab] = 0; // cannot teach lab
    }
  }
});

/* =========================
   ✅ TIME CONFIG
========================= */
const timeConfig = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  slotsPerDay: 7,
  breakSlots: [4]
};

/* =========================
   🚀 PIPELINE
========================= */
const tasks = generateTasks(subjects, sections);

console.log("Total Subjects:", subjects.length);
console.log("Total Tasks:", tasks.length);
console.log("Teachers:", teachers.length);
console.log("Rooms:", rooms.length);

const totalTasks = tasks.length;
const teacherCount = teachers.length;

const idealLoad = Math.ceil(totalTasks / teacherCount);

const totalCapacity = Object.values(teacherLoadMap)
  .reduce((a, b) => a + b, 0);

/* =========================
   ❌ IMPOSSIBLE CHECK
========================= */
if (totalTasks > totalCapacity) {
  console.log("❌ Impossible to generate timetable");
  console.log(`Tasks: ${totalTasks}, Capacity: ${totalCapacity}`);
} else {

  const slots = generateAllSlots(timeConfig);
  const state = initializeState();

  console.time("⏱ Timetable Generation");

  const timetable = generateTimetable({
    tasks,
    teachers,
    rooms,
    slots,
    state,
    teacherLoadMap,
    timeConfig,
    teacherSubjectMap,
    idealLoad
  });

  console.timeEnd("⏱ Timetable Generation");

  console.log("✅ Final Timetable Length:", timetable.length);

  /* =========================
     📊 ANALYSIS
  ========================= */

  const teacherUsage = {};

  for (let entry of timetable) {
    const t = entry.teacherId;
    teacherUsage[t] = (teacherUsage[t] || 0) + 1;
  }

  console.log("📊 Teacher Load Distribution:");
  console.log(teacherUsage);
}