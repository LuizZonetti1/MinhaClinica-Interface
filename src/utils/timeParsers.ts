import { formatDateToIsoDate, isIsoDate } from "./dateParsers";

export const DEFAULT_TIMEZONE = "America/Sao_Paulo";

type ParseTimeToMinutesOptions = {
  allowSingleDigitHour?: boolean;
  allowSeconds?: boolean;
  looseMatch?: boolean;
};

type GetNowInTimeZoneResult = {
  dateIso: string;
  minutesOfDay: number;
};

type HasNoShowWindowElapsedForDateOptions = {
  graceMinutes?: number;
  timeZone?: string;
  parseTimeOptions?: ParseTimeToMinutesOptions;
};

type HasTimeElapsedTodayOptions = {
  graceMinutes?: number;
  now?: Date;
  parseTimeOptions?: ParseTimeToMinutesOptions;
  invalidTimeReturns?: boolean;
};

type IsPastTimeSlotForDateOptions = {
  now?: Date;
  parseTimeOptions?: ParseTimeToMinutesOptions;
};

export const parseTimeToMinutes = (
  timeValue: string,
  options: ParseTimeToMinutesOptions = {},
): number | null => {
  const allowSingleDigitHour = options.allowSingleDigitHour ?? false;
  const allowSeconds = options.allowSeconds ?? false;
  const looseMatch = options.looseMatch ?? false;
  const hourToken = allowSingleDigitHour ? "\\d{1,2}" : "\\d{2}";
  const secondsToken = allowSeconds ? "(?::\\d{2})?" : "";

  const regex = looseMatch
    ? allowSeconds
      ? /(\d{1,2}):(\d{2})(?::\d{2})?/
      : /(\d{1,2}):(\d{2})/
    : new RegExp(`^(${hourToken}):(\\d{2})${secondsToken}$`);

  const match = timeValue.match(regex);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
};

export const getNowInTimeZone = (timeZone = DEFAULT_TIMEZONE): GetNowInTimeZoneResult => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const year = map.year ?? "0000";
  const month = map.month ?? "01";
  const day = map.day ?? "01";
  const hour = Number(map.hour ?? "0");
  const minute = Number(map.minute ?? "0");

  return {
    dateIso: `${year}-${month}-${day}`,
    minutesOfDay: hour * 60 + minute,
  };
};

export const hasNoShowWindowElapsedForDate = (
  appointmentDate: string,
  startTime: string,
  options: HasNoShowWindowElapsedForDateOptions = {},
): boolean => {
  if (!isIsoDate(appointmentDate)) return false;

  const appointmentMinutes = parseTimeToMinutes(startTime, options.parseTimeOptions);
  if (appointmentMinutes === null) return false;

  const graceMinutes = options.graceMinutes ?? 30;
  const nowInTimeZone = getNowInTimeZone(options.timeZone ?? DEFAULT_TIMEZONE);

  if (appointmentDate < nowInTimeZone.dateIso) return true;
  if (appointmentDate > nowInTimeZone.dateIso) return false;

  return nowInTimeZone.minutesOfDay >= appointmentMinutes + graceMinutes;
};

export const hasTimeElapsedToday = (
  timeValue: string,
  options: HasTimeElapsedTodayOptions = {},
): boolean => {
  const timeMinutes = parseTimeToMinutes(timeValue, options.parseTimeOptions);
  if (timeMinutes === null) {
    return options.invalidTimeReturns ?? false;
  }

  const graceMinutes = options.graceMinutes ?? 0;
  const now = options.now ?? new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return nowMinutes >= timeMinutes + graceMinutes;
};

export const isPastTimeSlotForDate = (
  date: string,
  time: string,
  options: IsPastTimeSlotForDateOptions = {},
): boolean => {
  const now = options.now ?? new Date();
  if (!date || date !== formatDateToIsoDate(now)) return false;

  const slotMinutes = parseTimeToMinutes(time, options.parseTimeOptions);
  if (slotMinutes === null) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= nowMinutes;
};
