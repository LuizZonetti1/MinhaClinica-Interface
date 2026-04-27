import { Camera, Eye, EyeOff, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Toggle } from "../../../components/Toggle";
import { useAuth } from "../../../contexts";
import {
  getProfessionalProfile,
  updateProfessionalAvatar,
  updateProfessionalPassword,
  updateProfessionalProfile,
} from "../../../services/professional-profile.service";
import type {
  DayOfWeek,
  ProfessionalProfileData,
  UpdateProfessionalProfilePayload,
  WorkingHour,
} from "../../../types/professional-profile";
import { maskPhoneInput, getInitials, normalizePhoneDigits } from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  ActionRow,
  AvatarCircle,
  AvatarHint,
  AvatarOverlay,
  AvatarUploadArea,
  AvatarWrapper,
  DayItem,
  DayItemHeader,
  DayItemLabel,
  DayList,
  DayTimeGrid,
  DayToggleLabel,
  DayToggleRow,
  FormCard,
  FormCardTitle,
  FormGrid,
  FullWidthField,
  PageTitle,
  PageWrapper,
  PasswordRequirements,
  StyledTextarea,
  TextareaLabel,
  TextareaWrapper,
} from "./styles";

const ALL_DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terca-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sabado",
  SUNDAY: "Domingo",
};

const PASSWORD_REQUIREMENTS_MESSAGE =
  "A nova senha deve ter no minimo 8 caracteres, com letras maiusculas, minusculas e numeros.";

type ProfessionalFormState = {
  name: string;
  phone: string;
  registrationNumber: string;
  registrationState: string;
  defaultAppointmentDuration: string;
  bio: string;
  formations: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type DayFormItem = {
  dayOfWeek: DayOfWeek;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
};

const normalizeApiValue = (value: string | null | undefined, fallback = "") =>
  value && value !== "-" ? value : fallback;

const isPasswordStrong = (password: string) =>
  password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

const buildInitialHours = (apiHours: WorkingHour[]): DayFormItem[] => {
  const map = new Map(apiHours.map((hour) => [hour.dayOfWeek, hour]));

  return ALL_DAYS.map((day) => {
    const existing = map.get(day);
    return {
      dayOfWeek: day,
      isWorking: existing?.isWorking ?? false,
      startTime: existing?.startTime ?? "08:00",
      endTime: existing?.endTime ?? "18:00",
      lunchBreakStart: existing?.lunchBreakStart ?? "",
      lunchBreakEnd: existing?.lunchBreakEnd ?? "",
    };
  });
};

const normalizeHoursForCompare = (hours: DayFormItem[]) =>
  hours.map((item) => ({
    dayOfWeek: item.dayOfWeek,
    isWorking: item.isWorking,
    startTime: item.startTime.trim(),
    endTime: item.endTime.trim(),
    lunchBreakStart: item.lunchBreakStart.trim(),
    lunchBreakEnd: item.lunchBreakEnd.trim(),
  }));

const profileToForm = (data: ProfessionalProfileData): ProfessionalFormState => ({
  name: normalizeApiValue(data.name),
  phone: maskPhoneInput(normalizeApiValue(data.phone)),
  registrationNumber: normalizeApiValue(data.registrationNumber),
  registrationState: normalizeApiValue(data.registrationState),
  defaultAppointmentDuration: String(data.defaultAppointmentDuration || 60),
  bio: normalizeApiValue(data.bio),
  formations: normalizeApiValue(data.formations),
});

const buildWorkingHoursPayload = (hours: DayFormItem[]): WorkingHour[] =>
  hours.map((hour) => ({
    dayOfWeek: hour.dayOfWeek,
    isWorking: hour.isWorking,
    startTime: hour.startTime || "08:00",
    endTime: hour.endTime || "18:00",
    lunchBreakStart: hour.lunchBreakStart.trim() || null,
    lunchBreakEnd: hour.lunchBreakEnd.trim() || null,
  }));

const ProfessionalEditProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [primarySpecialty, setPrimarySpecialty] = useState("");
  const [form, setForm] = useState<ProfessionalFormState>({
    name: "",
    phone: "",
    registrationNumber: "",
    registrationState: "",
    defaultAppointmentDuration: "60",
    bio: "",
    formations: "",
  });
  const [baseForm, setBaseForm] = useState<ProfessionalFormState>({
    name: "",
    phone: "",
    registrationNumber: "",
    registrationState: "",
    defaultAppointmentDuration: "60",
    bio: "",
    formations: "",
  });
  const [hours, setHours] = useState<DayFormItem[]>(buildInitialHours([]));
  const [baseHours, setBaseHours] = useState<DayFormItem[]>(buildInitialHours([]));
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const applyLatestProfile = (profile: ProfessionalProfileData) => {
    const resolvedName = normalizeApiValue(profile.name, user?.name ?? "");
    const resolvedEmail = normalizeApiValue(profile.email, user?.email ?? "");
    const resolvedAvatar = normalizeApiValue(profile.avatarUrl);
    const resolvedForm = profileToForm({ ...profile, name: resolvedName });
    const resolvedHours = buildInitialHours(profile.workingHours);

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setEmail(resolvedEmail);
    setPrimarySpecialty(profile.specialties.find((specialty) => specialty.isPrimary)?.name ?? "");
    setCurrentAvatarUrl(resolvedAvatar);
    setAvatarPreview(resolvedAvatar);
    setAvatarFile(null);
    setForm(resolvedForm);
    setBaseForm(resolvedForm);
    setHours(resolvedHours);
    setBaseHours(resolvedHours);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    if (user) {
      setUser({
        ...user,
        name: resolvedName,
        avatarUrl: resolvedAvatar || undefined,
      });
    }
  };

  useEffect(() => {
    getProfessionalProfile()
      .then((profile) => {
        applyLatestProfile(profile);
      })
      .catch((error: unknown) => {
        notifyError(getApiErrorMessage(error, "Nao foi possivel carregar o perfil."));

        const fallbackName = user?.name ?? "";
        const fallbackEmail = user?.email ?? "";
        const fallbackForm: ProfessionalFormState = {
          name: fallbackName,
          phone: "",
          registrationNumber: "",
          registrationState: "",
          defaultAppointmentDuration: "60",
          bio: "",
          formations: "",
        };

        setEmail(fallbackEmail);
        setPrimarySpecialty("");
        setCurrentAvatarUrl(user?.avatarUrl ?? "");
        setAvatarPreview(user?.avatarUrl ?? "");
        setForm(fallbackForm);
        setBaseForm(fallbackForm);
        setHours(buildInitialHours([]));
        setBaseHours(buildInitialHours([]));
      });
  }, [user?.avatarUrl, user?.email, user?.name]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const setFormField = <K extends keyof ProfessionalFormState>(key: K, value: ProfessionalFormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const setPasswordField = <K extends keyof PasswordFormState>(key: K, value: PasswordFormState[K]) =>
    setPasswordForm((previous) => ({ ...previous, [key]: value }));

  const updateDay = <K extends keyof DayFormItem>(dayOfWeek: DayOfWeek, key: K, value: DayFormItem[K]) =>
    setHours((previous) =>
      previous.map((item) => (item.dayOfWeek === dayOfWeek ? { ...item, [key]: value } : item)),
    );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedName = form.name.trim();
    const normalizedPhone = normalizePhoneDigits(form.phone);
    const normalizedRegistrationState = form.registrationState.trim().toUpperCase();
    const normalizedDuration = Number.parseInt(form.defaultAppointmentDuration, 10);
    const normalizedBio = form.bio.trim();
    const normalizedFormations = form.formations.trim();

    if (!trimmedName) {
      notifyError("O nome e obrigatorio.");
      return;
    }

    if (normalizedRegistrationState.length > 2) {
      notifyError("O estado do registro deve ter 2 caracteres (ex: SP).");
      return;
    }

    if (Number.isNaN(normalizedDuration) || normalizedDuration <= 0) {
      notifyError("A duracao da consulta deve ser um numero positivo.");
      return;
    }

    const isChangingPassword = Boolean(
      passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmPassword,
    );

    if (isChangingPassword) {
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        notifyError("Preencha senha atual, nova senha e confirmacao.");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        notifyError("As senhas nao coincidem.");
        return;
      }

      if (!isPasswordStrong(passwordForm.newPassword)) {
        notifyError(PASSWORD_REQUIREMENTS_MESSAGE);
        return;
      }
    }

    const normalizedBasePhone = normalizePhoneDigits(baseForm.phone);
    const normalizedBaseRegistrationState = baseForm.registrationState.trim().toUpperCase();
    const normalizedBaseDuration = Number.parseInt(baseForm.defaultAppointmentDuration, 10);
    const normalizedBaseBio = baseForm.bio.trim();
    const normalizedBaseFormations = baseForm.formations.trim();
    const hoursChanged =
      JSON.stringify(normalizeHoursForCompare(hours)) !==
      JSON.stringify(normalizeHoursForCompare(baseHours));

    const profileChanged =
      trimmedName !== baseForm.name.trim() ||
      normalizedPhone !== normalizedBasePhone ||
      form.registrationNumber.trim() !== baseForm.registrationNumber.trim() ||
      normalizedRegistrationState !== normalizedBaseRegistrationState ||
      normalizedDuration !== normalizedBaseDuration ||
      normalizedBio !== normalizedBaseBio ||
      normalizedFormations !== normalizedBaseFormations ||
      hoursChanged;

    const hasAvatarChange = avatarFile instanceof File;

    if (!profileChanged && !hasAvatarChange && !isChangingPassword) {
      notifySuccess("Nenhuma alteracao para salvar.");
      return;
    }

    setIsSaving(true);
    try {
      if (profileChanged) {
        const payload: UpdateProfessionalProfilePayload = {};

        if (trimmedName !== baseForm.name.trim()) {
          payload.name = trimmedName;
        }
        if (normalizedPhone !== normalizedBasePhone) {
          payload.phone = normalizedPhone || null;
        }
        if (form.registrationNumber.trim() !== baseForm.registrationNumber.trim()) {
          payload.registrationNumber = form.registrationNumber.trim();
        }
        if (normalizedRegistrationState !== normalizedBaseRegistrationState) {
          payload.registrationState = normalizedRegistrationState;
        }
        if (normalizedDuration !== normalizedBaseDuration) {
          payload.defaultAppointmentDuration = normalizedDuration;
        }
        if (normalizedBio !== normalizedBaseBio) {
          payload.bio = normalizedBio || null;
        }
        if (normalizedFormations !== normalizedBaseFormations) {
          payload.formations = normalizedFormations || null;
        }
        if (hoursChanged) {
          payload.workingHours = buildWorkingHoursPayload(hours);
        }

        if (Object.keys(payload).length > 0) {
          await updateProfessionalProfile(payload);
        }
      }

      if (hasAvatarChange) {
        await updateProfessionalAvatar(avatarFile as File);
      }

      if (isChangingPassword) {
        await updateProfessionalPassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        });
      }

      const latestProfile = await getProfessionalProfile();
      applyLatestProfile(latestProfile);

      notifySuccess("Perfil atualizado com sucesso.");
      navigate("/profissional/perfil");
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Nao foi possivel atualizar o perfil."));
    } finally {
      setIsSaving(false);
    }
  };

  const displayAvatar = avatarPreview || currentAvatarUrl;
  const initials = getInitials(form.name || user?.name || "P");

  return (
    <PageWrapper>
      <PageTitle>Editar Perfil</PageTitle>

      <FormCard>
        <FormCardTitle>Dados Pessoais e Profissionais</FormCardTitle>

        <AvatarUploadArea>
          <AvatarWrapper
            role="button"
            aria-label="Alterar foto de perfil"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                fileInputRef.current?.click();
              }
            }}
          >
            <AvatarCircle>
              {displayAvatar ? <img src={displayAvatar} alt="Foto de perfil" /> : initials || "P"}
            </AvatarCircle>
            <AvatarOverlay>
              <Camera size={22} />
            </AvatarOverlay>
          </AvatarWrapper>
          <AvatarHint>Clique na foto para alterar</AvatarHint>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </AvatarUploadArea>

        <FormGrid>
          <Input
            label="Nome Completo"
            fullWidth
            value={form.name}
            onChange={(event) => setFormField("name", event.target.value)}
            placeholder="Dr. Nome Sobrenome"
            disabled={isSaving}
          />
          <Input label="Email" fullWidth value={email} disabled />

          <Input
            label="Telefone"
            fullWidth
            value={form.phone}
            onChange={(event) => setFormField("phone", maskPhoneInput(event.target.value))}
            placeholder="(11) 99000-0000"
            disabled={isSaving}
          />
          <Input
            label="Numero do Conselho (CRM/CRO)"
            fullWidth
            value={form.registrationNumber}
            onChange={(event) => setFormField("registrationNumber", event.target.value)}
            placeholder="12345"
            disabled={isSaving}
          />

          <Input
            label="Estado do registro (UF)"
            fullWidth
            value={form.registrationState}
            onChange={(event) =>
              setFormField("registrationState", event.target.value.toUpperCase().slice(0, 2))
            }
            placeholder="SP"
            disabled={isSaving}
            maxLength={2}
          />
          <Input
            label="Duracao da consulta (min)"
            type="number"
            fullWidth
            value={form.defaultAppointmentDuration}
            onChange={(event) => setFormField("defaultAppointmentDuration", event.target.value)}
            placeholder="60"
            disabled={isSaving}
            min={1}
          />
        </FormGrid>

        {primarySpecialty && (
          <FullWidthField>
            <Input label="Especialidade principal" fullWidth value={primarySpecialty} disabled />
          </FullWidthField>
        )}

        <TextareaWrapper>
          <TextareaLabel>Sobre / Bio</TextareaLabel>
          <StyledTextarea
            placeholder="Descreva sua experiencia e especialidades..."
            value={form.bio}
            onChange={(event) => setFormField("bio", event.target.value)}
            rows={4}
            disabled={isSaving}
          />
        </TextareaWrapper>

        <TextareaWrapper>
          <TextareaLabel>Formacoes</TextareaLabel>
          <StyledTextarea
            placeholder={"Uma formacao por linha. Ex:\nGraduacao - USP (2005)\nEspecializacao - InCor (2009)"}
            value={form.formations}
            onChange={(event) => setFormField("formations", event.target.value)}
            rows={4}
            disabled={isSaving}
          />
        </TextareaWrapper>
      </FormCard>

      <FormCard>
        <FormCardTitle>Alterar Senha</FormCardTitle>

        <FullWidthField>
          <Input
            label="Senha Atual"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            value={passwordForm.currentPassword}
            onChange={(event) => setPasswordField("currentPassword", event.target.value)}
            placeholder="********"
            rightIcon={showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowCurrentPassword((previous) => !previous)}
            disabled={isSaving}
          />
        </FullWidthField>

        <FormGrid>
          <Input
            label="Nova Senha"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={passwordForm.newPassword}
            onChange={(event) => setPasswordField("newPassword", event.target.value)}
            placeholder="********"
            rightIcon={showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowNewPassword((previous) => !previous)}
            disabled={isSaving}
          />
          <Input
            label="Confirmar Nova Senha"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={passwordForm.confirmPassword}
            onChange={(event) => setPasswordField("confirmPassword", event.target.value)}
            placeholder="********"
            rightIcon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowConfirmPassword((previous) => !previous)}
            disabled={isSaving}
          />
        </FormGrid>
        <PasswordRequirements>{PASSWORD_REQUIREMENTS_MESSAGE}</PasswordRequirements>
      </FormCard>

      <FormCard>
        <FormCardTitle>Horarios de Atendimento</FormCardTitle>

        <DayList>
          {hours.map((day) => (
            <DayItem key={day.dayOfWeek}>
              <DayItemHeader>
                <DayItemLabel>{DAY_LABELS[day.dayOfWeek]}</DayItemLabel>
                <DayToggleRow>
                  <DayToggleLabel>{day.isWorking ? "Atendendo" : "Fechado"}</DayToggleLabel>
                  <Toggle
                    checked={day.isWorking}
                    onChange={(value) => updateDay(day.dayOfWeek, "isWorking", value)}
                    disabled={isSaving}
                  />
                </DayToggleRow>
              </DayItemHeader>

              {day.isWorking && (
                <DayTimeGrid>
                  <Input
                    label="Inicio"
                    type="time"
                    fullWidth
                    value={day.startTime}
                    onChange={(event) => updateDay(day.dayOfWeek, "startTime", event.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="Termino"
                    type="time"
                    fullWidth
                    value={day.endTime}
                    onChange={(event) => updateDay(day.dayOfWeek, "endTime", event.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="Inicio da pausa"
                    type="time"
                    fullWidth
                    value={day.lunchBreakStart}
                    onChange={(event) =>
                      updateDay(day.dayOfWeek, "lunchBreakStart", event.target.value)
                    }
                    disabled={isSaving}
                    placeholder="--:--"
                  />
                  <Input
                    label="Fim da pausa"
                    type="time"
                    fullWidth
                    value={day.lunchBreakEnd}
                    onChange={(event) =>
                      updateDay(day.dayOfWeek, "lunchBreakEnd", event.target.value)
                    }
                    disabled={isSaving}
                    placeholder="--:--"
                  />
                </DayTimeGrid>
              )}
            </DayItem>
          ))}
        </DayList>
      </FormCard>

      <ActionRow>
        <Button variant="outline" onClick={() => navigate("/profissional/perfil")} disabled={isSaving}>
          Cancelar
        </Button>
        <Button icon={<Save size={16} />} onClick={() => void handleSave()} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alteracoes"}
        </Button>
      </ActionRow>
    </PageWrapper>
  );
};

export default ProfessionalEditProfilePage;
