import { isAxiosError } from "axios";
import { api } from "../config/api";
import type {
  AppointmentConfirmation,
  AppointmentType,
  AppointmentProfessional,
  AppointmentSlot,
  CreateAppointmentPayload,
  PatientSearchResult,
} from "../types/appointment";

type Rec = Record<string, unknown>;

const toStr = (v: unknown): string => (typeof v === "string" ? v : String(v ?? ""));
const toNum = (v: unknown): number => (typeof v === "number" ? v : Number(v ?? 0) || 0);
const toBool = (v: unknown): boolean => {
  const normalized = toBoolOrNull(v);
  if (normalized !== null) return normalized;
  return Boolean(v);
};
const toBoolOrNull = (v: unknown): boolean | null => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const normalized = v.trim().toLowerCase();
    if (["1", "true", "yes", "sim", "verified", "confirmado", "confirmed"].includes(normalized)) {
      return true;
    }
    if (["0", "false", "no", "nao", "unverified", "pending", "not_verified", "nao_verificado"].includes(normalized)) {
      return false;
    }
  }
  return null;
};
const toRec = (v: unknown): Rec | null =>
  typeof v === "object" && v !== null ? (v as Rec) : null;

const extractArray = (data: unknown): Rec[] => {
  if (Array.isArray(data)) return data as Rec[];

  const root = toRec(data);
  if (!root) return [];

  for (const key of ["data", "items", "results", "professionals", "patients", "slots"]) {
    if (Array.isArray(root[key])) return root[key] as Rec[];
  }

  return [];
};

const readValue = (sources: Array<Rec | null | undefined>, keys: string[]): unknown => {
  for (const source of sources) {
    if (!source) continue;

    for (const key of keys) {
      if (!(key in source)) continue;
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
  }

  return undefined;
};

const readStr = (sources: Array<Rec | null | undefined>, keys: string[], fallback = ""): string => {
  const value = readValue(sources, keys);
  if (value === undefined) return fallback;
  return toStr(value).trim();
};

const readBool = (sources: Array<Rec | null | undefined>, keys: string[]): boolean | null => {
  const value = readValue(sources, keys);
  if (value === undefined) return null;
  return toBoolOrNull(value);
};

const mapPatientSearchResult = (raw: Rec): PatientSearchResult | null => {
  const nestedUser = toRec(raw.user);
  const nestedPatient = toRec(raw.patient);
  const nestedPerson = toRec(raw.person);
  const nestedProfile = toRec(raw.profile);
  const nestedAccount = toRec(raw.account);
  const nestedAuth = toRec(raw.auth);
  const sources = [raw, nestedUser, nestedPatient, nestedPerson, nestedProfile, nestedAccount, nestedAuth];

  const id = readStr(sources, ["id", "_id", "patientId", "userId", "patient_id"]);
  const name = readStr(sources, ["name", "fullName", "full_name", "patientName", "displayName", "nome", "userName"]);
  const cpf = readStr(sources, ["cpf", "document", "documentNumber", "cpfNumber", "cpf_number"]);

  if (!id || !name) return null;

  return {
    id,
    name,
    cpf,
    email: readStr(sources, ["email"]) || null,
    phone: readStr(sources, ["phone", "phoneNumber", "mobile"]) || null,
    avatarUrl: readStr(sources, ["avatarUrl", "avatar", "photoUrl", "profileImage", "imageUrl"]) || null,
    isEmailVerified: readBool(
      sources,
      ["emailVerified", "isEmailVerified", "verifiedEmail", "emailIsVerified", "isVerified", "emailVerificationStatus"],
    ),
  };
};

const normalizePatientSearchResults = (payload: unknown, query: string): PatientSearchResult[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const dedupe = new Map<string, PatientSearchResult>();

  for (const raw of extractArray(payload)) {
    const mapped = mapPatientSearchResult(raw);
    if (!mapped) continue;

    if (normalizedQuery) {
      const haystack = `${mapped.name} ${mapped.cpf} ${mapped.email ?? ""} ${mapped.phone ?? ""}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) continue;
    }

    if (!dedupe.has(mapped.id)) {
      dedupe.set(mapped.id, mapped);
    }
  }

  return [...dedupe.values()].slice(0, 20);
};

type PatientSearchAttempt = {
  path: string;
  buildParams: (query: string) => Record<string, string>;
};

const patientSearchAttempts: PatientSearchAttempt[] = [
  {
    path: "/appointments/patients/search",
    buildParams: (query) => ({ q: query, includeUnverified: "true" }),
  },
  {
    path: "/appointments/patients/search",
    buildParams: (query) => ({ q: query }),
  },
  {
    path: "/patients/search",
    buildParams: (query) => ({ q: query, includeUnverified: "true" }),
  },
  {
    path: "/patients/search",
    buildParams: (query) => ({ q: query }),
  },
  {
    path: "/patients",
    buildParams: (query) => ({ q: query, includeUnverified: "true" }),
  },
  {
    path: "/patients",
    buildParams: (query) => ({ q: query }),
  },
  {
    path: "/patients",
    buildParams: (query) => ({ search: query }),
  },
  {
    path: "/patients",
    buildParams: (query) => ({ name: query }),
  },
];

let preferredPatientSearchAttempt: PatientSearchAttempt | null = null;

const isSearchFallbackError = (error: unknown): boolean =>
  isAxiosError(error) &&
  (error.response?.status === 404 ||
    error.response?.status === 403 ||
    error.response?.status === 400);

export const searchAppointmentPatients = async (q: string): Promise<PatientSearchResult[]> => {
  const query = q.trim();
  if (!query) return [];

  const attempts = preferredPatientSearchAttempt
    ? [
        preferredPatientSearchAttempt,
        ...patientSearchAttempts.filter((attempt) => attempt !== preferredPatientSearchAttempt),
      ]
    : patientSearchAttempts;

  for (const attempt of attempts) {
    try {
      const { data } = await api.get<unknown>(attempt.path, {
        params: attempt.buildParams(query),
      });
      preferredPatientSearchAttempt = attempt;
      return normalizePatientSearchResults(data, query);
    } catch (error: unknown) {
      if (isSearchFallbackError(error)) {
        if (preferredPatientSearchAttempt === attempt) {
          preferredPatientSearchAttempt = null;
        }
        continue;
      }
      throw error;
    }
  }

  return [];
};

export const listAppointmentProfessionals = async (): Promise<AppointmentProfessional[]> => {
  const { data } = await api.get<unknown>("/appointments/professionals");
  return extractArray(data).map((p) => ({
    id: toStr(p.id),
    name: toStr(p.name),
    specialty: toStr(p.specialty ?? p.mainSpecialty ?? p.specialization ?? ""),
    defaultDuration: toNum(p.defaultDuration ?? p.duration ?? 30),
    calendarColor: toStr(p.calendarColor ?? p.color ?? "#3B82F6"),
    clinicName: p.clinicName ? toStr(p.clinicName) : null,
    clinicAddress: p.clinicAddress ? toStr(p.clinicAddress) : null,
  }));
};

export const getProfessionalSlots = async (
  professionalId: string,
  date: string,
): Promise<AppointmentSlot[]> => {
  const { data } = await api.get<unknown>(`/appointments/professionals/${professionalId}/slots`, {
    params: { date },
  });
  return extractArray(data).map((s) => ({
    time: toStr(s.time ?? s.startTime ?? ""),
    available: toBool(s.available ?? s.isAvailable ?? true),
  }));
};

export const createAppointment = async (
  payload: CreateAppointmentPayload,
): Promise<AppointmentConfirmation> => {
  const requestBody = {
    patientId: payload.patientId,
    professionalId: payload.professionalId,
    appointmentDate: payload.date,
    startTime: payload.time,
    appointmentType: payload.type,
    notes: payload.notes,
    // Compatibilidade com backends antigos
    date: payload.date,
    time: payload.time,
    type: payload.type,
  };

  const { data } = await api.post<unknown>("/appointments", requestBody);
  const r = toRec(data) ?? {};
  const patient = toRec(r.patient) ?? {};
  const professional = toRec(r.professional) ?? {};

  return {
    id: toStr(r.id),
    patientName: toStr(r.patientName ?? patient.name ?? ""),
    patientCpf: toStr(r.patientCpf ?? patient.cpf ?? ""),
    professionalName: toStr(r.professionalName ?? professional.name ?? ""),
    specialty: toStr(r.specialty ?? professional.specialty ?? professional.mainSpecialty ?? ""),
    clinicName: r.clinicName ? toStr(r.clinicName) : null,
    clinicAddress: r.clinicAddress ? toStr(r.clinicAddress) : null,
    date: toStr(r.date),
    time: toStr(r.time ?? r.startTime ?? ""),
    endTime: r.endTime ? toStr(r.endTime) : null,
    type: (r.type ? toStr(r.type) : null) as AppointmentType | null,
  };
};
