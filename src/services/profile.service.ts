import { api } from "../config/api";
import type {
  ProfileData,
  UpdateProfilePasswordPayload,
  UpdateProfilePayload,
  UserMeResponse,
} from "../types/profile";
import type { UserRole } from "../types/enums";

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) return value as Record<string, unknown>;
  return null;
};

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
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const readNumber = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
  fallback = 0,
): number => {
  const value = readValue(sources, keys);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
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
    if (["1", "true", "yes", "sim", "on", "enabled", "ativo", "active"].includes(normalized)) {
      return true;
    }
    if (
      ["0", "false", "no", "nao", "off", "disabled", "inativo", "inactive"].includes(normalized)
    ) {
      return false;
    }
  }
  return null;
};

const asTwoFactorLabel = (value: boolean | null): string => {
  if (value === null) return "-";
  return value ? "Ativado" : "Desativado";
};

const asSessionLabel = (value: boolean | null): string => {
  if (value === null) return "-";
  return value ? "Ativa" : "Inativa";
};

const asCurrency = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  if (typeof value === "string") return value;
  return "-";
};

const normalizeUserMeResponse = (response: UserMeResponse): ProfileData => {
  const root = asRecord(response) ?? {};
  const payload = asRecord(root.data) ?? asRecord(root.staff) ?? asRecord(root.user) ?? root;

  const personal = asRecord(payload.personal) ?? asRecord(payload.user) ?? asRecord(payload.staff);
  const clinic = asRecord(payload.clinic);
  const access =
    asRecord(payload.accessPermissions) ??
    asRecord(payload.access) ??
    asRecord(payload.permissions);
  const statistics = asRecord(payload.statistics) ?? asRecord(payload.stats);

  const personalSources = [personal, payload, root];
  const clinicSources = [clinic, payload, root];
  const accessSources = [access, payload, root];
  const statsSources = [statistics, payload, root];

  const twoFactorBoolean = readBoolean(accessSources, [
    "twoFactorEnabled",
    "twoFactor",
    "mfaEnabled",
    "enable2FA",
  ]);
  const sessionBoolean = readBoolean(accessSources, [
    "activeSession",
    "hasActiveSession",
    "sessionActive",
  ]);

  return {
    fullName: readString(personalSources, ["name", "fullName", "displayName"], "-"),
    email: readString(personalSources, ["email"], "-"),
    phone: readString(personalSources, ["phone"], "-"),
    address: readString(personalSources, ["address", "fullAddress"], "-"),
    city: readString(personalSources, ["city", "cidade"], "-"),
    state: readString(personalSources, ["state", "estado", "uf"], "-"),
    avatarUrl: readString(personalSources, ["avatarUrl", "avatar", "photoUrl"], ""),

    clinicName: readString(clinicSources, ["clinicName", "name", "tradeName"], "-"),
    clinicRole: readString(
      clinicSources,
      ["clinicRole", "role", "position", "specialty", "specialization", "especialidade"],
      "-",
    ),
    foundedAt: readString(clinicSources, ["foundedAt", "foundationDate", "createdAt"], "-"),
    totalProfessionals: readNumber(clinicSources, ["totalProfessionals", "professionalsCount"], 0),

    accessLevel: readString(accessSources, ["accessLevel", "role", "permissionLevel"], "-"),
    lastAccess: readString(accessSources, ["lastAccess", "lastLogin", "lastAccessAt"], "-"),
    twoFactor:
      readString(accessSources, ["twoFactorLabel"], "").trim() ||
      asTwoFactorLabel(twoFactorBoolean),
    activeSession:
      readString(accessSources, ["activeSessionLabel"], "").trim() ||
      asSessionLabel(sessionBoolean),

    totalPatients: readNumber(statsSources, ["totalPatients", "patientsCount"], 0),
    activeProfessionals: readNumber(statsSources, ["activeProfessionals"], 0),
    appointmentsThisMonth: readNumber(
      statsSources,
      ["appointmentsThisMonth", "consultationsThisMonth"],
      0,
    ),
    revenueCurrentMonth: asCurrency(
      readValue(statsSources, ["revenueCurrentMonth", "currentMonthRevenue", "monthlyBalance"]),
    ),
  };
};

// GET /api/staff/me
export const getProfile = async (): Promise<ProfileData> => {
  const { data } = await api.get<UserMeResponse>("/staff/me");
  return normalizeUserMeResponse(data);
};

// PATCH /api/staff/me
export const updateProfile = async (payload: UpdateProfilePayload): Promise<ProfileData> => {
  const hasName = typeof payload.name === "string";
  const hasPhone = typeof payload.phone === "string";
  const hasAvatar = payload.avatarFile instanceof File;

  if (!hasName && !hasPhone && !hasAvatar) {
    return getProfile();
  }

  let data: UserMeResponse | undefined;

  if (hasAvatar) {
    const formData = new FormData();
    if (hasName) formData.append("name", payload.name!.trim());
    if (hasPhone) formData.append("phone", payload.phone!.trim());
    formData.append("avatar", payload.avatarFile!, payload.avatarFile!.name);

    const response = await api.patch<UserMeResponse | undefined>("/staff/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    data = response.data;
  } else {
    const requestData: Record<string, string> = {};
    if (hasName) requestData.name = payload.name!.trim();
    if (hasPhone) requestData.phone = payload.phone!.trim();

    const response = await api.patch<UserMeResponse | undefined>("/staff/me", requestData);
    data = response.data;
  }

  if (data && typeof data === "object") {
    return normalizeUserMeResponse(data);
  }

  return getProfile();
};

// PATCH /api/staff/me/password
export const updateProfilePassword = async (
  payload: UpdateProfilePasswordPayload,
): Promise<void> => {
  await api.patch("/staff/me/password", {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });
};

// PATCH /api/staff/me/roles
export const updateUserRoles = async (roles: UserRole[]): Promise<{ token: string; roles: UserRole[] }> => {
  const response = await api.patch<{ token: string; roles: UserRole[]; message: string }>("/staff/me/roles", { roles });
  return { token: response.data.token, roles: response.data.roles };
};
