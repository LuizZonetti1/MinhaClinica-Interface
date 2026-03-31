import { api } from "../config/api";
import type {
  PatientDashboardData,
  PatientDashboardStats,
  PatientNextAppointment,
} from "../types/dashboard";
import { toIsoDateOrNull } from "../utils/dateParsers";
import { readNonEmptyValue, toNumberValue, toRecord, toTrimmedStringValue } from "../utils/parsers";
import { requestWithEndpointFallback } from "../utils/requestFallback";

type RecordValue = Record<string, unknown>;

const DASHBOARD_ENDPOINTS = ["/patients/me/dashboard", "/patient/me/dashboard"];
const getConfirmAppointmentEndpoints = (appointmentId: string) => [
  `/patients/me/appointments/${appointmentId}/confirm`,
  `/patient/me/appointments/${appointmentId}/confirm`,
];

const normalizeStats = (payload: unknown, fallbackUpcomingCount = 0): PatientDashboardStats => {
  const root = (toRecord(payload) as RecordValue | null) ?? {};
  const nestedStats = toRecord(root.stats) as RecordValue | null;
  const sources = [nestedStats, root];

  return {
    upcomingCount: toNumberValue(
      readNonEmptyValue(sources, ["upcomingCount", "upcomingAppointments", "nextAppointmentsCount"]),
      fallbackUpcomingCount,
    ),
    completedCount: toNumberValue(
      readNonEmptyValue(sources, ["completedCount", "completedAppointments", "doneAppointmentsCount"]),
      0,
    ),
    lastAppointmentDate: toIsoDateOrNull(
      readNonEmptyValue(sources, ["lastAppointmentDate", "latestAppointmentDate", "lastCompletedDate"]),
    ),
    unreadNotifications: toNumberValue(
      readNonEmptyValue(sources, ["unreadNotifications", "unreadNotificationsCount", "notificationsUnread"]),
      0,
    ),
  };
};

const normalizeNextAppointment = (payload: unknown): PatientNextAppointment | null => {
  const root = toRecord(payload) as RecordValue | null;
  if (!root) return null;

  const normalized: PatientNextAppointment = {
    id: toTrimmedStringValue(readNonEmptyValue([root], ["id", "_id", "appointmentId"]), ""),
    status: toTrimmedStringValue(readNonEmptyValue([root], ["status"]), "SCHEDULED").toUpperCase(),
    appointmentDate: toIsoDateOrNull(readNonEmptyValue([root], ["appointmentDate", "date"])) ?? "",
    startTime: toTrimmedStringValue(
      readNonEmptyValue([root], ["startTime", "time", "scheduledTime"]),
      "--:--",
    ),
    endTime: toTrimmedStringValue(readNonEmptyValue([root], ["endTime"]), "--:--"),
    type: toTrimmedStringValue(
      readNonEmptyValue([root], ["type", "appointmentType"]),
      "CONSULTATION",
    ).toUpperCase(),
    channel: toTrimmedStringValue(
      readNonEmptyValue([root], ["channel", "appointmentChannel"]),
      "IN_PERSON",
    ).toUpperCase(),
    professionalName: toTrimmedStringValue(
      readNonEmptyValue([root], ["professionalName", "doctorName"]),
      "Profissional",
    ),
    professionalAvatarUrl:
      toTrimmedStringValue(readNonEmptyValue([root], ["professionalAvatarUrl", "avatarUrl"]), "") || null,
    primarySpecialty:
      toTrimmedStringValue(readNonEmptyValue([root], ["primarySpecialty", "specialty"]), "") || null,
    clinicName: toTrimmedStringValue(readNonEmptyValue([root], ["clinicName", "clinic"]), "") || null,
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
  const root = (toRecord(payload) as RecordValue | null) ?? {};
  const dataCandidate = root.data ?? root;
  const data = toRecord(dataCandidate) as RecordValue | null;
  const dataSources = data ? [data] : [];
  const objectAppointments = normalizeAppointmentsList(
    readNonEmptyValue(dataSources, ["upcomingAppointments", "nextAppointments", "appointments", "upcoming"]),
  );
  const arrayAppointments = normalizeAppointmentsList(dataCandidate);
  const upcomingAppointments =
    objectAppointments.length > 0 ? objectAppointments : arrayAppointments;
  const nextAppointment =
    normalizeNextAppointment(
      readNonEmptyValue(dataSources, ["nextAppointment", "next", "upcomingAppointment"]),
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
  return requestWithEndpointFallback(
    DASHBOARD_ENDPOINTS,
    async (endpoint) => {
      const { data } = await api.get<unknown>(endpoint);
      return normalizeDashboardResponse(data);
    },
    { fallbackMessage: "Nao foi possivel carregar o dashboard do paciente." },
  );
};

export const confirmPatientAppointment = async (appointmentId: string): Promise<void> => {
  await requestWithEndpointFallback(
    getConfirmAppointmentEndpoints(appointmentId),
    async (endpoint) => {
      await api.patch(endpoint);
    },
    { fallbackMessage: "Nao foi possivel confirmar presenca." },
  );
};
