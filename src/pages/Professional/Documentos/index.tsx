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
import { Modal } from "../../../components/Modal";
import {
  concludeAppointment,
  getAppointmentById,
  patchAppointmentStatus,
} from "../../../services/appointment.service";
import {
  createClinicalDocument,
  deleteClinicalDocument,
  listClinicalDocuments,
} from "../../../services/clinical-documents.service";
import type { ClinicalDocumentItem, DocPageCache, DocumentAppointmentContext, DocumentTypeCard } from "../../../types/clinical-document";
import { ClinicalDocumentType } from "../../../types/clinical-document";
import { formatIsoDateToBr, formatIsoDateTimeToBr } from "../../../utils/dateParsers";
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
    label: "Relatório Clínico",
    description: "Resumo do quadro, sintomas, avaliação e conduta",
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
    label: "Declaração de Comparecimento",
    description: "Comprovação de comparecimento ou atendimento",
    iconColor: "#8B5CF6",
    bgColor: "#EDE9FE",
  },
  {
    type: ClinicalDocumentType.PRESCRIPTION,
    label: "Receita",
    description: "Prescrição de medicamentos (comum ou controle especial)",
    iconColor: "#F97316",
    bgColor: "#FFEDD5",
  },
  {
    type: ClinicalDocumentType.EXAM_REQUEST,
    label: "Solicitação de Exame",
    description: "Solicitação de exame com justificativa clínica",
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
    description: "Documento formal com conclusão pericial clara",
    iconColor: "#6B7280",
    bgColor: "#F3F4F6",
  },
  {
    type: ClinicalDocumentType.CONTROLLED_PRESCRIPTION,
    label: "Receita Controlada",
    description: "Prescrição de medicamentos com notificação especial",
    iconColor: "#D97706",
    bgColor: "#FEF3C7",
  },
  {
    type: ClinicalDocumentType.CONSENT_FORM,
    label: "Termo de Consentimento",
    description: "Autorização do paciente para procedimentos",
    iconColor: "#059669",
    bgColor: "#D1FAE5",
  },
  {
    type: ClinicalDocumentType.TREATMENT_PLAN,
    label: "Plano Terapêutico",
    description: "Planejamento de intervenções e acompanhamento",
    iconColor: "#7C3AED",
    bgColor: "#EDE9FE",
  },
  {
    type: ClinicalDocumentType.BUDGET,
    label: "Orçamento",
    description: "Orçamento de procedimentos e valores",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDocDateTime = (iso: string): string =>
  formatIsoDateTimeToBr(iso, "America/Sao_Paulo", "--");

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
      return "Concluído";
    case "COMPLETED_WITH_ADDENDUM":
      return "Concluído com adendo";
    case "SCHEDULED":
      return "Agendado";
    case "CONFIRMED":
      return "Confirmado";
    case "WAITING":
      return "Aguardando";
    case "NO_SHOW":
      return "Não compareceu";
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

// ─── Session cache (TTL 2 min) ────────────────────────────────────────────────

const DOC_CACHE_TTL = 2 * 60 * 1000;

function getDocCache(id: string): DocPageCache | null {
  try {
    const raw = sessionStorage.getItem(`doc-page-${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DocPageCache;
    if (Date.now() - parsed.cachedAt > DOC_CACHE_TTL) {
      sessionStorage.removeItem(`doc-page-${id}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setDocCache(id: string, appointmentCtx: DocumentAppointmentContext, documents: ClinicalDocumentItem[]) {
  try {
    const entry: DocPageCache = { appointmentCtx, documents, cachedAt: Date.now() };
    sessionStorage.setItem(`doc-page-${id}`, JSON.stringify(entry));
  } catch {
    // sessionStorage não disponível ou cheio — ignorar silenciosamente
  }
}

function clearDocCache(id: string) {
  sessionStorage.removeItem(`doc-page-${id}`);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfessionalDocumentosPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("consulta") ?? "";

  const [appointmentCtx, setAppointmentCtx] = useState<DocumentAppointmentContext>(() => {
    const cached = getDocCache(appointmentId);
    if (cached) return cached.appointmentCtx;
    return {
      appointmentId,
      patientName: searchParams.get("paciente") || "Paciente",
      appointmentDate: searchParams.get("data") || "",
      startTime: searchParams.get("horario") || "--:--",
      professionalName: searchParams.get("profissional") || "",
      councilRegistration: "",
      appointmentStatus: searchParams.get("statusConsulta") || "IN_PROGRESS",
    };
  });
  const [documents, setDocuments] = useState<ClinicalDocumentItem[]>(
    () => getDocCache(appointmentId)?.documents ?? [],
  );
  const [loading, setLoading] = useState(
    () => Boolean(appointmentId) && !getDocCache(appointmentId),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [creatingType, setCreatingType] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [concluding, setConcluding] = useState(false);
  const [showConcludeModal, setShowConcludeModal] = useState(false);
  const [showAddendumPicker, setShowAddendumPicker] = useState(false);
  const [draftDocumentWarning, setDraftDocumentWarning] =
    useState<Array<{ id: string; documentNumber?: string; type: string }> | null>(null);

  const loadData = useCallback(async (silent = false) => {
    if (!appointmentId) return;
    if (!silent) setLoading(true);
    setErrorMessage(null);
    try {
      // Load appointment context + documents in parallel
      const [appt, docsResult] = await Promise.all([
        getAppointmentById(appointmentId),
        listClinicalDocuments(appointmentId),
      ]);

      let currentStatus = appt.status;

      // Auto-transition SCHEDULED/CONFIRMED/WAITING → IN_PROGRESS
      const PRE_PROGRESS_STATUSES = ["WAITING", "SCHEDULED", "CONFIRMED"];
      if (PRE_PROGRESS_STATUSES.includes(currentStatus.toUpperCase())) {
        try {
          const patched = await patchAppointmentStatus(appointmentId, "IN_PROGRESS");
          currentStatus = patched.status;
        } catch {
          // PATCH falhou (ex: consulta já estava IN_PROGRESS no banco mas o GET retornou status defasado).
          // Re-busca o status real para evitar exibir status incorreto na UI.
          try {
            const fresh = await getAppointmentById(appointmentId);
            currentStatus = fresh.status;
          } catch {
            // Se o re-fetch também falhar, mantém o status do GET original
          }
        }
      }

      const newCtx: DocumentAppointmentContext = {
        appointmentId,
        patientName: appt.patientName,
        appointmentDate: appt.scheduledAt.split("T")[0] ?? "",
        startTime: appt.startTime,
        professionalName: appt.professionalName,
        councilRegistration: appt.councilRegistration,
        appointmentStatus: currentStatus,
      };

      setAppointmentCtx(newCtx);
      setDocuments(docsResult.documents);
      setDocCache(appointmentId, newCtx, docsResult.documents);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Nao foi possivel carregar os dados da consulta.");
      setErrorMessage(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    const hasCached = Boolean(getDocCache(appointmentId));
    void loadData(hasCached);
  }, [loadData, appointmentId]);

  const handleCreateDocument = async (type: ClinicalDocumentType) => {
    if (!appointmentId) return;
    setCreatingType(type);
    try {
      const doc = await createClinicalDocument(appointmentId, type);
      notifySuccess(`${DOC_TYPE_LABEL[type] ?? "Documento"} criado com sucesso.`);
      navigate(`/profissional/documentos/formulario?consulta=${appointmentId}&documento=${doc.id}&novo=1`);
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Nao foi possivel criar o documento."));
    } finally {
      setCreatingType(null);
    }
  };

  const handleDeleteDocument = async (doc: ClinicalDocumentItem) => {
    if (!appointmentId) return;
    if (doc.status === "SENT" || doc.status === "ADDENDUM") {
      notifyError("Este documento nao pode ser excluido.");
      return;
    }
    setDeletingId(doc.id);
    try {
      await deleteClinicalDocument(appointmentId, doc.id);
      notifySuccess("Documento removido.");
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      clearDocCache(appointmentId);
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Nao foi possivel remover o documento."));
    } finally {
      setDeletingId(null);
    }
  };

  const openConcludeModal = () => {
    setShowConcludeModal(true);
  };

  const handleConcludeAppointment = async () => {
    if (!appointmentId) return;
    setShowConcludeModal(false);
    setConcluding(true);
    try {
      const res = await concludeAppointment(appointmentId);
      notifySuccess("Consulta concluida com sucesso.");
      clearDocCache(appointmentId);
      setAppointmentCtx((prev) => ({ ...prev, appointmentStatus: res.status }));
      if (res.draftDocuments && res.draftDocuments.length > 0) {
        setDraftDocumentWarning(res.draftDocuments);
      }
      // Reload document list to reflect SENT status
      const docsResult = await listClinicalDocuments(appointmentId);
      setDocuments(docsResult.documents);
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

  const handlePickAddendumType = (type: ClinicalDocumentType) => {
    setShowAddendumPicker(false);
    navigate(
      `/profissional/documentos/formulario?consulta=${appointmentId}&modo=adendo&tipo=${type}`,
    );
  };

  const appointmentStatus = appointmentCtx.appointmentStatus;
  const locked = isAppointmentLocked(appointmentStatus);
  const isCompleted =
    appointmentStatus.toUpperCase() === "COMPLETED" || appointmentStatus.toUpperCase() === "DONE";
  const isWithAddendum = appointmentStatus.toUpperCase() === "COMPLETED_WITH_ADDENDUM";
  const canAddAddendum = isCompleted || isWithAddendum;
  const draftDocs = documents.filter((d) => d.status === "DRAFT");

  return (
    <PageWrapper>
      {/* ── Confirm conclude modal ── */}
      <Modal
        isOpen={showConcludeModal}
        onClose={() => setShowConcludeModal(false)}
        title="Concluir consulta"
        actions={
          <>
            <Button variant="outline" size="small" onClick={() => setShowConcludeModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="small" onClick={() => void handleConcludeAppointment()}>
              Confirmar conclusao
            </Button>
          </>
        }
      >
        {draftDocs.length > 0 ? (
          <div>
            <p style={{ marginBottom: 8 }}>
              <strong>Atencao:</strong> {draftDocs.length} documento(s) ainda em rascunho serao
              descartados ou permanecerao sem envio:
            </p>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {draftDocs.map((d) => (
                <li key={d.id} style={{ marginBottom: 4 }}>
                  {DOC_TYPE_LABEL[d.type] ?? d.type}
                  {d.documentNumber ? ` — Doc. ${d.documentNumber}` : ""}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 8 }}>Deseja continuar e concluir a consulta mesmo assim?</p>
          </div>
        ) : (
          <p>Tem certeza que deseja concluir esta consulta?</p>
        )}
      </Modal>

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
              onClick={openConcludeModal}
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

          {/* Adicionar adendo — visivel quando COMPLETED ou COMPLETED_WITH_ADDENDUM */}
          {appointmentId && canAddAddendum && (
            <Button
              variant="outline"
              size="medium"
              icon={<GitCompareArrows size={15} />}
              onClick={() => setShowAddendumPicker(true)}
            >
              Adicionar adendo
            </Button>
          )}
        </HeaderActions>
      </PageHeader>

      {/* ── Appointment info bar ── */}
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

      {/* ── Adendo picker ── */}
      {showAddendumPicker && (
        <div>
          <SectionTitle>Selecione o tipo do adendo</SectionTitle>
          <DocTypeGrid>
            {DOCUMENT_TYPES.map((docType) => (
              <DocTypeCard
                key={docType.type}
                type="button"
                onClick={() => handlePickAddendumType(docType.type)}
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
                  <DocsTableTh>Enviado em</DocsTableTh>
                  <DocsTableTh>Status</DocsTableTh>
                  <DocsTableTh>Acoes</DocsTableTh>
                </tr>
              </DocsTableHead>
              <DocsTableBody>
                {documents.length === 0 ? (
                  <tr>
                    <EmptyTableMessage colSpan={4}>
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
                    const isDeletable = !locked && (docStatus === "DRAFT" || docStatus === "FINALIZED");

                    return (
                      <DocsTableRow key={doc.id}>
                        <DocsTableTd>{DOC_TYPE_LABEL[doc.type] ?? doc.type}</DocsTableTd>
                        <DocsTableTd>{formatDocDateTime(doc.createdAt)}</DocsTableTd>
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
