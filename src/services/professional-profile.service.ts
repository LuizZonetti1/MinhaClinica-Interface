import { api } from "../config/api";
import type {
  ProfessionalProfileData,
  ProfessionalSpecialty,
  UpdateProfessionalProfilePayload,
  WorkingHour,
} from "../types/professional-profile";
import type { UpdateProfilePasswordPayload } from "../types/profile";

const BASE_PATH = "/professionals/me/profile";

type Rec = Record<string, unknown>;

const asRecord = (v: unknown): Rec | null =>
  typeof v === "object" && v !== null ? (v as Rec) : null;

const str = (v: unknown, fb = ""): string => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return fb;
};

const num = (v: unknown, fb = 0): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const parsed = Number(v);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fb;
};

const normalizeResponse = (raw: unknown): ProfessionalProfileData => {
  const root = asRecord(raw) ?? {};
  const data = asRecord(root.data) ?? root;
  const personal = asRecord(data.personal) ?? {};
  const professional = asRecord(data.professional) ?? {};
  const stats = asRecord(data.stats) ?? {};
  const specialtiesRaw = Array.isArray(data.specialties) ? (data.specialties as unknown[]) : [];
  const workingHoursRaw = Array.isArray(data.workingHours) ? (data.workingHours as unknown[]) : [];

  const specialties: ProfessionalSpecialty[] = specialtiesRaw.map((s) => {
    const sp = asRecord(s) ?? {};
    return {
      specialtyId: str(sp.specialtyId),
      name: str(sp.name),
      isPrimary: Boolean(sp.isPrimary),
    };
  });

  const workingHours: WorkingHour[] = workingHoursRaw.map((w) => {
    const wh = asRecord(w) ?? {};
    return {
      dayOfWeek: str(wh.dayOfWeek) as WorkingHour["dayOfWeek"],
      isWorking: Boolean(wh.isWorking),
      startTime: str(wh.startTime),
      endTime: str(wh.endTime),
      lunchBreakStart: typeof wh.lunchBreakStart === "string" ? wh.lunchBreakStart : null,
      lunchBreakEnd: typeof wh.lunchBreakEnd === "string" ? wh.lunchBreakEnd : null,
    };
  });

  return {
    name: str(personal.name),
    email: str(personal.email),
    phone: str(personal.phone),
    avatarUrl: typeof personal.avatarUrl === "string" ? personal.avatarUrl : null,
    professionalCouncil: str(professional.professionalCouncil, "CRM"),
    registrationNumber: str(professional.registrationNumber),
    registrationState: str(professional.registrationState),
    bio: typeof professional.bio === "string" ? professional.bio : null,
    formations: typeof professional.formations === "string" ? professional.formations : null,
    defaultAppointmentDuration: num(professional.defaultAppointmentDuration, 60),
    isActive: Boolean(professional.isActive),
    totalPatientsAttended: num(stats.totalPatientsAttended),
    yearsAtClinic: num(stats.yearsAtClinic),
    avgRating: num(stats.avgRating),
    punctualityPercent: num(stats.punctualityPercent),
    specialties,
    workingHours,
  };
};

// GET /api/professionals/me/profile
export const getProfessionalProfile = async (): Promise<ProfessionalProfileData> => {
  const { data } = await api.get(BASE_PATH);
  return normalizeResponse(data);
};

// PATCH /api/professionals/me/profile
export const updateProfessionalProfile = async (
  payload: UpdateProfessionalProfilePayload,
): Promise<void> => {
  await api.patch(BASE_PATH, payload);
};

// PATCH /api/professionals/me/avatar
export const updateProfessionalAvatar = async (avatarFile: File): Promise<void> => {
  const formData = new FormData();
  formData.append("avatar", avatarFile, avatarFile.name);

  await api.patch("/professionals/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// PATCH /api/professionals/me/password
export const updateProfessionalPassword = async (
  payload: UpdateProfilePasswordPayload,
): Promise<void> => {
  await api.patch("/professionals/me/password", {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });
};
