import { Pencil, Plus, Send, Trash2, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import {
  type CompletedConsultationPatient,
  commentService,
  listCompletedConsultationPatients,
} from "../../../services/comment.service";
import type { CommentConsultationType, PatientComment } from "../../../types/comment";
import type { BadgeVariant } from "../../../types/components";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  CommentAvatar,
  CommentCard,
  CommentCardBody,
  CommentCardFooter,
  CommentCardHeader,
  CommentDate,
  CommentInfo,
  CommentLeft,
  CommentPatientName,
  CommentPatientSubtitle,
  CommentRight,
  CommentsList,
  CommentText,
  ConfirmMessage,
  DeleteButton,
  EditButton,
  EmptyState,
  FormActions,
  FormCard,
  FormFields,
  FormTextarea,
  FormTextareaWrapper,
  FormTitle,
  PageHeader,
  PageTitle,
  PageWrapper,
  SearchResultInfo,
  SearchResultMeta,
  SearchResultName,
  SelectedPatientCard,
  SelectedPatientClear,
  SelectedPatientContent,
  SelectedPatientInfo,
  SelectedPatientMeta,
  SelectedPatientName,
  TodayAppointmentItem,
  TodayAppointmentsEmpty,
  TodayAppointmentsList,
} from "./styles";

type ConsultationMeta = { label: string; variant: BadgeVariant };

const CONSULTATION_TYPE_META: Partial<Record<CommentConsultationType, ConsultationMeta>> = {
  FIRST_CONSULTATION: { label: "Primeira consulta", variant: "warning" },
  CONSULTATION: { label: "Consulta", variant: "info" },
  RETURN: { label: "Retorno", variant: "neutral" },
  ROUTINE: { label: "Rotina", variant: "info" },
  EXAM: { label: "Exame", variant: "warning" },
  EMERGENCY: { label: "Urgência", variant: "warning" },
};

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "P";

const formatDate = (iso: string): string => {
  if (!iso) return "--/--/----";

  const [year, month, day] = iso.slice(0, 10).split("-");
  if (!year || !month || !day) return "--/--/----";
  return `${day}/${month}/${year}`;
};

const getCompletedOptionMeta = (patient: CompletedConsultationPatient): string =>
  formatDate(patient.lastCompletedAt);

const ProfessionalCommentsPage = () => {
  const [comments, setComments] = useState<PatientComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [completedPatientOptions, setCompletedPatientOptions] = useState<
    CompletedConsultationPatient[]
  >([]);
  const [loadingCompletedPatients, setLoadingCompletedPatients] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<CompletedConsultationPatient | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [commentPendingDelete, setCommentPendingDelete] = useState<PatientComment | null>(null);
  const [deletingComment, setDeletingComment] = useState(false);

  const resetForm = () => {
    setCompletedPatientOptions([]);
    setLoadingCompletedPatients(false);
    setSelectedPatient(null);
    setCommentText("");
  };

  const loadComments = async () => {
    setLoadingComments(true);

    try {
      const data = await commentService.list();
      setComments(data);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Não foi possível carregar os comentários."));
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    void loadComments();
  }, []);

  useEffect(() => {
    if (!isFormOpen || selectedPatient) return;

    let isMounted = true;

    const loadCompletedPatients = async () => {
      setLoadingCompletedPatients(true);

      try {
        const completedPatients = await listCompletedConsultationPatients();
        if (!isMounted) return;

        setCompletedPatientOptions(completedPatients);
      } catch {
        if (!isMounted) return;
        setCompletedPatientOptions([]);
      } finally {
        if (isMounted) setLoadingCompletedPatients(false);
      }
    };

    void loadCompletedPatients();

    return () => {
      isMounted = false;
    };
  }, [isFormOpen, selectedPatient]);

  const handleOpenForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const selectPatient = (patient: CompletedConsultationPatient) => {
    setSelectedPatient(patient);
  };

  const clearPatient = () => {
    setSelectedPatient(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPatient || !commentText.trim()) {
      notifyError("Selecione um paciente e escreva o comentário.");
      return;
    }

    setSubmitting(true);

    try {
      const createdComment = await commentService.create({
        patientId: selectedPatient.patientId,
        content: commentText.trim(),
      });

      setComments((previousComments) => [
        {
          ...createdComment,
          patientId: createdComment.patientId ?? selectedPatient.patientId,
          patientName: createdComment.patientName || selectedPatient.name,
          patientAvatarUrl: createdComment.patientAvatarUrl ?? selectedPatient.avatarUrl ?? null,
        },
        ...previousComments,
      ]);

      notifySuccess("Comentário salvo com sucesso!");
      handleCancel();
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Não foi possível salvar o comentário."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (comment: PatientComment) => {
    setCommentPendingDelete(comment);
  };

  const closeDeleteModal = () => {
    if (deletingComment) return;
    setCommentPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!commentPendingDelete) return;

    setDeletingComment(true);

    try {
      await commentService.remove(commentPendingDelete.id);
      setComments((previousComments) =>
        previousComments.filter((item) => item.id !== commentPendingDelete.id),
      );
      if (editingCommentId === commentPendingDelete.id) {
        setEditingCommentId(null);
        setEditingText("");
      }
      setCommentPendingDelete(null);
      notifySuccess("Comentário removido.");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Não foi possível remover o comentário."));
    } finally {
      setDeletingComment(false);
    }
  };

  const handleStartEdit = (comment: PatientComment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (comment: PatientComment) => {
    const content = editingText.trim();
    if (!content) {
      notifyError("Digite um comentário válido para salvar.");
      return;
    }

    setSavingEdit(true);

    try {
      const updatedComment = await commentService.update(comment.id, { content });
      setComments((previousComments) =>
        previousComments.map((item) =>
          item.id === comment.id
            ? { ...item, ...updatedComment, content: updatedComment.content || content }
            : item,
        ),
      );
      notifySuccess("Comentário atualizado com sucesso!");
      handleCancelEdit();
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Não foi possível atualizar o comentário."));
    } finally {
      setSavingEdit(false);
    }
  };

  const canSubmit = Boolean(selectedPatient?.patientId && commentText.trim());

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Comentários de Pacientes</PageTitle>
        <Button
          variant="primary"
          size="small"
          icon={<Plus size={16} />}
          disabled={isFormOpen}
          onClick={handleOpenForm}
        >
          Novo Comentário
        </Button>
      </PageHeader>

      {isFormOpen && (
        <FormCard onSubmit={handleSubmit} noValidate>
          <FormTitle>Adicionar Comentário</FormTitle>

          <FormFields>
            {selectedPatient ? (
              <SelectedPatientCard>
                <SelectedPatientContent>
                  <CommentAvatar>
                    {selectedPatient.avatarUrl ? (
                      <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} />
                    ) : (
                      getInitials(selectedPatient.name)
                    )}
                  </CommentAvatar>

                  <SelectedPatientInfo>
                    <SelectedPatientName>{selectedPatient.name}</SelectedPatientName>
                    <SelectedPatientMeta>
                      Consulta concluida em {getCompletedOptionMeta(selectedPatient)}
                    </SelectedPatientMeta>
                  </SelectedPatientInfo>
                </SelectedPatientContent>

                <SelectedPatientClear
                  type="button"
                  onClick={clearPatient}
                  aria-label="Remover paciente selecionado"
                >
                  <X size={16} />
                </SelectedPatientClear>
              </SelectedPatientCard>
            ) : (
              <TodayAppointmentsList>
                {loadingCompletedPatients ? (
                  <TodayAppointmentsEmpty>
                    Carregando pacientes com consultas concluidas...
                  </TodayAppointmentsEmpty>
                ) : completedPatientOptions.length === 0 ? (
                  <TodayAppointmentsEmpty>
                    Nenhum paciente com consulta concluida encontrado.
                  </TodayAppointmentsEmpty>
                ) : (
                  completedPatientOptions.map((patient) => (
                    <TodayAppointmentItem
                      type="button"
                      key={patient.patientId}
                      onClick={() => selectPatient(patient)}
                      $disabled={!patient.patientId}
                      disabled={!patient.patientId}
                    >
                      <CommentAvatar>
                        {patient.avatarUrl ? (
                          <img src={patient.avatarUrl} alt={patient.name} />
                        ) : (
                          getInitials(patient.name)
                        )}
                      </CommentAvatar>

                      <SearchResultInfo>
                        <SearchResultName>{patient.name}</SearchResultName>
                        <SearchResultMeta>{getCompletedOptionMeta(patient)}</SearchResultMeta>
                      </SearchResultInfo>
                    </TodayAppointmentItem>
                  ))
                )}
              </TodayAppointmentsList>
            )}

            <FormTextareaWrapper>
              <FormTextarea
                placeholder="Escreva observacoes, diagnosticos ou orientacoes para o paciente..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                rows={4}
              />
            </FormTextareaWrapper>
          </FormFields>

          <FormActions>
            <Button type="button" variant="outline" size="small" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="small"
              icon={<Send size={15} />}
              iconPosition="right"
              disabled={submitting || !canSubmit}
            >
              Salvar Comentario
            </Button>
          </FormActions>
        </FormCard>
      )}

      {loadingComments ? (
        <EmptyState>Carregando comentarios...</EmptyState>
      ) : comments.length === 0 ? (
        <EmptyState>Nenhum comentario registrado.</EmptyState>
      ) : (
        <CommentsList>
          {comments.map((comment) => {
            const meta = comment.consultationType
              ? CONSULTATION_TYPE_META[comment.consultationType]
              : null;
            const initials = getInitials(comment.patientName);
            const isEditing = editingCommentId === comment.id;

            return (
              <CommentCard key={comment.id}>
                <CommentCardHeader>
                  <CommentLeft>
                    <CommentAvatar>
                      {comment.patientAvatarUrl ? (
                        <img src={comment.patientAvatarUrl} alt={comment.patientName} />
                      ) : (
                        initials
                      )}
                    </CommentAvatar>
                    <CommentInfo>
                      <CommentPatientName>{comment.patientName}</CommentPatientName>
                      <CommentPatientSubtitle>Comentario registrado</CommentPatientSubtitle>
                    </CommentInfo>
                  </CommentLeft>

                  <CommentRight>
                    {meta && <Badge variant={meta.variant}>{meta.label}</Badge>}
                    <CommentDate>{formatDate(comment.date)}</CommentDate>
                  </CommentRight>
                </CommentCardHeader>

                <CommentCardBody>
                  {isEditing ? (
                    <FormTextareaWrapper>
                      <FormTextarea
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        rows={3}
                      />
                    </FormTextareaWrapper>
                  ) : (
                    <CommentText>{comment.content}</CommentText>
                  )}
                </CommentCardBody>

                <CommentCardFooter>
                  {isEditing ? (
                    <>
                      <EditButton type="button" onClick={handleCancelEdit} disabled={savingEdit}>
                        Cancelar
                      </EditButton>
                      <EditButton
                        type="button"
                        onClick={() => void handleSaveEdit(comment)}
                        disabled={savingEdit || !editingText.trim()}
                      >
                        <Send size={13} />
                        Salvar
                      </EditButton>
                    </>
                  ) : (
                    <EditButton type="button" onClick={() => handleStartEdit(comment)}>
                      <Pencil size={13} />
                      Editar
                    </EditButton>
                  )}
                  <DeleteButton
                    type="button"
                    title="Excluir comentario"
                    disabled={(savingEdit && isEditing) || deletingComment}
                    onClick={() => void handleDelete(comment)}
                  >
                    <Trash2 size={14} />
                  </DeleteButton>
                </CommentCardFooter>
              </CommentCard>
            );
          })}
        </CommentsList>
      )}

      {commentPendingDelete && (
        <Modal
          isOpen={Boolean(commentPendingDelete)}
          onClose={closeDeleteModal}
          title="Remover comentario?"
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={closeDeleteModal}
                disabled={deletingComment}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => void confirmDelete()}
                disabled={deletingComment}
              >
                {deletingComment ? "Removendo..." : "Remover"}
              </Button>
            </>
          }
        >
          <ConfirmMessage>
            Essa acao nao pode ser desfeita. O comentario de{" "}
            <strong>{commentPendingDelete.patientName}</strong> sera removido.
          </ConfirmMessage>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default ProfessionalCommentsPage;
