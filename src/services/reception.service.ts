import { isAxiosError } from "axios";
import { api } from "../config/api";
import type {
  AgendaProfessional,
  AgendaSlot,
  AgendaSlotStatus,
  AgendasResponse,
  AppointmentStatus,
  AppointmentStatusUpdate,
  ReceptionDashboardData,
  TodayAppointmentItem,
} from "../types/dashboard";
import type { RegisterPatientByReceptionPayload } from "../types/patient";
import type {
  ApiListPayload,
  DateLike,
  InviteStaffPayload,
  InviteStaffResponse,
  ReceptionistListItem,
  StaffRegisterCompletePayload,
  StaffRegisterCompleteResponse,
  UpdateReceptionistPayload,
} from "../types/professional";
import type {
  ReceptionProfileData,
  UpdateProfilePasswordPayload,
  UpdateProfilePayload,
} from "../types/profile";
import { storeAuthToken } from "../utils/authStorage";
import { formatDateToIsoDate } from "../utils/dateParsers";
import { hasTimeElapsedToday } from "../utils/timeParsers";

type ReceptionApiShape = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status?: string;
  role?: string;
  avatarUrl?: string | null;
  lastLoginAt?: DateLike;
  createdAt?: DateLike;
  appointmentsThisMonth?: number;
  isActive?: boolean;
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

const patchWithFallback = async <T>(
  primaryPath: string,
  payload: unknown,
  fallbackPath?: string,
): Promise<T> => {
  try {
    const { data } = await api.patch<T>(primaryPath, payload);
    return data;
  } catch (error: unknown) {
    if (fallbackPath && isAxiosError(error) && error.response?.status === 404) {
      const { data } = await api.patch<T>(fallbackPath, payload);
      return data;
    }

    throw error;
  }
};

const deleteWithFallback = async (primaryPath: string, fallbackPath?: string): Promise<void> => {
  try {
    await api.delete(primaryPath);
  } catch (error: unknown) {
    if (fallbackPath && isAxiosError(error) && error.response?.status === 404) {
      await api.delete(fallbackPath);
      return;
    }

    throw error;
  }
};

const mapReceptionist = (item: ReceptionApiShape): ReceptionistListItem => {
  const status = item.status ?? (item.isActive ? "ACTIVE" : "INACTIVE");

  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone ?? null,
    status,
    role: item.role ?? "RECEPTIONIST",
    avatarUrl: item.avatarUrl ?? null,
    lastLoginAt: toDateOrNull(item.lastLoginAt),
    createdAt: toDateOrNow(item.createdAt),
    appointmentsThisMonth: item.appointmentsThisMonth ?? 0,
    isActive: item.isActive ?? status === "ACTIVE",
  };
};

// GET /api/reception
export const listReceptionists = async (): Promise<ReceptionistListItem[]> => {
  const data = await getWithFallback<ApiListPayload<ReceptionApiShape>>(
    "/reception",
    "/staff/receptionists",
  );

  return getListItems(data).map(mapReceptionist);
};

// GET /api/reception/:id
export const getReceptionistById = async (id: string): Promise<ReceptionistListItem> => {
  const data = await getWithFallback<ReceptionApiShape>(
    `/reception/${id}`,
    `/staff/receptionists/${id}`,
  );

  return mapReceptionist(data);
};

// PATCH /api/reception/:id
export const updateReceptionist = async (
  id: string,
  payload: UpdateReceptionistPayload,
): Promise<ReceptionistListItem> => {
  const data = await patchWithFallback<ReceptionApiShape>(
    `/reception/${id}`,
    payload,
    `/staff/receptionists/${id}`,
  );

  return mapReceptionist(data);
};

// DELETE /api/reception/:id
export const deactivateReceptionist = async (id: string): Promise<void> => {
  await deleteWithFallback(`/reception/${id}`, `/staff/receptionists/${id}`);
};

// POST /api/staff/invite
export const inviteStaff = async (payload: InviteStaffPayload): Promise<InviteStaffResponse> => {
  const { data } = await api.post<InviteStaffResponse>("/staff/invite", payload);
  return data;
};

// POST /api/staff/complete
export const receptionRegisterComplete = async (
  payload: StaffRegisterCompletePayload,
): Promise<StaffRegisterCompleteResponse> => {
  const { data } = await api.post<StaffRegisterCompleteResponse>("/staff/complete", payload);

  if (data.accessToken) {
    storeAuthToken(data.accessToken);
  }

  return data;
};

// ─── Reception Dashboard ─────────────────────────────────────────────────────

const toNum = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const p = Number(v.trim());
    if (Number.isFinite(p)) return p;
  }
  return 0;
};

const toStr = (v: unknown, fallback = ""): string => {
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return fallback;
};

const toRec = (v: unknown): Record<string, unknown> | null =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;

const readValue = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): unknown => {
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

const readNumOptional = (
  record: Record<string, unknown> | null | undefined,
  keys: string[],
): number | undefined => {
  if (!record) return undefined;

  for (const key of keys) {
    if (!(key in record)) continue;
    const value = record[key];
    if (value === null || value === undefined || value === "") continue;
    return toNum(value);
  }

  return undefined;
};

const readArrayOptional = (
  record: Record<string, unknown> | null | undefined,
  keys: string[],
): unknown[] | undefined => {
  if (!record) return undefined;

  for (const key of keys) {
    if (!(key in record)) continue;
    const value = record[key];
    if (Array.isArray(value)) return value;
  }

  return undefined;
};

const readNumFromSources = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
  fallback: number,
): number => {
  for (const source of sources) {
    const found = readNumOptional(source, keys);
    if (found !== undefined) return found;
  }

  return fallback;
};

const readArrayFromSources = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): unknown[] => {
  for (const source of sources) {
    const found = readArrayOptional(source, keys);
    if (found) return found;
  }

  return [];
};

const normalizeStatus = (v: unknown): AppointmentStatus => {
  const raw = String(v ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  const status = raw.replace(/[\s-]+/g, "_");

  if (
    ["CHECKED_IN", "CHECKEDIN", "CHECKIN", "PRESENT", "PRESENTE", "ARRIVED", "CHEGOU"].includes(
      status,
    )
  ) {
    return "CHECKED_IN";
  }

  if (
    ["IN_PROGRESS", "IN_ATTENDANCE", "ATTENDING", "EM_ATENDIMENTO", "ATENDIMENTO"].includes(status)
  ) {
    return "IN_PROGRESS";
  }

  if (["DONE", "COMPLETED", "FINISHED", "CONCLUDED", "CONCLUIDO", "FINALIZADO"].includes(status)) {
    return "DONE";
  }

  if (
    [
      "CANCELLED",
      "CANCELED",
      "CANCELADO",
      "NO_SHOW",
      "NOSHOW",
      "RESCHEDULED",
      "RE_SCHEDULED",
      "REMARCADO",
      "FALTOSO",
    ].includes(status)
  ) {
    return "CANCELLED";
  }

  if (
    [
      "WAITING",
      "PENDING",
      "SCHEDULED",
      "CONFIRMED",
      "AGUARDANDO",
      "AGUARADANDO",
      "AGENDADO",
      "PENDENTE",
      "WAITING_CHECKIN",
      "PENDING_CHECKIN",
      "EM_ESPERA",
    ].includes(status)
  ) {
    return "WAITING";
  }

  const valid: AppointmentStatus[] = ["WAITING", "CHECKED_IN", "IN_PROGRESS", "DONE", "CANCELLED"];
  return valid.includes(status as AppointmentStatus) ? (status as AppointmentStatus) : "WAITING";
};

const toStatusToken = (v: unknown): string =>
  String(v ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

const hasNoShowWindowElapsed = (appointmentTime: string): boolean => {
  return hasTimeElapsedToday(appointmentTime, {
    graceMinutes: 30,
    parseTimeOptions: {
      allowSingleDigitHour: true,
      looseMatch: true,
    },
    invalidTimeReturns: true,
  });
};

const readAppointmentType = (
  sources: Array<Record<string, unknown> | null | undefined>,
): string | null => {
  const direct = readValue(sources, [
    "appointmentType",
    "appointment_type",
    "consultationType",
    "consultation_type",
    "type",
    "appointmentTypeName",
    "appointment_type_name",
    "typeName",
    "type_name",
    "kind",
    "modalidade",
    "label",
  ]);

  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const nested = toRec(readValue(sources, ["appointmentType", "type", "consultationType"]));
  if (nested) {
    const nestedDirect = readValue([nested], ["name", "label", "value", "type"]);
    if (typeof nestedDirect === "string" && nestedDirect.trim()) return nestedDirect.trim();
  }

  return null;
};

const normalizeAppointment = (item: unknown): TodayAppointmentItem | null => {
  const r = toRec(item);
  if (!r) return null;

  const patient = toRec(r.patient);
  const professional = toRec(r.professional) ?? toRec(r.doctor);
  const appointment = toRec(r.appointment) ?? toRec(r.consultation) ?? toRec(r.schedule);
  const sources = [r, patient, professional];
  const rawStatus = readValue(sources, [
    "status",
    "appointmentStatus",
    "checkinStatus",
    "attendanceStatus",
  ]);
  const rawStatusToken = toStatusToken(rawStatus);
  const time = toStr(
    readValue(sources, [
      "time",
      "scheduledTime",
      "appointmentTime",
      "startAt",
      "startTime",
      "start_time",
      "hour",
      "appointmentHour",
      "horario",
    ]),
    "--:--",
  );

  let normalizedStatus = normalizeStatus(rawStatus);

  // NO_SHOW so deve acontecer quando a janela de 30 minutos apos o horario ja passou.
  if (["NO_SHOW", "NOSHOW"].includes(rawStatusToken) && !hasNoShowWindowElapsed(time)) {
    normalizedStatus = "WAITING";
  }

  const avatarRaw = readValue(
    [r, patient],
    ["avatarUrl", "avatar", "photoUrl", "patientAvatarUrl", "patientAvatar"],
  );
  const typeRaw = readAppointmentType([r, appointment]);

  return {
    id: toStr(
      readValue(sources, ["id", "_id", "appointmentId", "consultationId", "scheduleId"]),
      String(Math.random()),
    ),
    time,
    patientName: toStr(
      readValue(sources, [
        "patientName",
        "patientFullName",
        "patient",
        "name",
        "nomePaciente",
        "patient_name",
      ]),
      "—",
    ),
    doctorName: toStr(
      readValue(sources, [
        "doctorName",
        "professionalName",
        "professional",
        "doctor",
        "providerName",
        "name",
        "nomeProfissional",
        "doctor_name",
      ]),
      "—",
    ),
    status: normalizedStatus,
    avatarUrl: typeof avatarRaw === "string" && avatarRaw.trim() ? avatarRaw : null,
    appointmentType: typeRaw,
  };
};

const enrichWithDashboardFallback = async (
  dashboard: ReceptionDashboardData,
): Promise<ReceptionDashboardData> => {
  if (dashboard.summary.consultationsToday > 0 || dashboard.appointments.length > 0) {
    return dashboard;
  }

  try {
    const { data } = await api.get<unknown>("/dashboard");
    const root = toRec(data) ?? {};
    const payload = toRec(root.data) ?? root;
    const summarySources: Array<Record<string, unknown> | null | undefined> = [
      toRec(payload.summary),
      toRec(payload.overview),
      payload,
      toRec(root.summary),
      toRec(root.overview),
      root,
    ];

    const consultationsToday = readNumFromSources(
      summarySources,
      [
        "appointmentsToday",
        "consultationsToday",
        "todayAppointments",
        "totalAppointmentsToday",
        "todayConsultations",
        "consultasHoje",
        "totalConsultasHoje",
      ],
      0,
    );

    if (consultationsToday <= 0) return dashboard;

    return {
      ...dashboard,
      summary: {
        ...dashboard.summary,
        consultationsToday,
      },
    };
  } catch {
    return dashboard;
  }
};

const normalizeReceptionDashboard = (raw: unknown): ReceptionDashboardData => {
  const root = toRec(raw) ?? {};
  const payload = toRec(root.data) ?? toRec(root.result) ?? root;
  const payloadToday = toRec(payload.today);
  const payloadDashboard = toRec(payload.dashboard);
  const payloadMetrics = toRec(payload.metrics);
  const payloadStats = toRec(payload.stats);

  const summarySources: Array<Record<string, unknown> | null | undefined> = [
    toRec(payload.summary),
    toRec(payload.counters),
    toRec(payload.todayCounters),
    toRec(payload.counts),
    toRec(payload.overview),
    toRec(payload.kpis),
    payloadToday,
    payloadDashboard,
    payloadMetrics,
    payloadStats,
    payload,
    toRec(root.summary),
    toRec(root.counters),
    toRec(root.todayCounters),
    toRec(root.counts),
    toRec(root.overview),
    toRec(root.kpis),
    root,
  ];

  const appointmentsRaw = readArrayFromSources(
    [payloadToday, payloadDashboard, payloadMetrics, payloadStats, payload, root],
    [
      "appointments",
      "todayAppointments",
      "appointmentsToday",
      "appointmentList",
      "todayList",
      "schedule",
      "agenda",
      "patientsToday",
      "consultations",
      "consultas",
      "items",
      "data",
      "list",
    ],
  );

  const appointments = appointmentsRaw
    .map(normalizeAppointment)
    .filter((a): a is TodayAppointmentItem => a !== null);

  const derivedSummary = {
    consultationsToday: appointments.length,
    awaitingCheckin: appointments.filter((item) => item.status === "WAITING").length,
    checkinsDone: appointments.filter(
      (item) =>
        item.status === "CHECKED_IN" || item.status === "IN_PROGRESS" || item.status === "DONE",
    ).length,
    pendingConfirmations: appointments.filter((item) => item.status === "WAITING").length,
  };

  const summary = {
    consultationsToday: readNumFromSources(
      summarySources,
      [
        "consultationsToday",
        "appointmentsToday",
        "todayAppointments",
        "totalConsultations",
        "totalAppointmentsToday",
        "todayConsultations",
        "todayConsultationsCount",
        "consultasHoje",
        "consultas_hoje",
        "totalConsultasHoje",
        "quantidadeConsultasHoje",
        "consultasNoDia",
        "consultasDia",
        "consultations",
        "consultas",
      ],
      derivedSummary.consultationsToday,
    ),
    awaitingCheckin: readNumFromSources(
      summarySources,
      [
        "awaitingCheckin",
        "pendingCheckin",
        "awaitingCheckIn",
        "checkinsPending",
        "waitingCheckin",
        "checkinPending",
        "awaiting_checkin",
        "aguardandoCheckin",
        "aguardando_checkin",
        "aguardandoChegada",
        "pendentesCheckin",
      ],
      derivedSummary.awaitingCheckin,
    ),
    checkinsDone: readNumFromSources(
      summarySources,
      [
        "checkinsDone",
        "completedCheckins",
        "checkedIn",
        "todayCheckinsDone",
        "checkinsCompleted",
        "totalCheckinsToday",
        "checkinsHoje",
        "checkinsRealizados",
        "checkins_realizados",
      ],
      derivedSummary.checkinsDone,
    ),
    pendingConfirmations: readNumFromSources(
      summarySources,
      [
        "pendingConfirmations",
        "confirmationsPending",
        "confirmationPending",
        "awaitingConfirmations",
        "pendingConfirmation",
        "confirmationsToDo",
        "confirmacoesPendentes",
        "confirmacoes_pendentes",
        "pendentesConfirmacao",
      ],
      derivedSummary.pendingConfirmations,
    ),
  };

  // Evita UI inconsistente quando o backend devolve resumo zerado
  // mas a lista de appointments traz itens validos.
  if (summary.consultationsToday === 0 && derivedSummary.consultationsToday > 0) {
    summary.consultationsToday = derivedSummary.consultationsToday;
  }
  if (summary.awaitingCheckin === 0 && derivedSummary.awaitingCheckin > 0) {
    summary.awaitingCheckin = derivedSummary.awaitingCheckin;
  }
  if (summary.checkinsDone === 0 && derivedSummary.checkinsDone > 0) {
    summary.checkinsDone = derivedSummary.checkinsDone;
  }
  if (summary.pendingConfirmations === 0 && derivedSummary.pendingConfirmations > 0) {
    summary.pendingConfirmations = derivedSummary.pendingConfirmations;
  }

  return { summary, appointments };
};

export const getReceptionDashboard = async (): Promise<ReceptionDashboardData> => {
  const endpoints: Array<{ path: string; params?: Record<string, string> }> = [
    // Usa a data padrao do backend (America/Sao_Paulo) para evitar divergencia de parsing em query-string.
    { path: "/reception/appointments/today" },
    { path: "/reception/dashboard" },
    { path: "/staff/reception/dashboard" },
    { path: "/staff/receptionists/dashboard" },
    { path: "/dashboard/reception" },
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const { data } = await api.get<unknown>(
        endpoint.path,
        endpoint.params ? { params: endpoint.params } : undefined,
      );
      const normalized = normalizeReceptionDashboard(data);
      return await enrichWithDashboardFallback(normalized);
    } catch (error: unknown) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  // Fallback para manter pelo menos o contador "Consultas Hoje"
  // quando a rota dedicada da recepção não estiver liberada.
  try {
    const { data } = await api.get<unknown>("/dashboard");
    const root = toRec(data) ?? {};
    const payload = toRec(root.data) ?? root;
    const summarySources: Array<Record<string, unknown> | null | undefined> = [
      toRec(payload.summary),
      toRec(payload.overview),
      payload,
      toRec(root.summary),
      toRec(root.overview),
      root,
    ];
    const consultationsToday = readNumFromSources(
      summarySources,
      [
        "appointmentsToday",
        "consultationsToday",
        "todayAppointments",
        "totalAppointmentsToday",
        "todayConsultations",
        "consultasHoje",
        "totalConsultasHoje",
      ],
      0,
    );

    return {
      summary: {
        consultationsToday,
        awaitingCheckin: 0,
        checkinsDone: 0,
        pendingConfirmations: 0,
      },
      appointments: [],
    };
  } catch {
    throw lastError ?? new Error("Nao foi possivel carregar o dashboard da recepcao.");
  }
};

export const getReceptionTodayAppointments = async (): Promise<ReceptionDashboardData> => {
  const localDate = formatDateToIsoDate(new Date());

  const endpoints: Array<{ path: string; params?: Record<string, string> }> = [
    { path: "/reception/appointments/today" },
    { path: "/reception/appointments/today", params: { date: localDate } },
    { path: "/reception/dashboard/appointments/today" },
    { path: "/reception/dashboard/appointments/today", params: { date: localDate } },
    { path: "/reception/appointment/today" },
    { path: "/reception/appointment/today", params: { date: localDate } },
    { path: "/dashboard/reception/appointments/today" },
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const { data } = await api.get<unknown>(
        endpoint.path,
        endpoint.params ? { params: endpoint.params } : undefined,
      );
      return normalizeReceptionDashboard(data);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Nao foi possivel carregar as consultas de hoje.");
};

export const registerPatientByReception = async (
  payload: RegisterPatientByReceptionPayload,
): Promise<void> => {
  await api.post("/patients/register-by-reception", payload);
};

// PATCH /reception/appointments/:id/status
export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatusUpdate,
): Promise<void> => {
  const attempts: Array<{ path: string; body: Record<string, string> }> = [
    { path: `/reception/appointments/${id}/status`, body: { status } },
    { path: `/reception/dashboard/appointments/${id}/status`, body: { status } },
    { path: `/reception/appointment/${id}/status`, body: { status } },
    { path: `/reception/appointments/status/${id}`, body: { status } },
    { path: `/reception/dashboard/appointments/status/${id}`, body: { status } },
    { path: `/reception/appointments/status`, body: { id, status } },
    { path: `/appointments/${id}/status`, body: { status } },
    { path: `/appointments/${id}`, body: { status } },
  ];

  const methods: Array<"patch" | "put"> = ["patch", "put"];
  let lastError: unknown;
  for (const attempt of attempts) {
    for (const method of methods) {
      try {
        await api.request({
          method,
          url: attempt.path,
          data: attempt.body,
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
  }

  throw lastError ?? new Error("Nao foi possivel atualizar o status.");
};

// ─── Reception Agendas ──────────────────────────────────────────────────────

const VALID_SLOT_STATUSES = new Set<AgendaSlotStatus>([
  "SCHEDULED",
  "CONFIRMED",
  "WAITING",
  "IN_PROGRESS",
  "COMPLETED",
  "NO_SHOW",
  "CANCELLED",
]);

const normalizeSlotStatus = (v: unknown): AgendaSlotStatus | null => {
  if (!v) return null;
  const raw = String(v)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  if (VALID_SLOT_STATUSES.has(raw as AgendaSlotStatus)) return raw as AgendaSlotStatus;
  // Map legacy values
  if (["DONE", "FINISHED", "CONCLUDED", "COMPLETED"].includes(raw)) return "COMPLETED";
  if (["IN_ATTENDANCE", "ATTENDING"].includes(raw)) return "IN_PROGRESS";
  if (["NOSHOW", "NO_SHOW"].includes(raw)) return "NO_SHOW";
  if (["CANCELED", "CANCELLED"].includes(raw)) return "CANCELLED";
  if (["PENDING", "AGUARDANDO"].includes(raw)) return "WAITING";
  return null;
};

const normalizeAgendaSlot = (item: unknown): AgendaSlot | null => {
  const r = toRec(item);
  if (!r) return null;

  const time = toStr(readValue([r], ["time", "scheduledTime", "startTime", "horario"]), "");
  if (!time) return null;

  const libre = r.libre === true || r.free === true || r.available === true;
  const appointmentId = toStr(readValue([r], ["appointmentId", "id", "_id"]), "") || null;
  const patientName = toStr(readValue([r], ["patientName", "patient", "name"]), "") || null;
  const rawStatus = readValue([r], ["status", "appointmentStatus"]);
  const status = normalizeSlotStatus(rawStatus);

  return { time, libre, appointmentId: appointmentId || null, patientName, status };
};

const normalizeAgendaProfessional = (item: unknown): AgendaProfessional | null => {
  const r = toRec(item);
  if (!r) return null;

  const id = toStr(readValue([r], ["id", "_id", "professionalId"]), "");
  if (!id) return null;

  const name = toStr(readValue([r], ["name", "fullName", "professionalName"]), "—");
  const specialty = toStr(readValue([r], ["specialty", "specialization", "especialidade"]), "");
  const avatarUrlRaw = readValue([r], ["avatarUrl", "avatar", "photoUrl"]);
  const avatarUrl = typeof avatarUrlRaw === "string" && avatarUrlRaw.trim() ? avatarUrlRaw : null;

  const rawSlots = readValue([r], ["slots", "schedule", "appointments", "horarios"]);
  const slots = Array.isArray(rawSlots)
    ? rawSlots.map(normalizeAgendaSlot).filter((s): s is AgendaSlot => s !== null)
    : [];

  return { id, name, specialty, avatarUrl, slots };
};

const normalizeAgendasResponse = (raw: unknown, date: string): AgendasResponse => {
  const root = toRec(raw) ?? {};
  const payload = toRec(root.data) ?? root;

  const responseDate = toStr(readValue([payload, root], ["date", "referenceDate", "data"]), date);

  const rawProfessionals = readValue(
    [payload, root],
    ["professionals", "profissionais", "doctors"],
  );
  const professionals = Array.isArray(rawProfessionals)
    ? rawProfessionals
        .map(normalizeAgendaProfessional)
        .filter((p): p is AgendaProfessional => p !== null)
    : [];

  return { date: responseDate, professionals };
};

// GET /api/reception/agendas?date=YYYY-MM-DD
export const getReceptionAgendas = async (date: string): Promise<AgendasResponse> => {
  const { data } = await api.get<unknown>("/reception/agendas", { params: { date } });
  return normalizeAgendasResponse(data, date);
};

// ─── Reception Profile (Me) ───────────────────────────────────────────────────

type ReceptionMeResponse = Record<string, unknown>;

const normalizeReceptionMeResponse = (response: ReceptionMeResponse): ReceptionProfileData => {
  const asRec = (v: unknown): Record<string, unknown> | null =>
    typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;

  const root = asRec(response) ?? {};
  const payload = asRec(root.data) ?? asRec(root.staff) ?? asRec(root.user) ?? root;
  const personal = asRec(payload.personal) ?? asRec(payload.user) ?? payload;
  const professional = asRec(payload.professional) ?? asRec(payload.professionalInfo);

  const readStr = (
    sources: Array<Record<string, unknown> | null>,
    keys: string[],
    fallback = "",
  ): string => {
    for (const source of sources) {
      if (!source) continue;
      for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) return value;
      }
    }
    return fallback;
  };

  return {
    fullName: readStr([personal, payload, root], ["name", "fullName"], "-"),
    email: readStr([personal, payload, root], ["email"], "-"),
    phone: readStr([personal, payload, root], ["phone"], "-"),
    address: readStr([personal, payload, root], ["address", "fullAddress"], "-"),
    avatarUrl: readStr([personal, payload, root], ["avatarUrl", "avatar", "photoUrl"], ""),
    role: readStr(
      [professional, payload, root],
      ["role", "clinicRole", "position"],
      "Recepcionista",
    ),
  };
};

// GET /api/reception/me
export const getReceptionProfile = async (): Promise<ReceptionProfileData> => {
  const { data } = await api.get<ReceptionMeResponse>("/reception/me");
  return normalizeReceptionMeResponse(data);
};

// PATCH /api/reception/me
export const updateReceptionProfile = async (
  payload: UpdateProfilePayload,
): Promise<ReceptionProfileData> => {
  const hasName = typeof payload.name === "string";
  const hasPhone = typeof payload.phone === "string";
  const hasAvatar = payload.avatarFile instanceof File;

  if (!hasName && !hasPhone && !hasAvatar) {
    return getReceptionProfile();
  }

  let responseData: ReceptionMeResponse | undefined;

  if (hasAvatar) {
    const avatarFile = payload.avatarFile as File;
    const formData = new FormData();
    if (hasName) formData.append("name", (payload.name ?? "").trim());
    if (hasPhone) formData.append("phone", (payload.phone ?? "").trim());
    formData.append("avatar", avatarFile, avatarFile.name);

    const response = await api.patch<ReceptionMeResponse | undefined>("/reception/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    responseData = response.data;
  } else {
    const requestData: Record<string, string> = {};
    if (hasName) requestData.name = (payload.name ?? "").trim();
    if (hasPhone) requestData.phone = (payload.phone ?? "").trim();

    const response = await api.patch<ReceptionMeResponse | undefined>("/reception/me", requestData);
    responseData = response.data;
  }

  if (responseData && typeof responseData === "object") {
    return normalizeReceptionMeResponse(responseData);
  }

  return getReceptionProfile();
};

// PATCH /api/reception/me/password
export const updateReceptionProfilePassword = async (
  payload: UpdateProfilePasswordPayload,
): Promise<void> => {
  await api.patch("/reception/me/password", {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });
};
