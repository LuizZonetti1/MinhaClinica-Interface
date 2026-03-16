import { api } from "../config/api";
import type {
  PatientListItem,
  PatientListResponse,
  PatientSummary,
} from "../types/patient";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

const readValue = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): unknown => {
  for (const source of sources) {
    if (!source) continue;

    for (const key of keys) {
      if (!(key in source)) continue;
      const value = source[key];
      if (value !== undefined && value !== null) return value;
    }
  }

  return undefined;
};

const readString = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
  fallback = "",
): string => {
  const value = readValue(sources, keys);
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const readNumber = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
  fallback = 0,
): number => {
  const value = readValue(sources, keys);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.trim().replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const readBoolean = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): boolean | null => {
  const value = readValue(sources, keys);
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "sim", "yes", "active", "ativo"].includes(normalized)) return true;
    if (["0", "false", "nao", "no", "inactive", "inativo"].includes(normalized)) return false;
  }
  return null;
};

const parseDateLike = (value: unknown): string | null => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const parsedFromNumber = new Date(value);
    if (!Number.isNaN(parsedFromNumber.getTime())) return parsedFromNumber.toISOString();
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
  }

  return null;
};

const readDate = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): string | null => {
  const value = readValue(sources, keys);
  return parseDateLike(value);
};

const extractLatestCollectionDate = (
  sources: Array<Record<string, unknown> | null | undefined>,
): string | null => {
  const collectionKeys = ["appointments", "consultations", "visits", "attendances", "history"];
  const dateKeys = [
    "date",
    "appointmentDate",
    "lastVisit",
    "lastVisitAt",
    "lastVisitDate",
    "referenceDate",
    "startAt",
    "startsAt",
    "scheduledFor",
    "createdAt",
  ];

  let latestMs = -1;
  let latestDate: string | null = null;

  for (const source of sources) {
    if (!source) continue;

    for (const collectionKey of collectionKeys) {
      const collection = source[collectionKey];
      if (!Array.isArray(collection)) continue;

      for (const rawItem of collection) {
        const item = asRecord(rawItem);
        if (!item) continue;

        for (const dateKey of dateKeys) {
          const parsedDate = parseDateLike(item[dateKey]);
          if (!parsedDate) continue;

          const dateMs = new Date(parsedDate).getTime();
          if (Number.isNaN(dateMs)) continue;

          if (dateMs > latestMs) {
            latestMs = dateMs;
            latestDate = parsedDate;
          }
        }
      }
    }
  }

  return latestDate;
};

const normalizeStatus = (status: string, isActive: boolean | null): PatientListItem["status"] => {
  const normalized = status.trim().toUpperCase();

  if (normalized === "BLOCKED" || normalized === "BLOQUEADO") return "BLOCKED";
  if (normalized === "INACTIVE" || normalized === "INATIVO") return "INACTIVE";
  if (normalized === "ACTIVE" || normalized === "ATIVO") return "ACTIVE";

  if (isActive === true) return "ACTIVE";
  if (isActive === false) return "INACTIVE";
  return "INACTIVE";
};

const mapPatient = (rawPatient: unknown, index: number): PatientListItem | null => {
  const patient = asRecord(rawPatient);
  if (!patient) return null;

  const nestedUser = asRecord(patient.user);
  const nestedPerson = asRecord(patient.person);
  const nestedProfile = asRecord(patient.profile);
  const nestedPatient = asRecord(patient.patient);
  const sources = [patient, nestedUser, nestedPerson, nestedProfile, nestedPatient];

  const isActiveValue = readBoolean(sources, ["isActive", "active", "enabled"]);
  const status = normalizeStatus(readString(sources, ["status", "patientStatus"], ""), isActiveValue);
  const isActive = isActiveValue ?? status === "ACTIVE";

  const latestVisitDate =
    readDate(sources, [
      "lastVisit",
      "lastVisitAt",
      "lastVisitDate",
      "lastAppointmentDate",
      "lastAppointmentAt",
      "lastConsultationDate",
      "lastConsultationAt",
      "latestVisitAt",
      "recentAppointmentDate",
    ]) ?? extractLatestCollectionDate(sources);

  const arrayFallbackCount =
    Math.max(
      Array.isArray(patient.appointments) ? patient.appointments.length : 0,
      Array.isArray(patient.consultations) ? patient.consultations.length : 0,
      Array.isArray(patient.visits) ? patient.visits.length : 0,
    );

  return {
    id: readString(sources, ["id", "_id", "patientId", "userId"], `patient-${index + 1}`),
    name: readString(sources, ["name", "fullName"], "-"),
    email: readString(sources, ["email"], "-"),
    phone: readString(sources, ["phone", "phoneNumber", "telephone", "mobile"], "") || null,
    avatarUrl: readString(sources, ["avatarUrl", "avatar", "photoUrl"], "") || null,
    status,
    isActive,
    lastVisit: latestVisitDate,
    totalAppointments: readNumber(
      sources,
      ["totalAppointments", "appointmentsCount", "totalVisits", "visitsCount", "consultationsCount"],
      arrayFallbackCount,
    ),
    createdAt:
      readDate(sources, ["createdAt", "created_at", "registeredAt", "registrationDate"]) ??
      new Date().toISOString(),
  };
};

export const listPatientsAdmin = async (): Promise<PatientListResponse> => {
  const { data } = await api.get<unknown>("/patients");
  const root = asRecord(data);

  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.data)
        ? root.data
        : Array.isArray(root?.patients)
          ? root.patients
          : [];

  const items = rawItems
    .map((item, index) => mapPatient(item, index))
    .filter((item): item is PatientListItem => item !== null);

  const count = readNumber([root], ["count", "total", "totalCount", "totalItems"], items.length);

  return {
    count,
    items,
  };
};

export const getPatientSummary = async (): Promise<PatientSummary> => {
  const { data } = await api.get<PatientSummary>("/patients/summary");
  return data;
};
