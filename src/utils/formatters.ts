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

const ISO_DATE_PREFIX_REGEX = /^(\d{4})-(\d{2})-(\d{2})/;

const toLocalDateForFormat = (value: Date | string): Date | null => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const isoMatch = value.trim().match(ISO_DATE_PREFIX_REGEX);
  if (isoMatch) {
    const d = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDateDayMonthYear = (
  value: Date | string | null | undefined,
  fallback = "-",
): string => {
  if (!value) return fallback;

  const date = toLocalDateForFormat(value);
  if (!date) return fallback;

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

// ─── Iniciais do nome ─────────────────────────────────────────────────────────

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

// ─── Saudação e data formatada ────────────────────────────────────────────────

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export const getFormattedDate = (): string =>
  new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ─── Máscara de CPF ───────────────────────────────────────────────────────────

export const maskCPF = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

// ─── Formatação de input de moeda ─────────────────────────────────────────────

export const formatCurrencyInput = (rawValue: string): string => {
  const digits = rawValue.replace(/\D/g, "");
  if (!digits) return "";
  const amount = Number(digits) / 100;
  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseNumberFromInput = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value
      .trim()
      .replace(/\s+/g, "")
      .replace(/\.(?=\d{3}\b)/g, "")
      .replace(",", ".");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};
