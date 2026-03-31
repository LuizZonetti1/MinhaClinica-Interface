import { isAxiosError } from "axios";
import { api } from "../config/api";
import type {
  AgendaSlotStatus,
  ProfessionalAgendaDay,
  ProfessionalAppointment,
  ProfessionalDashboardData,
  ProfessionalDashboardSummary,
  ProfessionalMonthlyAgendaData,
} from "../types/dashboard";
import type {
  ApiListPayload,
  DateLike,
  InviteProfessionalPayload,
  InviteProfessionalResponse,
  ProfessionalListItem,
  ProfessionalRegisterCompletePayload,
  ProfessionalRegisterCompleteResponse,
  UpdateProfessionalPayload,
} from "../types/professional";
import { storeAuthToken } from "../utils/authStorage";
import { formatDateToIsoDate } from "../utils/dateParsers";

type ProfessionalApiShape = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string | null;
  status?: string;
  avatarUrl?: string | null;
  lastLoginAt?: DateLike;
  createdAt?: DateLike;
  isActive?: boolean;
  professionalCouncil?: string;
  registrationNumber?: string;
  registrationState?: string;
  specialties?: string[] | null;
  specialty?: string | null;
  appointmentsThisMonth?: number;
  defaultAppointmentDuration?: number;
};

const toDateOrNull = (value: DateLike): Date | null => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};

const toDateOrNow = (value: DateLike): Date => {
  const parsedDate = toDateOrNull(value);
  return parsedDate ?? new Date();
};

const getListItems = <T>(payload: ApiListPayload<T>): T[] => {
  if (Array.isArray(payload)) return payload;
  if ("data" in payload) return payload.data;
  return payload.items;
};

const getWithFallback = async <T>(primaryPath: string, fallbackPath?: string): Promise<T> => {
  try {
    const { data } = await api.get<T>(primaryPath);
    return data;
  } catch (error: unknown) {
    if (fallbackPath && isAxiosError(error) && error.response?.status === 404) {
      const { data } = await api.get<T>(fallbackPath);
      return data;
    }

    throw error;
  }
};

const normalizeSpecialties = (item: ProfessionalApiShape): string[] => {
  if (Array.isArray(item.specialties) && item.specialties.length > 0) {
    return item.specialties.filter(Boolean);
  }

  if (typeof item.specialty === "string" && item.specialty.trim()) {
    return [item.specialty.trim()];
  }

  return [];
};

const mapProfessional = (item: ProfessionalApiShape): ProfessionalListItem => {
  const specialties = normalizeSpecialties(item);
  const status = item.status ?? (item.isActive ? "ACTIVE" : "INACTIVE");

  return {
    id: item.id,
    userId: item.userId ?? item.id,
    name: item.name,
    email: item.email,
    phone: item.phone ?? null,
    status,
    avatarUrl: item.avatarUrl ?? null,
    lastLoginAt: toDateOrNull(item.lastLoginAt),
    createdAt: toDateOrNow(item.createdAt),
    isActive: item.isActive ?? status === "ACTIVE",
    professionalCouncil: item.professionalCouncil ?? "",
    registrationNumber: item.registrationNumber ?? "",
    registrationState: item.registrationState ?? "",
    specialties,
    appointmentsThisMonth: item.appointmentsThisMonth ?? 0,
    defaultAppointmentDuration: item.defaultAppointmentDuration,
    specialty: specialties[0] ?? "",
  };
};

export const listProfessionals = async (): Promise<ProfessionalListItem[]> => {
  const data = await getWithFallback<ApiListPayload<ProfessionalApiShape>>(
    "/professionals",
    "/professionals/professionals",
  );

  return getListItems(data).map(mapProfessional);
};

export const getProfessionalById = async (id: string): Promise<ProfessionalListItem> => {
  const { data } = await api.get<ProfessionalApiShape>(`/professionals/${id}`);
  return mapProfessional(data);
};

export const updateProfessional = async (
  id: string,
  payload: UpdateProfessionalPayload,
): Promise<ProfessionalListItem> => {
  const { data } = await api.patch<ProfessionalApiShape>(`/professionals/${id}`, payload);
  return mapProfessional(data);
};

export const deactivateProfessional = async (id: string): Promise<void> => {
  await api.delete(`/professionals/${id}`);
};

export const inviteProfessional = async (
  payload: InviteProfessionalPayload,
): Promise<InviteProfessionalResponse> => {
  const { data } = await api.post<InviteProfessionalResponse>("/professionals/invite", payload);
  return data;
};

export const professionalRegisterComplete = async (
  payload: ProfessionalRegisterCompletePayload,
): Promise<ProfessionalRegisterCompleteResponse> => {
  const { data } = await api.post<ProfessionalRegisterCompleteResponse>(
    "/professionals/complete",
    payload,
  );

  if (data.accessToken) {
    storeAuthToken(data.accessToken);
  }

  return data;
};

type ApiRecord = Record<string, unknown>;

const toRec = (value: unknown): ApiRecord | null =>
  typeof value === "object" && value !== null ? (value as ApiRecord) : null;

const toStr = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const toDateOnly = (value: unknown): string => {
  const raw = toStr(value, "").trim();
  if (!raw) return "";
  const match = raw.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
};

const toNum = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const readVal = (sources: Array<ApiRecord | null | undefined>, keys: string[]): unknown => {
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

const APPOINTMENT_COLLECTION_KEYS = [
  "appointments",
  "appointmentsToday",
  "agenda",
  "todayAppointments",
  "slots",
  "list",
  "todayList",
  "consultations",
  "consultas",
  "patientsToday",
  "items",
  "data",
];

const extractAppointmentCollection = (value: unknown, depth = 0): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (depth > 3) {
    return [];
  }

  const record = toRec(value);
  if (!record) {
    return [];
  }

  for (const key of APPOINTMENT_COLLECTION_KEYS) {
    const candidate = record[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  for (const key of APPOINTMENT_COLLECTION_KEYS) {
    const nested = extractAppointmentCollection(record[key], depth + 1);
    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

const VALID_SLOT_STATUSES = new Set<AgendaSlotStatus>([
  "SCHEDULED",
  "CONFIRMED",
  "WAITING",
  "IN_PROGRESS",
  "COMPLETED",
  "NO_SHOW",
  "CANCELLED",
]);

const normalizeSlotStatus = (value: unknown): AgendaSlotStatus => {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (VALID_SLOT_STATUSES.has(normalized as AgendaSlotStatus)) {
    return normalized as AgendaSlotStatus;
  }

  if (["DONE", "FINISHED", "CONCLUDED"].includes(normalized)) return "COMPLETED";
  if (["IN_ATTENDANCE", "ATTENDING", "EM_ATENDIMENTO"].includes(normalized)) return "IN_PROGRESS";
  if (["PENDING", "AGUARDANDO", "AWAITING"].includes(normalized)) return "WAITING";
  if (["CANCELED", "CANCELADO"].includes(normalized)) return "CANCELLED";
  if (["CONFIRMED", "CONFIRMADO"].includes(normalized)) return "CONFIRMED";

  return "SCHEDULED";
};

const normalizeProfessionalAppointmentItem = (item: unknown): ProfessionalAppointment | null => {
  const record = toRec(item);
  if (!record) return null;

  const patient = toRec(record.patient);
  const patientUser = toRec(patient?.user);
  const patientPerson = toRec(patient?.person);
  const patientProfile = toRec(patient?.profile);
  const professional = toRec(record.professional);
  const patientSources = [record, patient, patientUser, patientPerson, patientProfile];

  const patientNameRaw =
    readVal(patientSources, [
      "patientName",
      "patient_name",
      "patientFullName",
      "nomePaciente",
      "name",
      "fullName",
      "full_name",
      "displayName",
      "nome",
    ]) ?? (typeof record.patient === "string" ? record.patient : undefined);

  const professionalNameRaw =
    readVal([record], ["professionalName", "doctorName", "providerName", "nomeProfissional"]) ??
    (typeof record.professional === "string"
      ? record.professional
      : readVal([professional], ["name", "fullName"]));

  const appointmentTypeRaw = readVal(
    [record],
    ["appointmentType", "type", "consultationType", "typeName", "kind", "description"],
  );

  const endTimeRaw = readVal([record], ["endTime", "end_time", "scheduledEndTime"]);
  const patientAvatarRaw = readVal(patientSources, [
    "patientAvatarUrl",
    "patientAvatar",
    "avatarUrl",
    "avatar",
    "photoUrl",
    "imageUrl",
  ]);

  const professionalIdRaw =
    readVal([record], ["professionalId"]) ?? readVal([professional], ["id", "_id"]);

  const patientIdRaw =
    readVal([record], ["patientId", "patient_id"]) ??
    readVal([patient], ["id", "_id", "userId", "user_id"]);
  const appointmentIdRaw = readVal([record], ["id", "_id", "appointmentId"]);
  const appointmentDateRaw = readVal([record], ["date", "day", "appointmentDate"]);
  const fallbackId = [
    toStr(
      readVal([record], ["time", "scheduledTime", "startTime", "start_time", "horario"]),
      "--:--",
    ),
    toStr(patientNameRaw, "-"),
    toStr(appointmentTypeRaw, ""),
    toDateOnly(appointmentDateRaw),
  ]
    .join("|")
    .toLowerCase();

  return {
    id: toStr(appointmentIdRaw, fallbackId || `appointment-${Date.now()}`),
    time: toStr(
      readVal([record], ["time", "scheduledTime", "startTime", "start_time", "horario"]),
      "--:--",
    ),
    endTime: typeof endTimeRaw === "string" && endTimeRaw.trim() ? endTimeRaw.trim() : null,
    patientId: typeof patientIdRaw === "string" && patientIdRaw.trim() ? patientIdRaw.trim() : null,
    patientName: toStr(patientNameRaw, "-"),
    patientAvatarUrl:
      typeof patientAvatarRaw === "string" && patientAvatarRaw.trim()
        ? patientAvatarRaw.trim()
        : null,
    professionalName:
      typeof professionalNameRaw === "string" && professionalNameRaw.trim()
        ? professionalNameRaw.trim()
        : null,
    professionalId:
      typeof professionalIdRaw === "string" && professionalIdRaw.trim()
        ? professionalIdRaw.trim()
        : null,
    appointmentType:
      typeof appointmentTypeRaw === "string" && appointmentTypeRaw.trim()
        ? appointmentTypeRaw.trim()
        : null,
    status: normalizeSlotStatus(readVal([record], ["status", "appointmentStatus"])),
  };
};

const getAppointmentIdentity = (appointment: ProfessionalAppointment): string => {
  const patientId = appointment.patientId?.trim();
  const patientName = appointment.patientName.trim().toLowerCase();
  const appointmentType = (appointment.appointmentType ?? "").trim().toLowerCase();

  if (patientId) {
    return `${patientId}|${appointment.time}|${appointmentType}`;
  }

  return `${patientName}|${appointment.time}|${appointmentType}`;
};

const mergeAppointmentLists = (
  primary: ProfessionalAppointment[],
  secondary: ProfessionalAppointment[],
): ProfessionalAppointment[] => {
  const merged = new Map<string, ProfessionalAppointment>();

  for (const appointment of [...primary, ...secondary]) {
    const key = getAppointmentIdentity(appointment);
    if (!merged.has(key)) {
      merged.set(key, appointment);
      continue;
    }

    const current = merged.get(key);
    if (!current) {
      merged.set(key, appointment);
      continue;
    }

    const currentIsScheduled = current.status === "SCHEDULED";
    const nextIsScheduled = appointment.status === "SCHEDULED";
    const shouldReplaceByStatus = currentIsScheduled && !nextIsScheduled;
    const shouldReplaceByAvatar =
      !current.patientAvatarUrl && Boolean(appointment.patientAvatarUrl);

    if (shouldReplaceByStatus || shouldReplaceByAvatar) {
      merged.set(key, appointment);
    }
  }

  return [...merged.values()].sort((left, right) => left.time.localeCompare(right.time));
};

const normalizeProfessionalAppointments = (raw: unknown): ProfessionalAppointment[] => {
  const root = toRec(raw) ?? {};
  const payload = root.data;

  let collection = extractAppointmentCollection(payload);
  if (collection.length === 0) {
    collection = extractAppointmentCollection(root);
  }

  return collection
    .map(normalizeProfessionalAppointmentItem)
    .filter((appointment): appointment is ProfessionalAppointment => appointment !== null);
};

const buildDashboardSummaryFromAppointments = (
  appointments: ProfessionalAppointment[],
): ProfessionalDashboardSummary => ({
  consultasHoje: appointments.length,
  confirmadas: appointments.filter((appointment) => appointment.status === "CONFIRMED").length,
  pacientesDoMes: new Set(
    appointments
      .map((appointment) => appointment.patientName.trim())
      .filter((patientName) => patientName && patientName !== "-"),
  ).size,
});

const mergeDashboardSummary = (
  base: ProfessionalDashboardSummary,
  appointments: ProfessionalAppointment[],
): ProfessionalDashboardSummary => {
  if (appointments.length === 0) {
    return base;
  }

  const derived = buildDashboardSummaryFromAppointments(appointments);
  return {
    consultasHoje: derived.consultasHoje,
    confirmadas: derived.confirmadas,
    pacientesDoMes: Math.max(base.pacientesDoMes, derived.pacientesDoMes),
  };
};

const normalizeProfessionalDashboard = (raw: unknown): ProfessionalDashboardData => {
  if (Array.isArray(raw)) {
    const appointments = raw
      .map(normalizeProfessionalAppointmentItem)
      .filter((appointment): appointment is ProfessionalAppointment => appointment !== null);

    return {
      summary: buildDashboardSummaryFromAppointments(appointments),
      appointments,
    };
  }

  const root = toRec(raw) ?? {};
  const payload = Array.isArray(root.data) ? null : (toRec(root.data) ?? root);
  const summarySources = [
    toRec(payload?.summary),
    toRec(payload?.stats),
    toRec(payload?.overview),
    payload,
    root,
  ];

  const summary: ProfessionalDashboardSummary = {
    consultasHoje: toNum(
      readVal(summarySources, [
        "consultasHoje",
        "consultationsToday",
        "appointmentsToday",
        "todayAppointments",
      ]),
    ),
    confirmadas: toNum(
      readVal(summarySources, [
        "confirmadas",
        "confirmed",
        "confirmedToday",
        "confirmedAppointments",
      ]),
    ),
    pacientesDoMes: toNum(
      readVal(summarySources, [
        "pacientesDoMes",
        "patientsThisMonth",
        "monthlyPatients",
        "uniquePatients",
      ]),
    ),
  };

  const appointments = normalizeProfessionalAppointments(raw);
  return { summary, appointments };
};

const PROFESSIONAL_DASHBOARD_ENDPOINTS = [
  "/professionals/me/dashboard",
  "/professional/me/dashboard",
];

const PROFESSIONAL_AGENDA_ENDPOINTS = ["/professionals/me/agenda", "/professional/me/agenda"];

const toIsoDate = (date: Date): string => formatDateToIsoDate(date);

const toMonthKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const readResponseDate = (raw: unknown): string | null => {
  if (Array.isArray(raw)) return null;

  const root = toRec(raw) ?? {};
  const payload = Array.isArray(root.data) ? null : (toRec(root.data) ?? root);
  const value = readVal([payload, root], ["date", "referenceDate", "day"]);

  const normalized = toDateOnly(value);
  return normalized || null;
};

const getFromFallbackEndpoints = async <T>(
  endpoints: string[],
  params?: Record<string, string>,
): Promise<T> => {
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const { data } = await api.get<T>(endpoint, params ? { params } : undefined);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel carregar os dados do profissional.");
};

const getCalendarAppointmentsByDate = async (date: string): Promise<ProfessionalAppointment[]> => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return [];
  }

  const referenceMonth = date.slice(0, 7);

  try {
    const { data } = await api.get<unknown>("/appointments/calendar");
    const normalizedCalendarData = normalizeCalendarMonthResponse(data, referenceMonth);
    return normalizedCalendarData.days.find((day) => day.date === date)?.appointments ?? [];
  } catch {
    return [];
  }
};

export const getProfessionalTodayAppointments = async (): Promise<ProfessionalAppointment[]> => {
  const today = toIsoDate(new Date());

  try {
    const calendarAppointments = await getCalendarAppointmentsByDate(today);
    if (calendarAppointments.length > 0) {
      return calendarAppointments;
    }
  } catch {
    // fallback below
  }

  try {
    return await getProfessionalAgenda(today);
  } catch {
    return [];
  }
};

export const getProfessionalDashboard = async (): Promise<ProfessionalDashboardData> => {
  const today = toIsoDate(new Date());
  let normalizedDashboard: ProfessionalDashboardData | null = null;
  let responseDate = today;

  try {
    const dashboardRaw = await getFromFallbackEndpoints<unknown>(PROFESSIONAL_DASHBOARD_ENDPOINTS);
    normalizedDashboard = normalizeProfessionalDashboard(dashboardRaw);
    responseDate = readResponseDate(dashboardRaw) ?? today;
  } catch (error: unknown) {
    if (!(isAxiosError(error) && error.response?.status === 404)) {
      throw error;
    }
  }

  let appointments: ProfessionalAppointment[] = [];

  try {
    appointments = await getCalendarAppointmentsByDate(responseDate);
  } catch {
    appointments = [];
  }

  if (appointments.length === 0) {
    try {
      appointments = await getProfessionalAgenda(responseDate);
    } catch {
      appointments = [];
    }
  }

  if (appointments.length === 0 && responseDate !== today) {
    try {
      appointments = await getCalendarAppointmentsByDate(today);
    } catch {
      appointments = [];
    }
  }

  if (appointments.length === 0 && responseDate !== today) {
    try {
      appointments = await getProfessionalAgenda(today);
    } catch {
      appointments = [];
    }
  }

  if (appointments.length === 0 && normalizedDashboard?.appointments.length) {
    appointments = normalizedDashboard.appointments;
  }

  if (!normalizedDashboard) {
    return {
      summary: buildDashboardSummaryFromAppointments(appointments),
      appointments,
    };
  }

  return {
    summary: mergeDashboardSummary(normalizedDashboard.summary, appointments),
    appointments,
  };
};

export const getProfessionalAgenda = async (date: string): Promise<ProfessionalAppointment[]> => {
  const agendaRaw = await getFromFallbackEndpoints<unknown>(PROFESSIONAL_AGENDA_ENDPOINTS, {
    date,
  });
  return normalizeProfessionalAppointments(agendaRaw);
};

const getMonthDateRange = (referenceMonth: string): { startDate: Date; endDate: Date } => {
  const [yearRaw, monthRaw] = referenceMonth.split("-");
  const year = Number(yearRaw);
  const monthIndex = Number(monthRaw) - 1;

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(monthIndex) ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
    throw new Error("Mes de referencia invalido.");
  }

  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);

  return { startDate, endDate };
};

const buildMonthDays = (startDate: Date, endDate: Date): Date[] => {
  const days: Date[] = [];

  for (let cursor = new Date(startDate); cursor <= endDate; cursor.setDate(cursor.getDate() + 1)) {
    days.push(new Date(cursor));
  }

  return days;
};

const buildProfessionalAgendaDay = (
  date: string,
  appointments: ProfessionalAppointment[],
): ProfessionalAgendaDay => ({
  date,
  appointments,
  totalAppointments: appointments.length,
  confirmedAppointments: appointments.filter((appointment) => appointment.status === "CONFIRMED")
    .length,
  completedAppointments: appointments.filter((appointment) => appointment.status === "COMPLETED")
    .length,
  hasAppointments: appointments.length > 0,
});

const buildProfessionalMonthlySummary = (days: ProfessionalAgendaDay[]) => {
  const uniquePatients = new Set(
    days.flatMap((day) =>
      day.appointments
        .map((appointment) => appointment.patientName.trim())
        .filter((patientName) => patientName && patientName !== "-"),
    ),
  );

  return {
    appointmentsCount: days.reduce((total, day) => total + day.totalAppointments, 0),
    confirmedCount: days.reduce((total, day) => total + day.confirmedAppointments, 0),
    completedCount: days.reduce((total, day) => total + day.completedAppointments, 0),
    daysWithAppointments: days.filter((day) => day.hasAppointments).length,
    patientsCount: uniquePatients.size,
  };
};

const orderAgendaDaysForList = (
  days: ProfessionalAgendaDay[],
  referenceMonth: string,
): ProfessionalAgendaDay[] => {
  const sortedDays = [...days].sort((left, right) => left.date.localeCompare(right.date));
  const today = toIsoDate(new Date());

  if (!today.startsWith(`${referenceMonth}-`)) {
    return [...sortedDays].sort((left, right) => right.date.localeCompare(left.date));
  }

  const currentAndFutureDays = sortedDays.filter((day) => day.date >= today);
  const pastDays = sortedDays
    .filter((day) => day.date < today)
    .sort((left, right) => right.date.localeCompare(left.date));

  return [...currentAndFutureDays, ...pastDays];
};

const buildProfessionalMonthlyAgendaData = (
  referenceMonth: string,
  days: ProfessionalAgendaDay[],
): ProfessionalMonthlyAgendaData => {
  const { startDate, endDate } = getMonthDateRange(referenceMonth);
  const orderedDays = orderAgendaDaysForList(days, referenceMonth);

  return {
    referenceMonth,
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
    days: orderedDays,
    summary: buildProfessionalMonthlySummary(orderedDays),
  };
};

const replaceAgendaDay = (
  agendaData: ProfessionalMonthlyAgendaData,
  nextDay: ProfessionalAgendaDay,
): ProfessionalMonthlyAgendaData =>
  buildProfessionalMonthlyAgendaData(
    agendaData.referenceMonth,
    agendaData.days.map((day) => (day.date === nextDay.date ? nextDay : day)),
  );

const normalizeCalendarMonthResponse = (
  raw: unknown,
  referenceMonth: string,
): ProfessionalMonthlyAgendaData => {
  const { startDate, endDate } = getMonthDateRange(referenceMonth);
  const monthDays = buildMonthDays(startDate, endDate);
  const root = toRec(raw) ?? {};
  const payload = Array.isArray(root.data) ? null : (toRec(root.data) ?? root);
  const rawDays =
    (Array.isArray(root.data) ? root.data : null) ??
    readVal([payload, root], ["days", "items", "data"]);

  const dayMap = new Map<string, ProfessionalAgendaDay>();

  if (Array.isArray(rawDays)) {
    for (const item of rawDays) {
      const dayRecord = toRec(item);
      if (!dayRecord) continue;

      const date = toDateOnly(readVal([dayRecord], ["date", "day"]));
      if (!date || !date.startsWith(`${referenceMonth}-`)) continue;

      const appointmentsRaw = readVal([dayRecord], ["appointments", "items", "data"]);
      const appointments = Array.isArray(appointmentsRaw)
        ? appointmentsRaw
            .map(normalizeProfessionalAppointmentItem)
            .filter((appointment): appointment is ProfessionalAppointment => appointment !== null)
        : [];

      dayMap.set(date, buildProfessionalAgendaDay(date, appointments));
    }
  }

  const monthAgendaDays = monthDays.map((day) => {
    const date = toIsoDate(day);
    return dayMap.get(date) ?? buildProfessionalAgendaDay(date, []);
  });

  return buildProfessionalMonthlyAgendaData(referenceMonth, monthAgendaDays);
};

const getProfessionalMonthlyAgendaFromDailyEndpoints = async (
  referenceMonth: string,
): Promise<ProfessionalMonthlyAgendaData> => {
  const { startDate, endDate } = getMonthDateRange(referenceMonth);
  const monthDays = buildMonthDays(startDate, endDate);
  const dayResults = await Promise.all(
    monthDays.map(async (day) => {
      const date = toIsoDate(day);
      const appointments = await getProfessionalAgenda(date);
      return buildProfessionalAgendaDay(date, appointments);
    }),
  );

  return buildProfessionalMonthlyAgendaData(referenceMonth, dayResults);
};

export const getProfessionalMonthlyAgenda = async (
  referenceMonth: string,
): Promise<ProfessionalMonthlyAgendaData> => {
  const today = toIsoDate(new Date());
  const isCurrentMonth = referenceMonth === toMonthKey(new Date());

  try {
    const { data } = await api.get<unknown>("/appointments/calendar");
    const normalizedCalendarData = normalizeCalendarMonthResponse(data, referenceMonth);

    if (!isCurrentMonth) {
      return normalizedCalendarData;
    }

    const todayCalendarDay = normalizedCalendarData.days.find((day) => day.date === today);

    try {
      const todayAppointments = await getProfessionalAgenda(today);
      const mergedTodayAppointments = mergeAppointmentLists(
        todayCalendarDay?.appointments ?? [],
        todayAppointments,
      );

      const todayAgendaDay = buildProfessionalAgendaDay(today, mergedTodayAppointments);
      return replaceAgendaDay(normalizedCalendarData, todayAgendaDay);
    } catch {
      return normalizedCalendarData;
    }
  } catch (error: unknown) {
    if (!(isAxiosError(error) && error.response?.status === 404)) {
      throw error;
    }
  }

  return getProfessionalMonthlyAgendaFromDailyEndpoints(referenceMonth);
};
