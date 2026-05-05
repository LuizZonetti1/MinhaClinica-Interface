// ─── Enums ────────────────────────────────────────────────────────────────────

export const ClinicalDocumentType = {
  CLINICAL_REPORT: "CLINICAL_REPORT",
  CERTIFICATE: "CERTIFICATE",
  ATTENDANCE_DECLARATION: "ATTENDANCE_DECLARATION",
  PRESCRIPTION: "PRESCRIPTION",
  CONTROLLED_PRESCRIPTION: "CONTROLLED_PRESCRIPTION",
  EXAM_REQUEST: "EXAM_REQUEST",
  REFERRAL: "REFERRAL",
  MEDICAL_REPORT: "MEDICAL_REPORT",
  CONSENT_FORM: "CONSENT_FORM",
  TREATMENT_PLAN: "TREATMENT_PLAN",
  BUDGET: "BUDGET",
} as const;

export type ClinicalDocumentType = (typeof ClinicalDocumentType)[keyof typeof ClinicalDocumentType];

export const ClinicalDocumentStatus = {
  DRAFT: "DRAFT",
  FINALIZED: "FINALIZED",
  SENT: "SENT",
  ADDENDUM: "ADDENDUM",
} as const;

export type ClinicalDocumentStatus =
  (typeof ClinicalDocumentStatus)[keyof typeof ClinicalDocumentStatus];

// ─── Clinic info embedded in document payload ─────────────────────────────────

export interface DocumentClinicInfo {
  tradeName?: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

// ─── Appointment context (cabeçalho da tela) ─────────────────────────────────

export interface DocumentAppointmentContext {
  appointmentId: string;
  patientName: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  professionalName: string;
  councilRegistration?: string; // "CRM 12345"
  appointmentStatus: string;
}

// ─── Document item ────────────────────────────────────────────────────────────

export interface ClinicalDocumentItem {
  id: string;
  type: ClinicalDocumentType;
  status: ClinicalDocumentStatus;
  createdAt: string; // ISO date string
  professionalName: string;
  documentNumber?: string;
}

// ─── Document type metadata (para os cards de "Novo documento") ───────────────

export interface DocumentTypeCard {
  type: ClinicalDocumentType;
  label: string;
  description: string;
  iconColor: string;
  bgColor: string;
}

// ─── Content interfaces per document type ─────────────────────────────────────

export interface ClinicalReportContent {
  anamnesis: string;
  history: string;
  physicalExam: string;
  complementaryExams: string;
  diagnosis: string;
  cid: string;
  treatment: string;
  prognosis: string;
}

export interface CertificateContent {
  daysOfRest: number | null;
  startDate: string;
  endDate: string;
  cid: string;
  diagnosisDescription: string;
  purpose: string;
  observations: string;
}

export type DeclarationType = "ATTENDANCE" | "INCAPACITY" | "MEDICAL_FOLLOW_UP";

export interface AttendanceDeclarationContent {
  declarationType: DeclarationType | "";
  attendanceDate: string;
  arrivalTime: string;
  departureTime: string;
  purpose: string;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: string;
}

export interface PrescriptionContent {
  medications: MedicationItem[];
}

export interface ControlledPrescriptionContent {
  patientAddress: string;
  notificationNumber: string;
  medications: MedicationItem[];
}

export interface ExamItem {
  name: string;
  code: string;
  instructions: string;
}

export interface ExamRequestContent {
  exams: ExamItem[];
  clinicalIndication: string;
  cid: string;
  urgency: string;
}

export interface ReferralContent {
  referredTo: string;
  targetProfessional: string;
  reason: string;
  clinicalHistory: string;
  cid: string;
  urgency: string;
}

export interface MedicalReportContent {
  purpose: string;
  examType: string;
  examDate: string;
  findings: string;
  conclusion: string;
  cid: string;
}

export interface ConsentFormContent {
  procedureName: string;
  procedureDescription: string;
  risks: string;
  benefits: string;
  alternatives: string;
  witnessName: string;
  patientAcknowledged: boolean;
}

export type InterventionType =
  | "MEDICATION"
  | "LIFESTYLE"
  | "MONITORING"
  | "PHYSIOTHERAPY"
  | "PROCEDURE";

export interface InterventionItem {
  type: InterventionType | "";
  description: string;
}

export interface TreatmentPlanContent {
  diagnosis: string;
  cid: string;
  goals: string[];
  interventions: InterventionItem[];
  followUpIntervalDays: number | null;
}

export interface BudgetItem {
  description: string;
  quantity: number | null;
  unitPrice: number | null;
  total: number;
}

export interface BudgetContent {
  items: BudgetItem[];
  subtotal: number;
  discount: number;
  total: number;
  validityDays: number | null;
  paymentMethods: string[];
  observations: string;
  patientAcknowledged: boolean;
}

export type DocumentContent =
  | ClinicalReportContent
  | CertificateContent
  | AttendanceDeclarationContent
  | PrescriptionContent
  | ControlledPrescriptionContent
  | ExamRequestContent
  | ReferralContent
  | MedicalReportContent
  | ConsentFormContent
  | TreatmentPlanContent
  | BudgetContent;

// ─── Document attachment ──────────────────────────────────────────────────────

export interface DocumentAttachment {
  id: string;
  documentId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  caption: string | null;
  uploadedAt: string; // ISO datetime
  url: string;
}

// ─── Document detail (single doc with content) ───────────────────────────────

export interface ClinicalDocumentDetail extends ClinicalDocumentItem {
  content: DocumentContent;
  internalNotes: string;
  appointmentContext: DocumentAppointmentContext;
  /** Numero sequencial gerado pelo backend ao finalizar */
  documentNumber?: string;
  /** ISO datetime de emissao/finalizacao do documento */
  issuedAt?: string;
  /** ID do documento original (presente nos adendos) */
  originalDocumentId?: string;
  /** ISO datetime de criacao do adendo */
  addendumAt?: string;
  /** Nome do profissional que criou o adendo */
  addendumAuthor?: string;
  /** Metadados da clinica para renderizacao */
  clinicInfo?: DocumentClinicInfo;
  /** Arquivos anexados ao documento */
  attachments?: DocumentAttachment[];
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateClinicalDocumentPayload {
  appointmentId: string;
  type: ClinicalDocumentType;
}

export interface UpdateClinicalDocumentPayload {
  content: DocumentContent;
  internalNotes?: string;
}

// ─── Result ───────────────────────────────────────────────────────────────────

export interface ClinicalDocumentsResult {
  appointmentContext: DocumentAppointmentContext;
  documents: ClinicalDocumentItem[];
}

// ─── Session cache (usado nas páginas de documentos) ──────────────────────────

export interface DocPageCache {
  appointmentCtx: DocumentAppointmentContext;
  documents: ClinicalDocumentItem[];
  cachedAt: number;
}
