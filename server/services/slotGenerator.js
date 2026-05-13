export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const SLOTS_PER_DAY = 7;
export const BREAK_SLOT = 4;

export function generateAllSlots(timeConfig) {
    // Expected timeConfig format:
    // {
    //   days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    //   slotsPerDay: 7,
    //   breakSlots: [4] // optional, default is [4]
    // }

    
  if (!timeConfig) {
    throw new Error("timeConfig is required");
  }

  const { days, slotsPerDay, breakSlots = [] } = timeConfig;

  // Basic validation
  if (!Array.isArray(days) || days.length === 0) {
    throw new Error("Invalid days in timeConfig");
  }

  if (!slotsPerDay || slotsPerDay <= 0) {
    throw new Error("Invalid slotsPerDay");
  }

  const slots = [];

  for (let day of days) {
    for (let slot = 1; slot <= slotsPerDay; slot++) {

      // skip break slots
      if (breakSlots.includes(slot)) continue;

      slots.push({ day, slot });
    }
  }

  return slots;
}