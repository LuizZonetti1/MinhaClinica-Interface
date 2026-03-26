import { isAxiosError } from "axios";
import { api } from "../config/api";
import type { PatientProfileData, UpdatePatientProfilePayload } from "../types/patient-profile";
import type { UpdateProfilePasswordPayload } from "../types/profile";

type RecordValue = Record<string, unknown>;

const PROFILE_ENDPOINTS = ["/patients/me/profile", "/patient/me/profile"];
const AVATAR_ENDPOINTS = ["/patients/me/avatar", "/patient/me/avatar"];
const PASSWORD_ENDPOINTS = ["/patients/me/password", "/patient/me/password"];

const toRecord = (value: unknown): RecordValue | null =>
  typeof value === "object" && value !== null ? (value as RecordValue) : null;

const toStringValue = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const toNullableString = (value: unknown): string | null => {
  const parsed = toStringValue(value, "");
  return parsed.length > 0 ? parsed : null;
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

const normalizePatientProfile = (payload: unknown): PatientProfileData => {
  const root = toRecord(payload) ?? {};
  const data = toRecord(root.data) ?? root;
  const personal = toRecord(data.personal) ?? {};
  const medical = toRecord(data.medical) ?? {};

  return {
    personal: {
      name: toStringValue(personal.name, ""),
      email: toStringValue(personal.email, ""),
      phone: toNullableString(personal.phone),
      cpf: toStringValue(personal.cpf, ""),
      dateOfBirth: toIsoDate(personal.dateOfBirth),
      avatarUrl: toNullableString(personal.avatarUrl),
      street: toNullableString(personal.street),
      number: toNullableString(personal.number),
      complement: toNullableString(personal.complement),
      neighborhood: toNullableString(personal.neighborhood),
      city: toNullableString(personal.city),
      state: toNullableString(personal.state),
      zipCode: toNullableString(personal.zipCode),
      addressFormatted: toNullableString(personal.addressFormatted),
    },
    medical: {
      bloodType: toNullableString(medical.bloodType),
      allergies: toNullableString(medical.allergies),
      medications: toNullableString(medical.medications),
      conditions: toNullableString(medical.conditions),
      observations: toNullableString(medical.observations),
      emergencyContactName: toNullableString(medical.emergencyContactName),
      emergencyContactPhone: toNullableString(medical.emergencyContactPhone),
    },
  };
};

export const getPatientProfile = async (): Promise<PatientProfileData> => {
  let lastError: unknown;

  for (const endpoint of PROFILE_ENDPOINTS) {
    try {
      const { data } = await api.get<unknown>(endpoint);
      return normalizePatientProfile(data);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel carregar o perfil.");
};

export const updatePatientProfile = async (payload: UpdatePatientProfilePayload): Promise<void> => {
  let lastError: unknown;

  for (const endpoint of PROFILE_ENDPOINTS) {
    try {
      await api.patch(endpoint, payload);
      return;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel atualizar o perfil.");
};

export const updatePatientAvatar = async (avatarFile: File): Promise<void> => {
  const formData = new FormData();
  formData.append("avatar", avatarFile, avatarFile.name);

  let lastError: unknown;

  for (const endpoint of AVATAR_ENDPOINTS) {
    try {
      await api.patch(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel atualizar o avatar.");
};

export const updatePatientPassword = async (
  payload: UpdateProfilePasswordPayload,
): Promise<void> => {
  let lastError: unknown;

  for (const endpoint of PASSWORD_ENDPOINTS) {
    try {
      await api.patch(endpoint, {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
      });
      return;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel atualizar a senha.");
};
