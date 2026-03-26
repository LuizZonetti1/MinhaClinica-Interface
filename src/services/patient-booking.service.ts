import { api } from "../config/api";
import type {
  PatientBookingClinicItem,
  PatientBookingCreatedAppointment,
  PatientBookingProfessionalItem,
  PatientBookingSlotItem,
  PatientBookingSlotsResult,
  PatientCreateBookingPayload,
} from "../types/patient";

type RecordValue = Record<string, unknown>;

const BASE_PATH = "/patient-booking";

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

const toBooleanValue = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "sim"].includes(normalized)) return true;
    if (["0", "false", "no", "nao"].includes(normalized)) return false;
  }
  return fallback;
};

const readArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  const root = toRecord(payload) ?? {};
  const data = root.data;
  if (Array.isArray(data)) return data;
  const nested = toRecord(data);
  if (!nested) return [];
  for (const key of ["items", "results", "clinics", "professionals", "slots"]) {
    if (Array.isArray(nested[key])) return nested[key] as unknown[];
  }
  return [];
};

const normalizeClinic = (value: unknown): PatientBookingClinicItem | null => {
  const item = toRecord(value);
  if (!item) return null;

  const normalized: PatientBookingClinicItem = {
    id: toStringValue(item.id),
    tradeName: toStringValue(item.tradeName ?? item.name ?? item.clinicName),
    logoUrl: toStringValue(item.logoUrl, "") || null,
    city: toStringValue(item.city),
    state: toStringValue(item.state),
    street: toStringValue(item.street),
    number: toStringValue(item.number),
    neighborhood: toStringValue(item.neighborhood),
  };

  if (!normalized.id || !normalized.tradeName) return null;
  return normalized;
};

const normalizeProfessional = (value: unknown): PatientBookingProfessionalItem | null => {
  const item = toRecord(value);
  if (!item) return null;

  const normalized: PatientBookingProfessionalItem = {
    id: toStringValue(item.id),
    userId: toStringValue(item.userId),
    name: toStringValue(item.name),
    specialty: toStringValue(item.specialty, "") || null,
    defaultAppointmentDuration: toNumberValue(item.defaultAppointmentDuration, 30),
    bufferTime: toNumberValue(item.bufferTime, 0),
    calendarColor: toStringValue(item.calendarColor, "#3B82F6"),
    avatarUrl: toStringValue(item.avatarUrl, "") || null,
  };

  if (!normalized.id || !normalized.name) return null;
  return normalized;
};

const normalizeSlot = (value: unknown): PatientBookingSlotItem | null => {
  const item = toRecord(value);
  if (!item) return null;

  const normalized: PatientBookingSlotItem = {
    startTime: toStringValue(item.startTime ?? item.time),
    endTime: toStringValue(item.endTime),
    available: toBooleanValue(item.available, false),
  };

  if (!normalized.startTime) return null;
  return normalized;
};

const normalizeCreatedAppointment = (payload: unknown): PatientBookingCreatedAppointment => {
  const root = toRecord(payload) ?? {};
  const data = toRecord(root.data) ?? root;

  return {
    id: toStringValue(data.id),
    patientName: toStringValue(data.patientName),
    patientCpf: toStringValue(data.patientCpf),
    professionalName: toStringValue(data.professionalName),
    professionalSpecialty: toStringValue(data.professionalSpecialty, "") || null,
    clinicName: toStringValue(data.clinicName),
    clinicAddress: toStringValue(data.clinicAddress, "") || null,
    appointmentDate: toStringValue(data.appointmentDate),
    startTime: toStringValue(data.startTime),
    endTime: toStringValue(data.endTime),
    type: toStringValue(data.type),
    notes: toStringValue(data.notes, "") || null,
  };
};

export const searchPatientBookingClinics = async (
  query: string,
): Promise<PatientBookingClinicItem[]> => {
  const { data } = await api.get<unknown>(`${BASE_PATH}/clinics`, {
    params: { q: query },
  });

  return readArray(data)
    .map(normalizeClinic)
    .filter((item): item is PatientBookingClinicItem => item !== null);
};

export const listPatientBookingProfessionals = async (
  clinicId: string,
): Promise<PatientBookingProfessionalItem[]> => {
  const { data } = await api.get<unknown>(`${BASE_PATH}/clinics/${clinicId}/professionals`);

  return readArray(data)
    .map(normalizeProfessional)
    .filter((item): item is PatientBookingProfessionalItem => item !== null);
};

export const getPatientBookingSlots = async (
  clinicId: string,
  professionalId: string,
  date: string,
): Promise<PatientBookingSlotsResult> => {
  const { data } = await api.get<unknown>(
    `${BASE_PATH}/clinics/${clinicId}/professionals/${professionalId}/slots`,
    { params: { date } },
  );

  const root = toRecord(data) ?? {};
  const nested = toRecord(root.data) ?? root;
  const slotList = Array.isArray(nested.slots) ? nested.slots : [];

  return {
    date: toStringValue(nested.date, date),
    professionalId: toStringValue(nested.professionalId, professionalId),
    duration: toNumberValue(nested.duration, 30),
    bufferTime: toNumberValue(nested.bufferTime, 0),
    slots: slotList
      .map(normalizeSlot)
      .filter((item): item is PatientBookingSlotItem => item !== null),
  };
};

export const createPatientBookingAppointment = async (
  payload: PatientCreateBookingPayload,
): Promise<PatientBookingCreatedAppointment> => {
  const { data } = await api.post<unknown>(`${BASE_PATH}/appointments`, payload);
  return normalizeCreatedAppointment(data);
};
