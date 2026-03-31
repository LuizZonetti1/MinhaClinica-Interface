export type AnyRecord = Record<string, unknown>;

export type ToStringOptions = {
  trim?: boolean;
};

export type ToNullableStringOptions = {
  trim?: boolean;
};

export type ReadValueOptions = {
  ignoreEmptyString?: boolean;
};

export const toRecord = (value: unknown): AnyRecord | null =>
  typeof value === "object" && value !== null ? (value as AnyRecord) : null;

export const toStringValue = (
  value: unknown,
  fallback = "",
  options: ToStringOptions = {},
): string => {
  if (typeof value === "string") {
    return options.trim ? value.trim() : value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

export const toTrimmedStringValue = (value: unknown, fallback = ""): string =>
  toStringValue(value, fallback, { trim: true });

export const toNullableString = (
  value: unknown,
  options: ToNullableStringOptions = {},
): string | null => {
  const parsed = toStringValue(value, "", options);
  return parsed.length > 0 ? parsed : null;
};

export const toNumberValue = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

export const toBooleanValue = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "sim"].includes(normalized)) {
      return true;
    }
    if (["0", "false", "no", "nao"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
};

export const readValue = (
  sources: Array<AnyRecord | null | undefined>,
  keys: string[],
  options: ReadValueOptions = {},
): unknown => {
  const ignoreEmptyString = options.ignoreEmptyString ?? false;

  for (const source of sources) {
    if (!source) continue;

    for (const key of keys) {
      const value = source[key];
      if (value === undefined || value === null) continue;
      if (ignoreEmptyString && value === "") continue;
      return value;
    }
  }

  return undefined;
};

export const readNonEmptyValue = (
  sources: Array<AnyRecord | null | undefined>,
  keys: string[],
): unknown => readValue(sources, keys, { ignoreEmptyString: true });
