import { isAxiosError } from "axios";
import { api } from "../config/api";
import type { PatientDashboardData, PatientDashboardStats, PatientNextAppointment } from "../types/dashboard";

type RecordValue = Record<string, unknown>;

const DASHBOARD_ENDPOINTS = ["/patients/me/dashboard", "/patient/me/dashboard"];
const getConfirmAppointmentEndpoints = (appointmentId: string) => [
  `/patients/me/appointments/${appointmentId}/confirm`,
  `/patient/me/appointments/${appointmentId}/confirm`,
];

const toRecord = (value: unknown): RecordValue | null =>
  typeof value === "object" && value !== null ? (value as RecordValue) : null;

const toStringValue = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const toNumberValue = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const readValue = (
  sources: Array<RecordValue | null | undefined>,
  keys: string[],
): unknown => {
  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
  }
  return undefined;
};

const toIsoDate = (value: unknown): string | null => {
  const raw = toStringValue(value, "");
  if (!raw) return null;

  const match = raw.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeStats = (
  payload: unknown,
  fallbackUpcomingCount = 0,
): PatientDashboardStats => {
  const root = toRecord(payload) ?? {};
  const nestedStats = toRecord(root.stats);
  const sources = [nestedStats, root];

  return {
    upcomingCount: toNumberValue(
      readValue(sources, ["upcomingCount", "upcomingAppointments", "nextAppointmentsCount"]),
      fallbackUpcomingCount,
    ),
    completedCount: toNumberValue(
      readValue(sources, ["completedCount", "completedAppointments", "doneAppointmentsCount"]),
      0,
    ),
    lastAppointmentDate: toIsoDate(
      readValue(sources, ["lastAppointmentDate", "latestAppointmentDate", "lastCompletedDate"]),
    ),
    unreadNotifications: toNumberValue(
      readValue(sources, ["unreadNotifications", "unreadNotificationsCount", "notificationsUnread"]),
      0,
    ),
  };
};

const normalizeNextAppointment = (payload: unknown): PatientNextAppointment | null => {
  const root = toRecord(payload);
  if (!root) return null;

  const normalized: PatientNextAppointment = {
    id: toStringValue(readValue([root], ["id", "_id", "appointmentId"]), ""),
    status: toStringValue(readValue([root], ["status"]), "SCHEDULED").toUpperCase(),
    appointmentDate: toIsoDate(readValue([root], ["appointmentDate", "date"])) ?? "",
    startTime: toStringValue(readValue([root], ["startTime", "time", "scheduledTime"]), "--:--"),
    endTime: toStringValue(readValue([root], ["endTime"]), "--:--"),
    type: toStringValue(readValue([root], ["type", "appointmentType"]), "CONSULTATION").toUpperCase(),
    channel: toStringValue(readValue([root], ["channel", "appointmentChannel"]), "IN_PERSON").toUpperCase(),
    professionalName: toStringValue(readValue([root], ["professionalName", "doctorName"]), "Profissional"),
    professionalAvatarUrl:
      toStringValue(readValue([root], ["professionalAvatarUrl", "avatarUrl"]), "") || null,
    primarySpecialty:
      toStringValue(readValue([root], ["primarySpecialty", "specialty"]), "") || null,
    clinicName: toStringValue(readValue([root], ["clinicName", "clinic"]), "") || null,
  };

  if (!normalized.id && !normalized.appointmentDate) return null;
  return normalized;
};

const normalizeAppointmentsList = (payload: unknown): PatientNextAppointment[] => {
  if (!Array.isArray(payload)) return [];

  return payload
    .map(normalizeNextAppointment)
    .filter((appointment): appointment is PatientNextAppointment => appointment !== null);
};

const normalizeDashboardResponse = (payload: unknown): PatientDashboardData => {
  const root = toRecord(payload) ?? {};
  const dataCandidate = root.data ?? root;
  const data = toRecord(dataCandidate);
  const dataSources = data ? [data] : [];
  const objectAppointments = normalizeAppointmentsList(
    readValue(dataSources, ["upcomingAppointments", "nextAppointments", "appointments", "upcoming"]),
  );
  const arrayAppointments = normalizeAppointmentsList(dataCandidate);
  const upcomingAppointments =
    objectAppointments.length > 0 ? objectAppointments : arrayAppointments;
  const nextAppointment =
    normalizeNextAppointment(
      readValue(dataSources, ["nextAppointment", "next", "upcomingAppointment"]),
    ) ??
    null;
  const normalizedAppointments =
    upcomingAppointments.length > 0
      ? upcomingAppointments
      : nextAppointment
        ? [nextAppointment]
        : [];

  return {
    stats: normalizeStats(data ?? root, normalizedAppointments.length),
    nextAppointment: normalizedAppointments[0] ?? null,
    upcomingAppointments: normalizedAppointments,
  };
};

export const getPatientDashboard = async (): Promise<PatientDashboardData> => {
  let lastError: unknown;

  for (const endpoint of DASHBOARD_ENDPOINTS) {
    try {
      const { data } = await api.get<unknown>(endpoint);
      return normalizeDashboardResponse(data);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel carregar o dashboard do paciente.");
};

export const confirmPatientAppointment = async (appointmentId: string): Promise<void> => {
  let lastError: unknown;

  for (const endpoint of getConfirmAppointmentEndpoints(appointmentId)) {
    try {
      await api.patch(endpoint);
      return;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel confirmar presenca.");
};
