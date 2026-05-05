import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../../../../components/Button";
import DocumentAttachmentUpload from "../../../../components/DocumentAttachmentUpload";
import {
  deleteClinicalDocument,
  deleteDocumentAttachment,
  finalizeClinicalDocument,
  getClinicalDocument,
  updateClinicalDocument,
  createClinicalDocumentAddendum,
  updateDocumentAttachmentCaption,
  uploadDocumentAttachment,
} from "../../../../services/clinical-documents.service";
import type {
  AttendanceDeclarationContent,
  BudgetContent,
  BudgetItem,
  CertificateContent,
  ClinicalDocumentDetail,
  ClinicalReportContent,
  ConsentFormContent,
  ControlledPrescriptionContent,
  DocumentContent,
  ExamRequestContent,
  MedicalReportContent,
  MedicationItem,
  PrescriptionContent,
  ReferralContent,
  TreatmentPlanContent,
} from "../../../../types/clinical-document";
import { ClinicalDocumentType } from "../../../../types/clinical-document";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../../utils/toast";
import DocumentFixedFields from "./DocumentFixedFields";
import DocumentFormFooter from "./DocumentFormFooter";
import AttendanceDeclarationForm from "./forms/AttendanceDeclarationForm";
import BudgetForm from "./forms/BudgetForm";
import CertificateForm from "./forms/CertificateForm";
import ClinicalReportForm from "./forms/ClinicalReportForm";
import ConsentFormForm from "./forms/ConsentFormForm";
import ControlledPrescriptionForm from "./forms/ControlledPrescriptionForm";
import ExamRequestForm from "./forms/ExamRequestForm";
import MedicalReportForm from "./forms/MedicalReportForm";
import PrescriptionForm from "./forms/PrescriptionForm";
import ReferralForm from "./forms/ReferralForm";
import TreatmentPlanForm from "./forms/TreatmentPlanForm";
import {
  ErrorWrapper,
  FormHeader,
  FormPageWrapper,
  FormSubtitle,
  FormTitle,
  FormTitleGroup,
  LoadingWrapper,
} from "./styles";

// ─── Default content per type ─────────────────────────────────────────────────

const EMPTY_MEDICATION: MedicationItem = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  quantity: "",
};

const EMPTY_BUDGET_ITEM: BudgetItem = {
  description: "",
  quantity: 1,
  unitPrice: null,
  total: 0,
};

const DEFAULT_CONTENT: Record<string, () => DocumentContent> = {
  [ClinicalDocumentType.CLINICAL_REPORT]: (): ClinicalReportContent => ({
    anamnesis: "",
    history: "",
    physicalExam: "",
    complementaryExams: "",
    diagnosis: "",
    cid: "",
    treatment: "",
    prognosis: "",
  }),
  [ClinicalDocumentType.CERTIFICATE]: (): CertificateContent => ({
    daysOfRest: null,
    startDate: "",
    endDate: "",
    cid: "",
    diagnosisDescription: "",
    purpose: "",
    observations: "",
  }),
  [ClinicalDocumentType.ATTENDANCE_DECLARATION]: (): AttendanceDeclarationContent => ({
    declarationType: "",
    attendanceDate: "",
    arrivalTime: "",
    departureTime: "",
    purpose: "",
  }),
  [ClinicalDocumentType.PRESCRIPTION]: (): PrescriptionContent => ({
    medications: [{ ...EMPTY_MEDICATION }],
  }),
  [ClinicalDocumentType.CONTROLLED_PRESCRIPTION]: (): ControlledPrescriptionContent => ({
    patientAddress: "",
    notificationNumber: "",
    medications: [{ ...EMPTY_MEDICATION }],
  }),
  [ClinicalDocumentType.EXAM_REQUEST]: (): ExamRequestContent => ({
    exams: [{ name: "", code: "", instructions: "" }],
    clinicalIndication: "",
    cid: "",
    urgency: "",
  }),
  [ClinicalDocumentType.REFERRAL]: (): ReferralContent => ({
    referredTo: "",
    targetProfessional: "",
    reason: "",
    clinicalHistory: "",
    cid: "",
    urgency: "",
  }),
  [ClinicalDocumentType.MEDICAL_REPORT]: (): MedicalReportContent => ({
    purpose: "",
    examType: "",
    examDate: "",
    findings: "",
    conclusion: "",
    cid: "",
  }),
  [ClinicalDocumentType.CONSENT_FORM]: (): ConsentFormContent => ({
    procedureName: "",
    procedureDescription: "",
    risks: "",
    benefits: "",
    alternatives: "",
    witnessName: "",
    patientAcknowledged: false,
  }),
  [ClinicalDocumentType.TREATMENT_PLAN]: (): TreatmentPlanContent => ({
    diagnosis: "",
    cid: "",
    goals: [""],
    interventions: [{ type: "", description: "" }],
    followUpIntervalDays: null,
  }),
  [ClinicalDocumentType.BUDGET]: (): BudgetContent => ({
    items: [{ ...EMPTY_BUDGET_ITEM }],
    subtotal: 0,
    discount: 0,
    total: 0,
    validityDays: 30,
    paymentMethods: [],
    observations: "",
    patientAcknowledged: false,
  }),
};

const DOC_TYPE_LABEL: Record<string, string> = {
  CLINICAL_REPORT: "Relatorio Clinico",
  CERTIFICATE: "Atestado",
  ATTENDANCE_DECLARATION: "Declaracao de Comparecimento",
  PRESCRIPTION: "Receita",
  CONTROLLED_PRESCRIPTION: "Receita Controlada",
  EXAM_REQUEST: "Solicitacao de Exame",
  REFERRAL: "Encaminhamento",
  MEDICAL_REPORT: "Laudo",
  CONSENT_FORM: "Termo de Consentimento",
  TREATMENT_PLAN: "Plano Terapeutico",
  BUDGET: "Orcamento",
};

const AUTOSAVE_INTERVAL_MS = 30_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const computeCanFinalize = (type: string, content: DocumentContent): boolean => {
  if (type === ClinicalDocumentType.CONSENT_FORM) {
    return Boolean((content as ConsentFormContent).patientAcknowledged);
  }
  if (type === ClinicalDocumentType.BUDGET) {
    return Boolean((content as BudgetContent).patientAcknowledged);
  }
  return true;
};

const renderFormForType = (
  type: string,
  content: DocumentContent,
  onChange: <K extends string>(field: K, value: unknown) => void,
  errors: Partial<Record<string, string>>,
  disabled: boolean,
) => {
  switch (type) {
    case ClinicalDocumentType.CLINICAL_REPORT:
      return <ClinicalReportForm content={content as ClinicalReportContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.CERTIFICATE:
      return <CertificateForm content={content as CertificateContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.ATTENDANCE_DECLARATION:
      return <AttendanceDeclarationForm content={content as AttendanceDeclarationContent} onChange={onChange} errors={errors} disabled={disabled} appointmentContext={{ appointmentId: "", patientName: "", appointmentDate: "", startTime: "--:--", professionalName: "", councilRegistration: "", appointmentStatus: "" }} />;
    case ClinicalDocumentType.PRESCRIPTION:
      return <PrescriptionForm content={content as PrescriptionContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.CONTROLLED_PRESCRIPTION:
      return <ControlledPrescriptionForm content={content as ControlledPrescriptionContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.EXAM_REQUEST:
      return <ExamRequestForm content={content as ExamRequestContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.REFERRAL:
      return <ReferralForm content={content as ReferralContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.MEDICAL_REPORT:
      return <MedicalReportForm content={content as MedicalReportContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.CONSENT_FORM:
      return <ConsentFormForm content={content as ConsentFormContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.TREATMENT_PLAN:
      return <TreatmentPlanForm content={content as TreatmentPlanContent} onChange={onChange} errors={errors} disabled={disabled} />;
    case ClinicalDocumentType.BUDGET:
      return <BudgetForm content={content as BudgetContent} onChange={onChange} errors={errors} disabled={disabled} />;
    default:
      return <p>Tipo de documento nao suportado.</p>;
  }
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const DocumentFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("consulta") ?? "";
  const documentId = searchParams.get("documento") ?? "";
  const viewMode = searchParams.get("modo") === "visualizar";
  const isAddendoMode = searchParams.get("modo") === "adendo";
  const addendoTipo = (searchParams.get("tipo") ?? "") as ClinicalDocumentType;
  const isNew = searchParams.get("novo") === "1";

  const [document, setDocument] = useState<ClinicalDocumentDetail | null>(null);
  const [content, setContent] = useState<DocumentContent | null>(null);
  const [internalNotes, setInternalNotes] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [autosaveError, setAutosaveError] = useState(false);

  const isDirtyRef = useRef(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const contentRef = useRef<DocumentContent | null>(null);
  const internalNotesRef = useRef("");

  // keep refs in sync
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  useEffect(() => {
    internalNotesRef.current = internalNotes;
  }, [internalNotes]);

  // ── Load document ──
  const loadDocument = useCallback(async () => {
    if (isAddendoMode) {
      // Adendo mode: skip loading, use type from URL param
      if (!addendoTipo || !DEFAULT_CONTENT[addendoTipo]) {
        setErrorMessage("Tipo de adendo invalido.");
        setLoading(false);
        return;
      }
      const defaultContent = DEFAULT_CONTENT[addendoTipo]();
      setContent(defaultContent);
      setLoading(false);
      return;
    }
    if (!appointmentId || !documentId) {
      setErrorMessage("Parametros de consulta ou documento ausentes.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const doc = await getClinicalDocument(appointmentId, documentId);
      setDocument(doc);

      const defaultFactory = DEFAULT_CONTENT[doc.type];
      const defaultContent = defaultFactory ? defaultFactory() : {};
      const mergedContent = { ...defaultContent, ...doc.content } as DocumentContent;
      setContent(mergedContent);
      setInternalNotes(doc.internalNotes);
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err, "Nao foi possivel carregar o documento."));
    } finally {
      setLoading(false);
    }
  }, [appointmentId, documentId, isAddendoMode, addendoTipo]);

  useEffect(() => {
    void loadDocument();
  }, [loadDocument]);

  // ── Autosave ──
  const saveDraft = useCallback(
    async (silent = false): Promise<boolean> => {
      if (!appointmentId || !documentId || !contentRef.current) return false;
      if (!silent) setSaving(true);
      try {
        await updateClinicalDocument(appointmentId, documentId, {
          content: contentRef.current,
          internalNotes: internalNotesRef.current,
        });
        isDirtyRef.current = false;
        setAutosaveError(false);
        const now = new Date();
        setLastSavedAt(
          `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
        );
        if (!silent) notifySuccess("Rascunho salvo.");
        return true;
      } catch (err: unknown) {
        if (silent) {
          setAutosaveError(true);
        } else {
          notifyError(getApiErrorMessage(err, "Nao foi possivel salvar o rascunho."));
        }
        return false;
      } finally {
        if (!silent) setSaving(false);
      }
    },
    [appointmentId, documentId],
  );

  useEffect(() => {
    if (viewMode || !document || document.status === "FINALIZED") return;

    autosaveTimerRef.current = setInterval(() => {
      if (isDirtyRef.current) {
        void saveDraft(true);
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [viewMode, document, saveDraft]);

  // ── Handlers ──
  const handleContentChange = useCallback(<K extends string>(field: K, value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value } as DocumentContent;
    });
    isDirtyRef.current = true;
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleInternalNotesChange = useCallback((value: string) => {
    setInternalNotes(value);
    isDirtyRef.current = true;
  }, []);

  const handleCancel = async () => {
    const isUntouched = isNew && !isDirtyRef.current && lastSavedAt === null;
    if (isUntouched && appointmentId && documentId) {
      try {
        await deleteClinicalDocument(appointmentId, documentId);
      } catch {
        // ignora erro de deleção, navega de volta mesmo assim
      }
    }
    navigate(`/profissional/documentos?consulta=${appointmentId}`);
  };

  const handleSaveDraft = async () => {
    const ok = await saveDraft(false);
    if (ok) navigate(`/profissional/documentos?consulta=${appointmentId}`);
  };

  const handleFinalize = async () => {
    if (isAddendoMode) {
      // Adendo mode: create addendum document
      if (!appointmentId || !contentRef.current) return;
      setFinalizing(true);
      try {
        await createClinicalDocumentAddendum(
          appointmentId,
          addendoTipo,
          contentRef.current,
          internalNotesRef.current || undefined,
        );
        notifySuccess("Adendo criado com sucesso.");
        navigate(`/profissional/documentos?consulta=${appointmentId}`);
      } catch (err: unknown) {
        notifyError(getApiErrorMessage(err, "Nao foi possivel criar o adendo."));
      } finally {
        setFinalizing(false);
      }
      return;
    }
    if (!appointmentId || !documentId || !contentRef.current) return;
    setFinalizing(true);
    try {
      // Save latest content first
      await updateClinicalDocument(appointmentId, documentId, {
        content: contentRef.current,
        internalNotes: internalNotesRef.current,
      });
      // Then finalize
      await finalizeClinicalDocument(appointmentId, documentId);
      notifySuccess("Documento finalizado com sucesso.");
      navigate(`/profissional/documentos?consulta=${appointmentId}`);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        notifyError("Sem permissao para finalizar este documento.");
      } else {
        notifyError(getApiErrorMessage(err, "Nao foi possivel finalizar o documento."));
      }
    } finally {
      setFinalizing(false);
    }
  };

  // ── onBlur autosave ──
  const handleBlurAutosave = useCallback(() => {
    if (!isDirtyRef.current) return;
    if (!document) return;
    const docStatus = document.status.toUpperCase();
    if (docStatus === "FINALIZED" || docStatus === "SENT" || docStatus === "ADDENDUM") return;
    void saveDraft(true);
  }, [document, saveDraft]);

  // ── Render states ──
  if (loading) {
    return (
      <FormPageWrapper>
        <LoadingWrapper>Carregando documento...</LoadingWrapper>
      </FormPageWrapper>
    );
  }

  if (isAddendoMode) {
    if (errorMessage || !content) {
      return (
        <FormPageWrapper>
          <ErrorWrapper>
            <p>{errorMessage ?? "Tipo de adendo nao reconhecido."}</p>
            <Button variant="outline" size="small" onClick={handleCancel}>
              Voltar
            </Button>
          </ErrorWrapper>
        </FormPageWrapper>
      );
    }

    const addendoTypeLabel = DOC_TYPE_LABEL[addendoTipo] ?? "Adendo";

    return (
      <FormPageWrapper>
        <FormHeader>
          <FormTitleGroup>
            <FormTitle>Novo adendo — {addendoTypeLabel}</FormTitle>
            <FormSubtitle>Preencha o conteudo do adendo. Ele sera criado ao clicar em "Criar adendo".</FormSubtitle>
          </FormTitleGroup>
          <Button variant="outline" size="small" icon={<ArrowLeft size={14} />} onClick={handleCancel}>
            Voltar
          </Button>
        </FormHeader>

        <DocumentFixedFields
          appointmentContext={{
            appointmentId,
            patientName: "",
            appointmentDate: "",
            startTime: "--:--",
            professionalName: "",
            councilRegistration: "",
            appointmentStatus: "COMPLETED",
          }}
          status="DRAFT"
          internalNotes={internalNotes}
          onInternalNotesChange={handleInternalNotesChange}
          disabled={false}
          onBlurAutosave={() => { }}
        />

        {renderFormForType(addendoTipo, content, handleContentChange, errors, false)}

        <DocumentFormFooter
          onCancel={handleCancel}
          onSaveDraft={() => { }}
          onFinalize={() => void handleFinalize()}
          saving={false}
          finalizing={finalizing}
          canFinalize={computeCanFinalize(addendoTipo, content)}
          lastSavedAt={null}
          autosaveError={false}
          disabled={false}
          finalizeLabel="Criar adendo"
        />
      </FormPageWrapper>
    );
  }

  if (errorMessage || !document || !content) {
    return (
      <FormPageWrapper>
        <ErrorWrapper>
          <p>{errorMessage ?? "Documento nao encontrado."}</p>
          <Button variant="outline" size="small" onClick={handleCancel}>
            Voltar
          </Button>
        </ErrorWrapper>
      </FormPageWrapper>
    );
  }

  const isFinalized = document.status === "FINALIZED";
  const isSentOrAddendum = document.status === "SENT" || document.status === "ADDENDUM";
  const disabled = viewMode || isFinalized || isSentOrAddendum;
  const typeLabel = DOC_TYPE_LABEL[document.type] ?? "Documento";

  // ── Type-specific form ──
  const renderForm = () => {
    switch (document.type) {
      case ClinicalDocumentType.CLINICAL_REPORT:
        return (
          <ClinicalReportForm
            content={content as ClinicalReportContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.CERTIFICATE:
        return (
          <CertificateForm
            content={content as CertificateContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.ATTENDANCE_DECLARATION:
        return (
          <AttendanceDeclarationForm
            content={content as AttendanceDeclarationContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
            appointmentContext={document.appointmentContext}
          />
        );
      case ClinicalDocumentType.PRESCRIPTION:
        return (
          <PrescriptionForm
            content={content as PrescriptionContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.CONTROLLED_PRESCRIPTION:
        return (
          <ControlledPrescriptionForm
            content={content as ControlledPrescriptionContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.EXAM_REQUEST:
        return (
          <ExamRequestForm
            content={content as ExamRequestContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.REFERRAL:
        return (
          <ReferralForm
            content={content as ReferralContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.MEDICAL_REPORT:
        return (
          <MedicalReportForm
            content={content as MedicalReportContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.CONSENT_FORM:
        return (
          <ConsentFormForm
            content={content as ConsentFormContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.TREATMENT_PLAN:
        return (
          <TreatmentPlanForm
            content={content as TreatmentPlanContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      case ClinicalDocumentType.BUDGET:
        return (
          <BudgetForm
            content={content as BudgetContent}
            onChange={handleContentChange}
            errors={errors}
            disabled={disabled}
          />
        );
      default:
        return <p>Tipo de documento nao suportado.</p>;
    }
  };

  return (
    <FormPageWrapper>
      <FormHeader>
        <FormTitleGroup>
          <FormTitle>
            {viewMode || isSentOrAddendum
              ? "Visualizar"
              : isFinalized
                ? "Documento finalizado"
                : "Editar"}{" "}
            — {typeLabel}
          </FormTitle>
          <FormSubtitle>
            {isSentOrAddendum
              ? document.status === "ADDENDUM"
                ? "Adendo — somente leitura"
                : "Documento enviado — somente leitura"
              : viewMode
                ? "Visualizacao do documento (somente leitura)"
                : isFinalized
                  ? "Este documento ja foi finalizado e nao pode ser editado"
                  : "Preencha os campos abaixo. O documento sera salvo automaticamente."}
          </FormSubtitle>
        </FormTitleGroup>

        <Button
          variant="outline"
          size="small"
          icon={<ArrowLeft size={14} />}
          onClick={handleCancel}
        >
          Voltar
        </Button>
      </FormHeader>

      <DocumentFixedFields
        appointmentContext={document.appointmentContext}
        status={document.status}
        internalNotes={internalNotes}
        onInternalNotesChange={handleInternalNotesChange}
        disabled={disabled}
        onBlurAutosave={handleBlurAutosave}
      />

      {renderForm()}

      {/* Anexos — disponíveis em qualquer status do documento */}
      {!isAddendoMode && document && (
        <DocumentAttachmentUpload
          attachments={document.attachments ?? []}
          canEdit
          onUpload={async (file) => {
            await uploadDocumentAttachment(appointmentId, documentId, file);
            await loadDocument();
          }}
          onDelete={async (attachmentId) => {
            await deleteDocumentAttachment(appointmentId, documentId, attachmentId);
            await loadDocument();
          }}
          onUpdateCaption={async (attachmentId, caption) => {
            await updateDocumentAttachmentCaption(appointmentId, documentId, attachmentId, caption);
            await loadDocument();
          }}
        />
      )}

      {!viewMode && !isFinalized && !isSentOrAddendum && (
        <DocumentFormFooter
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          onFinalize={() => void handleFinalize()}
          saving={saving}
          finalizing={finalizing}
          canFinalize={computeCanFinalize(document.type, content)}
          lastSavedAt={lastSavedAt}
          autosaveError={autosaveError}
          disabled={disabled}
        />
      )}
    </FormPageWrapper>
  );
};

export default DocumentFormPage;
