const PHONE_MAX_LENGTH = 11;

export const normalizePhoneDigits = (value: string | null | undefined): string => {
  if (!value) return "";

  let digits = value.replace(/\D/g, "");

  if (digits.length > PHONE_MAX_LENGTH && digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  return digits.slice(0, PHONE_MAX_LENGTH);
};

export const formatPhoneNumber = (
  value: string | null | undefined,
  fallback = "-",
): string => {
  const digits = normalizePhoneDigits(value);
  if (!digits) return fallback;

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return digits.length === 2 ? `(${digits}` : digits;
};

export const maskPhoneInput = (value: string): string => {
  const digits = normalizePhoneDigits(value);
  if (!digits) return "";

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const formatDateDayMonthYear = (
  value: Date | string | null | undefined,
  fallback = "-",
): string => {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatCurrencyBRL = (value: number): string =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
