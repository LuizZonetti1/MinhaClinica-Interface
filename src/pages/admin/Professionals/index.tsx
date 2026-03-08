import { Eye, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { ActionIconButton } from "../../../components/ActionIconButton";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import {
  ActionsGroup,
  Avatar,
  EmptyStateCell,
  FieldError,
  FilterSelect,
  FiltersRow,
  ModalActions,
  ModalCard,
  ModalFieldGroup,
  ModalForm,
  ModalOverlay,
  ModalSelect,
  ModalTitle,
  PageTitle,
  PageWrapper,
  ProfessionalCell,
  ProfessionalEmail,
  ProfessionalMeta,
  ProfessionalName,
  SearchField,
  TableCard,
  TableElement,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TopRow,
} from "./styles";

type ProfessionalStatus = "ACTIVE" | "INACTIVE";
type StaffRole = "PROFESSIONAL" | "RECEPTIONIST";

interface ProfessionalItem {
  id: string;
  name: string;
  email: string;
  specialty: string;
  monthlyConsultations: number;
  status: ProfessionalStatus;
}

const PROFESSIONALS_MOCK: ProfessionalItem[] = [
  {
    id: "pro-1",
    name: "Dr. Joao Santos",
    email: "joao.santos@clinica.com",
    specialty: "Cardiologia",
    monthlyConsultations: 48,
    status: "ACTIVE",
  },
  {
    id: "pro-2",
    name: "Dra. Ana Paula",
    email: "ana.paula@clinica.com",
    specialty: "Clinica Geral",
    monthlyConsultations: 62,
    status: "INACTIVE",
  },
];

const AVATAR_COLORS = ["#2563EB", "#16A34A", "#9333EA", "#EA580C", "#4B5563"];

const getInitials = (name: string) =>
  name
    .replace("Dr. ", "")
    .replace("Dra. ", "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const statusLabelByType: Record<ProfessionalStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

interface NewStaffFormData {
  name: string;
  email: string;
  role: StaffRole;
  specialty: string;
}

const INITIAL_FORM_DATA: NewStaffFormData = {
  name: "",
  email: "",
  role: "PROFESSIONAL",
  specialty: "",
};

const ProfessionalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<NewStaffFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NewStaffFormData, string>>>({});

  const specialties = useMemo(
    () => Array.from(new Set(PROFESSIONALS_MOCK.map((item) => item.specialty))),
    [],
  );

  const filteredProfessionals = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return PROFESSIONALS_MOCK.filter((professional) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        professional.name.toLowerCase().includes(normalizedQuery) ||
        professional.email.toLowerCase().includes(normalizedQuery) ||
        professional.specialty.toLowerCase().includes(normalizedQuery);

      const matchesSpecialty =
        specialtyFilter === "all" || professional.specialty === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    });
  }, [searchTerm, specialtyFilter]);

  const handleOpenCreateModal = () => {
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormErrors({});
  };

  const handleFieldChange = <K extends keyof NewStaffFormData>(field: K, value: NewStaffFormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as NewStaffFormData;
      if (field === "role" && value === "RECEPTIONIST") {
        next.specialty = "";
      }
      return next;
    });

    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof NewStaffFormData, string>> = {};

    if (!formData.name.trim()) nextErrors.name = "Nome obrigatorio.";
    if (!formData.email.trim()) nextErrors.email = "Email obrigatorio.";
    if (!formData.role) nextErrors.role = "Selecione uma funcao.";

    if (formData.role === "PROFESSIONAL" && !formData.specialty.trim()) {
      nextErrors.specialty = "Especialidade obrigatoria para profissional.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const verificationEmailRoute =
      formData.role === "PROFESSIONAL"
        ? "/api/professionals/send-verification-email"
        : "/api/reception/send-verification-email";

    const payload = {
      ...formData,
      status: "ACTIVE" as ProfessionalStatus,
    };

    console.log("TODO: enviar convite", { payload, verificationEmailRoute });
    handleCloseCreateModal();
  };

  return (
    <PageWrapper>
      <TopRow>
        <PageTitle>Profissionais</PageTitle>
        <Button size="small" icon={<Plus size={16} />} onClick={handleOpenCreateModal}>
          Novo Profissional
        </Button>
      </TopRow>

      <FiltersRow>
        <SearchField>
          <Input
            fullWidth
            placeholder="Buscar por nome ou especialidade..."
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </SearchField>

        <FilterSelect
          aria-label="Filtrar por especialidade"
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
      </FiltersRow>

      <TableCard>
        <TableElement>
          <thead>
            <TableHeaderRow>
              <TableHeaderCell>PROFISSIONAL</TableHeaderCell>
              <TableHeaderCell>ESPECIALIDADE</TableHeaderCell>
              <TableHeaderCell>CONSULTAS (MES)</TableHeaderCell>
              <TableHeaderCell>STATUS</TableHeaderCell>
              <TableHeaderCell>ACOES</TableHeaderCell>
            </TableHeaderRow>
          </thead>

          <tbody>
            {filteredProfessionals.length === 0 && (
              <TableRow>
                <EmptyStateCell colSpan={5}>Nenhum profissional encontrado.</EmptyStateCell>
              </TableRow>
            )}

            {filteredProfessionals.map((professional, index) => (
              <TableRow key={professional.id}>
                <td>
                  <ProfessionalCell>
                    <Avatar $bgColor={AVATAR_COLORS[index % AVATAR_COLORS.length]}>
                      {getInitials(professional.name)}
                    </Avatar>
                    <ProfessionalMeta>
                      <ProfessionalName>{professional.name}</ProfessionalName>
                      <ProfessionalEmail>{professional.email}</ProfessionalEmail>
                    </ProfessionalMeta>
                  </ProfessionalCell>
                </td>

                <td>
                  <Badge variant="info">{professional.specialty}</Badge>
                </td>

                <td>{professional.monthlyConsultations}</td>

                <td>
                  <Badge variant={professional.status === "ACTIVE" ? "success" : "neutral"}>
                    {statusLabelByType[professional.status]}
                  </Badge>
                </td>

                <td>
                  <ActionsGroup>
                    <ActionIconButton
                      variant="view"
                      icon={<Eye />}
                      aria-label={`Visualizar ${professional.name}`}
                    />
                    <ActionIconButton
                      variant="edit"
                      icon={<Pencil />}
                      aria-label={`Editar ${professional.name}`}
                    />
                    <ActionIconButton
                      variant="delete"
                      icon={<Trash2 />}
                      aria-label={`Excluir ${professional.name}`}
                    />
                  </ActionsGroup>
                </td>
              </TableRow>
            ))}
          </tbody>
        </TableElement>
      </TableCard>

      {isCreateModalOpen && (
        <ModalOverlay onClick={handleCloseCreateModal}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>Novo Profissional</ModalTitle>

            <ModalForm onSubmit={handleCreateSubmit}>
              <Input
                label="Nome Completo"
                placeholder="Digite o nome completo"
                fullWidth
                value={formData.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                error={formErrors.name}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Digite o email"
                fullWidth
                value={formData.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                error={formErrors.email}
              />

              <ModalFieldGroup>
                <label htmlFor="new-staff-role">Funcao</label>
                <ModalSelect
                  id="new-staff-role"
                  value={formData.role}
                  onChange={(event) => handleFieldChange("role", event.target.value as StaffRole)}
                >
                  <option value="PROFESSIONAL">Profissional</option>
                  <option value="RECEPTIONIST">Recepcao</option>
                </ModalSelect>
                {formErrors.role && <FieldError>{formErrors.role}</FieldError>}
              </ModalFieldGroup>

              {formData.role === "PROFESSIONAL" && (
                <Input
                  label="Especialidade"
                  placeholder="Digite a especialidade"
                  fullWidth
                  value={formData.specialty}
                  onChange={(event) => handleFieldChange("specialty", event.target.value)}
                  error={formErrors.specialty}
                />
              )}

              <ModalActions>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  icon={<X size={14} />}
                  onClick={handleCloseCreateModal}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="small" icon={<Save size={14} />}>
                  Salvar
                </Button>
              </ModalActions>
            </ModalForm>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default ProfessionalsPage;
