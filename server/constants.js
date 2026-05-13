export const DB_NAME = "loadapp";

let globalTaskId = 0;

export function generateTasks(subjects, sections) {
  const tasks = [];

  sections.forEach(section => {
    subjects.forEach(subject => {

      if (
        subject.semester === section.semester &&
        subject.department === section.department
      ) {

        const totalTheory =
          subject.numberOfClasses + subject.numberOfTutorials;

        for (let i = 0; i < totalTheory; i++) {
          tasks.push({
            id: `TASK_${globalTaskId++}`, // ✅ NEVER resets
            subjectId: subject._id,
            sectionId: section._id,
            duration: 1,
            type: "Theory"
          });
        }

        if (subject.subjectType === "Lab" && subject.labHours > 0) {
          tasks.push({
            id: `TASK_${globalTaskId++}`, // ✅ UNIQUE
            subjectId: subject._id,
            sectionId: section._id,
            duration: 2,
            type: "Lab"
          });
        }
      }
    });
  });

  return tasks;
}