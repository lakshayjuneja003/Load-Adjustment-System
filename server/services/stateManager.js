export function initializeState() {
  return {
    teacherSchedule: {},
    roomSchedule: {},
    sectionSchedule: {},
    teacherLoad: {},
    sectionDayLoad: {},
    subjectDayMap: {},
    history: [] ,
  };
}

export function resetState(state) {
  state.teacherSchedule = {};
  state.roomSchedule = {};
  state.sectionSchedule = {};
  state.teacherLoad = {};
  state.sectionDayLoad = {};
  state.subjectDayMap = {};
  state.history = [];
}