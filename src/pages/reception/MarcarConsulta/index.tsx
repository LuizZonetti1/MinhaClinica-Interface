import { isAxiosError } from "axios";
import { CheckCircle, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Stepper } from "../../../components/Stepper";
import {
  createAppointment,
  getProfessionalSlots,
  listAppointmentProfessionals,
  searchAppointmentPatients,
} from "../../../services/appointment.service";
import {
  type AppointmentProfessional,
  type AppointmentSlot,
  AppointmentType,
  type PatientSearchResult,
} from "../../../types/appointment";
import type { Step } from "../../../types/components";
import { formatDateToIsoDate, formatIsoDateToBr } from "../../../utils/dateParsers";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { isPastTimeSlotForDate } from "../../../utils/timeParsers";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  ConfirmButton,
  FieldBlock,
  FieldLabel,
  FormActions,
  FormGrid,
  FormSelect,
  ObservationsSection,
  ObservationsTextarea,
  PageTitle,
  PageWrapper,
  PatientAvatar,
  SearchResultInfo,
  SearchResultItem,
  SearchResultList,
  SearchResultMeta,
  SearchResultName,
  SearchWrapper,
  SelectedBadge,
  SelectedBadgeClear,
  SelectedBadgeContent,
  SelectedBadgeInfo,
  SelectedBadgeName,
  SelectedBadgeSub,
  SlotBtn,
  SlotGrid,
  SlotSection,
  SlotSectionTitle,
  SlotsEmpty,
  StepCard,
  StepperWrapper,
  StepTitle,
  SummaryLabel,
  SummaryRow,
  SummaryTable,
  SummaryTableWrapper,
  SummaryValue,
} from "./styles";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStepperConfig = (step: number): Step[] => [
  { label: "Paciente", status: step > 1 ? "completed" : step === 1 ? "active" : "inactive" },
  { label: "Agendamento", status: step > 2 ? "completed" : step === 2 ? "active" : "inactive" },
  { label: "Confirmar", status: step === 3 ? "active" : "inactive" },
];

const formatDateBR = (d: string): string => formatIsoDateToBr(d, "-", { strictIsoOnly: true });

const maskCPF = (cpf: string): string => {
  const d = cpf.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) return "P";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

const getPatientMeta = (patient: PatientSearchResult): string => {
  const details = [maskCPF(patient.cpf) || "CPF nao informado"];
  if (patient.isEmailVerified === false) details.push("email nao verificado");
  return details.join(" • ");
};

const PAST_APPOINTMENT_ERROR = "nao e permitido agendar em horario ja passado";

const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

const isCpfQuery = (value: string): boolean => {
  const digits = onlyDigits(value);
  return digits.length > 0 && digits === onlyDigits(value.replace(/[.-]/g, ""));
};

const toApiQuery = (value: string): string =>
  isCpfQuery(value) ? onlyDigits(value) : value.trim();

const filterPatientsIgnoringAccents = (
  patients: PatientSearchResult[],
  query: string,
): PatientSearchResult[] => {
  if (!query.trim()) return patients;
  if (isCpfQuery(query)) {
    const digits = onlyDigits(query);
    return patients.filter((p) => onlyDigits(p.cpf).includes(digits));
  }
  const normalizedQuery = normalizeText(query);
  return patients.filter((p) => normalizeText(`${p.name} ${p.cpf}`).includes(normalizedQuery));
};

const getLocalDateISO = (date: Date): string => formatDateToIsoDate(date);

const isPastSlotForDate = (date: string, time: string, now: Date): boolean => {
  return isPastTimeSlotForDate(date, time, {
    now,
    parseTimeOptions: {
      allowSingleDigitHour: true,
      allowSeconds: true,
    },
  });
};

const CONSULTATION_TYPE_OPTIONS: Array<{
  value: AppointmentType;
  label: string;
}> = [
  { value: AppointmentType.CONSULTATION, label: "Consulta" },
  { value: AppointmentType.RETURN, label: "Retorno" },
  { value: AppointmentType.EXAM, label: "Exame" },
  { value: AppointmentType.EMERGENCY, label: "Emergência" },
];

const getConsultationTypeLabel = (value: AppointmentType): string =>
  CONSULTATION_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? "Consulta";

// ─── Component ────────────────────────────────────────────────────────────────

const ReceptionMarcarConsultaPage = () => {
  const navigate = useNavigate();

  // ── View / Step ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ── Step 1 state ────────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [patientResults, setPatientResults] = useState<PatientSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
  const [consultationType, setConsultationType] = useState<AppointmentType>(
    AppointmentType.CONSULTATION,
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const patientQueryCacheRef = useRef<Map<string, PatientSearchResult[]>>(new Map());

  // ── Step 2 state ────────────────────────────────────────────────────────────
  const [professionals, setProfessionals] = useState<AppointmentProfessional[]>([]);
  const [profLoading, setProfLoading] = useState(false);
  const [selectedProfId, setSelectedProfId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  // ── Step 3 state ────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // ── Derived ─────────────────────────────────────────────────────────────────
  const today = getLocalDateISO(now);
  const selectedProfessional = professionals.find((p) => p.id === selectedProfId) ?? null;
  const isSlotSelectable = (slot: AppointmentSlot, date = selectedDate): boolean =>
    slot.available && !isPastSlotForDate(date, slot.time, now);

  // ── Effects ─────────────────────────────────────────────────────────────────

  // Debounced patient search with per-query cache + client-side filter
  useEffect(() => {
    if (selectedPatient) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setPatientResults([]);
      setShowDropdown(false);
      return;
    }

    const cacheKey = normalizeText(trimmed);
    const cachedResults = patientQueryCacheRef.current.get(cacheKey);
    if (cachedResults) {
      setPatientResults(filterPatientsIgnoringAccents(cachedResults, trimmed));
      setShowDropdown(true);
      return;
    }

    // Look for a shorter prefix already cached and filter client-side
    for (const [key, results] of patientQueryCacheRef.current) {
      if (cacheKey.startsWith(key) && key.length >= 2) {
        const filtered = filterPatientsIgnoringAccents(results, trimmed);
        setPatientResults(filtered);
        setShowDropdown(true);
        return;
      }
    }

    let active = true;
    const timer = window.setTimeout(() => {
      setSearchLoading(true);
      searchAppointmentPatients(toApiQuery(trimmed))
        .then((results) => {
          if (!active) return;
          patientQueryCacheRef.current.set(cacheKey, results);
          setPatientResults(filterPatientsIgnoringAccents(results, trimmed));
          setShowDropdown(true);
        })
        .catch(() => {
          if (!active) return;
          setPatientResults([]);
          setShowDropdown(true);
        })
        .finally(() => {
          if (active) setSearchLoading(false);
        });
    }, 180);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, selectedPatient]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keep local time in sync so past slots are disabled without page refresh.
  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  // If the selected slot becomes invalid (past time or unavailable), clear selection.
  useEffect(() => {
    setSelectedSlot((current) => {
      if (!current) return "";
      const currentSlot = slots.find((slot) => slot.time === current);
      if (!currentSlot) return "";
      return currentSlot.available && !isPastSlotForDate(selectedDate, currentSlot.time, now)
        ? current
        : "";
    });
  }, [now, slots, selectedDate]);

  // Load professionals when entering step 2
  useEffect(() => {
    if (step !== 2 || professionals.length > 0) return;
    setProfLoading(true);
    listAppointmentProfessionals()
      .then(setProfessionals)
      .catch(() => notifyError("Erro ao carregar profissionais."))
      .finally(() => setProfLoading(false));
  }, [step, professionals.length]);

  // Load slots when professional or date changes
  useEffect(() => {
    if (!selectedProfId || !selectedDate) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }
    setSlotsLoading(true);
    getProfessionalSlots(selectedProfId, selectedDate)
      .then((nextSlots) => {
        setSlots(nextSlots);
        setSelectedSlot((current) =>
          nextSlots.some(
            (slot) =>
              slot.available &&
              slot.time === current &&
              !isPastSlotForDate(selectedDate, slot.time, new Date()),
          )
            ? current
            : "",
        );
      })
      .catch(() => {
        setSlots([]);
        setSelectedSlot("");
        notifyError("Erro ao carregar horarios.");
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedProfId, selectedDate]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const selectPatient = (p: PatientSearchResult) => {
    setSelectedPatient(p);
    setQuery("");
    setPatientResults([]);
    setShowDropdown(false);
  };

  const clearPatient = () => {
    setSelectedPatient(null);
    setQuery("");
  };

  const handleStep1Next = () => {
    if (!selectedPatient) {
      notifyError("Selecione um paciente.");
      return;
    }
    setStep(2);
    setProfessionals([]);
  };

  const handleStep2Next = () => {
    if (!selectedProfId) {
      notifyError("Selecione um profissional.");
      return;
    }
    if (!selectedDate) {
      notifyError("Selecione uma data.");
      return;
    }
    if (!selectedSlot) {
      notifyError("Selecione um horário disponível.");
      return;
    }
    const selectedSlotData = slots.find((slot) => slot.time === selectedSlot);
    if (!selectedSlotData || !isSlotSelectable(selectedSlotData)) {
      setSelectedSlot("");
      notifyError("O horario selecionado nao esta mais disponivel.");
      return;
    }

    setStep(3);
  };

  const handleConfirm = async () => {
    if (!selectedPatient || !selectedProfessional) return;

    const selectedSlotData = slots.find((slot) => slot.time === selectedSlot);
    if (!selectedSlotData || !isSlotSelectable(selectedSlotData)) {
      setSelectedSlot("");
      setStep(2);
      notifyError("O horario selecionado nao esta mais disponivel.");
      return;
    }

    setSubmitting(true);
    try {
      await createAppointment({
        patientId: selectedPatient.id,
        professionalId: selectedProfessional.id,
        date: selectedDate,
        time: selectedSlotData.time,
        type: consultationType,
        notes: notes.trim() || undefined,
      });
      notifySuccess("Consulta agendada com sucesso!");
      navigate("/recepcao/dashboard");
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Erro ao confirmar agendamento.");
      notifyError(errorMessage);

      if (
        isAxiosError(err) &&
        err.response?.status === 400 &&
        normalizeText(errorMessage).includes(PAST_APPOINTMENT_ERROR)
      ) {
        setSlotsLoading(true);
        try {
          const refreshedSlots = await getProfessionalSlots(selectedProfId, selectedDate);
          setSlots(refreshedSlots);
          setSelectedSlot((current) =>
            refreshedSlots.some(
              (slot) =>
                slot.available &&
                slot.time === current &&
                !isPastSlotForDate(selectedDate, slot.time, new Date()),
            )
              ? current
              : "",
          );
          setStep(2);
        } catch {
          setSlots([]);
          setSelectedSlot("");
          notifyError("Erro ao recarregar horarios.");
        } finally {
          setSlotsLoading(false);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render helpers ───────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <>
      <StepTitle>Selecionar Paciente</StepTitle>

      <FieldBlock>
        <FieldLabel>Buscar pelo nome do paciente</FieldLabel>
        {selectedPatient ? (
          <SelectedBadge>
            <SelectedBadgeContent>
              <PatientAvatar $size={40}>
                {selectedPatient.avatarUrl ? (
                  <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} />
                ) : (
                  getInitials(selectedPatient.name)
                )}
              </PatientAvatar>
              <SelectedBadgeInfo>
                <SelectedBadgeName>{selectedPatient.name}</SelectedBadgeName>
                <SelectedBadgeSub>{getPatientMeta(selectedPatient)}</SelectedBadgeSub>
              </SelectedBadgeInfo>
            </SelectedBadgeContent>
            <SelectedBadgeClear type="button" onClick={clearPatient} aria-label="Remover paciente">
              <X size={16} />
            </SelectedBadgeClear>
          </SelectedBadge>
        ) : (
          <SearchWrapper ref={searchRef}>
            <Input
              placeholder="Digite o nome do paciente..."
              value={query}
              onChange={(e) => {
                const raw = e.target.value;
                const digits = onlyDigits(raw);
                const isCpfInput =
                  digits.length > 0 && onlyDigits(raw.replace(/[.-]/g, "")) === digits;
                if (isCpfInput && digits.length > 11) return;
                const formatted = isCpfInput ? maskCPF(digits) : raw;
                setQuery(formatted);
                setShowDropdown(true);
              }}
              icon={<Search size={16} />}
              iconPosition="left"
              fullWidth
            />
            {showDropdown && (
              <SearchResultList>
                {searchLoading && <SearchResultItem $disabled>Buscando...</SearchResultItem>}
                {!searchLoading && patientResults.length === 0 && query.trim().length >= 2 && (
                  <SearchResultItem $disabled>Nenhum paciente encontrado.</SearchResultItem>
                )}
                {!searchLoading &&
                  patientResults.map((p) => (
                    <SearchResultItem key={p.id} onMouseDown={() => selectPatient(p)}>
                      <PatientAvatar $size={34}>
                        {p.avatarUrl ? <img src={p.avatarUrl} alt={p.name} /> : getInitials(p.name)}
                      </PatientAvatar>
                      <SearchResultInfo>
                        <SearchResultName>{p.name}</SearchResultName>
                        <SearchResultMeta>{getPatientMeta(p)}</SearchResultMeta>
                      </SearchResultInfo>
                    </SearchResultItem>
                  ))}
              </SearchResultList>
            )}
          </SearchWrapper>
        )}
      </FieldBlock>

      <FieldBlock>
        <FieldLabel>Tipo de Consulta</FieldLabel>
        <FormSelect
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value as AppointmentType)}
        >
          {CONSULTATION_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
      </FieldBlock>

      <FormActions>
        <Button variant="primary" type="button" onClick={handleStep1Next}>
          Próximo →
        </Button>
      </FormActions>
    </>
  );

  const renderStep2 = () => (
    <>
      <StepTitle>Selecionar Profissional e Horário</StepTitle>

      <FormGrid>
        <FieldBlock>
          <FieldLabel>Profissional</FieldLabel>
          <FormSelect
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
            disabled={profLoading}
          >
            <option value="">{profLoading ? "Carregando..." : "Selecione..."}</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.specialty ? ` — ${p.specialty}` : ""}
              </option>
            ))}
          </FormSelect>
        </FieldBlock>

        <FieldBlock>
          <Input
            label="Data"
            type="date"
            value={selectedDate}
            min={today}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot("");
            }}
            fullWidth
          />
        </FieldBlock>
      </FormGrid>

      {selectedProfId && selectedDate && (
        <SlotSection>
          <SlotSectionTitle>Horários disponíveis</SlotSectionTitle>
          {slotsLoading ? (
            <SlotsEmpty>Carregando horários...</SlotsEmpty>
          ) : slots.length === 0 ? (
            <SlotsEmpty>Nenhum horário disponível para esta data.</SlotsEmpty>
          ) : (
            <SlotGrid>
              {slots.map((s) => {
                const slotAvailable = isSlotSelectable(s);
                return (
                  <SlotBtn
                    key={s.time}
                    type="button"
                    $available={slotAvailable}
                    $selected={selectedSlot === s.time && slotAvailable}
                    disabled={!slotAvailable}
                    onClick={() => slotAvailable && setSelectedSlot(s.time)}
                  >
                    {s.time}
                  </SlotBtn>
                );
              })}
            </SlotGrid>
          )}
        </SlotSection>
      )}

      <FormActions>
        <Button variant="outline" type="button" onClick={() => setStep(1)}>
          ← Voltar
        </Button>
        <Button variant="primary" type="button" onClick={handleStep2Next}>
          Próximo →
        </Button>
      </FormActions>
    </>
  );

  const renderStep3 = () => (
    <>
      <StepTitle>Confirmar Agendamento</StepTitle>

      <SummaryTableWrapper>
        <SummaryTable>
          <tbody>
            <SummaryRow>
              <SummaryLabel>Paciente</SummaryLabel>
              <SummaryValue>{selectedPatient?.name ?? "—"}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>CPF</SummaryLabel>
              <SummaryValue>{maskCPF(selectedPatient?.cpf ?? "")}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Tipo</SummaryLabel>
              <SummaryValue>{getConsultationTypeLabel(consultationType)}</SummaryValue>
            </SummaryRow>
            {selectedProfessional?.clinicName && (
              <SummaryRow>
                <SummaryLabel>Clínica</SummaryLabel>
                <SummaryValue>{selectedProfessional.clinicName}</SummaryValue>
              </SummaryRow>
            )}
            {selectedProfessional?.clinicAddress && (
              <SummaryRow>
                <SummaryLabel>Endereço</SummaryLabel>
                <SummaryValue>{selectedProfessional.clinicAddress}</SummaryValue>
              </SummaryRow>
            )}
            <SummaryRow>
              <SummaryLabel>Profissional</SummaryLabel>
              <SummaryValue>
                {selectedProfessional?.name ?? "—"}
                {selectedProfessional?.specialty ? ` — ${selectedProfessional.specialty}` : ""}
              </SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Data</SummaryLabel>
              <SummaryValue>{formatDateBR(selectedDate)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Horário</SummaryLabel>
              <SummaryValue>{selectedSlot}</SummaryValue>
            </SummaryRow>
          </tbody>
        </SummaryTable>
      </SummaryTableWrapper>

      <ObservationsSection>
        <FieldLabel>Observações (opcional)</FieldLabel>
        <ObservationsTextarea
          placeholder="Ex: Paciente é diabético, primeira vez, retorno de exame..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </ObservationsSection>

      <FormActions>
        <Button variant="outline" type="button" onClick={() => setStep(2)} disabled={submitting}>
          ← Voltar
        </Button>
        <ConfirmButton type="button" onClick={handleConfirm} disabled={submitting}>
          <CheckCircle size={18} />
          {submitting ? "Confirmando..." : "Confirmar Agendamento"}
        </ConfirmButton>
      </FormActions>
    </>
  );

  // ── Main render ──────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <PageTitle>Marcar Consulta</PageTitle>

      <StepperWrapper>
        <Stepper steps={getStepperConfig(step)} />
      </StepperWrapper>

      <StepCard>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </StepCard>
    </PageWrapper>
  );
};

export default ReceptionMarcarConsultaPage;
