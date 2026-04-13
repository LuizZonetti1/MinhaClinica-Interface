import { api } from "../config/api";
import type {
  PatientAuditDetails,
  PatientAuditReportItem,
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

const readNullableString = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): string | null => {
  const value = readValue(sources, keys);
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
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

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  return [];
};

const readStringArray = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): string[] => {
  const value = readValue(sources, keys);
  return toStringArray(value);
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

const readSpecialtyName = (professionalSource: Record<string, unknown> | null | undefined): string | null => {
  if (!professionalSource) return null;

  const specialties = professionalSource.specialties;
  if (!Array.isArray(specialties)) return null;

  for (const rawSpecialty of specialties) {
    const specialtyItem = asRecord(rawSpecialty);
    if (!specialtyItem) continue;

    const specialty = asRecord(specialtyItem.specialty);
    const name =
      readNullableString([specialty, specialtyItem], ["name", "specialtyName", "label"]) ?? null;
    if (name) return name;
  }

  return null;
};

const mapPatientReport = (rawReport: unknown, index: number): PatientAuditReportItem | null => {
  const report = asRecord(rawReport);
  if (!report) return null;

  const appointment = asRecord(report.appointment);
  const appointmentProfessional = asRecord(appointment?.professional);
  const reportProfessional = asRecord(report.professional);

  const appointmentProfessionalUser = asRecord(appointmentProfessional?.user);
  const reportProfessionalUser = asRecord(reportProfessional?.user);

  const professionalName =
    readString(
      [report, appointmentProfessionalUser, reportProfessionalUser, appointmentProfessional, reportProfessional],
      ["professionalName", "name", "fullName"],
      "",
    ) || "-";

  const professionalSpecialty =
    readNullableString([report], ["professionalSpecialty", "specialty"]) ??
    readSpecialtyName(appointmentProfessional) ??
    readSpecialtyName(reportProfessional);

  const attachments = readStringArray([report], ["attachments", "files"]);

  return {
    id: readString([report], ["id", "_id", "reportId"], `report-${index + 1}`),
    appointmentId: readString([report, appointment], ["appointmentId", "id"], ""),
    appointmentDate: readDate([report, appointment], [
      "appointmentDate",
      "date",
      "scheduledDate",
      "createdAt",
    ]),
    startTime: readNullableString([report, appointment], ["startTime", "startsAt"]),
    endTime: readNullableString([report, appointment], ["endTime", "endsAt"]),
    appointmentType: readNullableString([report, appointment], ["appointmentType", "type"]),
    appointmentStatus: readNullableString([report, appointment], ["appointmentStatus", "status"]),
    appointmentNotes: readNullableString([report, appointment], ["appointmentNotes", "notes"]),
    professionalName,
    professionalSpecialty,
    chiefComplaint: readNullableString([report], ["chiefComplaint"]),
    symptoms: readNullableString([report], ["symptoms"]),
    diagnosis: readNullableString([report], ["diagnosis"]),
    treatment: readNullableString([report], ["treatment"]),
    prescription: readNullableString([report], ["prescription"]),
    observations: readNullableString([report], ["observations"]),
    attachments,
    createdAt: readDate([report], ["createdAt", "created_at"]),
    updatedAt: readDate([report], ["updatedAt", "updated_at"]),
  };
};

const mapPatientDetails = (rawData: unknown, patientId: string): PatientAuditDetails => {
  const root = asRecord(rawData);
  const payload = asRecord(root?.data) ?? root ?? {};
  const patient = asRecord(payload.patient) ?? payload;
  const patientUser = asRecord(patient?.user);
  const patientSources = [patient, patientUser, payload];

  const address = asRecord(patient?.address) ?? asRecord(payload.address);
  const medical = asRecord(patient?.medical) ?? asRecord(payload.medical);

  const isActiveValue = readBoolean(patientSources, ["isActive", "active", "enabled"]);
  const status = normalizeStatus(readString(patientSources, ["status"], ""), isActiveValue);
  const isActive = isActiveValue ?? status === "ACTIVE";

  const rawReports = Array.isArray(payload.reports)
    ? payload.reports
    : Array.isArray(payload.medicalRecords)
      ? payload.medicalRecords
      : [];

  const reports = rawReports
    .map((report, index) => mapPatientReport(report, index))
    .filter((report): report is PatientAuditReportItem => report !== null);

  return {
    patient: {
      id: readString(patientSources, ["id", "patientId"], patientId),
      userId: readString(patientSources, ["userId"], ""),
      name: readString(patientSources, ["name", "fullName"], "-"),
      email: readString(patientSources, ["email"], "-"),
      phone: readNullableString(patientSources, ["phone", "phoneNumber", "telephone"]),
      avatarUrl: readNullableString(patientSources, ["avatarUrl", "avatar", "photoUrl"]),
      status,
      isActive,
      cpf: readString(patientSources, ["cpf"], "-"),
      rg: readNullableString(patientSources, ["rg", "identity"]),
      dateOfBirth: readDate(patientSources, ["dateOfBirth", "birthDate", "dob"]),
      gender: readNullableString(patientSources, ["gender", "sex"]),
      alternativePhone: readNullableString(patientSources, ["alternativePhone", "secondaryPhone"]),
      noShowCount: readNumber(patientSources, ["noShowCount", "missedAppointments"], 0),
      totalAppointments: readNumber(
        patientSources,
        ["totalAppointments", "appointmentsCount", "totalVisits", "consultationsCount"],
        0,
      ),
      completedAppointments: readNumber(
        patientSources,
        ["completedAppointments", "completedConsultations", "attendedAppointments"],
        0,
      ),
      lastVisit: readDate(patientSources, ["lastVisit", "lastVisitAt", "lastAppointmentDate"]),
      createdAt: readDate(patientSources, ["createdAt", "created_at"]),
      updatedAt: readDate(patientSources, ["updatedAt", "updated_at"]),
      address: {
        zipCode: readNullableString([address, patient], ["zipCode", "postalCode", "cep"]),
        street: readNullableString([address, patient], ["street", "logradouro"]),
        number: readNullableString([address, patient], ["number"]),
        complement: readNullableString([address, patient], ["complement"]),
        neighborhood: readNullableString([address, patient], ["neighborhood", "district"]),
        city: readNullableString([address, patient], ["city"]),
        state: readNullableString([address, patient], ["state", "uf"]),
      },
      medical: {
        bloodType: readNullableString([medical, patient], ["bloodType"]),
        allergies: readNullableString([medical, patient], ["allergies"]),
        medications: readNullableString([medical, patient], ["medications"]),
        conditions: readNullableString([medical, patient], ["conditions"]),
        observations: readNullableString([medical, patient], ["observations"]),
        emergencyContactName: readNullableString([medical, patient], ["emergencyContactName"]),
        emergencyContactPhone: readNullableString([medical, patient], ["emergencyContactPhone"]),
      },
    },
    reports,
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

export const getPatientDetailsAdmin = async (patientId: string): Promise<PatientAuditDetails> => {
  const { data } = await api.get<unknown>(`/patients/${patientId}/details`);
  return mapPatientDetails(data, patientId);
};
