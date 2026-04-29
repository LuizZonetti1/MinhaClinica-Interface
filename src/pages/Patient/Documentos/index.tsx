import {
  ArrowLeft,
  BadgeDollarSign,
  ClipboardList,
  Eye,
  FileCheck2,
  FileHeart,
  FlaskConical,
  HandHeart,
  ListChecks,
  ReceiptText,
  SendHorizonal,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../../../components/Button";
import { getPatientAppointmentDetail } from "../../../services/patient-appointments.service";
import { listClinicalDocuments } from "../../../services/clinical-documents.service";
import type { ClinicalDocumentItem } from "../../../types/clinical-document";
import { formatIsoDateToBr, formatIsoDateTimeToBr } from "../../../utils/dateParsers";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError } from "../../../utils/toast";
import {
  AppointmentInfoBar,
  DocActionBtn,
  DocActionsCell,
  DocStatusBadge,
  DocsTable,
  DocsTableBody,
  DocsTableHead,
  DocsTableRow,
  DocsTableTd,
  DocsTableTh,
  EmptyTableMessage,
  HeaderActions,
  InfoBarItem,
  InfoBarLabel,
  InfoBarValue,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageTitleGroup,
  PageWrapper,
  SectionTitle,
  StatusMessage,
} from "../../Professional/Documentos/styles";
import type { DocStatusVariant } from "../../Professional/Documentos/styles";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DOC_TYPE_LABEL: Record<string, string> = {
  CLINICAL_REPORT: "Relatorio Clinico",
  CERTIFICATE: "Atestado",
  ATTENDANCE_DECLARATION: "Declaracao de Comparecimento",
  PRESCRIPTION: "Receita",
  EXAM_REQUEST: "Solicitacao de Exame",
  REFERRAL: "Encaminhamento",
  MEDICAL_REPORT: "Laudo",
  CONTROLLED_PRESCRIPTION: "Receita Controlada",
  CONSENT_FORM: "Termo de Consentimento",
  TREATMENT_PLAN: "Plano Terapeutico",
  BUDGET: "Orcamento",
};

const DOC_TYPE_ICON: Record<string, React.ReactNode> = {
  CLINICAL_REPORT: <Stethoscope size={18} />,
  CERTIFICATE: <FileCheck2 size={18} />,
  ATTENDANCE_DECLARATION: <FileHeart size={18} />,
  PRESCRIPTION: <ReceiptText size={18} />,
  EXAM_REQUEST: <FlaskConical size={18} />,
  REFERRAL: <SendHorizonal size={18} />,
  MEDICAL_REPORT: <ClipboardList size={18} />,
  CONTROLLED_PRESCRIPTION: <ShieldCheck size={18} />,
  CONSENT_FORM: <HandHeart size={18} />,
  TREATMENT_PLAN: <ListChecks size={18} />,
  BUDGET: <BadgeDollarSign size={18} />,
};
void DOC_TYPE_ICON;

const formatDocDate = (iso: string): string => {
  if (!iso) return "--/--/----";
  return formatIsoDateToBr(iso.split("T")[0], "--/--/----");
};

const formatDocDateTime = (iso: string): string =>
  formatIsoDateTimeToBr(iso, "America/Sao_Paulo", "--");

// ─── Page ─────────────────────────────────────────────────────────────────────

const PatientDocumentosPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("consulta") ?? "";

  const [patientName, setPatientName] = useState(
    searchParams.get("paciente") || "Paciente",
  );
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("--:--");
  const [professionalName, setProfessionalName] = useState("");
  const [documents, setDocuments] = useState<ClinicalDocumentItem[]>([]);
  const [loading, setLoading] = useState(Boolean(appointmentId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!appointmentId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const [appt, docsResult] = await Promise.all([
        getPatientAppointmentDetail(appointmentId),
        listClinicalDocuments(appointmentId),
      ]);
      setAppointmentDate(appt.appointmentDate);
      setStartTime(appt.startTime);
      setProfessionalName(appt.professionalName);
      setDocuments(docsResult.documents);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Nao foi possivel carregar os documentos.");
      setErrorMessage(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>Meus Documentos</PageTitle>
          <PageSubtitle>Documentos clinicos do seu atendimento</PageSubtitle>
        </PageTitleGroup>
        <HeaderActions>
          <Button
            variant="outline"
            size="medium"
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate("/paciente/agendamentos")}
          >
            Voltar para agendamentos
          </Button>
        </HeaderActions>
      </PageHeader>

      {appointmentId && (
        <AppointmentInfoBar>
          <InfoBarItem>
            <InfoBarLabel>Paciente</InfoBarLabel>
            <InfoBarValue>{patientName}</InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Consulta</InfoBarLabel>
            <InfoBarValue>
              {formatDocDate(appointmentDate)} as {startTime}
            </InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Profissional</InfoBarLabel>
            <InfoBarValue>{professionalName}</InfoBarValue>
          </InfoBarItem>
        </AppointmentInfoBar>
      )}

      {loading && <StatusMessage>Carregando documentos...</StatusMessage>}
      {!loading && errorMessage && <StatusMessage $error>{errorMessage}</StatusMessage>}

      {!loading && (
        <div>
          <SectionTitle>Documentos disponíveis</SectionTitle>
          <DocsTable>
            <DocsTableHead>
              <tr>
                <DocsTableTh>Tipo</DocsTableTh>
                <DocsTableTh>Enviado em</DocsTableTh>
                <DocsTableTh>Status</DocsTableTh>
                <DocsTableTh>Acao</DocsTableTh>
              </tr>
            </DocsTableHead>
            <DocsTableBody>
              {documents.length === 0 ? (
                <tr>
                  <EmptyTableMessage colSpan={4}>
                    Nenhum documento disponivel para esta consulta.
                  </EmptyTableMessage>
                </tr>
              ) : (
                documents.map((doc) => {
                  const docStatus = doc.status.toUpperCase();
                  const statusVariant: DocStatusVariant =
                    docStatus === "SENT" ? "sent" : docStatus === "ADDENDUM" ? "addendum" : "draft";
                  const statusLabel =
                    docStatus === "SENT"
                      ? "Disponivel"
                      : docStatus === "ADDENDUM"
                        ? "Adendo"
                        : "—";

                  return (
                    <DocsTableRow key={doc.id}>
                      <DocsTableTd>{DOC_TYPE_LABEL[doc.type] ?? doc.type}</DocsTableTd>
                      <DocsTableTd>{formatDocDateTime(doc.createdAt)}</DocsTableTd>
                      <DocsTableTd>
                        <DocStatusBadge $variant={statusVariant}>{statusLabel}</DocStatusBadge>
                      </DocsTableTd>
                      <DocsTableTd>
                        <DocActionsCell>
                          <DocActionBtn
                            type="button"
                            title="Visualizar documento"
                            onClick={() =>
                              navigate(
                                `/paciente/documentos/visualizar?consulta=${appointmentId}&documento=${doc.id}`,
                              )
                            }
                          >
                            <Eye size={14} />
                          </DocActionBtn>
                        </DocActionsCell>
                      </DocsTableTd>
                    </DocsTableRow>
                  );
                })
              )}
            </DocsTableBody>
          </DocsTable>
        </div>
      )}
    </PageWrapper>
  );
};

export default PatientDocumentosPage;
