import { Eye, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActionIconButton } from "../../../components/ActionIconButton";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { getPatientSummary, listPatientsAdmin } from "../../../services/patient-admin.service";
import type { PatientListItem, PatientSummary } from "../../../types/patient";
import {
  formatDateDayMonthYear,
  formatPhoneNumber,
  normalizePhoneDigits,
} from "../../../utils/formatters";
import { notifyError } from "../../../utils/toast";
import {
  ActionsGroup,
  Avatar,
  DetailItem,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  EmptyStateCell,
  FiltersRow,
  ModalActions,
  ModalCard,
  ModalOverlay,
  ModalTitle,
  PageTitle,
  PageWrapper,
  PatientCell,
  PatientEmail,
  PatientMeta,
  PatientName,
  PhoneText,
  SearchField,
  StatusMessage,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  TableCard,
  TableElement,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TopRow,
} from "./styles";

const AVATAR_COLORS = ["#2563EB", "#16A34A", "#9333EA", "#EA580C", "#4B5563"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    BLOCKED: "Bloqueado",
  };
  return map[status] ?? status;
};

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewPatient, setViewPatient] = useState<PatientListItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientListResponse, patientSummary] = await Promise.all([
        listPatientsAdmin(),
        getPatientSummary(),
      ]);
      setPatients(patientListResponse.items);
      setSummary(patientSummary);
    } catch {
      const message = "Erro ao carregar pacientes. Tente novamente.";
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    void fetchData();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const phoneQuery = normalizePhoneDigits(q);
    if (q.length === 0) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (phoneQuery.length > 0 && normalizePhoneDigits(p.phone).includes(phoneQuery)),
    );
  }, [patients, searchTerm]);

  const openView = (patient: PatientListItem) => {
    setViewPatient(patient);
    setIsViewOpen(true);
  };

  const closeView = () => {
    setIsViewOpen(false);
    setViewPatient(null);
  };

  return (
    <PageWrapper>
      <TopRow>
        <PageTitle>Pacientes</PageTitle>
      </TopRow>

      {summary && (
        <SummaryGrid>
          <SummaryCard $borderColor="#3B82F6">
            <SummaryLabel>Total Cadastrado</SummaryLabel>
            <SummaryValue>{summary.total}</SummaryValue>
          </SummaryCard>
          <SummaryCard $borderColor="#22C55E">
            <SummaryLabel>Pacientes Ativos</SummaryLabel>
            <SummaryValue>{summary.active}</SummaryValue>
          </SummaryCard>
          <SummaryCard $borderColor="#94A3B8">
            <SummaryLabel>Pacientes Inativos</SummaryLabel>
            <SummaryValue>{summary.inactive}</SummaryValue>
          </SummaryCard>
          <SummaryCard $borderColor="#9333EA">
            <SummaryLabel>Novos este Mês</SummaryLabel>
            <SummaryValue>+{summary.newThisMonth}</SummaryValue>
          </SummaryCard>
        </SummaryGrid>
      )}

      <FiltersRow>
        <SearchField>
          <Input
            fullWidth
            placeholder="Buscar por nome, email ou telefone..."
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </SearchField>
      </FiltersRow>

      {loading && <StatusMessage>Carregando...</StatusMessage>}
      {error && <StatusMessage $variant="error">{error}</StatusMessage>}

      {!loading && !error && (
        <TableCard>
          <TableElement>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>PACIENTE</TableHeaderCell>
                <TableHeaderCell>TELEFONE</TableHeaderCell>
                <TableHeaderCell>ÚLTIMA VISITA</TableHeaderCell>
                <TableHeaderCell>TOTAL DE VISITAS</TableHeaderCell>
                <TableHeaderCell>STATUS</TableHeaderCell>
                <TableHeaderCell>AÇÕES</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {filteredPatients.length === 0 && (
                <TableRow>
                  <EmptyStateCell colSpan={6}>Nenhum paciente encontrado.</EmptyStateCell>
                </TableRow>
              )}
              {filteredPatients.map((p, i) => (
                <TableRow key={p.id}>
                  <td>
                    <PatientCell>
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
                      <PatientMeta>
                        <PatientName>{p.name}</PatientName>
                        <PatientEmail>{p.email}</PatientEmail>
                      </PatientMeta>
                    </PatientCell>
                  </td>
                  <td>
                    <PhoneText>{formatPhoneNumber(p.phone)}</PhoneText>
                  </td>
                  <td>{formatDateDayMonthYear(p.lastVisit)}</td>
                  <td>{p.totalAppointments}</td>
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
                        onClick={() => openView(p)}
                      />
                    </ActionsGroup>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </TableElement>
        </TableCard>
      )}

      {isViewOpen && viewPatient && (
        <ModalOverlay onClick={closeView}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>{viewPatient.name}</ModalTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{viewPatient.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Telefone</DetailLabel>
                <DetailValue>{formatPhoneNumber(viewPatient.phone)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>{statusLabel(viewPatient.status)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Última Visita</DetailLabel>
                <DetailValue>{formatDateDayMonthYear(viewPatient.lastVisit)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Total de Visitas</DetailLabel>
                <DetailValue>{viewPatient.totalAppointments}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Cadastrado em</DetailLabel>
                <DetailValue>{formatDateDayMonthYear(viewPatient.createdAt)}</DetailValue>
              </DetailItem>
            </DetailsGrid>
            <ModalActions>
              <Button size="small" variant="outline" onClick={closeView}>
                Fechar
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default PatientsPage;
