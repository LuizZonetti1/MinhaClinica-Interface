import { Camera, Eye, EyeOff, Save } from "lucide-react";
import { TwoFactorCard } from "../../../components/TwoFactorCard";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Toggle } from "../../../components/Toggle";
import { useAuth } from "../../../contexts";
import {
  getProfile,
  updateProfile,
  updateProfilePassword,
} from "../../../services/profile.service";
import {
  getProfessionalProfile,
  updateProfessionalProfile,
} from "../../../services/professional-profile.service";
import type { ProfileData, UpdateProfilePayload } from "../../../types/profile";
import type {
  DayOfWeek,
  ProfessionalProfileData,
  UpdateProfessionalProfilePayload,
  WorkingHour,
} from "../../../types/professional-profile";
import { UserRole } from "../../../types/enums";
import { getInitials, maskPhoneInput, normalizePhoneDigits } from "../../../utils/formatters";
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
  RoleCheckboxDesc,
  RoleCheckboxInfo,
  RoleCheckboxItem,
  RoleCheckboxLabel,
  RoleCheckboxList,
  RolesSaveRow,
  RoleToggle,
  SpecialtyTag,
  SpecialtyTagRow,
  StyledTextarea,
  TextareaLabel,
  TextareaWrapper,
} from "./styles";

type EditForm = {
  name: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileBase = {
  name: string;
  phone: string;
};

type DayFormItem = {
  dayOfWeek: DayOfWeek;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
};

type ProfForm = {
  professionalCouncil: string;
  registrationNumber: string;
  registrationState: string;
  defaultAppointmentDuration: string;
  bio: string;
  formations: string;
  specialty: string;
};

const ALL_DAYS: DayOfWeek[] = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const buildInitialHours = (apiHours: WorkingHour[]): DayFormItem[] =>
  ALL_DAYS.map((day) => {
    const existing = apiHours.find((h) => h.dayOfWeek === day);
    return {
      dayOfWeek: day,
      isWorking: existing?.isWorking ?? false,
      startTime: existing?.startTime ?? "08:00",
      endTime: existing?.endTime ?? "18:00",
      lunchBreakStart: existing?.lunchBreakStart ?? "",
      lunchBreakEnd: existing?.lunchBreakEnd ?? "",
    };
  });

const normalizeApiValue = (value: string, fallback = "") => (value === "-" ? fallback : value);

const PASSWORD_REQUIREMENTS_MESSAGE =
  "A nova senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.";

const isPasswordStrong = (password: string) =>
  password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

const EditProfilePage = () => {
  const { user, setUser, updateRoles } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [baseProfile, setBaseProfile] = useState<ProfileBase>({
    name: "",
    phone: "",
  });

  // Multi-role state (ADMIN pode acumular PROFESSIONAL, RECEPTIONIST, PATIENT)
  const EXTRA_ROLES: { role: UserRole; label: string; desc: string }[] = [
    { role: UserRole.PROFESSIONAL, label: "Profissional", desc: "Acesso à agenda, documentos clínicos e comentários de pacientes." },
    { role: UserRole.RECEPTIONIST, label: "Recepcionista", desc: "Acesso ao check-in, agendamentos e histórico de consultas." },
    { role: UserRole.PATIENT, label: "Paciente", desc: "Acesso ao portal do paciente, agendamentos e clínicas." },
  ];

  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([UserRole.ADMIN]);
  const [isSavingRoles, setIsSavingRoles] = useState(false);

  // Estado do perfil profissional (visível somente se hasProfessionalRole)
  const hasProfessionalRole = !!(user?.roles?.includes(UserRole.PROFESSIONAL));
  const [profData, setProfData] = useState<ProfessionalProfileData | null>(null);
  const [profForm, setProfForm] = useState<ProfForm>({
    professionalCouncil: "",
    registrationNumber: "",
    registrationState: "",
    defaultAppointmentDuration: "",
    bio: "",
    formations: "",
    specialty: "",
  });
  const [hours, setHours] = useState<DayFormItem[]>(buildInitialHours([]));

  const [form, setForm] = useState<EditForm>({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        const resolvedName = normalizeApiValue(data.fullName, user?.name ?? "");
        const resolvedPhone = maskPhoneInput(normalizeApiValue(data.phone));
        const resolvedEmail = normalizeApiValue(data.email, user?.email ?? "");
        const resolvedAvatar = normalizeApiValue(data.avatarUrl);

        setEmail(resolvedEmail);
        setCurrentAvatarUrl(resolvedAvatar);
        setAvatarPreview(resolvedAvatar);
        setBaseProfile({ name: resolvedName, phone: normalizePhoneDigits(resolvedPhone) });
        setForm({
          name: resolvedName,
          phone: resolvedPhone,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err: unknown) => {
        notifyError(getApiErrorMessage(err, "Não foi possível carregar o perfil."));
        const fallbackName = user?.name ?? "";
        setEmail(user?.email ?? "");
        setBaseProfile({ name: fallbackName, phone: "" });
        setForm({
          name: fallbackName,
          phone: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      });
  }, [user?.email, user?.name]);

  useEffect(() => {
    if (user?.roles) {
      setSelectedRoles(user.roles);
    }
  }, [user?.roles]);

  useEffect(() => {
    if (!hasProfessionalRole) return;
    getProfessionalProfile()
      .then((data) => {
        setProfData(data);
        setProfForm({
          professionalCouncil: data.professionalCouncil ?? "",
          registrationNumber: data.registrationNumber ?? "",
          registrationState: data.registrationState ?? "",
          defaultAppointmentDuration: data.defaultAppointmentDuration
            ? String(data.defaultAppointmentDuration)
            : "",
          bio: data.bio ?? "",
          formations: data.formations ?? "",
          specialty: data.specialties.find((s) => s.isPrimary)?.name ?? data.specialties[0]?.name ?? "",
        });
        setHours(buildInitialHours(data.workingHours));
      })
      .catch(() => {
        // silencioso: a seção simplesmente não pré-preenche
      });
  }, [hasProfessionalRole]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const set = <K extends keyof EditForm>(key: K, value: EditForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const applyLatestProfile = (
    latestProfile: ProfileData,
    fallbackName: string,
    fallbackPhone: string,
  ) => {
    const latestName = normalizeApiValue(latestProfile.fullName, fallbackName);
    const latestPhoneMasked = maskPhoneInput(normalizeApiValue(latestProfile.phone, fallbackPhone));
    const latestPhoneDigits = normalizePhoneDigits(latestPhoneMasked);
    const latestEmail = normalizeApiValue(latestProfile.email, email);
    const latestAvatar = latestProfile.avatarUrl.trim()
      ? latestProfile.avatarUrl
      : currentAvatarUrl;

    if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);

    setEmail(latestEmail);
    setCurrentAvatarUrl(latestAvatar);
    setAvatarPreview(latestAvatar);
    setAvatarFile(null);
    setBaseProfile({ name: latestName, phone: latestPhoneDigits });
    setForm({
      name: latestName,
      phone: latestPhoneMasked,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    if (user) {
      setUser({
        ...user,
        name: latestName,
        avatarUrl: latestAvatar || undefined,
      });
    }
  };

  const handleToggleRole = (role: UserRole) => {
    if (role === UserRole.ADMIN) return; // role primário não pode ser removido
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const updateDay = (
    day: DayOfWeek,
    field: keyof Omit<DayFormItem, "dayOfWeek">,
    value: string | boolean,
  ) => {
    setHours((prev) =>
      prev.map((item) => (item.dayOfWeek === day ? { ...item, [field]: value } : item)),
    );
  };

  const handleSaveRoles = async () => {
    if (isSavingRoles) return;
    setIsSavingRoles(true);
    try {
      await updateRoles(selectedRoles);
      notifySuccess("Papéis atualizados com sucesso.");
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Não foi possível atualizar os papéis."));
    } finally {
      setIsSavingRoles(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedName = form.name.trim();
    const normalizedPhone = normalizePhoneDigits(form.phone);

    const isChangingPassword = Boolean(
      form.currentPassword || form.newPassword || form.confirmPassword,
    );
    if (isChangingPassword) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        notifyError("Preencha senha atual, nova senha e confirmação.");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        notifyError("As senhas não coincidem.");
        return;
      }

      if (!isPasswordStrong(form.newPassword)) {
        notifyError(PASSWORD_REQUIREMENTS_MESSAGE);
        return;
      }
    }

    const profileChanged =
      trimmedName !== baseProfile.name.trim() || normalizedPhone !== baseProfile.phone.trim();
    const hasAvatarChange = Boolean(avatarFile);

    if (!profileChanged && !isChangingPassword && !hasAvatarChange && !hasProfessionalRole) {
      notifySuccess("Nenhuma alteração para salvar.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: UpdateProfilePayload = {};
      if (trimmedName !== baseProfile.name.trim()) payload.name = trimmedName;
      if (normalizedPhone !== baseProfile.phone.trim()) payload.phone = normalizedPhone;
      if (avatarFile) payload.avatarFile = avatarFile;

      if (Object.keys(payload).length > 0) {
        await updateProfile(payload);
      }

      if (isChangingPassword) {
        await updateProfilePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        });
      }

      const latestProfile: ProfileData = await getProfile();
      applyLatestProfile(latestProfile, trimmedName, form.phone);

      if (hasProfessionalRole) {
        const profPayload: UpdateProfessionalProfilePayload = {
          professionalCouncil: profForm.professionalCouncil.trim() || undefined,
          registrationNumber: profForm.registrationNumber.trim() || undefined,
          registrationState: profForm.registrationState.trim() || undefined,
          defaultAppointmentDuration: profForm.defaultAppointmentDuration
            ? Number(profForm.defaultAppointmentDuration)
            : undefined,
          specialty: profForm.specialty.trim() || undefined,
          bio: profForm.bio.trim() || null,
          formations: profForm.formations.trim() || null,
          workingHours: hours.map((item): WorkingHour => ({
            dayOfWeek: item.dayOfWeek,
            isWorking: item.isWorking,
            startTime: item.startTime,
            endTime: item.endTime,
            lunchBreakStart: item.lunchBreakStart.trim() || null,
            lunchBreakEnd: item.lunchBreakEnd.trim() || null,
          })),
        };
        await updateProfessionalProfile(profPayload);
      }

      notifySuccess("Perfil atualizado com sucesso.");
      navigate("/admin/perfil");
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Não foi possível atualizar o perfil."));
    } finally {
      setIsSaving(false);
    }
  };

  const displayAvatar = avatarPreview || currentAvatarUrl;
  const initials = getInitials(form.name || user?.name || "U");

  return (
    <PageWrapper>
      <PageTitle>Editar Perfil</PageTitle>

      <FormCard>
        <FormCardTitle>Dados Pessoais</FormCardTitle>

        <AvatarUploadArea>
          <AvatarWrapper
            role="button"
            aria-label="Alterar foto de perfil"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
          >
            <AvatarCircle>
              {displayAvatar ? <img src={displayAvatar} alt="Foto de perfil" /> : initials || "U"}
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
            onChange={(e) => set("name", e.target.value)}
            placeholder="Dr. Nome Sobrenome"
            disabled={isSaving}
          />
          <Input label="Email" fullWidth value={email} disabled />
          <Input
            label="Telefone"
            fullWidth
            value={form.phone}
            onChange={(e) => set("phone", maskPhoneInput(e.target.value))}
            placeholder="(11) 99000-0000"
            disabled={isSaving}
          />
        </FormGrid>
      </FormCard>

      <FormCard>
        <FormCardTitle>Alterar Senha</FormCardTitle>
        <FullWidthField>
          <Input
            label="Senha Atual"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            value={form.currentPassword}
            onChange={(e) => set("currentPassword", e.target.value)}
            placeholder="********"
            rightIcon={showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowCurrentPassword((prev) => !prev)}
            disabled={isSaving}
          />
        </FullWidthField>
        <FormGrid>
          <Input
            label="Nova Senha"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={form.newPassword}
            onChange={(e) => set("newPassword", e.target.value)}
            placeholder="********"
            rightIcon={showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowNewPassword((prev) => !prev)}
            disabled={isSaving}
          />
          <Input
            label="Confirmar Nova Senha"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={form.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            placeholder="********"
            rightIcon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={isSaving}
          />
        </FormGrid>
        <PasswordRequirements>{PASSWORD_REQUIREMENTS_MESSAGE}.</PasswordRequirements>
      </FormCard>

      <FormCard>
        <FormCardTitle>Papéis de acesso</FormCardTitle>
        <RoleCheckboxList>
          {/* Role primário: sempre ativo e desabilitado */}
          <RoleCheckboxItem $disabled>
            <RoleToggle $checked $disabled />
            <RoleCheckboxInfo>
              <RoleCheckboxLabel>Proprietário (Admin)</RoleCheckboxLabel>
              <RoleCheckboxDesc>Papel principal. Gerencia toda a clínica.</RoleCheckboxDesc>
            </RoleCheckboxInfo>
          </RoleCheckboxItem>
          {/* Roles adicionais */}
          {EXTRA_ROLES.map(({ role, label, desc }) => (
            <RoleCheckboxItem key={role} onClick={() => handleToggleRole(role)}>
              <RoleToggle $checked={selectedRoles.includes(role)} />
              <RoleCheckboxInfo>
                <RoleCheckboxLabel>{label}</RoleCheckboxLabel>
                <RoleCheckboxDesc>{desc}</RoleCheckboxDesc>
              </RoleCheckboxInfo>
            </RoleCheckboxItem>
          ))}
        </RoleCheckboxList>
        <RolesSaveRow>
          <Button
            icon={<Save size={16} />}
            onClick={() => void handleSaveRoles()}
            disabled={isSavingRoles}
          >
            {isSavingRoles ? "Salvando..." : "Salvar Papéis"}
          </Button>
        </RolesSaveRow>
      </FormCard>

      {hasProfessionalRole && (
        <>
          <FormCard>
            <FormCardTitle>Dados Profissionais</FormCardTitle>

            <FormGrid>
              <Input
                label="Conselho Profissional (ex: CRM, CRO)"
                fullWidth
                value={profForm.professionalCouncil}
                onChange={(e) =>
                  setProfForm((prev) => ({ ...prev, professionalCouncil: e.target.value }))
                }
                placeholder="CRM"
                disabled={isSaving}
              />
              <Input
                label="Número de Registro"
                fullWidth
                value={profForm.registrationNumber}
                onChange={(e) =>
                  setProfForm((prev) => ({ ...prev, registrationNumber: e.target.value }))
                }
                placeholder="123456"
                disabled={isSaving}
              />
              <Input
                label="Estado de Registro (UF)"
                fullWidth
                value={profForm.registrationState}
                onChange={(e) =>
                  setProfForm((prev) => ({ ...prev, registrationState: e.target.value.toUpperCase().slice(0, 2) }))
                }
                placeholder="SP"
                disabled={isSaving}
              />
              <Input
                label="Duração da Consulta (minutos)"
                type="number"
                fullWidth
                value={profForm.defaultAppointmentDuration}
                onChange={(e) =>
                  setProfForm((prev) => ({ ...prev, defaultAppointmentDuration: e.target.value }))
                }
                placeholder="30"
                disabled={isSaving}
              />
            </FormGrid>

            <TextareaWrapper>
              <TextareaLabel>Bio</TextareaLabel>
              <StyledTextarea
                value={profForm.bio}
                onChange={(e) => setProfForm((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Uma breve descrição sobre você e sua experiência..."
                disabled={isSaving}
              />
            </TextareaWrapper>

            <TextareaWrapper>
              <TextareaLabel>Formações</TextareaLabel>
              <StyledTextarea
                value={profForm.formations}
                onChange={(e) => setProfForm((prev) => ({ ...prev, formations: e.target.value }))}
                placeholder="Graduação, especializações, residências..."
                disabled={isSaving}
              />
            </TextareaWrapper>

            <FullWidthField>
              <Input
                label="Especialidade principal"
                fullWidth
                value={profForm.specialty}
                onChange={(e) => setProfForm((prev) => ({ ...prev, specialty: e.target.value }))}
                placeholder="Ex: Cardiologia, Dermatologia..."
                disabled={isSaving}
              />
            </FullWidthField>
          </FormCard>

          <FormCard>
            <FormCardTitle>Horários de Atendimento</FormCardTitle>
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
                        label="Início"
                        type="time"
                        fullWidth
                        value={day.startTime}
                        onChange={(e) => updateDay(day.dayOfWeek, "startTime", e.target.value)}
                        disabled={isSaving}
                      />
                      <Input
                        label="Término"
                        type="time"
                        fullWidth
                        value={day.endTime}
                        onChange={(e) => updateDay(day.dayOfWeek, "endTime", e.target.value)}
                        disabled={isSaving}
                      />
                      <Input
                        label="Início da pausa"
                        type="time"
                        fullWidth
                        value={day.lunchBreakStart}
                        onChange={(e) =>
                          updateDay(day.dayOfWeek, "lunchBreakStart", e.target.value)
                        }
                        disabled={isSaving}
                        placeholder="--:--"
                      />
                      <Input
                        label="Fim da pausa"
                        type="time"
                        fullWidth
                        value={day.lunchBreakEnd}
                        onChange={(e) => updateDay(day.dayOfWeek, "lunchBreakEnd", e.target.value)}
                        disabled={isSaving}
                        placeholder="--:--"
                      />
                    </DayTimeGrid>
                  )}
                </DayItem>
              ))}
            </DayList>
          </FormCard>
        </>
      )}

      <TwoFactorCard />

      <ActionRow>
        <Button variant="outline" onClick={() => navigate("/admin/perfil")} disabled={isSaving}>
          Cancelar
        </Button>
        <Button icon={<Save size={16} />} onClick={() => void handleSave()} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </ActionRow>
    </PageWrapper>
  );
};

export default EditProfilePage;
