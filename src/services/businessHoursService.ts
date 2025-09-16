import {
  addHours,
  addDays,
  isWeekend,
  setHours,
  setMinutes,
  format,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { getHolidays } from "../utils/holidays.js";

const TIME_ZONE = "America/Bogota";
const BUSINESS_HOURS = {
  start: 8,
  lunchStart: 12,
  lunchEnd: 13,
  end: 17,
};

function isBusinessDay(date: Date, holidays: string[]): boolean {
  const isWeekendDay = isWeekend(date);
  const isHoliday = holidays.includes(format(date, "yyyy-MM-dd"));
  return !isWeekendDay && !isHoliday;
}
async function normalizateDate(date: Date, holidays: string[]): Promise<Date> {
  let currentDate = date;
  const currentHour = currentDate.getHours();
  while (!isBusinessDay(currentDate, holidays)) {
    currentDate = addDays(currentDate, -1);
  }
  if (currentHour < BUSINESS_HOURS.start) {
    currentDate = setHours(currentDate, BUSINESS_HOURS.start);
    currentDate = setMinutes(currentDate, 0);
  }
  if (currentHour > BUSINESS_HOURS.end) {
    currentDate = setHours(currentDate, BUSINESS_HOURS.end);
    currentDate = setMinutes(currentDate, 0);
  }
  if (
    currentHour > BUSINESS_HOURS.lunchStart &&
    currentHour < BUSINESS_HOURS.lunchEnd
  ) {
    currentDate = setHours(currentDate, BUSINESS_HOURS.lunchEnd);
    currentDate = setMinutes(currentDate, 0);
  }

  return currentDate;
}
async function calculateBusinessHours(
  dayToAdd?: number,
  hourToAdd?: number,
  startDate?: Date
): Promise<Date> {
  try {
    let dayToAddValue = dayToAdd || 0;
    let hourToAddValue = hourToAdd || 0;
    if (dayToAddValue < 0 || hourToAddValue < 0) {
      throw new Error("Days and hours to add must be non-negative numbers.");
    }
    const holidays = await getHolidays();
    let currentDate = startDate
      ? toZonedTime(startDate, TIME_ZONE)
      : toZonedTime(new Date(), TIME_ZONE);

    currentDate = await normalizateDate(currentDate, holidays);

    let remainingDays = dayToAddValue;
    while (remainingDays > 0) {
      currentDate = addDays(currentDate, 1);
      if (isBusinessDay(currentDate, holidays)) {
        remainingDays--;
      }
    }

    let remainingHours = hourToAddValue;
    while (remainingHours > 0) {
      const currentHour = currentDate.getHours();

      if (
        currentHour < BUSINESS_HOURS.start ||
        currentHour >= BUSINESS_HOURS.end
      ) {
        do {
          currentDate = addDays(currentDate, 1);
        } while (!isBusinessDay(currentDate, holidays));
        currentDate = setHours(currentDate, BUSINESS_HOURS.start);
        currentDate = setMinutes(currentDate, 0);
      }

      if (
        currentHour >= BUSINESS_HOURS.lunchStart &&
        currentHour < BUSINESS_HOURS.lunchEnd
      ) {
        currentDate = setHours(currentDate, BUSINESS_HOURS.lunchEnd);
        currentDate = setMinutes(currentDate, 0);
      }

      currentDate = addHours(currentDate, 1);
      remainingHours--;
    }

    const finalHour = currentDate.getHours();
    if (finalHour < BUSINESS_HOURS.start) {
      currentDate = setHours(currentDate, BUSINESS_HOURS.start);
    } else if (finalHour >= BUSINESS_HOURS.end) {
      do {
        currentDate = addDays(currentDate, 1);
      } while (!isBusinessDay(currentDate, holidays));
      currentDate = setHours(currentDate, BUSINESS_HOURS.start);
    }

    return toZonedTime(currentDate, TIME_ZONE);
  } catch (error) {
    console.error("Error in calculateBusinessHours:", error);
    throw error;
  }
}

export { calculateBusinessHours };
