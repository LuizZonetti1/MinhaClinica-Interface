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

  // O backend pode devolver clinic/professional como objetos aninhados ou campos rasos
  const nestedClinic = toRecord(root.clinic) as RecordValue | null;
  const nestedProfessional = toRecord(root.professional) as RecordValue | null;
  const nestedSchedule = toRecord(root.schedule) as RecordValue | null;

  const resolveClinicId = (): string | null => {
    const flat = toTrimmedStringValue(root.clinicId ?? root.clinic_id ?? root.clinicid, "");
    if (flat) return flat;
    const fromClinic = toTrimmedStringValue(nestedClinic?.id ?? nestedClinic?.clinicId, "");
    if (fromClinic) return fromClinic;
    const fromSchedule = toTrimmedStringValue(
      nestedSchedule?.clinicId ?? nestedSchedule?.clinic_id,
      "",
    );
    return fromSchedule || null;
  };

  const resolveProfessionalId = (): string | null => {
    const flat = toTrimmedStringValue(
      root.professionalId ?? root.professional_id ?? root.professionalid,
      "",
    );
    if (flat) return flat;
    const fromProf = toTrimmedStringValue(
      nestedProfessional?.id ?? nestedProfessional?.professionalId,
      "",
    );
    if (fromProf) return fromProf;
    const fromSchedule = toTrimmedStringValue(
      nestedSchedule?.professionalId ?? nestedSchedule?.professional_id,
      "",
    );
    return fromSchedule || null;
  };

  const resolveProfessionalName = (): string => {
    const flat = toTrimmedStringValue(root.professionalName ?? root.professional_name, "");
    if (flat) return flat;
    return (
      toTrimmedStringValue(
        nestedProfessional?.name ??
        nestedProfessional?.fullName ??
        nestedProfessional?.professionalName,
        "Profissional",
      ) || "Profissional"
    );
  };

  const resolveClinicName = (): string | null => {
    const flat = toTrimmedStringValue(root.clinicName ?? root.clinic_name, "");
    if (flat) return flat;
    return (
      toTrimmedStringValue(
        nestedClinic?.name ?? nestedClinic?.tradeName ?? nestedClinic?.clinicName,
        "",
      ) || null
    );
  };

  const item: PatientAppointmentListItem = {
    id: toTrimmedStringValue(root.id, ""),
    appointmentDate: toIsoDateOrEmpty(root.appointmentDate ?? root.date),
    startTime: toTrimmedStringValue(root.startTime, "--:--"),
    endTime: toTrimmedStringValue(root.endTime, "--:--"),
    type: toTrimmedStringValue(root.type, "CONSULTATION").toUpperCase(),
    status: toTrimmedStringValue(root.status, "SCHEDULED").toUpperCase(),
    channel: toTrimmedStringValue(root.channel, "IN_PERSON").toUpperCase(),
    notes: toTrimmedStringValue(root.notes, "") || null,
    professionalName: resolveProfessionalName(),
    professionalAvatarUrl:
      toTrimmedStringValue(
        root.professionalAvatarUrl ?? nestedProfessional?.avatarUrl ?? nestedProfessional?.photoUrl,
        "",
      ) || null,
    primarySpecialty:
      toTrimmedStringValue(
        root.primarySpecialty ??
        nestedProfessional?.specialty ??
        nestedProfessional?.primarySpecialty,
        "",
      ) || null,
    clinicName: resolveClinicName(),
    clinicId: resolveClinicId(),
    professionalId: resolveProfessionalId(),
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

export interface ReschedulePayload {
  appointmentDate: string;
  startTime: string;
  clinicId: string;
  professionalId: string;
}

export const rescheduleAppointment = async (
  id: string,
  payload: ReschedulePayload,
): Promise<void> => {
  await api.patch(`/patients/me/appointments/${id}`, payload);
};

export const cancelAppointment = async (id: string): Promise<void> => {
  await api.patch(`/patients/me/appointments/${id}/cancel`);
};

// ─── Patient appointment detail ───────────────────────────────────────────────

export interface PatientAppointmentDetail {
  id: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  professionalName: string;
  clinicName: string;
  primarySpecialty: string | null;
}

export const getPatientAppointmentDetail = async (
  appointmentId: string,
): Promise<PatientAppointmentDetail> => {
  const { data } = await api.get<unknown>(`/patients/me/appointments/${appointmentId}`);
  const root = toRecord(data) as Record<string, unknown> | null ?? {};
  const inner = (toRecord(root.data) as Record<string, unknown> | null) ?? root;
  return {
    id: toTrimmedStringValue(inner.id, ""),
    appointmentDate: toTrimmedStringValue(inner.appointmentDate, ""),
    startTime: toTrimmedStringValue(inner.startTime, "--:--"),
    status: toTrimmedStringValue(inner.status, ""),
    professionalName: toTrimmedStringValue(inner.professionalName, ""),
    clinicName: toTrimmedStringValue(inner.clinicName, ""),
    primarySpecialty: inner.primarySpecialty
      ? toTrimmedStringValue(inner.primarySpecialty, "")
      : null,
  };
};
