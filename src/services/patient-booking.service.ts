import { api } from "../config/api";
import type {
  PatientBookingClinicItem,
  PatientBookingCreatedAppointment,
  PatientBookingProfessionalItem,
  PatientBookingSlotItem,
  PatientBookingSlotsResult,
  PatientCreateBookingPayload,
} from "../types/patient";
import {
  toBooleanValue,
  toNumberValue,
  toRecord,
  toTrimmedStringValue,
} from "../utils/parsers";

const BASE_PATH = "/patient-booking";

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
    id: toTrimmedStringValue(item.id),
    tradeName: toTrimmedStringValue(item.tradeName ?? item.name ?? item.clinicName),
    logoUrl: toTrimmedStringValue(item.logoUrl, "") || null,
    city: toTrimmedStringValue(item.city),
    state: toTrimmedStringValue(item.state),
    street: toTrimmedStringValue(item.street),
    number: toTrimmedStringValue(item.number),
    neighborhood: toTrimmedStringValue(item.neighborhood),
  };

  if (!normalized.id || !normalized.tradeName) return null;
  return normalized;
};

const normalizeProfessional = (value: unknown): PatientBookingProfessionalItem | null => {
  const item = toRecord(value);
  if (!item) return null;

  const normalized: PatientBookingProfessionalItem = {
    id: toTrimmedStringValue(item.id),
    userId: toTrimmedStringValue(item.userId),
    name: toTrimmedStringValue(item.name),
    specialty: toTrimmedStringValue(item.specialty, "") || null,
    defaultAppointmentDuration: toNumberValue(item.defaultAppointmentDuration, 30),
    bufferTime: toNumberValue(item.bufferTime, 0),
    calendarColor: toTrimmedStringValue(item.calendarColor, "#3B82F6"),
    avatarUrl: toTrimmedStringValue(item.avatarUrl, "") || null,
  };

  if (!normalized.id || !normalized.name) return null;
  return normalized;
};

const normalizeSlot = (value: unknown): PatientBookingSlotItem | null => {
  const item = toRecord(value);
  if (!item) return null;

  const normalized: PatientBookingSlotItem = {
    startTime: toTrimmedStringValue(item.startTime ?? item.time),
    endTime: toTrimmedStringValue(item.endTime),
    available: toBooleanValue(item.available, false),
  };

  if (!normalized.startTime) return null;
  return normalized;
};

const normalizeCreatedAppointment = (payload: unknown): PatientBookingCreatedAppointment => {
  const root = toRecord(payload) ?? {};
  const data = toRecord(root.data) ?? root;

  return {
    id: toTrimmedStringValue(data.id),
    patientName: toTrimmedStringValue(data.patientName),
    patientCpf: toTrimmedStringValue(data.patientCpf),
    professionalName: toTrimmedStringValue(data.professionalName),
    professionalSpecialty: toTrimmedStringValue(data.professionalSpecialty, "") || null,
    clinicName: toTrimmedStringValue(data.clinicName),
    clinicAddress: toTrimmedStringValue(data.clinicAddress, "") || null,
    appointmentDate: toTrimmedStringValue(data.appointmentDate),
    startTime: toTrimmedStringValue(data.startTime),
    endTime: toTrimmedStringValue(data.endTime),
    type: toTrimmedStringValue(data.type),
    notes: toTrimmedStringValue(data.notes, "") || null,
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
    date: toTrimmedStringValue(nested.date, date),
    professionalId: toTrimmedStringValue(nested.professionalId, professionalId),
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
