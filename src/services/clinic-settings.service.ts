import { api } from "../config/api";
import type {
  ClinicSettingsInfoPayload,
  ClinicSettingsNotificationsPayload,
  ClinicSettingsResponse,
  ClinicSettingsSchedulePayload,
  ClinicSettingsSecurityPayload,
} from "../types/clinic";

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return null;
};

export const getClinicSettings = async (): Promise<ClinicSettingsResponse> => {
  const { data } = await api.get<ClinicSettingsResponse | { data: ClinicSettingsResponse }>(
    "/clinics/settings",
  );

  const root = asRecord(data);
  const nestedData = asRecord(root?.data);
  const nestedDataLevel2 = asRecord(nestedData?.data);

  if (nestedDataLevel2) {
    return nestedDataLevel2 as ClinicSettingsResponse;
  }

  if (nestedData) {
    return nestedData as ClinicSettingsResponse;
  }

  return data as ClinicSettingsResponse;
};

export const updateClinicSettingsInfo = async (
  payload: ClinicSettingsInfoPayload,
): Promise<void> => {
  await api.patch("/clinics/settings/info", payload);
};

export const updateClinicSettingsSchedule = async (
  payload: ClinicSettingsSchedulePayload,
): Promise<void> => {
  await api.patch("/clinics/settings/schedule", payload);
};

export const updateClinicSettingsNotifications = async (
  payload: ClinicSettingsNotificationsPayload,
): Promise<void> => {
  await api.patch("/clinics/settings/notifications", payload);
};

export const updateClinicSettingsSecurity = async (
  payload: ClinicSettingsSecurityPayload,
): Promise<void> => {
  await api.patch("/clinics/settings/security", payload);
};
