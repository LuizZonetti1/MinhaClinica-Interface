import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getReceptionAgendas } from "../../../services/reception.service";
import type {
  AgendaProfessional,
  AgendaSlotStatus,
  AgendasResponse,
  AppointmentStatus,
} from "../../../types/dashboard";
import { formatDateToIsoDate } from "../../../utils/dateParsers";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError } from "../../../utils/toast";
import {
  AgendaDateInput,
  ControlsRow,
  DateLabel,
  DateNavButton,
  DateNavRow,
  EmptyState,
  FilterBar,
  FilterTab,
  FreeLabel,
  LoadingState,
  PageHeader,
  PageTitle,
  PageWrapper,
  PatientName,
  ProfAvatar,
  ProfCardHeader,
  ProfessionalCard,
  ProfessionalsGrid,
  ProfInfo,
  ProfName,
  ProfSpecialty,
  SlotBadge,
  SlotList,
  SlotRow,
  SlotTime,
  TimeFilterInput,
  TimeFilterWrap,
} from "./styles";

// ─── Constants ────────────────────────────────────────────────────────────────

type BadgeVariant = "waiting" | "checkin" | "progress" | "done" | "cancelled";

const DASHBOARD_STATUS_META: Record<AppointmentStatus, { label: string; variant: BadgeVariant }> = {
  WAITING: { label: "Aguardando", variant: "waiting" },
  CHECKED_IN: { label: "Check-in OK", variant: "checkin" },
  IN_PROGRESS: { label: "Em Atendimento", variant: "progress" },
  DONE: { label: "Concluido", variant: "done" },
  CANCELLED: { label: "Cancelado", variant: "cancelled" },
};

const mapAgendaStatusToDashboardStatus = (status: AgendaSlotStatus): AppointmentStatus => {
  switch (status) {
    case "SCHEDULED":
    case "CONFIRMED":
      return "WAITING";
    case "WAITING":
      return "CHECKED_IN";
    case "IN_PROGRESS":
      return "IN_PROGRESS";
    case "COMPLETED":
      return "DONE";
    case "NO_SHOW":
    case "CANCELLED":
      return "CANCELLED";
  }
};

const getSlotStatusMeta = (status: AgendaSlotStatus) => {
  const normalized = mapAgendaStatusToDashboardStatus(status);
  return DASHBOARD_STATUS_META[normalized];
};

const AVATAR_PALETTE = [
  { bg: "#DBEAFE", color: "#1E40AF" },
  { bg: "#DCFCE7", color: "#166534" },
  { bg: "#F3E8FF", color: "#7C3AED" },
  { bg: "#FFEDD5", color: "#9A3412" },
  { bg: "#FCE7F3", color: "#9D174D" },
  { bg: "#FEF3C7", color: "#92400E" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getAvatarColors = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const toISODate = (d: Date): string => formatDateToIsoDate(d);

const addDays = (d: Date, n: number): Date => {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
};

const stripTime = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const formatDateLabel = (date: Date): string => {
  const dateStr = date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  return `${dateStr} — ${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

const ReceptionAgendasPage = () => {
  const todayNorm = stripTime(new Date());
  const minDate = new Date(todayNorm.getFullYear(), todayNorm.getMonth() - 6, todayNorm.getDate());
  const maxDate = new Date(todayNorm.getFullYear(), todayNorm.getMonth() + 6, todayNorm.getDate());

  const [currentDate, setCurrentDate] = useState<Date>(todayNorm);
  const [data, setData] = useState<AgendasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfId, setSelectedProfId] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState("");

  const canGoPrev = currentDate > minDate;
  const canGoNext = currentDate < maxDate;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const load = async () => {
      try {
        const result = await getReceptionAgendas(toISODate(currentDate));
        if (isMounted) {
          setData(result);
          setSelectedProfId("all");
          setTimeFilter("");
        }
      } catch (err: unknown) {
        if (isMounted) {
          notifyError(getApiErrorMessage(err, "Erro ao carregar agendas."));
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [currentDate]);

  const handlePrev = useCallback(() => {
    if (canGoPrev) setCurrentDate((d) => addDays(d, -1));
  }, [canGoPrev]);

  const handleNext = useCallback(() => {
    if (canGoNext) setCurrentDate((d) => addDays(d, 1));
  }, [canGoNext]);

  const visibleProfessionals: AgendaProfessional[] =
    data == null
      ? []
      : selectedProfId === "all"
        ? data.professionals
        : data.professionals.filter((p) => p.id === selectedProfId);

  const filteredProfessionals = useMemo(() => {
    const trimmed = timeFilter.trim();
    if (!trimmed) return visibleProfessionals;
    return visibleProfessionals.filter((p) => p.slots.some((s) => s.time.startsWith(trimmed)));
  }, [visibleProfessionals, timeFilter]);

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Agenda dos Profissionais</PageTitle>
        <ControlsRow>
          <AgendaDateInput
            type="date"
            value={toISODate(currentDate)}
            min={toISODate(minDate)}
            max={toISODate(maxDate)}
            onChange={(e) => {
              if (!e.target.value) return;
              const [y, m, d] = e.target.value.split("-").map(Number);
              setCurrentDate(stripTime(new Date(y, m - 1, d)));
            }}
          />
          <TimeFilterWrap>
            <Clock size={14} />
            <TimeFilterInput
              type="text"
              placeholder="Filtrar horário..."
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            />
          </TimeFilterWrap>
        </ControlsRow>
      </PageHeader>

      {/* Professional filter tabs */}
      <FilterBar>
        <FilterTab $active={selectedProfId === "all"} onClick={() => setSelectedProfId("all")}>
          Todos
        </FilterTab>
        {data?.professionals.map((prof) => (
          <FilterTab
            key={prof.id}
            $active={prof.id === selectedProfId}
            onClick={() => setSelectedProfId(prof.id)}
          >
            {prof.name}
          </FilterTab>
        ))}
      </FilterBar>

      {/* Date navigation */}
      <DateNavRow>
        <DateNavButton
          type="button"
          disabled={!canGoPrev || loading}
          onClick={handlePrev}
          aria-label="Dia anterior"
        >
          <ChevronLeft size={18} />
        </DateNavButton>

        <DateLabel>{formatDateLabel(currentDate)}</DateLabel>

        <DateNavButton
          type="button"
          disabled={!canGoNext || loading}
          onClick={handleNext}
          aria-label="Próximo dia"
        >
          <ChevronRight size={18} />
        </DateNavButton>
      </DateNavRow>

      {/* Content */}
      {loading ? (
        <LoadingState>Carregando agendas...</LoadingState>
      ) : !data || data.professionals.length === 0 ? (
        <EmptyState>Nenhum profissional com agenda para esta data.</EmptyState>
      ) : filteredProfessionals.length === 0 ? (
        <EmptyState>Nenhuma agenda encontrada para o filtro selecionado.</EmptyState>
      ) : (
        <ProfessionalsGrid>
          {filteredProfessionals.map((prof) => {
            const avatarColors = getAvatarColors(prof.name);
            const initials = getInitials(prof.name);

            return (
              <ProfessionalCard key={prof.id}>
                <ProfCardHeader>
                  <ProfAvatar
                    style={{ backgroundColor: avatarColors.bg, color: avatarColors.color }}
                  >
                    {prof.avatarUrl ? (
                      <img src={prof.avatarUrl} alt={prof.name} />
                    ) : (
                      initials || "?"
                    )}
                  </ProfAvatar>

                  <ProfInfo>
                    <ProfName>{prof.name}</ProfName>
                    <ProfSpecialty>{prof.specialty}</ProfSpecialty>
                  </ProfInfo>
                </ProfCardHeader>

                <SlotList>
                  {prof.slots.length === 0 ? (
                    <SlotRow>
                      <FreeLabel>Nenhum horário disponível</FreeLabel>
                    </SlotRow>
                  ) : (
                    prof.slots
                      .filter((s) => {
                        const trimmed = timeFilter.trim();
                        return !trimmed || s.time.startsWith(trimmed);
                      })
                      .map((slot) => (
                        <SlotRow key={slot.time}>
                          <SlotTime>{slot.time}</SlotTime>

                          {slot.libre ? (
                            <FreeLabel>Livre</FreeLabel>
                          ) : (
                            <>
                              <PatientName>{slot.patientName ?? "—"}</PatientName>
                              {slot.status &&
                                (() => {
                                  const statusMeta = getSlotStatusMeta(slot.status);
                                  return (
                                    <SlotBadge $variant={statusMeta.variant}>
                                      {statusMeta.label}
                                    </SlotBadge>
                                  );
                                })()}
                            </>
                          )}
                        </SlotRow>
                      ))
                  )}
                </SlotList>
              </ProfessionalCard>
            );
          })}
        </ProfessionalsGrid>
      )}
    </PageWrapper>
  );
};

export default ReceptionAgendasPage;
