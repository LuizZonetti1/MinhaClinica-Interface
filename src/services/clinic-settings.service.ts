import { api } from "../config/api";
import type {
  ClinicSettingsInfoPayload,
  ClinicSettingsNotificationsPayload,
  ClinicSettingsResponse,
  ClinicSettingsSchedulePayload,
  ClinicSettingsSecurityPayload,
} from "../types/clinic";

export const getClinicSettings = async (): Promise<ClinicSettingsResponse> => {
  const { data } = await api.get<ClinicSettingsResponse>("/clinics/settings");
  return data;
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

