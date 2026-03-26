import { isAxiosError } from "axios";
import { api } from "../config/api";
import type { PatientAppointmentListItem, PatientAppointmentsListResult } from "../types/patient";

type RecordValue = Record<string, unknown>;

const APPOINTMENTS_ENDPOINTS = ["/patients/me/appointments", "/patient/me/appointments"];

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

const toIsoDate = (value: unknown): string => {
  const raw = toStringValue(value, "");
  if (!raw) return "";

  const match = raw.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeAppointment = (value: unknown): PatientAppointmentListItem | null => {
  const root = toRecord(value);
  if (!root) return null;

  const item: PatientAppointmentListItem = {
    id: toStringValue(root.id, ""),
    appointmentDate: toIsoDate(root.appointmentDate ?? root.date),
    startTime: toStringValue(root.startTime, "--:--"),
    endTime: toStringValue(root.endTime, "--:--"),
    type: toStringValue(root.type, "CONSULTATION").toUpperCase(),
    status: toStringValue(root.status, "SCHEDULED").toUpperCase(),
    channel: toStringValue(root.channel, "IN_PERSON").toUpperCase(),
    notes: toStringValue(root.notes, "") || null,
    professionalName: toStringValue(root.professionalName, "Profissional"),
    professionalAvatarUrl: toStringValue(root.professionalAvatarUrl, "") || null,
    primarySpecialty: toStringValue(root.primarySpecialty, "") || null,
    clinicName: toStringValue(root.clinicName, "") || null,
  };

  if (!item.id && !item.appointmentDate) return null;
  return item;
};

const normalizeAppointmentsResult = (payload: unknown): PatientAppointmentsListResult => {
  const root = toRecord(payload) ?? {};
  const data = toRecord(root.data) ?? root;
  const listValue = data.appointments ?? data.items ?? [];
  const list = Array.isArray(listValue)
    ? listValue
        .map(normalizeAppointment)
        .filter((item): item is PatientAppointmentListItem => item !== null)
    : [];

  return {
    total: toNumberValue(data.total, list.length),
    appointments: list,
  };
};

export const listPatientAppointments = async (
  status?: string,
): Promise<PatientAppointmentsListResult> => {
  let lastError: unknown;

  for (const endpoint of APPOINTMENTS_ENDPOINTS) {
    try {
      const { data } = await api.get<unknown>(endpoint, {
        params: status ? { status } : undefined,
      });
      return normalizeAppointmentsResult(data);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel carregar os agendamentos.");
};
