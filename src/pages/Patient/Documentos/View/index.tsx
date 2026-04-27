import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../../../../components/Button";
import { getClinicalDocument } from "../../../../services/clinical-documents.service";
import type { ClinicalDocumentDetail } from "../../../../types/clinical-document";
import { ClinicalDocumentType } from "../../../../types/clinical-document";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";
import DocumentPrintLayout from "../../../Professional/Documentos/View/DocumentPrintLayout";
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
} from "../../../Professional/Documentos/View/renderers";
import {
  ViewPageHeader,
  ViewPageWrapper,
  ViewStatusMessage,
} from "../../../Professional/Documentos/View/styles";
import { PatientScreenViewWrapper } from "./styles";

// ─── Page ─────────────────────────────────────────────────────────────────────

const PatientDocumentViewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("consulta") ?? "";
  const documentId = searchParams.get("documento") ?? "";

  const [doc, setDoc] = useState<ClinicalDocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDocument = useCallback(async () => {
    if (!appointmentId || !documentId) {
      setErrorMessage("Parametros ausentes.");
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

  const handleBack = () => {
    navigate(`/paciente/documentos?consulta=${appointmentId}`);
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
      <ViewPageHeader>
        <Button variant="outline" size="small" icon={<ArrowLeft size={14} />} onClick={handleBack}>
          Voltar
        </Button>
      </ViewPageHeader>

      <PatientScreenViewWrapper>
        <DocumentPrintLayout doc={doc} patientSignature={needsPatientSignature}>
          {renderBody()}
        </DocumentPrintLayout>
      </PatientScreenViewWrapper>
    </ViewPageWrapper>
  );
};

export default PatientDocumentViewPage;
