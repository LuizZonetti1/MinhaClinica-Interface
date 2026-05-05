import { ArrowLeft, Printer } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../../../../components/Button";
import DocumentAttachmentUpload from "../../../../components/DocumentAttachmentUpload";
import {
  deleteDocumentAttachment,
  getClinicalDocument,
  printAuditDocument,
  uploadDocumentAttachment,
} from "../../../../services/clinical-documents.service";
import type { ClinicalDocumentDetail } from "../../../../types/clinical-document";
import { ClinicalDocumentType } from "../../../../types/clinical-document";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";
import { notifyError } from "../../../../utils/toast";
import DocumentPrintLayout from "./DocumentPrintLayout";
import {
  AttendanceDeclarationRenderer,
  BudgetRenderer,
  CertificateRenderer,
  ClinicalReportRenderer,
  ConsentFormRenderer,
  ControlledPrescriptionRenderer,
  ExamRequestRenderer,
  MedicalReportRenderer,
  PrescriptionRenderer,
  ReferralRenderer,
  TreatmentPlanRenderer,
} from "./renderers";
import { ViewHeaderActions, ViewPageHeader, ViewPageWrapper, ViewStatusMessage } from "./styles";

// ─── Page ─────────────────────────────────────────────────────────────────────

const DocumentViewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("consulta") ?? "";
  const documentId = searchParams.get("documento") ?? "";
  const autoPrint = searchParams.get("print") === "1";

  const [doc, setDoc] = useState<ClinicalDocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);
  const autoPrintFired = useRef(false);

  const loadDocument = useCallback(async () => {
    if (!appointmentId || !documentId) {
      setErrorMessage("Parametros de consulta ou documento ausentes.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getClinicalDocument(appointmentId, documentId);
      setDoc(data);
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err, "Nao foi possivel carregar o documento."));
    } finally {
      setLoading(false);
    }
  }, [appointmentId, documentId]);

  useEffect(() => {
    void loadDocument();
  }, [loadDocument]);

  const handlePrint = useCallback(async () => {
    if (!appointmentId || !documentId) return;
    setPrinting(true);
    try {
      // Registra auditoria antes de imprimir
      await printAuditDocument(appointmentId, documentId);
    } catch {
      // Auditoria falhou — notifica mas continua com a impressao
      notifyError("Nao foi possivel registrar a auditoria de impressao. A impressao continuara.");
    } finally {
      setPrinting(false);
      window.print();
    }
  }, [appointmentId, documentId]);

  // Auto-trigger print when print=1 param present and doc loaded
  useEffect(() => {
    if (autoPrint && doc && !loading && !autoPrintFired.current) {
      autoPrintFired.current = true;
      void handlePrint();
    }
  }, [autoPrint, doc, loading, handlePrint]);

  const handleBack = () => {
    navigate(`/profissional/documentos?consulta=${appointmentId}`);
  };

  if (loading) {
    return (
      <ViewPageWrapper>
        <ViewStatusMessage>Carregando documento...</ViewStatusMessage>
      </ViewPageWrapper>
    );
  }

  if (errorMessage || !doc) {
    return (
      <ViewPageWrapper>
        <ViewStatusMessage $error>{errorMessage ?? "Documento nao encontrado."}</ViewStatusMessage>
        <div style={{ textAlign: "center" }}>
          <Button variant="outline" size="small" onClick={handleBack}>
            Voltar
          </Button>
        </div>
      </ViewPageWrapper>
    );
  }

  const needsPatientSignature =
    doc.type === ClinicalDocumentType.CONSENT_FORM || doc.type === ClinicalDocumentType.BUDGET;

  const renderBody = () => {
    switch (doc.type) {
      case ClinicalDocumentType.CLINICAL_REPORT:
        return <ClinicalReportRenderer doc={doc} />;
      case ClinicalDocumentType.CERTIFICATE:
        return <CertificateRenderer doc={doc} />;
      case ClinicalDocumentType.ATTENDANCE_DECLARATION:
        return <AttendanceDeclarationRenderer doc={doc} />;
      case ClinicalDocumentType.PRESCRIPTION:
        return <PrescriptionRenderer doc={doc} />;
      case ClinicalDocumentType.CONTROLLED_PRESCRIPTION:
        return <ControlledPrescriptionRenderer doc={doc} />;
      case ClinicalDocumentType.EXAM_REQUEST:
        return <ExamRequestRenderer doc={doc} />;
      case ClinicalDocumentType.REFERRAL:
        return <ReferralRenderer doc={doc} />;
      case ClinicalDocumentType.MEDICAL_REPORT:
        return <MedicalReportRenderer doc={doc} />;
      case ClinicalDocumentType.CONSENT_FORM:
        return <ConsentFormRenderer doc={doc} />;
      case ClinicalDocumentType.TREATMENT_PLAN:
        return <TreatmentPlanRenderer doc={doc} />;
      case ClinicalDocumentType.BUDGET:
        return <BudgetRenderer doc={doc} />;
      default:
        return <ViewStatusMessage>Tipo de documento nao suportado.</ViewStatusMessage>;
    }
  };

  return (
    <ViewPageWrapper>
      {/* ── Controls (hidden on print) ── */}
      <ViewPageHeader>
        <Button variant="outline" size="small" icon={<ArrowLeft size={14} />} onClick={handleBack}>
          Voltar
        </Button>
        <ViewHeaderActions>
          <Button
            variant="primary"
            size="small"
            icon={<Printer size={14} />}
            onClick={() => void handlePrint()}
            disabled={printing}
          >
            {printing ? "Preparando..." : "Imprimir / PDF"}
          </Button>
        </ViewHeaderActions>
      </ViewPageHeader>

      {/* ── Document layout (printable) ── */}
      <DocumentPrintLayout doc={doc} patientSignature={needsPatientSignature}>
        {renderBody()}
      </DocumentPrintLayout>

      {/* ── Attachments (not printed) ── */}
      <DocumentAttachmentUpload
        attachments={doc.attachments ?? []}
        canEdit
        onUpload={async (file) => {
          await uploadDocumentAttachment(appointmentId, documentId, file);
          await loadDocument();
        }}
        onDelete={async (attachmentId) => {
          await deleteDocumentAttachment(appointmentId, documentId, attachmentId);
          await loadDocument();
        }}
      />
    </ViewPageWrapper>
  );
};

export default DocumentViewPage;
