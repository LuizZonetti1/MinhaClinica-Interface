import {
  ArrowLeft,
  BadgeDollarSign,
  ClipboardList,
  Eye,
  FileCheck2,
  FileHeart,
  FileText,
  FlaskConical,
  HandHeart,
  ListChecks,
  Printer,
  ReceiptText,
  SendHorizonal,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../../../components/Button";
import { getAppointmentById } from "../../../services/appointment.service";
import { listClinicalDocuments } from "../../../services/clinical-documents.service";
import type { ClinicalDocumentItem } from "../../../types/clinical-document";
import { formatIsoDateToBr } from "../../../utils/dateParsers";
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
  InfoBarStatusBadge,
  InfoBarValue,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageTitleGroup,
  PageWrapper,
  SectionTitle,
  StatusMessage,
} from "../../Professional/Documentos/styles";
import type { ConsultaStatusVariant, DocStatusVariant } from "../../Professional/Documentos/styles";

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

const resolveConsultaStatusVariant = (status: string): ConsultaStatusVariant => {
  const s = status.trim().toUpperCase();
  if (s === "IN_PROGRESS") return "inProgress";
  if (s === "COMPLETED" || s === "DONE") return "completed";
  if (s === "COMPLETED_WITH_ADDENDUM") return "withAddendum";
  if (s === "SCHEDULED" || s === "CONFIRMED") return "scheduled";
  if (s === "WAITING") return "inProgress";
  return "default";
};

const resolveConsultaStatusLabel = (status: string): string => {
  switch (status.trim().toUpperCase()) {
    case "IN_PROGRESS": return "Em andamento";
    case "COMPLETED":
    case "DONE": return "Concluído";
    case "COMPLETED_WITH_ADDENDUM": return "Concluído com adendo";
    case "SCHEDULED": return "Agendado";
    case "CONFIRMED": return "Confirmado";
    case "WAITING": return "Aguardando";
    case "NO_SHOW": return "Não compareceu";
    case "CANCELLED": return "Cancelado";
    default: return status;
  }
};

const formatDocDate = (iso: string): string => {
  if (!iso) return "--/--/----";
  return formatIsoDateToBr(iso.split("T")[0], "--/--/----");
};

// ─── Page ─────────────────────────────────────────────────────────────────────

interface AppointmentCtx {
  appointmentId: string;
  patientName: string;
  appointmentDate: string;
  startTime: string;
  professionalName: string;
  appointmentStatus: string;
}

const AdminDocumentosPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("consulta") ?? "";

  const [appointmentCtx, setAppointmentCtx] = useState<AppointmentCtx>({
    appointmentId,
    patientName: searchParams.get("paciente") || "Paciente",
    appointmentDate: "",
    startTime: "--:--",
    professionalName: "",
    appointmentStatus: "COMPLETED",
  });
  const [documents, setDocuments] = useState<ClinicalDocumentItem[]>([]);
  const [loading, setLoading] = useState(Boolean(appointmentId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!appointmentId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const [appt, docsResult] = await Promise.all([
        getAppointmentById(appointmentId),
        listClinicalDocuments(appointmentId),
      ]);
      setAppointmentCtx({
        appointmentId,
        patientName: appt.patientName,
        appointmentDate: appt.scheduledAt.split("T")[0] ?? "",
        startTime: appt.startTime,
        professionalName: appt.professionalName,
        appointmentStatus: appt.status,
      });
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

  const appointmentStatus = appointmentCtx.appointmentStatus;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>Documentos da Consulta</PageTitle>
          <PageSubtitle>Visualizacao dos documentos clinicos deste atendimento</PageSubtitle>
        </PageTitleGroup>
        <HeaderActions>
          <Button
            variant="outline"
            size="medium"
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate("/admin/paciente/dashboard")}
          >
            Voltar
          </Button>
        </HeaderActions>
      </PageHeader>

      {appointmentId && (
        <AppointmentInfoBar>
          <InfoBarItem>
            <InfoBarLabel>Paciente</InfoBarLabel>
            <InfoBarValue>{appointmentCtx.patientName}</InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Consulta</InfoBarLabel>
            <InfoBarValue>
              {formatDocDate(appointmentCtx.appointmentDate)} as {appointmentCtx.startTime}
            </InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Profissional</InfoBarLabel>
            <InfoBarValue>{appointmentCtx.professionalName}</InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Status da Consulta</InfoBarLabel>
            <InfoBarStatusBadge $variant={resolveConsultaStatusVariant(appointmentStatus)}>
              {resolveConsultaStatusLabel(appointmentStatus)}
            </InfoBarStatusBadge>
          </InfoBarItem>
        </AppointmentInfoBar>
      )}

      {loading && <StatusMessage>Carregando documentos...</StatusMessage>}
      {!loading && errorMessage && <StatusMessage $error>{errorMessage}</StatusMessage>}

      {!loading && (
        <div>
          <SectionTitle>Documentos</SectionTitle>
          <DocsTable>
            <DocsTableHead>
              <tr>
                <DocsTableTh>Tipo</DocsTableTh>
                <DocsTableTh>Data</DocsTableTh>
                <DocsTableTh>Profissional</DocsTableTh>
                <DocsTableTh>Status</DocsTableTh>
                <DocsTableTh>Acoes</DocsTableTh>
              </tr>
            </DocsTableHead>
            <DocsTableBody>
              {documents.length === 0 ? (
                <tr>
                  <EmptyTableMessage colSpan={5}>
                    Nenhum documento encontrado para esta consulta.
                  </EmptyTableMessage>
                </tr>
              ) : (
                documents.map((doc) => {
                  const docStatus = doc.status.toUpperCase();
                  const statusVariant: DocStatusVariant =
                    docStatus === "FINALIZED"
                      ? "finalized"
                      : docStatus === "SENT"
                        ? "sent"
                        : docStatus === "ADDENDUM"
                          ? "addendum"
                          : "draft";
                  const statusLabel =
                    docStatus === "FINALIZED"
                      ? "Finalizado"
                      : docStatus === "SENT"
                        ? "Enviado"
                        : docStatus === "ADDENDUM"
                          ? "Adendo"
                          : "Rascunho";

                  return (
                    <DocsTableRow key={doc.id}>
                      <DocsTableTd>{DOC_TYPE_LABEL[doc.type] ?? doc.type}</DocsTableTd>
                      <DocsTableTd>{formatDocDate(doc.createdAt)}</DocsTableTd>
                      <DocsTableTd>{doc.professionalName}</DocsTableTd>
                      <DocsTableTd>
                        <DocStatusBadge $variant={statusVariant}>{statusLabel}</DocStatusBadge>
                      </DocsTableTd>
                      <DocsTableTd>
                        <DocActionsCell>
                          <DocActionBtn
                            type="button"
                            title="Visualizar"
                            onClick={() =>
                              navigate(
                                `/admin/documentos/visualizar?consulta=${appointmentId}&documento=${doc.id}`,
                              )
                            }
                          >
                            <Eye size={14} />
                          </DocActionBtn>
                          <DocActionBtn
                            type="button"
                            title="Imprimir / PDF"
                            onClick={() =>
                              navigate(
                                `/admin/documentos/visualizar?consulta=${appointmentId}&documento=${doc.id}&print=1`,
                              )
                            }
                          >
                            <Printer size={14} />
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

export default AdminDocumentosPage;
