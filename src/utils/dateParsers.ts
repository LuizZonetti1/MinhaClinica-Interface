import { toStringValue } from "./parsers";

const ISO_DATE_PREFIX_REGEX = /^\d{4}-\d{2}-\d{2}/;
const ISO_DATE_EXACT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const BR_DATE_EXACT_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const formatDateToIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isIsoDate = (value: string): boolean => ISO_DATE_EXACT_REGEX.test(value);

const toPtBrDateString = (date: Date): string =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const toPtBrLongDateString = (date: Date): string =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const toLocalDateFromIso = (isoDate: string): Date | null => {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day, 0, 0, 0, 0);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseIsoDate = (value: unknown): string | null => {
  const raw = toStringValue(value, "", { trim: true });
  if (!raw) return null;

  const match = raw.match(ISO_DATE_PREFIX_REGEX);
  if (match) return match[0];

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  return formatDateToIsoDate(parsed);
};

export const toIsoDateOrNull = (value: unknown): string | null => parseIsoDate(value);

export const toIsoDateOrEmpty = (value: unknown): string => parseIsoDate(value) ?? "";

export const toIsoDateOrFallback = (value: unknown, fallback: string): string =>
  parseIsoDate(value) ?? fallback;

export const toInputDate = (value: string): string => {
  if (!value) return "";

  const trimmed = value.trim();
  if (isIsoDate(trimmed)) return trimmed;

  const brMatch = trimmed.match(BR_DATE_EXACT_REGEX);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "";

  return formatDateToIsoDate(parsed);
};

type FormatDateOptions = {
  strictIsoOnly?: boolean;
};

export const formatIsoDateToBr = (
  value: string | null | undefined,
  fallback = "--/--/----",
  options: FormatDateOptions = {},
): string => {
  if (!value) return fallback;

  const trimmed = value.trim();
  const match = trimmed.match(ISO_DATE_PREFIX_REGEX);
  if (match) {
    const localDate = toLocalDateFromIso(match[0]);
    if (!localDate) return fallback;
    return toPtBrDateString(localDate);
  }

  if (options.strictIsoOnly) return fallback;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return toPtBrDateString(parsed);
};

export const formatIsoDateToLongPtBr = (
  value: string | null | undefined,
  fallback = "--",
): string => {
  if (!value) return fallback;

  const trimmed = value.trim();
  const match = trimmed.match(ISO_DATE_PREFIX_REGEX);
  if (match) {
    const localDate = toLocalDateFromIso(match[0]);
    if (!localDate) return fallback;
    return toPtBrLongDateString(localDate);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return toPtBrLongDateString(parsed);
};
