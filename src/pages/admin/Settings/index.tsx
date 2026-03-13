import { Bell, Building2, Clock, ExternalLink, Save, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Toggle } from "../../../components/Toggle";
import {
  getClinicSettings,
  updateClinicSettingsInfo,
  updateClinicSettingsNotifications,
  updateClinicSettingsSchedule,
  updateClinicSettingsSecurity,
} from "../../../services/clinic-settings.service";
import type { ClinicSettingsResponse } from "../../../types/clinic";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { maskPhoneInput, normalizePhoneDigits } from "../../../utils/formatters";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  CardGrid,
  FieldGroup,
  FieldLabel,
  FieldSelect,
  FormFields,
  GerenciarButton,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PlanInfo,
  PlanName,
  PlanRow,
  PlanSubtext,
  SaveRow,
  SectionCard,
  SectionHeader,
  SectionHeaderTitle,
  TimeoutRow,
  TimeoutSelect,
  ToggleDesc,
  ToggleInfo,
  ToggleName,
  ToggleRow,
  TopSection,
} from "./styles";

type SettingsState = {
  clinicName: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  openTime: string;
  closeTime: string;
  appointmentInterval: string;
  workingDays: string;
  appointmentReminder: boolean;
  cancellationAlert: boolean;
  newPatient: boolean;
  dailyReport: boolean;
  twoFactor: boolean;
  accessLog: boolean;
  sessionTimeout: string;
};

const DEFAULT_SETTINGS: SettingsState = {
  clinicName: "",
  cnpj: "",
  phone: "",
  email: "",
  address: "",
  openTime: "",
  closeTime: "",
  appointmentInterval: "30",
  workingDays: "seg-sex",
  appointmentReminder: true,
  cancellationAlert: true,
  newPatient: false,
  dailyReport: true,
  twoFactor: false,
  accessLog: true,
  sessionTimeout: "30",
};

const APPOINTMENT_INTERVAL_VALUES = new Set(["15", "20", "30", "45", "60"]);
const SESSION_TIMEOUT_VALUES = new Set(["0", "15", "30", "60", "120"]);
const WORKING_DAY_VALUES = new Set(["seg-sex", "seg-sab", "seg-dom", "seg-qui"]);

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) return value as Record<string, unknown>;
  return null;
};

const readValue = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): unknown => {
  for (const source of sources) {
    if (!source) continue;

    for (const key of keys) {
      if (!(key in source)) continue;
      const value = source[key];
      if (value !== undefined && value !== null) return value;
    }
  }
  return undefined;
};

const readString = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
  fallback: string,
): string => {
  const value = readValue(sources, keys);
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const readBoolean = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
  fallback: boolean,
): boolean => {
  const value = readValue(sources, keys);
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "sim", "on"].includes(normalized)) return true;
    if (["0", "false", "no", "nao", "off"].includes(normalized)) return false;
  }
  return fallback;
};

const readNumberString = (
  sources: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
  fallback: string,
): string => {
  const value = readValue(sources, keys);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return value;
  return fallback;
};

const parseInteger = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatAddress = (rawAddress: unknown): string => {
  if (typeof rawAddress === "string") return rawAddress;

  const addressObj = asRecord(rawAddress);
  if (!addressObj) return "";

  const street = readString([addressObj], ["street", "logradouro"], "");
  const number = readString([addressObj], ["number", "numero"], "");
  const complement = readString([addressObj], ["complement", "complemento"], "");
  const neighborhood = readString([addressObj], ["neighborhood", "bairro"], "");
  const city = readString([addressObj], ["city", "cidade"], "");
  const state = readString([addressObj], ["state", "uf"], "");

  const line1 = [street, number].filter(Boolean).join(", ");
  const line2 = [complement, neighborhood].filter(Boolean).join(" - ");
  const line3 = [city, state].filter(Boolean).join(", ");

  return [line1, line2, line3].filter(Boolean).join(" | ");
};

const normalizeWorkingDays = (value: unknown): string => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (WORKING_DAY_VALUES.has(normalized)) return normalized;

    const mapped: Record<string, string> = {
      "mon-fri": "seg-sex",
      "monday-friday": "seg-sex",
      monday_friday: "seg-sex",
      "segunda-sexta": "seg-sex",
      "mon-sat": "seg-sab",
      "monday-saturday": "seg-sab",
      monday_saturday: "seg-sab",
      "segunda-sabado": "seg-sab",
      "mon-sun": "seg-dom",
      "monday-sunday": "seg-dom",
      monday_sunday: "seg-dom",
      "segunda-domingo": "seg-dom",
      "mon-thu": "seg-qui",
      "monday-thursday": "seg-qui",
      monday_thursday: "seg-qui",
      "segunda-quinta": "seg-qui",
    };
    return mapped[normalized] ?? DEFAULT_SETTINGS.workingDays;
  }

  if (Array.isArray(value)) {
    const days = value.map((day) => String(day).trim().toLowerCase());
    const hasSat = days.some((day) => ["sat", "saturday", "sabado", "sábado"].includes(day));
    const hasSun = days.some((day) => ["sun", "sunday", "domingo"].includes(day));
    const hasFri = days.some((day) => ["fri", "friday", "sexta"].includes(day));
    const hasThu = days.some((day) => ["thu", "thursday", "quinta"].includes(day));

    if (hasSun) return "seg-dom";
    if (hasSat) return "seg-sab";
    if (hasThu && !hasFri) return "seg-qui";
    return "seg-sex";
  }

  return DEFAULT_SETTINGS.workingDays;
};

const normalizeSettingsResponse = (response: ClinicSettingsResponse): SettingsState => {
  const root = asRecord(response) ?? {};
  const info = asRecord(root.info);
  const schedule = asRecord(root.schedule);
  const notifications = asRecord(root.notifications);
  const security = asRecord(root.security);

  const infoSources = [info, root];
  const scheduleSources = [schedule, root];
  const notificationSources = [notifications, root];
  const securitySources = [security, root];

  const interval = readNumberString(
    scheduleSources,
    ["appointmentInterval", "interval", "minIntervalBetweenAppointments", "intervalMinutes"],
    DEFAULT_SETTINGS.appointmentInterval,
  );

  const sessionTimeout = readNumberString(
    securitySources,
    ["sessionTimeout", "timeout", "timeoutMinutes", "inactivityTimeout"],
    DEFAULT_SETTINGS.sessionTimeout,
  );

  return {
    clinicName: readString(
      infoSources,
      ["clinicName", "name", "tradeName", "legalName"],
      DEFAULT_SETTINGS.clinicName,
    ),
    cnpj: readString(infoSources, ["cnpj"], DEFAULT_SETTINGS.cnpj),
    phone: maskPhoneInput(readString(infoSources, ["phone", "telephone"], DEFAULT_SETTINGS.phone)),
    email: readString(infoSources, ["email", "clinicEmail", "contactEmail"], DEFAULT_SETTINGS.email),
    address:
      formatAddress(readValue(infoSources, ["address"])) ||
      readString(infoSources, ["address", "fullAddress"], DEFAULT_SETTINGS.address),
    openTime: readString(scheduleSources, ["openTime", "openingTime"], DEFAULT_SETTINGS.openTime),
    closeTime: readString(scheduleSources, ["closeTime", "closingTime"], DEFAULT_SETTINGS.closeTime),
    appointmentInterval: APPOINTMENT_INTERVAL_VALUES.has(interval)
      ? interval
      : DEFAULT_SETTINGS.appointmentInterval,
    workingDays: normalizeWorkingDays(
      readValue(scheduleSources, ["workingDays", "days", "workingDaysLabel"]),
    ),
    appointmentReminder: readBoolean(
      notificationSources,
      ["appointmentReminder", "sendAppointmentReminder", "sendReminder"],
      DEFAULT_SETTINGS.appointmentReminder,
    ),
    cancellationAlert: readBoolean(
      notificationSources,
      ["cancellationAlert", "sendCancellationAlert", "notifyCancellation"],
      DEFAULT_SETTINGS.cancellationAlert,
    ),
    newPatient: readBoolean(
      notificationSources,
      ["newPatient", "newPatientAlert", "notifyNewPatient"],
      DEFAULT_SETTINGS.newPatient,
    ),
    dailyReport: readBoolean(
      notificationSources,
      ["dailyReport", "sendDailyReport", "dailySummary"],
      DEFAULT_SETTINGS.dailyReport,
    ),
    twoFactor: readBoolean(
      securitySources,
      ["twoFactor", "twoFactorEnabled", "enable2FA", "mfaEnabled"],
      DEFAULT_SETTINGS.twoFactor,
    ),
    accessLog: readBoolean(
      securitySources,
      ["accessLog", "accessLogEnabled", "logAccess"],
      DEFAULT_SETTINGS.accessLog,
    ),
    sessionTimeout: SESSION_TIMEOUT_VALUES.has(sessionTimeout)
      ? sessionTimeout
      : DEFAULT_SETTINGS.sessionTimeout,
  };
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isBusy = loading || isSaving;

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await getClinicSettings();
        setSettings(normalizeSettingsResponse(response));
      } catch (error: unknown) {
        notifyError(getApiErrorMessage(error, "Erro ao carregar configuracoes da clinica."));
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (isBusy) return;

    setIsSaving(true);
    try {
      await Promise.all([
        updateClinicSettingsInfo({
          name: settings.clinicName.trim(),
          cnpj: settings.cnpj.trim(),
          phone: normalizePhoneDigits(settings.phone),
          email: settings.email.trim(),
          address: settings.address.trim(),
        }),
        updateClinicSettingsSchedule({
          openTime: settings.openTime,
          closeTime: settings.closeTime,
          appointmentInterval: parseInteger(settings.appointmentInterval, 30),
          workingDays: settings.workingDays,
        }),
        updateClinicSettingsNotifications({
          appointmentReminder: settings.appointmentReminder,
          cancellationAlert: settings.cancellationAlert,
          newPatient: settings.newPatient,
          dailyReport: settings.dailyReport,
        }),
        updateClinicSettingsSecurity({
          twoFactor: settings.twoFactor,
          accessLog: settings.accessLog,
          sessionTimeout: parseInteger(settings.sessionTimeout, 30),
        }),
      ]);

      notifySuccess("Configuracoes salvas com sucesso.");
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Nao foi possivel salvar as configuracoes."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <TopSection>
        <PageTitle>Configuracoes da Clinica</PageTitle>
        <PageSubtitle>
          {loading
            ? "Carregando configuracoes..."
            : "Gerencie as preferencias e dados da sua clinica."}
        </PageSubtitle>
      </TopSection>

      <CardGrid>
        <SectionCard>
          <SectionHeader>
            <Building2 size={18} />
            <SectionHeaderTitle>Dados da Clinica</SectionHeaderTitle>
          </SectionHeader>
          <FormFields>
            <Input
              label="Nome da Clinica"
              fullWidth
              value={settings.clinicName}
              onChange={(e) => set("clinicName", e.target.value)}
              placeholder="Nome da clinica"
              disabled={isBusy}
            />
            <Input
              label="CNPJ"
              fullWidth
              value={settings.cnpj}
              onChange={(e) => set("cnpj", e.target.value)}
              placeholder="00.000.000/0001-00"
              disabled={isBusy}
            />
            <Input
              label="Telefone"
              fullWidth
              value={settings.phone}
              onChange={(e) => set("phone", maskPhoneInput(e.target.value))}
              placeholder="(11) 11111-0000"
              disabled={isBusy}
            />
            <Input
              label="Email de Contato"
              type="email"
              fullWidth
              value={settings.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="contato@clinica.com.br"
              disabled={isBusy}
            />
            <Input
              label="Endereco"
              fullWidth
              value={settings.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Rua, numero - Cidade, UF"
              disabled={isBusy}
            />
          </FormFields>
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <Clock size={18} />
            <SectionHeaderTitle>Horario de Funcionamento</SectionHeaderTitle>
          </SectionHeader>
          <FormFields>
            <Input
              label="Abertura"
              type="time"
              fullWidth
              value={settings.openTime}
              onChange={(e) => set("openTime", e.target.value)}
              disabled={isBusy}
            />
            <Input
              label="Fechamento"
              type="time"
              fullWidth
              value={settings.closeTime}
              onChange={(e) => set("closeTime", e.target.value)}
              disabled={isBusy}
            />
            <FieldGroup>
              <FieldLabel htmlFor="appointmentInterval">Intervalo entre consultas (min)</FieldLabel>
              <FieldSelect
                id="appointmentInterval"
                value={settings.appointmentInterval}
                onChange={(e) => set("appointmentInterval", e.target.value)}
                disabled={isBusy}
              >
                <option value="15">15 minutos</option>
                <option value="20">20 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
              </FieldSelect>
            </FieldGroup>
            <FieldGroup>
              <FieldLabel htmlFor="workingDays">Dias de atendimento</FieldLabel>
              <FieldSelect
                id="workingDays"
                value={settings.workingDays}
                onChange={(e) => set("workingDays", e.target.value)}
                disabled={isBusy}
              >
                <option value="seg-sex">Segunda a Sexta</option>
                <option value="seg-sab">Segunda a Sabado</option>
                <option value="seg-dom">Segunda a Domingo</option>
                <option value="seg-qui">Segunda a Quinta</option>
              </FieldSelect>
            </FieldGroup>
          </FormFields>
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <Bell size={18} />
            <SectionHeaderTitle>Notificacoes</SectionHeaderTitle>
          </SectionHeader>
          <ToggleRow>
            <ToggleInfo>
              <ToggleName>Lembrete de Consulta</ToggleName>
              <ToggleDesc>Enviar lembretes automaticos aos pacientes</ToggleDesc>
            </ToggleInfo>
            <Toggle
              checked={settings.appointmentReminder}
              onChange={(v) => set("appointmentReminder", v)}
              disabled={isBusy}
            />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <ToggleName>Alerta de Cancelamento</ToggleName>
              <ToggleDesc>Notificar cancelamentos imediatamente</ToggleDesc>
            </ToggleInfo>
            <Toggle
              checked={settings.cancellationAlert}
              onChange={(v) => set("cancellationAlert", v)}
              disabled={isBusy}
            />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <ToggleName>Novo Paciente</ToggleName>
              <ToggleDesc>Aviso ao cadastrar novo paciente</ToggleDesc>
            </ToggleInfo>
            <Toggle
              checked={settings.newPatient}
              onChange={(v) => set("newPatient", v)}
              disabled={isBusy}
            />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <ToggleName>Relatorio Diario</ToggleName>
              <ToggleDesc>Resumo diario de atividades</ToggleDesc>
            </ToggleInfo>
            <Toggle
              checked={settings.dailyReport}
              onChange={(v) => set("dailyReport", v)}
              disabled={isBusy}
            />
          </ToggleRow>
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <Shield size={18} />
            <SectionHeaderTitle>Seguranca</SectionHeaderTitle>
          </SectionHeader>
          <ToggleRow>
            <ToggleInfo>
              <ToggleName>Autenticacao em 2 fatores</ToggleName>
              <ToggleDesc>Aumenta a seguranca do acesso ao sistema</ToggleDesc>
            </ToggleInfo>
            <Toggle
              checked={settings.twoFactor}
              onChange={(v) => set("twoFactor", v)}
              disabled={isBusy}
            />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <ToggleName>Log de acessos</ToggleName>
              <ToggleDesc>Registrar todos os acessos ao sistema</ToggleDesc>
            </ToggleInfo>
            <Toggle
              checked={settings.accessLog}
              onChange={(v) => set("accessLog", v)}
              disabled={isBusy}
            />
          </ToggleRow>
          <TimeoutRow>
            <ToggleInfo>
              <ToggleName>Timeout de sessao</ToggleName>
              <ToggleDesc>Encerrar sessao apos inatividade</ToggleDesc>
            </ToggleInfo>
            <TimeoutSelect
              value={settings.sessionTimeout}
              onChange={(e) => set("sessionTimeout", e.target.value)}
              disabled={isBusy}
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">60 min</option>
              <option value="120">2 horas</option>
              <option value="0">Nunca</option>
            </TimeoutSelect>
          </TimeoutRow>
          <PlanRow>
            <PlanInfo>
              <PlanName>Plano Atual</PlanName>
              <PlanSubtext>Clinica Premium - R$ 299/mes</PlanSubtext>
            </PlanInfo>
            <GerenciarButton type="button">
              <ExternalLink size={15} />
              Gerenciar
            </GerenciarButton>
          </PlanRow>
        </SectionCard>
      </CardGrid>

      <SaveRow>
        <Button icon={<Save size={16} />} onClick={() => void handleSave()} disabled={isBusy}>
          {loading ? "Carregando..." : isSaving ? "Salvando..." : "Salvar Configuracoes"}
        </Button>
      </SaveRow>
    </PageWrapper>
  );
};

export default SettingsPage;
