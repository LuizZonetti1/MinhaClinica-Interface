import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle,
  ClipboardList,
  Copy,
  Eye,
  FileCheck2,
  FileHeart,
  FileText,
  FlaskConical,
  GitCompareArrows,
  HandHeart,
  ListChecks,
  Pencil,
  Printer,
  ReceiptText,
  SendHorizonal,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../../../components/Button";
import {
  concludeAppointment,
  createAppointmentAddendum,
} from "../../../services/appointment.service";
import {
  createClinicalDocument,
  deleteClinicalDocument,
  listClinicalDocuments,
} from "../../../services/clinical-documents.service";
import type {
  ClinicalDocumentItem,
  ClinicalDocumentsResult,
  DocumentTypeCard,
} from "../../../types/clinical-document";
import { ClinicalDocumentType } from "../../../types/clinical-document";
import { formatIsoDateToBr } from "../../../utils/dateParsers";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import type { ConsultaStatusVariant, DocStatusVariant } from "./styles";
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
  DocTypeCard,
  DocTypeDescription,
  DocTypeGrid,
  DocTypeIconWrap,
  DocTypeInfo,
  DocTypeLabel,
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
} from "./styles";

// ─── Document type catalog ────────────────────────────────────────────────────

const DOCUMENT_TYPES: DocumentTypeCard[] = [
  {
    type: ClinicalDocumentType.CLINICAL_REPORT,
    label: "Relatorio Clinico",
    description: "Resumo do quadro, sintomas, avaliacao e conduta",
    iconColor: "#3B82F6",
    bgColor: "#DBEAFE",
  },
  {
    type: ClinicalDocumentType.CERTIFICATE,
    label: "Atestado",
    description: "Documento de afastamento ou justificativa",
    iconColor: "#F59E0B",
    bgColor: "#FEF3C7",
  },
  {
    type: ClinicalDocumentType.ATTENDANCE_DECLARATION,
    label: "Declaracao de Comparecimento",
    description: "Comprovacao de comparecimento ou atendimento",
    iconColor: "#8B5CF6",
    bgColor: "#EDE9FE",
  },
  {
    type: ClinicalDocumentType.PRESCRIPTION,
    label: "Receita",
    description: "Prescricao de medicamentos (comum ou controle especial)",
    iconColor: "#F97316",
    bgColor: "#FFEDD5",
  },
  {
    type: ClinicalDocumentType.EXAM_REQUEST,
    label: "Solicitacao de Exame",
    description: "Solicitacao de exame com justificativa clinica",
    iconColor: "#10B981",
    bgColor: "#D1FAE5",
  },
  {
    type: ClinicalDocumentType.REFERRAL,
    label: "Encaminhamento",
    description: "Encaminhamento para outro profissional ou especialidade",
    iconColor: "#EF4444",
    bgColor: "#FEE2E2",
  },
  {
    type: ClinicalDocumentType.MEDICAL_REPORT,
    label: "Laudo",
    description: "Documento formal com conclusao pericial clara",
    iconColor: "#6B7280",
    bgColor: "#F3F4F6",
  },
  {
    type: ClinicalDocumentType.CONTROLLED_PRESCRIPTION,
    label: "Receita Controlada",
    description: "Prescricao de medicamentos com notificacao especial",
    iconColor: "#D97706",
    bgColor: "#FEF3C7",
  },
  {
    type: ClinicalDocumentType.CONSENT_FORM,
    label: "Termo de Consentimento",
    description: "Autorizacao do paciente para procedimentos",
    iconColor: "#059669",
    bgColor: "#D1FAE5",
  },
  {
    type: ClinicalDocumentType.TREATMENT_PLAN,
    label: "Plano Terapeutico",
    description: "Planejamento de intervencoes e acompanhamento",
    iconColor: "#7C3AED",
    bgColor: "#EDE9FE",
  },
  {
    type: ClinicalDocumentType.BUDGET,
    label: "Orcamento",
    description: "Orcamento de procedimentos e valores",
    iconColor: "#0891B2",
    bgColor: "#CFFAFE",
  },
];

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resolveConsultaStatusVariant = (status: string): ConsultaStatusVariant => {
  const normalized = status.trim().toUpperCase();
  if (normalized === "IN_PROGRESS") return "inProgress";
  if (normalized === "COMPLETED" || normalized === "DONE") return "completed";
  if (normalized === "COMPLETED_WITH_ADDENDUM") return "withAddendum";
  if (normalized === "SCHEDULED" || normalized === "CONFIRMED") return "scheduled";
  if (normalized === "WAITING") return "inProgress";
  return "default";
};

const resolveConsultaStatusLabel = (status: string): string => {
  const normalized = status.trim().toUpperCase();
  switch (normalized) {
    case "IN_PROGRESS":
      return "Em andamento";
    case "COMPLETED":
    case "DONE":
      return "Concluido";
    case "COMPLETED_WITH_ADDENDUM":
      return "Concluido com adendo";
    case "SCHEDULED":
      return "Agendado";
    case "CONFIRMED":
      return "Confirmado";
    case "WAITING":
      return "Aguardando";
    case "NO_SHOW":
      return "Nao compareceu";
    case "CANCELLED":
      return "Cancelado";
    default:
      return normalized;
  }
};

/** Retorna true quando o status bloqueia criacao e edicao de documentos */
const isAppointmentLocked = (status: string): boolean => {
  const normalized = status.trim().toUpperCase();
  return (
    normalized === "COMPLETED" ||
    normalized === "COMPLETED_WITH_ADDENDUM" ||
    normalized === "DONE" ||
    normalized === "NO_SHOW" ||
    normalized === "CANCELLED"
  );
};

const formatDocDate = (iso: string): string => {
  if (!iso) return "--/--/----";
  const datePart = iso.split("T")[0];
  return formatIsoDateToBr(datePart, "--/--/----");
};

const buildContextFromParams = (
  params: URLSearchParams,
  appointmentId: string,
): ClinicalDocumentsResult["appointmentContext"] => ({
  appointmentId,
  patientName: params.get("paciente") || "Paciente",
  appointmentDate: params.get("data") || "",
  startTime: params.get("horario") || "--:--",
  professionalName: params.get("profissional") || "",
  councilRegistration: "",
  appointmentStatus: params.get("statusConsulta") || "IN_PROGRESS",
});

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfessionalDocumentosPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("consulta") ?? "";

  const [result, setResult] = useState<ClinicalDocumentsResult>(() => ({
    appointmentContext: buildContextFromParams(searchParams, appointmentId),
    documents: [],
  }));
  const [loading, setLoading] = useState(Boolean(appointmentId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [creatingType, setCreatingType] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [concluding, setConcluding] = useState(false);
  const [addingAddendum, setAddingAddendum] = useState(false);
  const [draftDocumentWarning, setDraftDocumentWarning] = useState<string[] | null>(null);

  const loadDocuments = useCallback(async () => {
    if (!appointmentId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await listClinicalDocuments(appointmentId);
      setResult(data);
      // Se o status retornado for WAITING, atualizar badge localmente para IN_PROGRESS
      // (backend nao possui endpoint de transicao automatica para este status)
      if (data.appointmentContext.appointmentStatus.toUpperCase() === "WAITING") {
        setResult((prev) => ({
          ...prev,
          appointmentContext: { ...prev.appointmentContext, appointmentStatus: "IN_PROGRESS" },
        }));
      }
    } catch (err: unknown) {
      // Se o endpoint nao existir ainda (404) trata como lista vazia —
      // o contexto da consulta ja foi populado pelos params da URL.
      const isAxios404 =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { status?: number } }).response?.status === 404;
      if (!isAxios404) {
        const msg = getApiErrorMessage(err, "Nao foi possivel carregar os documentos.");
        setErrorMessage(msg);
        notifyError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const handleCreateDocument = async (type: ClinicalDocumentType) => {
    if (!appointmentId) return;
    setCreatingType(type);
    try {
      const doc = await createClinicalDocument(appointmentId, type);
      notifySuccess(`${DOC_TYPE_LABEL[type] ?? "Documento"} criado com sucesso.`);
      navigate(`/profissional/documentos/formulario?consulta=${appointmentId}&documento=${doc.id}`);
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Nao foi possivel criar o documento."));
    } finally {
      setCreatingType(null);
    }
  };

  const handleDeleteDocument = async (doc: ClinicalDocumentItem) => {
    if (!appointmentId) return;
    if (doc.status === "FINALIZED" || doc.status === "SENT" || doc.status === "ADDENDUM") {
      notifyError("Este documento nao pode ser excluido.");
      return;
    }
    setDeletingId(doc.id);
    try {
      await deleteClinicalDocument(appointmentId, doc.id);
      notifySuccess("Documento removido.");
      void loadDocuments();
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Nao foi possivel remover o documento."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleConcludeAppointment = async () => {
    if (!appointmentId) return;
    setConcluding(true);
    try {
      const result = await concludeAppointment(appointmentId);
      notifySuccess("Consulta concluida com sucesso.");
      setResult((prev) => ({
        ...prev,
        appointmentContext: {
          ...prev.appointmentContext,
          appointmentStatus: result.status,
        },
      }));
      if (result.draftDocuments && result.draftDocuments.length > 0) {
        setDraftDocumentWarning(result.draftDocuments);
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        notifyError("Sem permissao para concluir esta consulta.");
      } else {
        notifyError(getApiErrorMessage(err, "Nao foi possivel concluir a consulta."));
      }
    } finally {
      setConcluding(false);
    }
  };

  const handleCreateAddendum = async () => {
    if (!appointmentId) return;
    setAddingAddendum(true);
    try {
      const addendumResult = await createAppointmentAddendum(appointmentId);
      notifySuccess("Adendo criado. Registre as alteracoes no novo documento.");
      setResult((prev) => ({
        ...prev,
        appointmentContext: {
          ...prev.appointmentContext,
          appointmentStatus: addendumResult.status,
        },
      }));
      void loadDocuments();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        notifyError("Sem permissao para criar um adendo nesta consulta.");
      } else {
        notifyError(getApiErrorMessage(err, "Nao foi possivel criar o adendo."));
      }
    } finally {
      setAddingAddendum(false);
    }
  };

  const { appointmentContext, documents } = result;
  const appointmentStatus = appointmentContext.appointmentStatus;
  const locked = isAppointmentLocked(appointmentStatus);
  const isCompleted =
    appointmentStatus.toUpperCase() === "COMPLETED" || appointmentStatus.toUpperCase() === "DONE";
  const isWithAddendum = appointmentStatus.toUpperCase() === "COMPLETED_WITH_ADDENDUM";

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>Documentos da Consulta</PageTitle>
          <PageSubtitle>Gerencie os documentos clinicos vinculados a este atendimento</PageSubtitle>
        </PageTitleGroup>

        <HeaderActions>
          <Button
            variant="outline"
            size="medium"
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate("/profissional/agenda")}
          >
            Voltar para agenda
          </Button>

          {/* Concluir consulta — visivel quando nao esta concluida */}
          {appointmentId && !locked && (
            <Button
              variant="primary"
              size="medium"
              icon={<CheckCircle size={15} />}
              onClick={() => void handleConcludeAppointment()}
              disabled={concluding}
            >
              {concluding ? "Concluindo..." : "Concluir consulta"}
            </Button>
          )}

          {/* Consulta concluida — desabilitado */}
          {appointmentId && (isCompleted || isWithAddendum) && (
            <Button variant="outline" size="medium" icon={<CheckCircle size={15} />} disabled>
              Consulta concluida
            </Button>
          )}

          {/* Adicionar adendo — visivel apenas quando COMPLETED */}
          {appointmentId && isCompleted && (
            <Button
              variant="outline"
              size="medium"
              icon={<GitCompareArrows size={15} />}
              onClick={() => void handleCreateAddendum()}
              disabled={addingAddendum}
            >
              {addingAddendum ? "Criando adendo..." : "Adicionar adendo"}
            </Button>
          )}
        </HeaderActions>
      </PageHeader>

      {/* ── Appointment info bar ── */}
      {appointmentId && (
        <AppointmentInfoBar>
          <InfoBarItem>
            <InfoBarLabel>Paciente</InfoBarLabel>
            <InfoBarValue>{appointmentContext.patientName}</InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Consulta</InfoBarLabel>
            <InfoBarValue>
              {formatDocDate(appointmentContext.appointmentDate)} as {appointmentContext.startTime}
            </InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Profissional</InfoBarLabel>
            <InfoBarValue>{appointmentContext.professionalName}</InfoBarValue>
          </InfoBarItem>
          <InfoBarItem>
            <InfoBarLabel>Status da Consulta</InfoBarLabel>
            <InfoBarStatusBadge $variant={resolveConsultaStatusVariant(appointmentStatus)}>
              {resolveConsultaStatusLabel(appointmentStatus)}
            </InfoBarStatusBadge>
          </InfoBarItem>
        </AppointmentInfoBar>
      )}

      {/* ── Alerta de documentos em rascunho apos conclusao ── */}
      {draftDocumentWarning && draftDocumentWarning.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 10,
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            color: "#92400e",
            fontSize: 13,
          }}
        >
          <AlertTriangle size={16} />
          <span>
            <strong>Atencao:</strong> {draftDocumentWarning.length} documento(s) permanecem como
            rascunho e nao foram enviados ao paciente.
          </span>
        </div>
      )}

      {/* ── Loading / Error ── */}
      {loading && <StatusMessage>Carregando documentos...</StatusMessage>}
      {!loading && errorMessage && <StatusMessage $error>{errorMessage}</StatusMessage>}

      {!loading && (
        <>
          {/* ── Novo documento — oculto quando consulta esta bloqueada ── */}
          {!locked && (
            <div>
              <SectionTitle>Novo documento</SectionTitle>
              <DocTypeGrid>
                {DOCUMENT_TYPES.map((docType) => (
                  <DocTypeCard
                    key={docType.type}
                    type="button"
                    onClick={() => void handleCreateDocument(docType.type)}
                    disabled={Boolean(creatingType) || !appointmentId}
                    title={
                      !appointmentId ? "Selecione uma consulta para criar documentos" : undefined
                    }
                  >
                    <DocTypeIconWrap $bg={docType.bgColor} $color={docType.iconColor}>
                      {DOC_TYPE_ICON[docType.type] ?? <FileText size={18} />}
                    </DocTypeIconWrap>
                    <DocTypeInfo>
                      <DocTypeLabel>{docType.label}</DocTypeLabel>
                      <DocTypeDescription>{docType.description}</DocTypeDescription>
                    </DocTypeInfo>
                  </DocTypeCard>
                ))}
              </DocTypeGrid>
            </div>
          )}

          {/* ── Documentos ja criados ── */}
          <div>
            <SectionTitle>Documentos ja criados</SectionTitle>
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
                      Nenhum documento criado para esta consulta.
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
                    const isEditable = docStatus === "DRAFT" && !locked;
                    const isDeletable = docStatus === "DRAFT" && !locked;

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
                            {/* Visualizar */}
                            <DocActionBtn
                              type="button"
                              title="Visualizar"
                              onClick={() =>
                                navigate(
                                  `/profissional/documentos/visualizar?consulta=${appointmentId}&documento=${doc.id}`,
                                )
                              }
                            >
                              <Eye size={14} />
                            </DocActionBtn>

                            {/* Imprimir */}
                            <DocActionBtn
                              type="button"
                              title="Imprimir / PDF"
                              onClick={() =>
                                navigate(
                                  `/profissional/documentos/visualizar?consulta=${appointmentId}&documento=${doc.id}&print=1`,
                                )
                              }
                            >
                              <Printer size={14} />
                            </DocActionBtn>

                            {/* Editar — apenas rascunho e consulta nao bloqueada */}
                            {isEditable && (
                              <DocActionBtn
                                type="button"
                                title="Editar"
                                onClick={() =>
                                  navigate(
                                    `/profissional/documentos/formulario?consulta=${appointmentId}&documento=${doc.id}`,
                                  )
                                }
                              >
                                <Pencil size={14} />
                              </DocActionBtn>
                            )}

                            {/* Duplicar (apenas informativo por ora) */}
                            {isEditable && (
                              <DocActionBtn type="button" title="Duplicar">
                                <Copy size={14} />
                              </DocActionBtn>
                            )}

                            {/* Excluir — apenas rascunho e consulta nao bloqueada */}
                            {isDeletable && (
                              <DocActionBtn
                                type="button"
                                title="Excluir"
                                $danger
                                disabled={deletingId === doc.id}
                                onClick={() => void handleDeleteDocument(doc)}
                              >
                                <Trash2 size={14} />
                              </DocActionBtn>
                            )}
                          </DocActionsCell>
                        </DocsTableTd>
                      </DocsTableRow>
                    );
                  })
                )}
              </DocsTableBody>
            </DocsTable>
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default ProfessionalDocumentosPage;
