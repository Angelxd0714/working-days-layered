import {
  addHours,
  addDays,
  isWeekend,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  format,
  getHours,
  getMinutes,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { getHolidays } from "../utils/holidays";

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

function normalizeToBusinessHours(date: Date, holidays: string[]): Date {
  let currentDate = new Date(date);

  while (!isBusinessDay(currentDate, holidays)) {
    currentDate = addDays(currentDate, -1);
  }

  const currentHour = getHours(currentDate);
  const currentMinute = getMinutes(currentDate);

  if (currentHour < BUSINESS_HOURS.start) {
    currentDate = setHours(currentDate, BUSINESS_HOURS.start);
    currentDate = setMinutes(currentDate, 0);
    currentDate = setSeconds(currentDate, 0);
    currentDate = setMilliseconds(currentDate, 0);
  }
  else if (currentHour >= BUSINESS_HOURS.end) {
    currentDate = setHours(currentDate, BUSINESS_HOURS.end);
    currentDate = setMinutes(currentDate, 0);
    currentDate = setSeconds(currentDate, 0);
    currentDate = setMilliseconds(currentDate, 0);
  }
  else if (currentHour >= BUSINESS_HOURS.lunchStart && currentHour < BUSINESS_HOURS.lunchEnd) {
    currentDate = setHours(currentDate, BUSINESS_HOURS.lunchEnd);
    currentDate = setMinutes(currentDate, 0);
    currentDate = setSeconds(currentDate, 0);
    currentDate = setMilliseconds(currentDate, 0);
  }
  else {
    currentDate = setSeconds(currentDate, 0);
    currentDate = setMilliseconds(currentDate, 0);
  }

  return currentDate;
}

function addBusinessDays(startDate: Date, daysToAdd: number, holidays: string[]): Date {
  let currentDate = new Date(startDate);
  let remainingDays = daysToAdd;

  while (remainingDays > 0) {
    currentDate = addDays(currentDate, 1);
    if (isBusinessDay(currentDate, holidays)) {
      remainingDays--;
    }
  }

  return currentDate;
}

function addBusinessHours(startDate: Date, hoursToAdd: number, holidays: string[]): Date {
  let currentDate = new Date(startDate);
  let remainingHours = hoursToAdd;

  while (remainingHours > 0) {
    const currentHour = getHours(currentDate);

    if (currentHour < BUSINESS_HOURS.start || currentHour >= BUSINESS_HOURS.end) {
      do {
        currentDate = addDays(currentDate, 1);
      } while (!isBusinessDay(currentDate, holidays));

      currentDate = setHours(currentDate, BUSINESS_HOURS.start);
      currentDate = setMinutes(currentDate, 0);
      currentDate = setSeconds(currentDate, 0);
      currentDate = setMilliseconds(currentDate, 0);
      continue;
    }

    if (currentHour >= BUSINESS_HOURS.lunchStart && currentHour < BUSINESS_HOURS.lunchEnd) {
      currentDate = setHours(currentDate, BUSINESS_HOURS.lunchEnd);
      currentDate = setMinutes(currentDate, 0);
      currentDate = setSeconds(currentDate, 0);
      currentDate = setMilliseconds(currentDate, 0);
      continue;
    }

    currentDate = addHours(currentDate, 1);
    remainingHours--;

    const newHour = getHours(currentDate);
    if (newHour === BUSINESS_HOURS.lunchStart) {
      currentDate = setHours(currentDate, BUSINESS_HOURS.lunchEnd);
      currentDate = setMinutes(currentDate, 0);
      currentDate = setSeconds(currentDate, 0);
      currentDate = setMilliseconds(currentDate, 0);
    }
  }

  const finalHour = getHours(currentDate);
  if (finalHour >= BUSINESS_HOURS.end) {
    do {
      currentDate = addDays(currentDate, 1);
    } while (!isBusinessDay(currentDate, holidays));

    currentDate = setHours(currentDate, BUSINESS_HOURS.start);
    currentDate = setMinutes(currentDate, 0);
    currentDate = setSeconds(currentDate, 0);
    currentDate = setMilliseconds(currentDate, 0);
  }

  return currentDate;
}

async function calculateBusinessHours(
  dayToAdd: number = 0,
  hourToAdd: number = 0,
  startDate?: Date
): Promise<Date> {
  try {
    if (dayToAdd < 0 || hourToAdd < 0) {
      throw new Error("Days and hours to add must be non-negative numbers.");
    }

    const holidays = await getHolidays();

    let currentDate = startDate
      ? toZonedTime(startDate, TIME_ZONE)
      : toZonedTime(new Date(), TIME_ZONE);

    currentDate = normalizeToBusinessHours(currentDate, holidays);

    if (dayToAdd > 0) {
      currentDate = addBusinessDays(currentDate, dayToAdd, holidays);
    }

    if (hourToAdd > 0) {
      currentDate = addBusinessHours(currentDate, hourToAdd, holidays);
    }

    return fromZonedTime(currentDate, TIME_ZONE);
  } catch (error) {
    console.error("Error in calculateBusinessHours:", error);
    throw error;
  }
}

export { calculateBusinessHours };
