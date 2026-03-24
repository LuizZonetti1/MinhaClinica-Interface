import { CalendarDays, ChevronLeft, ChevronRight, Clock3, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../../../components/Badge";
import { useProfessionalAgenda } from "../../../contexts";
import type { AgendaSlotStatus, ProfessionalAgendaDay } from "../../../types/dashboard";
import { notifyError } from "../../../utils/toast";
import {
  AppointmentMeta,
  AppointmentName,
  AppointmentPrimary,
  AppointmentRow,
  AppointmentRowActions,
  AppointmentRowContent,
  DayCard,
  DayCardBody,
  DayCardEmptyMessage,
  DayCardHeader,
  DayCardTitle,
  EmptyState,
  ListShell,
  MonthNavButton,
  MonthNavGroup,
  MonthNavLabel,
  MonthNavRow,
  PageHeader,
  PageTitle,
  PageWrapper,
  ReportButton,
  SectionDivider,
  StatusBadge,
  TimeLabel,
  TimeWrap,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ViewToggle,
  ViewToggleButton,
  WeekAppointmentCard,
  WeekAppointmentFooter,
  WeekAppointmentList,
  WeekBadgeRow,
  WeekColumnBody,
  WeekColumnDate,
  WeekColumnHeader,
  WeekColumnLabel,
  WeekColumnNumber,
  WeekDayColumn,
  WeekEmptyState,
  WeekGrid,
  WeekShell,
} from "./styles";

type ViewMode = "list" | "week";
type StatusVariant = "confirmed" | "pending" | "waiting" | "progress" | "done" | "cancelled";

const STATUS_META: Record<AgendaSlotStatus, { label: string; variant: StatusVariant }> = {
  CONFIRMED: { label: "Confirmado", variant: "confirmed" },
  SCHEDULED: { label: "Pendente", variant: "pending" },
  WAITING: { label: "Aguardando", variant: "waiting" },
  IN_PROGRESS: { label: "Em atendimento", variant: "progress" },
  COMPLETED: { label: "Concluído", variant: "done" },
  NO_SHOW: { label: "Não compareceu", variant: "cancelled" },
  CANCELLED: { label: "Cancelado", variant: "cancelled" },
};

const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  CONSULTATION: "Consulta agendada",
  RETURN: "Retorno",
  EXAM: "Exame",
  EMERGENCY: "Emergência",
  FIRST_CONSULTATION: "Primeira consulta",
  CONSULTA: "Consulta agendada",
  RETORNO: "Retorno",
  EXAME: "Exame",
  EMERGENCIA: "Emergência",
};

const buildEmptyAgendaDay = (date: string): ProfessionalAgendaDay => ({
  date,
  appointments: [],
  totalAppointments: 0,
  confirmedAppointments: 0,
  completedAppointments: 0,
  hasAppointments: false,
});

const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const parseLocalDate = (value: string): Date => new Date(`${value}T12:00:00`);

const addDays = (date: Date, amount: number): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const getWeekStart = (date: Date): Date => {
  const normalizedDate = parseLocalDate(toIsoDate(date));
  const weekday = normalizedDate.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  return addDays(normalizedDate, diff);
};

const buildWeekDates = (anchorDate: string): string[] => {
  const weekStart = getWeekStart(parseLocalDate(anchorDate));
  return Array.from({ length: 7 }, (_, index) => toIsoDate(addDays(weekStart, index)));
};

const formatMonthLabel = (date: Date): string =>
  capitalize(
    date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    }),
  );

const formatWeekLabel = (dates: string[]): string => {
  const startDate = parseLocalDate(dates[0]);
  const endDate = parseLocalDate(dates[dates.length - 1]);

  const startDay = startDate.toLocaleDateString("pt-BR", { day: "numeric" });
  const endDay = endDate.toLocaleDateString("pt-BR", { day: "numeric" });
  const startMonth = startDate.toLocaleDateString("pt-BR", { month: "long" });
  const endMonth = endDate.toLocaleDateString("pt-BR", { month: "long" });
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  if (startYear === endYear && startMonth === endMonth) {
    return `${startDay} - ${endDay} de ${startMonth} de ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startDay} de ${startMonth} - ${endDay} de ${endMonth} de ${startYear}`;
  }

  return `${startDay} de ${startMonth} de ${startYear} - ${endDay} de ${endMonth} de ${endYear}`;
};

const formatAppointmentType = (raw: string | null | undefined): string => {
  if (!raw) return "Tipo n\u00e3o informado";

  const key = raw
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  return APPOINTMENT_TYPE_LABELS[key] ?? raw.trim();
};

const formatDayLabel = (date: string): string => {
  const current = parseLocalDate(date);
  const today = parseLocalDate(toIsoDate(new Date()));
  const tomorrow = addDays(today, 1);

  const weekday = current.toLocaleDateString("pt-BR", { weekday: "long" });
  const fullDate = current.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (date === toIsoDate(today)) {
    return `Hoje - ${weekday}, ${fullDate}`;
  }

  if (date === toIsoDate(tomorrow)) {
    return `Amanh\u00e3 - ${weekday}, ${fullDate}`;
  }

  return `${capitalize(weekday)} - ${fullDate}`;
};

const formatWeekdayLabel = (date: string): string =>
  capitalize(
    parseLocalDate(date).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
  );

const formatWeekdayDate = (date: string): string =>
  parseLocalDate(date)
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
    .replace(".", "");

const sortByTime = (a: { time: string }, b: { time: string }) => a.time.localeCompare(b.time);

const ProfessionalAgendaPage = () => {
  const {
    data,
    currentMonth,
    selectedDate,
    loading,
    errorMessage,
    canGoPreviousMonth,
    canGoNextMonth,
    minAllowedDate,
    maxAllowedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    selectDate,
  } = useProfessionalAgenda();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const todayIso = toIsoDate(new Date());
  const effectiveSelectedDate = selectedDate || todayIso;

  useEffect(() => {
    if (errorMessage) {
      notifyError(errorMessage);
    }
  }, [errorMessage]);

  const highlightedDates = useMemo(() => {
    const dates = new Set<string>();

    if (!data) return dates;

    if (todayIso.startsWith(`${data.referenceMonth}-`)) {
      dates.add(todayIso);
    }

    if (selectedDate && selectedDate.startsWith(`${data?.referenceMonth}-`)) {
      dates.add(selectedDate);
    }

    return dates;
  }, [data, selectedDate, todayIso]);

  const visibleDays = useMemo(
    () =>
      (data?.days ?? [])
        .filter((day) => day.hasAppointments || highlightedDates.has(day.date))
        .map((day) => ({
          ...day,
          appointments: [...day.appointments].sort(sortByTime),
        })),
    [data, highlightedDates],
  );

  const weekDays = useMemo(() => {
    const weekDates = buildWeekDates(effectiveSelectedDate);
    const dayMap = new Map(
      (data?.days ?? []).map((day) => [
        day.date,
        {
          ...day,
          appointments: [...day.appointments].sort(sortByTime),
        },
      ]),
    );

    return weekDates.map((date) => dayMap.get(date) ?? buildEmptyAgendaDay(date));
  }, [data, effectiveSelectedDate]);

  const navigationLabel = useMemo(() => {
    if (viewMode === "week") {
      return formatWeekLabel(weekDays.map((day) => day.date));
    }

    return formatMonthLabel(currentMonth);
  }, [currentMonth, viewMode, weekDays]);

  const canGoPreviousPeriod = useMemo(() => {
    if (viewMode === "list") {
      return canGoPreviousMonth;
    }

    const previousWeekDate = toIsoDate(addDays(parseLocalDate(effectiveSelectedDate), -7));
    return previousWeekDate >= minAllowedDate;
  }, [canGoPreviousMonth, effectiveSelectedDate, minAllowedDate, viewMode]);

  const canGoNextPeriod = useMemo(() => {
    if (viewMode === "list") {
      return canGoNextMonth;
    }

    const nextWeekDate = toIsoDate(addDays(parseLocalDate(effectiveSelectedDate), 7));
    return nextWeekDate <= maxAllowedDate;
  }, [canGoNextMonth, effectiveSelectedDate, maxAllowedDate, viewMode]);

  const handleGoToday = () => {
    goToCurrentMonth();
    selectDate(todayIso);
  };

  const handleMoveWeek = (direction: -1 | 1) => {
    const nextDate = addDays(parseLocalDate(effectiveSelectedDate), direction * 7);
    const nextDateIso = toIsoDate(nextDate);
    if (nextDateIso < minAllowedDate || nextDateIso > maxAllowedDate) return;

    selectDate(nextDateIso);
  };

  const handleGoPrevious = () => {
    if (!canGoPreviousPeriod) return;

    if (viewMode === "week") {
      handleMoveWeek(-1);
      return;
    }

    goToPreviousMonth();
  };

  const handleGoNext = () => {
    if (!canGoNextPeriod) return;

    if (viewMode === "week") {
      handleMoveWeek(1);
      return;
    }

    goToNextMonth();
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Minha Agenda</PageTitle>

        <Toolbar>
          <ToolbarButton type="button" onClick={handleGoToday} disabled={loading}>
            Hoje
          </ToolbarButton>

          <ToolbarGroup>
            <ViewToggle>
              <ViewToggleButton
                type="button"
                $active={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                Lista
              </ViewToggleButton>
              <ViewToggleButton
                type="button"
                $active={viewMode === "week"}
                onClick={() => setViewMode("week")}
              >
                Semana
              </ViewToggleButton>
            </ViewToggle>
          </ToolbarGroup>
        </Toolbar>
      </PageHeader>

      <MonthNavRow>
        <MonthNavGroup>
          <MonthNavButton
            type="button"
            onClick={handleGoPrevious}
            disabled={loading || !canGoPreviousPeriod}
            aria-label="Per\u00edodo anterior"
          >
            <ChevronLeft size={16} />
          </MonthNavButton>

          <MonthNavLabel>{navigationLabel}</MonthNavLabel>

          <MonthNavButton
            type="button"
            onClick={handleGoNext}
            disabled={loading || !canGoNextPeriod}
            aria-label="Próximo período"
          >
            <ChevronRight size={16} />
          </MonthNavButton>
        </MonthNavGroup>
      </MonthNavRow>

      {loading ? (
        <EmptyState>Carregando agenda...</EmptyState>
      ) : !data ? (
        <EmptyState>{errorMessage ?? "Não foi possível carregar sua agenda."}</EmptyState>
      ) : viewMode === "list" ? (
        visibleDays.length === 0 ? (
          <EmptyState>Nenhuma consulta agendada para este mês.</EmptyState>
        ) : (
          <ListShell>
            {visibleDays.map((day) => (
              <DayCard
                key={day.date}
                $selected={day.date === selectedDate}
                onClick={() => selectDate(day.date)}
              >
                <DayCardHeader>
                  <DayCardTitle>{formatDayLabel(day.date)}</DayCardTitle>
                </DayCardHeader>

                <DayCardBody>
                  {day.appointments.length === 0 ? (
                    <DayCardEmptyMessage>Nenhuma consulta agendada neste dia.</DayCardEmptyMessage>
                  ) : (
                    day.appointments.map((appointment, index) => {
                      const status = STATUS_META[appointment.status];

                      return (
                        <div key={appointment.id}>
                          <AppointmentRow>
                            <AppointmentPrimary>
                              <TimeWrap>
                                <Clock3 size={14} />
                                <TimeLabel>{appointment.time}</TimeLabel>
                              </TimeWrap>

                              <AppointmentRowContent>
                                <AppointmentName>{appointment.patientName}</AppointmentName>
                                <AppointmentMeta>
                                  {formatAppointmentType(appointment.appointmentType)}
                                </AppointmentMeta>
                              </AppointmentRowContent>
                            </AppointmentPrimary>

                            <AppointmentRowActions>
                              <StatusBadge $variant={status.variant}>{status.label}</StatusBadge>
                              <ReportButton type="button" title="Laudo em breve">
                                <FileText size={14} />
                                Laudo
                              </ReportButton>
                            </AppointmentRowActions>
                          </AppointmentRow>

                          {index < day.appointments.length - 1 && <SectionDivider />}
                        </div>
                      );
                    })
                  )}
                </DayCardBody>
              </DayCard>
            ))}
          </ListShell>
        )
      ) : (
        <WeekShell>
          <WeekGrid>
            {weekDays.map((day) => {
              const isToday = day.date === todayIso;
              const isSelected = day.date === effectiveSelectedDate;
              const isOutsideCurrentMonth = !day.date.startsWith(`${data.referenceMonth}-`);
              const isWithinAllowedRange = day.date >= minAllowedDate && day.date <= maxAllowedDate;
              const dayBadgeVariant = !day.hasAppointments
                ? "neutral"
                : isToday
                  ? "success"
                  : "info";

              return (
                <WeekDayColumn
                  key={day.date}
                  $selected={isSelected}
                  $today={isToday}
                  $outsideMonth={isOutsideCurrentMonth}
                  $disabled={!isWithinAllowedRange}
                  onClick={() => {
                    if (!isWithinAllowedRange) return;
                    selectDate(day.date);
                  }}
                >
                  <WeekColumnHeader $today={isToday}>
                    <div>
                      <WeekColumnLabel>{formatWeekdayLabel(day.date)}</WeekColumnLabel>
                      <WeekColumnDate>{formatWeekdayDate(day.date)}</WeekColumnDate>
                    </div>

                    <WeekColumnNumber $today={isToday}>
                      {parseLocalDate(day.date).getDate()}
                    </WeekColumnNumber>
                  </WeekColumnHeader>

                  <WeekColumnBody>
                    <WeekBadgeRow>
                      <Badge variant={dayBadgeVariant}>
                        {day.totalAppointments === 0
                          ? "Sem consultas"
                          : `${day.totalAppointments} consulta${day.totalAppointments > 1 ? "s" : ""}`}
                      </Badge>
                    </WeekBadgeRow>

                    {day.appointments.length === 0 ? (
                      <WeekEmptyState>
                        <CalendarDays size={18} />
                        Nenhum atendimento
                      </WeekEmptyState>
                    ) : (
                      <WeekAppointmentList>
                        {day.appointments.map((appointment) => {
                          const status = STATUS_META[appointment.status];

                          return (
                            <WeekAppointmentCard key={appointment.id} $selected={isSelected}>
                              <AppointmentPrimary>
                                <TimeWrap>
                                  <Clock3 size={14} />
                                  <TimeLabel>
                                    {appointment.time}
                                    {appointment.endTime ? ` - ${appointment.endTime}` : ""}
                                  </TimeLabel>
                                </TimeWrap>

                                <AppointmentRowContent>
                                  <AppointmentName>{appointment.patientName}</AppointmentName>
                                  <AppointmentMeta>
                                    {formatAppointmentType(appointment.appointmentType)}
                                  </AppointmentMeta>
                                </AppointmentRowContent>
                              </AppointmentPrimary>

                              <WeekAppointmentFooter>
                                <StatusBadge $variant={status.variant}>{status.label}</StatusBadge>
                                <ReportButton type="button" title="Laudo em breve">
                                  <FileText size={14} />
                                  Laudo
                                </ReportButton>
                              </WeekAppointmentFooter>
                            </WeekAppointmentCard>
                          );
                        })}
                      </WeekAppointmentList>
                    )}
                  </WeekColumnBody>
                </WeekDayColumn>
              );
            })}
          </WeekGrid>
        </WeekShell>
      )}
    </PageWrapper>
  );
};

export default ProfessionalAgendaPage;
