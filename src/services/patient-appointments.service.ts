import { api } from "../config/api";
import type { PatientAppointmentListItem, PatientAppointmentsListResult } from "../types/patient";
import { toIsoDateOrEmpty } from "../utils/dateParsers";
import { toNumberValue, toRecord, toTrimmedStringValue } from "../utils/parsers";
import { requestWithEndpointFallback } from "../utils/requestFallback";

type RecordValue = Record<string, unknown>;

const APPOINTMENTS_ENDPOINTS = ["/patients/me/appointments", "/patient/me/appointments"];

const normalizeAppointment = (value: unknown): PatientAppointmentListItem | null => {
  const root = toRecord(value) as RecordValue | null;
  if (!root) return null;

  const item: PatientAppointmentListItem = {
    id: toTrimmedStringValue(root.id, ""),
    appointmentDate: toIsoDateOrEmpty(root.appointmentDate ?? root.date),
    startTime: toTrimmedStringValue(root.startTime, "--:--"),
    endTime: toTrimmedStringValue(root.endTime, "--:--"),
    type: toTrimmedStringValue(root.type, "CONSULTATION").toUpperCase(),
    status: toTrimmedStringValue(root.status, "SCHEDULED").toUpperCase(),
    channel: toTrimmedStringValue(root.channel, "IN_PERSON").toUpperCase(),
    notes: toTrimmedStringValue(root.notes, "") || null,
    professionalName: toTrimmedStringValue(root.professionalName, "Profissional"),
    professionalAvatarUrl: toTrimmedStringValue(root.professionalAvatarUrl, "") || null,
    primarySpecialty: toTrimmedStringValue(root.primarySpecialty, "") || null,
    clinicName: toTrimmedStringValue(root.clinicName, "") || null,
  };

  if (!item.id && !item.appointmentDate) return null;
  return item;
};

const normalizeAppointmentsResult = (payload: unknown): PatientAppointmentsListResult => {
  const root = (toRecord(payload) as RecordValue | null) ?? {};
  const data = (toRecord(root.data) as RecordValue | null) ?? root;
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
  return requestWithEndpointFallback(
    APPOINTMENTS_ENDPOINTS,
    async (endpoint) => {
      const { data } = await api.get<unknown>(endpoint, {
        params: status ? { status } : undefined,
      });
      return normalizeAppointmentsResult(data);
    },
    { fallbackMessage: "Nao foi possivel carregar os agendamentos." },
  );
};
