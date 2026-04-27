/**
 * statusLabels.ts
 * Labels centralizadas para status exibidos ao usuário em pt-BR.
 * Use estas constantes nas páginas para manter consistência visual.
 */

// ─── Status de consulta/agendamento ──────────────────────────────────────────

/** Labels para visualização de badges nas páginas do paciente */
export const PATIENT_APPT_STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmado",
  SCHEDULED: "Pendente",
  RESCHEDULED: "Remarcado",
  WAITING: "Aguardando",
  IN_PROGRESS: "Em atendimento",
  COMPLETED: "Compareceu",
  NO_SHOW: "Não compareceu",
  CANCELLED: "Cancelado",
};

/** Labels para visualização de badges nas páginas da recepção e admin */
export const ADMIN_APPT_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  CHECKED_IN: "Check-in realizado",
  IN_PROGRESS: "Em atendimento",
  DONE: "Concluída",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  NO_SHOW: "Não compareceu",
  SCHEDULED: "Agendada",
  CONFIRMED: "Confirmada",
  RESCHEDULED: "Reagendada",
};

/** Labels para badges na página de check-in (visão simplificada da recepção) */
export const CHECKIN_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  CHECKED_IN: "Check-in OK",
  IN_PROGRESS: "Em Atendimento",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não Compareceu",
};

/** Opções do dropdown de atualização de status (recepção e admin) */
export const APPOINTMENT_UPDATE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "SCHEDULED", label: "Agendada" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "WAITING", label: "Check-in OK" },
  { value: "IN_PROGRESS", label: "Em Atendimento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "NO_SHOW", label: "Não compareceu" },
  { value: "CANCELLED", label: "Cancelada" },
];

/** Aliases para normalização de status vindos da API */
export const APPT_STATUS_ALIASES: Record<string, string> = {
  DONE: "COMPLETED",
  FINISHED: "COMPLETED",
  CONCLUDED: "COMPLETED",
  CONCLUIDO: "COMPLETED",
  NOSHOW: "NO_SHOW",
  CANCELED: "CANCELLED",
};

/** Normaliza um status de consulta, resolvendo aliases */
export const normalizeApptStatus = (status: string): string => {
  const normalized = status.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return APPT_STATUS_ALIASES[normalized] ?? normalized;
};

// ─── Labels de tipo de consulta ──────────────────────────────────────────────

export const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  FIRST_CONSULTATION: "Primeira consulta",
  CONSULTATION: "Consulta",
  RETURN: "Retorno",
  ROUTINE: "Rotina",
  EXAM: "Exame",
  EMERGENCY: "Urgência",
};

// ─── Labels de canal de atendimento ──────────────────────────────────────────

export const APPOINTMENT_CHANNEL_LABELS: Record<string, string> = {
  IN_PERSON: "Presencial",
  ONLINE: "Online",
  ONLINE_PORTAL: "Portal Online",
  TELEMEDICINE: "Telemedicina",
};

// ─── Labels de status de documentos clínicos ─────────────────────────────────

export const CLINICAL_DOC_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  FINALIZED: "Finalizado",
  SENT: "Enviado",
  ADDENDUM: "Adendo",
};

// ─── Labels de tipos de documentos clínicos ──────────────────────────────────

export const CLINICAL_DOC_TYPE_LABELS: Record<string, string> = {
  CLINICAL_REPORT: "Relatório Clínico",
  CERTIFICATE: "Atestado",
  ATTENDANCE_DECLARATION: "Declaração de Comparecimento",
  PRESCRIPTION: "Receita",
  EXAM_REQUEST: "Solicitação de Exame",
  REFERRAL: "Encaminhamento",
  MEDICAL_REPORT: "Laudo",
  CONTROLLED_PRESCRIPTION: "Receita Controlada",
  CONSENT_FORM: "Termo de Consentimento",
  TREATMENT_PLAN: "Plano Terapêutico",
  BUDGET: "Orçamento",
};

// ─── Labels de status de pagamento ───────────────────────────────────────────

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

// ─── Labels de tipo de transação ─────────────────────────────────────────────

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
};
