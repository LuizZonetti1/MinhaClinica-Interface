import { Eye, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { ActionIconButton } from "../../../components/ActionIconButton";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { Skeleton } from "../../../components/Skeleton";
import {
  deactivateProfessional,
  deactivateReceptionist,
  inviteProfessional,
  inviteStaff,
  listProfessionals,
  listReceptionists,
  updateProfessional,
  updateReceptionist,
} from "../../../services/admin.service";
import type {
  NewStaffFormData,
  ProfessionalListItem,
  ReceptionistListItem,
  StaffRole,
  UpdateProfessionalPayload,
  UpdateReceptionistPayload,
} from "../../../types/professional";
import { formatPhoneNumber } from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  ActionsGroup,
  Avatar,
  DetailItem,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  EmptyStateCell,
  FieldError,
  FilterSelect,
  FiltersRow,
  ModalFieldGroup,
  ModalForm,
  ModalSelect,
  PageTitle,
  PageWrapper,
  PhoneText,
  ProfessionalCell,
  ProfessionalEmail,
  ProfessionalMeta,
  ProfessionalName,
  SearchField,
  StatusMessage,
  TabButton,
  TableCard,
  TableElement,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TabRow,
  TopRow,
} from "./styles";

type ActiveTab = "professionals" | "receptionists";
type ModalType = "professional" | "receptionist";
type DeleteTarget = {
  id: string;
  name: string;
  type: ModalType;
};

type ProfessionalEditForm = {
  name: string;
  email: string;
  specialty: string;
  professionalCouncil: string;
  registrationNumber: string;
  registrationState: string;
  defaultAppointmentDuration: string;
  isActive: boolean;
};

type ReceptionEditForm = {
  name: string;
  email: string;
  isActive: boolean;
};

const INITIAL_CREATE_FORM_DATA: NewStaffFormData = {
  name: "",
  email: "",
  role: "PROFESSIONAL",
  specialty: "",
};

const AVATAR_COLORS = ["#2563EB", "#16A34A", "#9333EA", "#EA580C", "#4B5563"];

const getInitials = (name: string) =>
  name
    .replace("Dr. ", "")
    .replace("Dra. ", "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const statusLabel = (status: string) => {
  const map: Record<string, string> = { ACTIVE: "Ativo", INACTIVE: "Inativo" };
  return map[status] ?? status;
};

const getSpecialty = (item: ProfessionalListItem) =>
  item.specialty?.trim() || item.specialties[0] || "";

const ProfessionalsPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("professionals");
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const [professionals, setProfessionals] = useState<ProfessionalListItem[]>([]);
  const [receptionists, setReceptionists] = useState<ReceptionistListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<NewStaffFormData>(INITIAL_CREATE_FORM_DATA);
  const [createFormErrors, setCreateFormErrors] = useState<
    Partial<Record<keyof NewStaffFormData, string>>
  >({});
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewType, setViewType] = useState<ModalType | null>(null);
  const [viewProfessional, setViewProfessional] = useState<ProfessionalListItem | null>(null);
  const [viewReceptionist, setViewReceptionist] = useState<ReceptionistListItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editType, setEditType] = useState<ModalType | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [professionalEdit, setProfessionalEdit] = useState<ProfessionalEditForm>({
    name: "",
    email: "",
    specialty: "",
    professionalCouncil: "",
    registrationNumber: "",
    registrationState: "",
    defaultAppointmentDuration: "",
    isActive: true,
  });
  const [receptionEdit, setReceptionEdit] = useState<ReceptionEditForm>({
    name: "",
    email: "",
    isActive: true,
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profs, receps] = await Promise.all([listProfessionals(), listReceptionists()]);
      setProfessionals(profs);
      setReceptionists(receps);
    } catch {
      const message = "Erro ao carregar dados. Tente novamente.";
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const specialties = useMemo(
    () =>
      Array.from(
        new Set(
          professionals.flatMap((p) => {
            if (p.specialties.length > 0) return p.specialties;
            const specialty = getSpecialty(p);
            return specialty ? [specialty] : [];
          }),
        ),
      ),
    [professionals],
  );

  const filteredProfessionals = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return professionals.filter((p) => {
      const specialty = getSpecialty(p);
      const matchesSearch =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.specialties.some((s) => s.toLowerCase().includes(q)) ||
        specialty.toLowerCase().includes(q);

      const matchesSpecialty =
        specialtyFilter === "all" ||
        p.specialties.includes(specialtyFilter) ||
        specialty === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    });
  }, [professionals, searchTerm, specialtyFilter]);

  const filteredReceptionists = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return receptionists.filter(
      (r) =>
        q.length === 0 || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
    );
  }, [receptionists, searchTerm]);

  const handleOpenCreateModal = () => {
    setCreateFormData({
      ...INITIAL_CREATE_FORM_DATA,
      role: activeTab === "receptionists" ? "RECEPTIONIST" : "PROFESSIONAL",
    });
    setCreateFormErrors({});
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormErrors({});
  };

  const handleCreateFieldChange = <K extends keyof NewStaffFormData>(
    field: K,
    value: NewStaffFormData[K],
  ) => {
    setCreateFormData((prev) => {
      const next = { ...prev, [field]: value } as NewStaffFormData;
      if (field === "role" && value === "RECEPTIONIST") {
        next.specialty = "";
      }
      return next;
    });

    setCreateFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof NewStaffFormData, string>> = {};
    if (!createFormData.name.trim()) nextErrors.name = "Nome obrigatorio.";
    if (!createFormData.email.trim()) nextErrors.email = "Email obrigatorio.";
    if (!createFormData.role) nextErrors.role = "Selecione uma função.";
    if (createFormData.role === "PROFESSIONAL" && !createFormData.specialty.trim()) {
      nextErrors.specialty = "Especialidade obrigatoria.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setCreateFormErrors(nextErrors);
      return;
    }

    setIsSubmittingInvite(true);
    try {
      if (createFormData.role === "PROFESSIONAL") {
        await inviteProfessional({
          name: createFormData.name.trim(),
          email: createFormData.email.trim(),
          specialty: createFormData.specialty.trim(),
        });
      } else {
        await inviteStaff({
          name: createFormData.name.trim(),
          email: createFormData.email.trim(),
          role: createFormData.role,
        });
      }

      notifySuccess("Convite enviado com sucesso.");
      handleCloseCreateModal();
      await fetchData();
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Não foi possível enviar o convite."));
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const openViewProfessional = (item: ProfessionalListItem) => {
    setViewType("professional");
    setViewProfessional(item);
    setViewReceptionist(null);
    setIsViewOpen(true);
  };

  const openViewReceptionist = (item: ReceptionistListItem) => {
    setViewType("receptionist");
    setViewReceptionist(item);
    setViewProfessional(null);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setViewType(null);
    setViewProfessional(null);
    setViewReceptionist(null);
  };

  const openEditProfessional = (item: ProfessionalListItem) => {
    setEditType("professional");
    setEditId(item.id);
    setEditErrors({});
    setProfessionalEdit({
      name: item.name,
      email: item.email,
      specialty: getSpecialty(item),
      professionalCouncil: item.professionalCouncil ?? "",
      registrationNumber: item.registrationNumber ?? "",
      registrationState: (item.registrationState ?? "").toUpperCase(),
      defaultAppointmentDuration:
        typeof item.defaultAppointmentDuration === "number"
          ? String(item.defaultAppointmentDuration)
          : "",
      isActive: item.isActive ?? item.status === "ACTIVE",
    });
    setIsEditOpen(true);
  };

  const openEditReceptionist = (item: ReceptionistListItem) => {
    setEditType("receptionist");
    setEditId(item.id);
    setEditErrors({});
    setReceptionEdit({
      name: item.name,
      email: item.email,
      isActive: item.isActive ?? item.status === "ACTIVE",
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditType(null);
    setEditId(null);
    setEditErrors({});
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editType || !editId) return;

    const errors: Record<string, string> = {};
    if (editType === "professional") {
      if (!professionalEdit.name.trim()) errors.name = "Nome obrigatório.";
      if (!professionalEdit.email.trim()) errors.email = "Email obrigatório.";
      if (!professionalEdit.specialty.trim()) errors.specialty = "Especialidade obrigatória.";
      if (!professionalEdit.professionalCouncil.trim())
        errors.professionalCouncil = "Conselho obrigatório.";
      if (!professionalEdit.registrationNumber.trim())
        errors.registrationNumber = "Registro obrigatório.";
      if (!/^[A-Z]{2}$/.test(professionalEdit.registrationState.trim().toUpperCase())) {
        errors.registrationState = "UF inválida.";
      }
    } else {
      if (!receptionEdit.name.trim()) errors.name = "Nome obrigatório.";
      if (!receptionEdit.email.trim()) errors.email = "Email obrigatório.";
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setIsSavingEdit(true);
    try {
      if (editType === "professional") {
        const payload: UpdateProfessionalPayload = {
          name: professionalEdit.name.trim(),
          email: professionalEdit.email.trim(),
          specialty: professionalEdit.specialty.trim(),
          professionalCouncil: professionalEdit.professionalCouncil.trim().toUpperCase(),
          registrationNumber: professionalEdit.registrationNumber.trim(),
          registrationState: professionalEdit.registrationState.trim().toUpperCase(),
          defaultAppointmentDuration: professionalEdit.defaultAppointmentDuration.trim()
            ? Number(professionalEdit.defaultAppointmentDuration)
            : undefined,
          isActive: professionalEdit.isActive,
        };
        await updateProfessional(editId, payload);
        notifySuccess("Profissional atualizado com sucesso.");
      } else {
        const payload: UpdateReceptionistPayload = {
          name: receptionEdit.name.trim(),
          email: receptionEdit.email.trim(),
          isActive: receptionEdit.isActive,
        };
        await updateReceptionist(editId, payload);
        notifySuccess("Recepção atualizada com sucesso.");
      }

      closeEditModal();
      await fetchData();
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Não foi possível salvar as alterações."));
    } finally {
      setIsSavingEdit(false);
    }
  };

  const openDeleteProfessional = (item: ProfessionalListItem) => {
    setDeleteTarget({ id: item.id, name: item.name, type: "professional" });
    setIsDeleteOpen(true);
  };

  const openDeleteReceptionist = (item: ReceptionistListItem) => {
    setDeleteTarget({ id: item.id, name: item.name, type: "receptionist" });
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setBusyId(deleteTarget.id);
    try {
      if (deleteTarget.type === "professional") {
        await deactivateProfessional(deleteTarget.id);
        notifySuccess("Profissional removido com sucesso.");
      } else {
        await deactivateReceptionist(deleteTarget.id);
        notifySuccess("Recepção removida com sucesso.");
      }

      setIsDeleteOpen(false);
      setDeleteTarget(null);
      await fetchData();
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Não foi possível remover o registro."));
    } finally {
      setBusyId(null);
      setIsDeleting(false);
    }
  };

  return (
    <PageWrapper>
      <TopRow>
        <PageTitle>Equipe</PageTitle>
        <Button size="small" icon={<Plus size={16} />} onClick={handleOpenCreateModal}>
          {activeTab === "professionals" ? "Novo Profissional" : "Novo Recepcionista"}
        </Button>
      </TopRow>

      <TabRow>
        <TabButton
          $active={activeTab === "professionals"}
          onClick={() => setActiveTab("professionals")}
        >
          Profissionais ({professionals.length})
        </TabButton>
        <TabButton
          $active={activeTab === "receptionists"}
          onClick={() => setActiveTab("receptionists")}
        >
          Recepção ({receptionists.length})
        </TabButton>
      </TabRow>

      <FiltersRow>
        <SearchField>
          <Input
            fullWidth
            placeholder={
              activeTab === "professionals"
                ? "Buscar por nome ou especialidade..."
                : "Buscar por nome ou email..."
            }
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </SearchField>

        {activeTab === "professionals" && (
          <FilterSelect
            value={specialtyFilter}
            onChange={(event) => setSpecialtyFilter(event.target.value)}
          >
            <option value="all">Especialidade</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </FilterSelect>
        )}
      </FiltersRow>

      {loading && !error && (
        <TableCard>
          <TableElement>
            <thead>
              {activeTab === "professionals" ? (
                <TableHeaderRow>
                  <TableHeaderCell>PROFISSIONAL</TableHeaderCell>
                  <TableHeaderCell>ESPECIALIDADES</TableHeaderCell>
                  <TableHeaderCell>CONSELHO</TableHeaderCell>
                  <TableHeaderCell>CONSULTAS (MÊS)</TableHeaderCell>
                  <TableHeaderCell>STATUS</TableHeaderCell>
                  <TableHeaderCell>AÇÕES</TableHeaderCell>
                </TableHeaderRow>
              ) : (
                <TableHeaderRow>
                  <TableHeaderCell>RECEPCIONISTA</TableHeaderCell>
                  <TableHeaderCell>TELEFONE</TableHeaderCell>
                  <TableHeaderCell>FUNÇÃO</TableHeaderCell>
                  <TableHeaderCell>CONSULTAS (MÊS)</TableHeaderCell>
                  <TableHeaderCell>STATUS</TableHeaderCell>
                  <TableHeaderCell>AÇÕES</TableHeaderCell>
                </TableHeaderRow>
              )}
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`staff-skeleton-${index}`}>
                  <td>
                    <ProfessionalCell>
                      <Skeleton variant="circle" width={38} height={38} />
                      <ProfessionalMeta>
                        <Skeleton width={150} height={14} />
                        <Skeleton width={190} height={12} />
                      </ProfessionalMeta>
                    </ProfessionalCell>
                  </td>
                  <td>
                    {activeTab === "professionals" ? (
                      <div style={{ display: "inline-flex", gap: 8 }}>
                        <Skeleton width={88} height={24} radius={999} />
                        <Skeleton width={72} height={24} radius={999} />
                      </div>
                    ) : (
                      <Skeleton width={112} height={14} />
                    )}
                  </td>
                  {activeTab === "professionals" && (
                  <td>
                    <Skeleton width={96} height={14} />
                  </td>
                  )}
                  <td>
                    <Skeleton width={24} height={14} />
                  </td>
                  <td>
                    <Skeleton width={78} height={24} radius={999} />
                  </td>
                  <td>
                    <ActionsGroup>
                      <Skeleton variant="circle" width={32} height={32} />
                      <Skeleton variant="circle" width={32} height={32} />
                      <Skeleton variant="circle" width={32} height={32} />
                    </ActionsGroup>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </TableElement>
        </TableCard>
      )}
      {error && <StatusMessage $variant="error">{error}</StatusMessage>}

      {!loading && !error && activeTab === "professionals" && (
        <TableCard>
          <TableElement>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>PROFISSIONAL</TableHeaderCell>
                <TableHeaderCell>ESPECIALIDADES</TableHeaderCell>
                <TableHeaderCell>CONSELHO</TableHeaderCell>
                <TableHeaderCell>CONSULTAS (MÊS)</TableHeaderCell>
                <TableHeaderCell>STATUS</TableHeaderCell>
                <TableHeaderCell>AÇÕES</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {filteredProfessionals.length === 0 && (
                <TableRow>
                  <EmptyStateCell colSpan={6}>Nenhum profissional encontrado.</EmptyStateCell>
                </TableRow>
              )}
              {filteredProfessionals.map((p, i) => (
                <TableRow key={p.id}>
                  <td>
                    <ProfessionalCell>
                      <Avatar $bgColor={AVATAR_COLORS[i % AVATAR_COLORS.length]}>
                        {p.avatarUrl ? (
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            style={{ width: 38, height: 38, borderRadius: "50%" }}
                          />
                        ) : (
                          getInitials(p.name)
                        )}
                      </Avatar>
                      <ProfessionalMeta>
                        <ProfessionalName>{p.name}</ProfessionalName>
                        <ProfessionalEmail>{p.email}</ProfessionalEmail>
                      </ProfessionalMeta>
                    </ProfessionalCell>
                  </td>
                  <td>
                    {(p.specialties.length > 0
                      ? p.specialties
                      : [getSpecialty(p)].filter(Boolean)
                    ).map((s) => (
                      <Badge key={s} variant="info">
                        {s}
                      </Badge>
                    ))}
                  </td>
                  <td>
                    <PhoneText>
                      {p.professionalCouncil} {p.registrationNumber}
                      {p.registrationState ? `/${p.registrationState}` : ""}
                    </PhoneText>
                  </td>
                  <td>{p.appointmentsThisMonth}</td>
                  <td>
                    <Badge variant={p.isActive ? "success" : "neutral"}>
                      {statusLabel(p.status)}
                    </Badge>
                  </td>
                  <td>
                    <ActionsGroup>
                      <ActionIconButton
                        variant="view"
                        icon={<Eye />}
                        aria-label={`Visualizar ${p.name}`}
                        onClick={() => openViewProfessional(p)}
                      />
                      <ActionIconButton
                        variant="edit"
                        icon={<Pencil />}
                        aria-label={`Editar ${p.name}`}
                        onClick={() => openEditProfessional(p)}
                      />
                      <ActionIconButton
                        variant="delete"
                        icon={<Trash2 />}
                        aria-label={`Excluir ${p.name}`}
                        onClick={() => openDeleteProfessional(p)}
                        disabled={busyId === p.id}
                      />
                    </ActionsGroup>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </TableElement>
        </TableCard>
      )}

      {!loading && !error && activeTab === "receptionists" && (
        <TableCard>
          <TableElement>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>RECEPCIONISTA</TableHeaderCell>
                <TableHeaderCell>TELEFONE</TableHeaderCell>
                <TableHeaderCell>CONSULTAS (MÊS)</TableHeaderCell>
                <TableHeaderCell>STATUS</TableHeaderCell>
                <TableHeaderCell>AÇÕES</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {filteredReceptionists.length === 0 && (
                <TableRow>
                  <EmptyStateCell colSpan={5}>Nenhum recepcionista encontrado.</EmptyStateCell>
                </TableRow>
              )}
              {filteredReceptionists.map((r, i) => (
                <TableRow key={r.id}>
                  <td>
                    <ProfessionalCell>
                      <Avatar $bgColor={AVATAR_COLORS[i % AVATAR_COLORS.length]}>
                        {r.avatarUrl ? (
                          <img
                            src={r.avatarUrl}
                            alt={r.name}
                            style={{ width: 38, height: 38, borderRadius: "50%" }}
                          />
                        ) : (
                          getInitials(r.name)
                        )}
                      </Avatar>
                      <ProfessionalMeta>
                        <ProfessionalName>{r.name}</ProfessionalName>
                        <ProfessionalEmail>{r.email}</ProfessionalEmail>
                      </ProfessionalMeta>
                    </ProfessionalCell>
                  </td>
                  <td>
                    <PhoneText>{formatPhoneNumber(r.phone)}</PhoneText>
                  </td>
                  <td>{r.appointmentsThisMonth}</td>
                  <td>
                    <Badge variant={r.status === "ACTIVE" ? "success" : "neutral"}>
                      {statusLabel(r.status)}
                    </Badge>
                  </td>
                  <td>
                    <ActionsGroup>
                      <ActionIconButton
                        variant="view"
                        icon={<Eye />}
                        aria-label={`Visualizar ${r.name}`}
                        onClick={() => openViewReceptionist(r)}
                      />
                      <ActionIconButton
                        variant="edit"
                        icon={<Pencil />}
                        aria-label={`Editar ${r.name}`}
                        onClick={() => openEditReceptionist(r)}
                      />
                      <ActionIconButton
                        variant="delete"
                        icon={<Trash2 />}
                        aria-label={`Excluir ${r.name}`}
                        onClick={() => openDeleteReceptionist(r)}
                        disabled={busyId === r.id}
                      />
                    </ActionsGroup>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </TableElement>
        </TableCard>
      )}

      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          title={
            createFormData.role === "PROFESSIONAL" ? "Novo Profissional" : "Novo Recepcionista"
          }
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                size="small"
                icon={<X size={14} />}
                onClick={handleCloseCreateModal}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="create-staff-form"
                size="small"
                icon={<Save size={14} />}
                disabled={isSubmittingInvite}
              >
                {isSubmittingInvite ? "Enviando..." : "Salvar"}
              </Button>
            </>
          }
        >
          <ModalForm id="create-staff-form" onSubmit={handleCreateSubmit}>
            <Input
              label="Nome Completo"
              fullWidth
              value={createFormData.name}
              onChange={(event) => handleCreateFieldChange("name", event.target.value)}
              error={createFormErrors.name}
            />

            <Input
              label="Email"
              type="email"
              fullWidth
              value={createFormData.email}
              onChange={(event) => handleCreateFieldChange("email", event.target.value)}
              error={createFormErrors.email}
            />

            <ModalFieldGroup>
              <label htmlFor="new-staff-role">Função</label>
              <ModalSelect
                id="new-staff-role"
                value={createFormData.role}
                onChange={(event) =>
                  handleCreateFieldChange("role", event.target.value as StaffRole)
                }
              >
                <option value="PROFESSIONAL">Profissional</option>
                <option value="RECEPTIONIST">Recepção</option>
              </ModalSelect>
              {createFormErrors.role && <FieldError>{createFormErrors.role}</FieldError>}
            </ModalFieldGroup>

            {createFormData.role === "PROFESSIONAL" && (
              <Input
                label="Especialidade"
                fullWidth
                value={createFormData.specialty}
                onChange={(event) => handleCreateFieldChange("specialty", event.target.value)}
                error={createFormErrors.specialty}
              />
            )}
          </ModalForm>
        </Modal>
      )}

      {isViewOpen && (
        <Modal
          isOpen={isViewOpen}
          onClose={closeViewModal}
          title={viewType === "professional" ? "Detalhes do profissional" : "Detalhes da recepção"}
          actions={
            <Button type="button" variant="outline" size="small" onClick={closeViewModal}>
              Fechar
            </Button>
          }
        >
          {viewType === "professional" && viewProfessional && (
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Nome</DetailLabel>
                <DetailValue>{viewProfessional.name}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{viewProfessional.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Especialidade</DetailLabel>
                <DetailValue>{getSpecialty(viewProfessional) || "-"}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>{statusLabel(viewProfessional.status)}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          )}

          {viewType === "receptionist" && viewReceptionist && (
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Nome</DetailLabel>
                <DetailValue>{viewReceptionist.name}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{viewReceptionist.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Telefone</DetailLabel>
                <DetailValue>{formatPhoneNumber(viewReceptionist.phone)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>{statusLabel(viewReceptionist.status)}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          )}
        </Modal>
      )}

      {isEditOpen && (
        <Modal
          isOpen={isEditOpen}
          onClose={closeEditModal}
          title={editType === "professional" ? "Editar profissional" : "Editar recepção"}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                size="small"
                icon={<X size={14} />}
                onClick={closeEditModal}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="edit-staff-form"
                size="small"
                icon={<Save size={14} />}
                disabled={isSavingEdit}
              >
                {isSavingEdit ? "Salvando..." : "Salvar"}
              </Button>
            </>
          }
        >
          <ModalForm id="edit-staff-form" onSubmit={submitEdit}>
            {editType === "professional" && (
              <>
                <Input
                  label="Nome"
                  fullWidth
                  value={professionalEdit.name}
                  onChange={(event) =>
                    setProfessionalEdit((prev) => ({ ...prev, name: event.target.value }))
                  }
                  error={editErrors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  fullWidth
                  value={professionalEdit.email}
                  onChange={(event) =>
                    setProfessionalEdit((prev) => ({ ...prev, email: event.target.value }))
                  }
                  error={editErrors.email}
                />
                <Input
                  label="Especialidade"
                  fullWidth
                  value={professionalEdit.specialty}
                  onChange={(event) =>
                    setProfessionalEdit((prev) => ({ ...prev, specialty: event.target.value }))
                  }
                  error={editErrors.specialty}
                />
                <Input
                  label="Conselho profissional"
                  fullWidth
                  value={professionalEdit.professionalCouncil}
                  onChange={(event) =>
                    setProfessionalEdit((prev) => ({
                      ...prev,
                      professionalCouncil: event.target.value,
                    }))
                  }
                  error={editErrors.professionalCouncil}
                />
                <Input
                  label="Numero do registro"
                  fullWidth
                  value={professionalEdit.registrationNumber}
                  onChange={(event) =>
                    setProfessionalEdit((prev) => ({
                      ...prev,
                      registrationNumber: event.target.value,
                    }))
                  }
                  error={editErrors.registrationNumber}
                />
                <Input
                  label="UF do registro"
                  maxLength={2}
                  fullWidth
                  value={professionalEdit.registrationState}
                  onChange={(event) =>
                    setProfessionalEdit((prev) => ({
                      ...prev,
                      registrationState: event.target.value.toUpperCase(),
                    }))
                  }
                  error={editErrors.registrationState}
                />
                <Input
                  label="Duracao padrao (min)"
                  inputMode="numeric"
                  fullWidth
                  value={professionalEdit.defaultAppointmentDuration}
                  onChange={(event) =>
                    setProfessionalEdit((prev) => ({
                      ...prev,
                      defaultAppointmentDuration: event.target.value,
                    }))
                  }
                />
                <ModalFieldGroup>
                  <label htmlFor="professional-status">Status</label>
                  <ModalSelect
                    id="professional-status"
                    value={professionalEdit.isActive ? "ACTIVE" : "INACTIVE"}
                    onChange={(event) =>
                      setProfessionalEdit((prev) => ({
                        ...prev,
                        isActive: event.target.value === "ACTIVE",
                      }))
                    }
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </ModalSelect>
                </ModalFieldGroup>
              </>
            )}

            {editType === "receptionist" && (
              <>
                <Input
                  label="Nome"
                  fullWidth
                  value={receptionEdit.name}
                  onChange={(event) =>
                    setReceptionEdit((prev) => ({ ...prev, name: event.target.value }))
                  }
                  error={editErrors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  fullWidth
                  value={receptionEdit.email}
                  onChange={(event) =>
                    setReceptionEdit((prev) => ({ ...prev, email: event.target.value }))
                  }
                  error={editErrors.email}
                />
                <ModalFieldGroup>
                  <label htmlFor="reception-status">Status</label>
                  <ModalSelect
                    id="reception-status"
                    value={receptionEdit.isActive ? "ACTIVE" : "INACTIVE"}
                    onChange={(event) =>
                      setReceptionEdit((prev) => ({
                        ...prev,
                        isActive: event.target.value === "ACTIVE",
                      }))
                    }
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </ModalSelect>
                </ModalFieldGroup>
              </>
            )}
          </ModalForm>
        </Modal>
      )}

      {isDeleteOpen && deleteTarget && (
        <Modal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          title="Confirmar exclusao"
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                size="small"
                icon={<X size={14} />}
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="small"
                icon={<Trash2 size={14} />}
                onClick={() => void handleConfirmDelete()}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            {`Deseja excluir ${
              deleteTarget.type === "professional" ? "o profissional" : "a recepção"
            } ${deleteTarget.name}?`}
          </p>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default ProfessionalsPage;
