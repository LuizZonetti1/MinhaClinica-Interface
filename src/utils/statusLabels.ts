/**
 * Labels centralizadas para status exibidos ao usuário em pt-BR.
 * Use estas constantes/funções para manter consistência entre telas.
 */

// Status de consulta/agendamento
export const PATIENT_APPT_STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmado",
  SCHEDULED: "Pendente",
  RESCHEDULED: "Remarcado",
  WAITING: "Aguardando",
  IN_PROGRESS: "Em atendimento",
  COMPLETED: "Compareceu",
  COMPLETED_WITH_ADDENDUM: "Concluído com adendo",
  NO_SHOW: "Não compareceu",
  CANCELLED: "Cancelado",
};

export const ADMIN_APPT_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  CHECKED_IN: "Check-in realizado",
  IN_PROGRESS: "Em atendimento",
  DONE: "Concluída",
  COMPLETED: "Concluída",
  COMPLETED_WITH_ADDENDUM: "Concluída com adendo",
  CANCELLED: "Cancelada",
  NO_SHOW: "Não compareceu",
  SCHEDULED: "Agendada",
  CONFIRMED: "Confirmada",
  RESCHEDULED: "Reagendada",
};

export const CHECKIN_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  CHECKED_IN: "Check-in OK",
  IN_PROGRESS: "Em atendimento",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não compareceu",
};

export const APPOINTMENT_UPDATE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "SCHEDULED", label: "Agendada" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "WAITING", label: "Check-in OK" },
  { value: "IN_PROGRESS", label: "Em atendimento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "NO_SHOW", label: "Não compareceu" },
  { value: "CANCELLED", label: "Cancelada" },
];

export const APPT_STATUS_ALIASES: Record<string, string> = {
  DONE: "COMPLETED",
  FINISHED: "COMPLETED",
  CONCLUDED: "COMPLETED",
  CONCLUIDO: "COMPLETED",
  NOSHOW: "NO_SHOW",
  CANCELED: "CANCELLED",
};

export const normalizeApptStatus = (status: string): string => {
  const normalized = status.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return APPT_STATUS_ALIASES[normalized] ?? normalized;
};

// Labels de tipo de consulta
export const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  FIRST_CONSULTATION: "Primeira consulta",
  CONSULTATION: "Consulta",
  RETURN: "Retorno",
  ROUTINE: "Rotina",
  EXAM: "Exame",
  EMERGENCY: "Urgência",
  CONSULTA: "Consulta",
  RETORNO: "Retorno",
  EXAME: "Exame",
  EMERGENCIA: "Urgência",
};

// Labels de canal de atendimento
export const APPOINTMENT_CHANNEL_LABELS: Record<string, string> = {
  IN_PERSON: "Presencial",
  ONLINE: "Online",
  ONLINE_PORTAL: "Portal online",
  TELEMEDICINE: "Telemedicina",
};

// Labels de status de documentos clínicos
export const CLINICAL_DOC_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  FINALIZED: "Finalizado",
  SENT: "Enviado",
  ADDENDUM: "Adendo",
};

// Labels de tipos de documentos clínicos
export const CLINICAL_DOC_TYPE_LABELS: Record<string, string> = {
  CLINICAL_REPORT: "Relatório clínico",
  CERTIFICATE: "Atestado",
  ATTENDANCE_DECLARATION: "Declaração de comparecimento",
  PRESCRIPTION: "Receita",
  EXAM_REQUEST: "Solicitação de exame",
  REFERRAL: "Encaminhamento",
  MEDICAL_REPORT: "Laudo",
  CONTROLLED_PRESCRIPTION: "Receita controlada",
  CONSENT_FORM: "Termo de consentimento",
  TREATMENT_PLAN: "Plano terapêutico",
  BUDGET: "Orçamento",
};

// Labels de status de pagamento
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

// Labels de tipo de transação
export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
};

const normalizeEnumKey = (value: string): string =>
  value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

export const getAppointmentTypeLabel = (
  value: string | null | undefined,
  fallback = "Tipo não informado",
): string => {
  if (!value) return fallback;
  const key = normalizeEnumKey(value);
  return APPOINTMENT_TYPE_LABELS[key] ?? (value.trim() || fallback);
};

export const getAppointmentChannelLabel = (
  value: string | null | undefined,
  fallback = "Canal não informado",
): string => {
  if (!value) return fallback;
  const key = normalizeEnumKey(value);
  return APPOINTMENT_CHANNEL_LABELS[key] ?? (value.trim() || fallback);
};

export const getClinicalDocTypeLabel = (
  value: string | null | undefined,
  fallback = "Documento",
): string => {
  if (!value) return fallback;
  const key = normalizeEnumKey(value);
  return CLINICAL_DOC_TYPE_LABELS[key] ?? (value.trim() || fallback);
};
