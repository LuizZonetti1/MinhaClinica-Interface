import { api } from "../config/api";
import type { PatientProfileData, UpdatePatientProfilePayload } from "../types/patient-profile";
import type { UpdateProfilePasswordPayload } from "../types/profile";
import { toIsoDateOrEmpty } from "../utils/dateParsers";
import type { EndpointRequest } from "../utils/requestFallback";
import { toNullableString, toRecord, toStringValue } from "../utils/parsers";
import { requestWithEndpointFallback } from "../utils/requestFallback";

type RecordValue = Record<string, unknown>;

const PROFILE_ENDPOINTS = ["/patients/me/profile", "/patient/me/profile"];
const AVATAR_ENDPOINTS = ["/patients/me/avatar", "/patient/me/avatar"];
const PASSWORD_ENDPOINTS = ["/patients/me/password", "/patient/me/password"];

const requestPatientEndpoint = async <TResult>(
  endpoints: readonly string[],
  request: EndpointRequest<TResult>,
  fallbackMessage: string,
): Promise<TResult> =>
  requestWithEndpointFallback(endpoints, request, {
    fallbackMessage,
  });

const normalizePatientProfile = (payload: unknown): PatientProfileData => {
  const root = (toRecord(payload) as RecordValue | null) ?? {};
  const data = (toRecord(root.data) as RecordValue | null) ?? root;
  const personal = (toRecord(data.personal) as RecordValue | null) ?? {};
  const medical = (toRecord(data.medical) as RecordValue | null) ?? {};

  return {
    personal: {
      name: toStringValue(personal.name, "", { trim: true }),
      email: toStringValue(personal.email, "", { trim: true }),
      phone: toNullableString(personal.phone, { trim: true }),
      cpf: toStringValue(personal.cpf, "", { trim: true }),
      dateOfBirth: toIsoDateOrEmpty(personal.dateOfBirth),
      avatarUrl: toNullableString(personal.avatarUrl, { trim: true }),
      street: toNullableString(personal.street, { trim: true }),
      number: toNullableString(personal.number, { trim: true }),
      complement: toNullableString(personal.complement, { trim: true }),
      neighborhood: toNullableString(personal.neighborhood, { trim: true }),
      city: toNullableString(personal.city, { trim: true }),
      state: toNullableString(personal.state, { trim: true }),
      zipCode: toNullableString(personal.zipCode, { trim: true }),
      addressFormatted: toNullableString(personal.addressFormatted, { trim: true }),
    },
    medical: {
      bloodType: toNullableString(medical.bloodType, { trim: true }),
      allergies: toNullableString(medical.allergies, { trim: true }),
      medications: toNullableString(medical.medications, { trim: true }),
      conditions: toNullableString(medical.conditions, { trim: true }),
      observations: toNullableString(medical.observations, { trim: true }),
      emergencyContactName: toNullableString(medical.emergencyContactName, { trim: true }),
      emergencyContactPhone: toNullableString(medical.emergencyContactPhone, { trim: true }),
    },
  };
};

export const getPatientProfile = async (): Promise<PatientProfileData> => {
  return requestPatientEndpoint(
    PROFILE_ENDPOINTS,
    async (endpoint) => {
      const { data } = await api.get<unknown>(endpoint);
      return normalizePatientProfile(data);
    },
    "Nao foi possivel carregar o perfil.",
  );
};

export const updatePatientProfile = async (payload: UpdatePatientProfilePayload): Promise<void> => {
  await requestPatientEndpoint(
    PROFILE_ENDPOINTS,
    async (endpoint) => {
      await api.patch(endpoint, payload);
    },
    "Nao foi possivel atualizar o perfil.",
  );
};

export const updatePatientAvatar = async (avatarFile: File): Promise<void> => {
  const formData = new FormData();
  formData.append("avatar", avatarFile, avatarFile.name);

  await requestPatientEndpoint(
    AVATAR_ENDPOINTS,
    async (endpoint) => {
      await api.patch(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    "Nao foi possivel atualizar o avatar.",
  );
};

export const updatePatientPassword = async (
  payload: UpdateProfilePasswordPayload,
): Promise<void> => {
  await requestPatientEndpoint(
    PASSWORD_ENDPOINTS,
    async (endpoint) => {
      await api.patch(endpoint, {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
      });
    },
    "Nao foi possivel atualizar a senha.",
  );
};
