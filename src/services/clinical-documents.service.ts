/**
 * Service de documentos clínicos — placeholder.
 *
 * Rotas necessárias no backend:
 *   GET  /professional/appointments/:appointmentId/documents
 *        → { appointmentContext: DocumentAppointmentContext, documents: ClinicalDocumentItem[] }
 *
 *   POST /professional/appointments/:appointmentId/documents
 *        Body: { type: ClinicalDocumentType }
 *        → ClinicalDocumentItem
 *
 *   DELETE /professional/appointments/:appointmentId/documents/:documentId
 *        → 204 No Content
 *
 *   PATCH /professional/appointments/:appointmentId/finalize
 *        → { message: string }
 */
import { api } from "../config/api";
import type {
  ClinicalDocumentDetail,
  ClinicalDocumentItem,
  ClinicalDocumentStatus,
  ClinicalDocumentsResult,
  ClinicalDocumentType,
  DocumentAppointmentContext,
  DocumentAttachment,
  DocumentClinicInfo,
  DocumentContent,
  UpdateClinicalDocumentPayload,
} from "../types/clinical-document";
import { toRecord, toTrimmedStringValue } from "../utils/parsers";

type RecordValue = Record<string, unknown>;

// ─── Normalizers ──────────────────────────────────────────────────────────────

const normalizeAppointmentContext = (value: unknown): DocumentAppointmentContext | null => {
  const root = toRecord(value) as RecordValue | null;
  if (!root) return null;
  return {
    appointmentId: toTrimmedStringValue(root.appointmentId ?? root.id, ""),
    patientName: toTrimmedStringValue(root.patientName ?? root.patient_name, "Paciente"),
    appointmentDate: toTrimmedStringValue(root.appointmentDate ?? root.date, ""),
    startTime: toTrimmedStringValue(root.startTime ?? root.start_time, "--:--"),
    professionalName: toTrimmedStringValue(root.professionalName ?? root.professional_name, ""),
    councilRegistration: toTrimmedStringValue(
      root.councilRegistration ?? root.council_registration,
      "",
    ),
    appointmentStatus: toTrimmedStringValue(root.appointmentStatus ?? root.status, "IN_PROGRESS"),
  };
};

const normalizeDocument = (value: unknown): ClinicalDocumentItem | null => {
  const root = toRecord(value) as RecordValue | null;
  if (!root) return null;
  const id = toTrimmedStringValue(root.id, "");
  if (!id) return null;
  const documentNumber =
    toTrimmedStringValue(root.documentNumber ?? root.document_number, "") || undefined;
  return {
    id,
    type: toTrimmedStringValue(root.type, "CLINICAL_REPORT") as ClinicalDocumentType,
    status: toTrimmedStringValue(root.status, "DRAFT") as ClinicalDocumentStatus,
    createdAt: toTrimmedStringValue(root.createdAt ?? root.created_at, ""),
    professionalName: toTrimmedStringValue(root.professionalName ?? root.professional_name, ""),
    ...(documentNumber && { documentNumber }),
  };
};

const DEFAULT_APPOINTMENT_CONTEXT: DocumentAppointmentContext = {
  appointmentId: "",
  patientName: "Paciente",
  appointmentDate: "",
  startTime: "--:--",
  professionalName: "",
  councilRegistration: "",
  appointmentStatus: "IN_PROGRESS",
};

const normalizeClinicalDocumentsResult = (payload: unknown): ClinicalDocumentsResult => {
  const root = (toRecord(payload) as RecordValue | null) ?? {};
  const data = (toRecord(root.data) as RecordValue | null) ?? root;

  const rawContext = data.appointmentContext ?? data.appointment ?? data;
  const context = normalizeAppointmentContext(rawContext) ?? DEFAULT_APPOINTMENT_CONTEXT;

  const rawList = data.documents ?? data.items ?? [];
  const documents = Array.isArray(rawList)
    ? rawList.map(normalizeDocument).filter((d): d is ClinicalDocumentItem => d !== null)
    : [];

  return { appointmentContext: context, documents };
};

// ─── API calls ────────────────────────────────────────────────────────────────

export const listClinicalDocuments = async (
  appointmentId: string,
): Promise<ClinicalDocumentsResult> => {
  const { data } = await api.get<unknown>(`/appointments/${appointmentId}/documents`);
  return normalizeClinicalDocumentsResult(data);
};

export const createClinicalDocument = async (
  appointmentId: string,
  type: ClinicalDocumentType,
  content: DocumentContent | Record<string, unknown> = {},
): Promise<ClinicalDocumentItem> => {
  const { data } = await api.post<unknown>(
    `/appointments/${appointmentId}/documents`,
    { type, content },
  );
  const root = (toRecord(data) as RecordValue | null) ?? {};
  const payload = (toRecord(root.data) as RecordValue | null) ?? root;
  const doc = normalizeDocument(payload);
  if (!doc) throw new Error("Resposta inesperada ao criar documento.");
  return doc;
};

export const deleteClinicalDocument = async (
  appointmentId: string,
  documentId: string,
): Promise<void> => {
  await api.delete(`/appointments/${appointmentId}/documents/${documentId}`);
};

export const createClinicalDocumentAddendum = async (
  appointmentId: string,
  type: ClinicalDocumentType,
  content: DocumentContent | Record<string, unknown>,
  internalNotes?: string,
): Promise<ClinicalDocumentItem> => {
  const { data } = await api.post<unknown>(
    `/appointments/${appointmentId}/addendum`,
    { type, content, ...(internalNotes !== undefined && { internalNotes }) },
  );
  const root = (toRecord(data) as RecordValue | null) ?? {};
  const payload = (toRecord(root.data) as RecordValue | null) ?? root;
  const doc = normalizeDocument(payload);
  if (!doc) throw new Error("Resposta inesperada ao criar adendo.");
  return doc;
};

// ─── Single document operations ──────────────────────────────────────────────

const normalizeDocumentDetail = (payload: unknown): ClinicalDocumentDetail => {
  const root = (toRecord(payload) as RecordValue | null) ?? {};
  const data = (toRecord(root.data) as RecordValue | null) ?? root;

  const doc = normalizeDocument(data);
  if (!doc) throw new Error("Resposta inesperada ao carregar documento.");

  const rawContext = data.appointmentContext ?? data.appointment ?? {};
  const appointmentContext = normalizeAppointmentContext(rawContext) ?? DEFAULT_APPOINTMENT_CONTEXT;

  const content = (data.content ?? {}) as DocumentContent;
  const internalNotes = toTrimmedStringValue(data.internalNotes ?? data.internal_notes, "");

  // Metadados adicionais
  const documentNumber =
    toTrimmedStringValue(data.documentNumber ?? data.document_number, "") || undefined;
  const issuedAt = toTrimmedStringValue(data.issuedAt ?? data.issued_at, "") || undefined;
  const originalDocumentId =
    toTrimmedStringValue(data.originalDocumentId ?? data.original_document_id, "") || undefined;
  const addendumAt = toTrimmedStringValue(data.addendumAt ?? data.addendum_at, "") || undefined;
  const addendumAuthor =
    toTrimmedStringValue(data.addendumAuthor ?? data.addendum_author, "") || undefined;

  // Dados da clinica embutidos no payload
  const rawClinic = (toRecord(data.clinic) ??
    toRecord(data.clinicInfo) ??
    null) as RecordValue | null;
  const clinicInfo: DocumentClinicInfo | undefined = rawClinic
    ? {
      tradeName:
        toTrimmedStringValue(rawClinic.tradeName ?? rawClinic.trade_name, "") || undefined,
      cnpj: toTrimmedStringValue(rawClinic.cnpj, "") || undefined,
      phone: toTrimmedStringValue(rawClinic.phone, "") || undefined,
      email:
        toTrimmedStringValue(
          rawClinic.email ?? rawClinic.clinicEmail ?? rawClinic.clinic_email,
          "",
        ) || undefined,
      timezone: toTrimmedStringValue(rawClinic.timezone, "") || undefined,
      address: (() => {
        const addr = (toRecord(rawClinic.address) as RecordValue | null) ?? rawClinic;
        return {
          street: toTrimmedStringValue(addr.street, "") || undefined,
          number: toTrimmedStringValue(addr.number, "") || undefined,
          neighborhood: toTrimmedStringValue(addr.neighborhood, "") || undefined,
          city: toTrimmedStringValue(addr.city, "") || undefined,
          state: toTrimmedStringValue(addr.state, "") || undefined,
          zipCode:
            toTrimmedStringValue(addr.zipCode ?? addr.zip_code ?? addr.cep, "") || undefined,
        };
      })(),
    }
    : undefined;

  return {
    ...doc,
    content,
    internalNotes,
    appointmentContext,
    documentNumber,
    issuedAt,
    originalDocumentId,
    addendumAt,
    addendumAuthor,
    clinicInfo,
    attachments: Array.isArray(data.attachments)
      ? (data.attachments as RecordValue[]).map((a): DocumentAttachment => ({
          id: toTrimmedStringValue(a.id, ""),
          documentId: toTrimmedStringValue(a.documentId ?? a.document_id, ""),
          fileName: toTrimmedStringValue(a.fileName ?? a.file_name, ""),
          mimeType: toTrimmedStringValue(a.mimeType ?? a.mime_type, ""),
          sizeBytes: typeof a.sizeBytes === "number" ? a.sizeBytes : 0,
          caption: toTrimmedStringValue(a.caption, "") || null,
          uploadedAt: toTrimmedStringValue(a.uploadedAt ?? a.uploaded_at, ""),
          url: toTrimmedStringValue(a.url, ""),
        }))
      : [],
  };
};

export const getClinicalDocument = async (
  appointmentId: string,
  documentId: string,
): Promise<ClinicalDocumentDetail> => {
  const { data } = await api.get<unknown>(
    `/appointments/${appointmentId}/documents/${documentId}`,
  );
  return normalizeDocumentDetail(data);
};

export const updateClinicalDocument = async (
  appointmentId: string,
  documentId: string,
  payload: UpdateClinicalDocumentPayload,
): Promise<ClinicalDocumentDetail> => {
  const { data } = await api.put<unknown>(
    `/appointments/${appointmentId}/documents/${documentId}`,
    payload,
  );
  return normalizeDocumentDetail(data);
};

export const finalizeClinicalDocument = async (
  appointmentId: string,
  documentId: string,
): Promise<ClinicalDocumentDetail> => {
  const { data } = await api.patch<unknown>(
    `/appointments/${appointmentId}/documents/${documentId}/finalize`,
  );
  return normalizeDocumentDetail(data);
};

// ─── Print audit ─────────────────────────────────────────────────────────────

export const printAuditDocument = async (
  appointmentId: string,
  documentId: string,
): Promise<void> => {
  await api.get(`/appointments/${appointmentId}/documents/${documentId}/print`);
};

// ─── Attachments ─────────────────────────────────────────────────────────────

export const uploadDocumentAttachment = async (
  appointmentId: string,
  documentId: string,
  file: File,
): Promise<DocumentAttachment> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<DocumentAttachment>(
    `/appointments/${appointmentId}/documents/${documentId}/attachments`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

export const deleteDocumentAttachment = async (
  appointmentId: string,
  documentId: string,
  attachmentId: string,
): Promise<void> => {
  await api.delete(
    `/appointments/${appointmentId}/documents/${documentId}/attachments/${attachmentId}`,
  );
};

export const updateDocumentAttachmentCaption = async (
  appointmentId: string,
  documentId: string,
  attachmentId: string,
  caption: string | null,
): Promise<DocumentAttachment> => {
  const { data } = await api.patch<DocumentAttachment>(
    `/appointments/${appointmentId}/documents/${documentId}/attachments/${attachmentId}/caption`,
    { caption },
  );
  return data;
};
