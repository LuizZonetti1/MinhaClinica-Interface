import { Camera, Eye, EyeOff, Save } from "lucide-react";
import { TwoFactorCard } from "../../../components/TwoFactorCard";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { useAuth } from "../../../contexts";
import {
  getPatientProfile,
  updatePatientAvatar,
  updatePatientPassword,
  updatePatientProfile,
} from "../../../services/patient-profile.service";
import type { PatientProfileData, UpdatePatientProfilePayload } from "../../../types/patient-profile";
import type { UpdateProfilePasswordPayload } from "../../../types/profile";
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
  RoleToggle,
} from "./styles";

type EditForm = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

type BaseForm = Omit<EditForm, "email" | "cpf">;
type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const EMPTY_PROFILE: PatientProfileData = {
  personal: {
    name: "",
    email: "",
    phone: null,
    cpf: "",
    dateOfBirth: "",
    avatarUrl: null,
    street: null,
    number: null,
    complement: null,
    neighborhood: null,
    city: null,
    state: null,
    zipCode: null,
    addressFormatted: null,
  },
  medical: {
    bloodType: null,
    allergies: null,
    medications: null,
    conditions: null,
    observations: null,
    emergencyContactName: null,
    emergencyContactPhone: null,
  },
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");
const maskZipCode = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const toNullWhenEmpty = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const PASSWORD_REQUIREMENTS_MESSAGE =
  "A nova senha deve ter no minimo 8 caracteres, com letras maiusculas, minusculas e numeros.";

const isPasswordStrong = (password: string) =>
  password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

const PatientEditProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("");
  const [baseForm, setBaseForm] = useState<BaseForm>({
    name: "",
    phone: "",
    dateOfBirth: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [form, setForm] = useState<EditForm>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    dateOfBirth: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);

      try {
        const data = await getPatientProfile();
        if (!mounted) return;

        const initialForm: EditForm = {
          name: data.personal.name || user?.name || "",
          email: data.personal.email || user?.email || "",
          phone: maskPhoneInput(data.personal.phone ?? ""),
          cpf: data.personal.cpf ?? "",
          dateOfBirth: data.personal.dateOfBirth ?? "",
          street: data.personal.street ?? "",
          number: data.personal.number ?? "",
          complement: data.personal.complement ?? "",
          neighborhood: data.personal.neighborhood ?? "",
          city: data.personal.city ?? "",
          state: (data.personal.state ?? "").toUpperCase(),
          zipCode: maskZipCode(data.personal.zipCode ?? ""),
        };
        const initialAvatar = data.personal.avatarUrl ?? user?.avatarUrl ?? "";

        setForm(initialForm);
        setCurrentAvatarUrl(initialAvatar);
        setAvatarPreview(initialAvatar);
        setAvatarFile(null);
        setBaseForm({
          name: initialForm.name,
          phone: normalizePhoneDigits(initialForm.phone),
          dateOfBirth: initialForm.dateOfBirth,
          street: initialForm.street,
          number: initialForm.number,
          complement: initialForm.complement,
          neighborhood: initialForm.neighborhood,
          city: initialForm.city,
          state: initialForm.state,
          zipCode: onlyDigits(initialForm.zipCode),
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error: unknown) {
        if (!mounted) return;
        notifyError(getApiErrorMessage(error, "Nao foi possivel carregar o perfil."));

        const fallback = {
          ...EMPTY_PROFILE,
          personal: {
            ...EMPTY_PROFILE.personal,
            name: user?.name ?? "",
            email: user?.email ?? "",
            avatarUrl: user?.avatarUrl ?? null,
          },
        };

        const fallbackForm: EditForm = {
          name: fallback.personal.name,
          email: fallback.personal.email,
          phone: "",
          cpf: "",
          dateOfBirth: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        };
        const fallbackAvatar = fallback.personal.avatarUrl ?? "";

        setForm(fallbackForm);
        setCurrentAvatarUrl(fallbackAvatar);
        setAvatarPreview(fallbackAvatar);
        setAvatarFile(null);
        setBaseForm({
          name: fallbackForm.name,
          phone: "",
          dateOfBirth: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [user?.avatarUrl, user?.email, user?.name]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const set = <K extends keyof EditForm>(key: K, value: EditForm[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  const setPassword = <K extends keyof PasswordForm>(key: K, value: PasswordForm[K]) =>
    setPasswordForm((previous) => ({ ...previous, [key]: value }));

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
    if (isSaving || loading) return;

    const trimmedName = form.name.trim();
    const normalizedPhone = normalizePhoneDigits(form.phone);
    const normalizedZipCode = onlyDigits(form.zipCode);
    const normalizedState = form.state.trim().toUpperCase();
    const normalizedDateOfBirth = form.dateOfBirth.trim();

    if (!trimmedName || trimmedName.length < 2) {
      notifyError("Nome deve ter ao menos 2 caracteres.");
      return;
    }

    if (normalizedPhone && ![10, 11].includes(normalizedPhone.length)) {
      notifyError("Telefone invalido. Informe 10 ou 11 digitos.");
      return;
    }

    if (normalizedDateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(normalizedDateOfBirth)) {
      notifyError("Data de nascimento invalida. Use o formato YYYY-MM-DD.");
      return;
    }

    if (normalizedState && normalizedState.length !== 2) {
      notifyError("Estado deve ter 2 letras (UF).");
      return;
    }

    if (normalizedZipCode && normalizedZipCode.length !== 8) {
      notifyError("CEP deve ter 8 digitos.");
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

    const payload: UpdatePatientProfilePayload = {};

    if (trimmedName !== baseForm.name.trim()) payload.name = trimmedName;
    if (normalizedPhone !== baseForm.phone) payload.phone = normalizedPhone;
    if (normalizedDateOfBirth !== baseForm.dateOfBirth.trim()) payload.dateOfBirth = normalizedDateOfBirth;

    if (form.street.trim() !== baseForm.street.trim()) payload.street = form.street.trim();
    if (form.number.trim() !== baseForm.number.trim()) payload.number = form.number.trim();
    if (form.neighborhood.trim() !== baseForm.neighborhood.trim())
      payload.neighborhood = form.neighborhood.trim();
    if (form.city.trim() !== baseForm.city.trim()) payload.city = form.city.trim();
    if (normalizedState !== baseForm.state.trim().toUpperCase()) payload.state = normalizedState;
    if (normalizedZipCode !== baseForm.zipCode) payload.zipCode = normalizedZipCode;

    if (form.complement.trim() !== baseForm.complement.trim()) {
      payload.complement = toNullWhenEmpty(form.complement);
    }
    const profileChanged = Object.keys(payload).length > 0;
    const hasAvatarChange = avatarFile instanceof File;

    if (!profileChanged && !hasAvatarChange && !isChangingPassword) {
      notifySuccess("Nenhuma alteracao para salvar.");
      return;
    }

    setIsSaving(true);
    try {
      if (profileChanged) {
        await updatePatientProfile(payload);
      }
      if (hasAvatarChange) {
        await updatePatientAvatar(avatarFile as File);
      }
      if (isChangingPassword) {
        const passwordPayload: UpdateProfilePasswordPayload = {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        };
        await updatePatientPassword(passwordPayload);
      }

      const refreshed = await getPatientProfile();
      const refreshedName = refreshed.personal.name || trimmedName;
      const refreshedAvatar = refreshed.personal.avatarUrl ?? currentAvatarUrl;

      if (user) {
        setUser({
          ...user,
          name: refreshedName,
          avatarUrl: refreshedAvatar || undefined,
        });
      }

      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      setCurrentAvatarUrl(refreshedAvatar);
      setAvatarPreview(refreshedAvatar);
      setAvatarFile(null);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      notifySuccess("Perfil atualizado com sucesso.");
      navigate("/paciente/perfil");
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
        <FormCardTitle>Informacoes Pessoais</FormCardTitle>

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
            disabled={isSaving || loading}
          />
        </AvatarUploadArea>

        <FormGrid>
          <Input
            label="Nome Completo"
            fullWidth
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            disabled={isSaving || loading}
          />
          <Input label="Email" fullWidth value={form.email} disabled />
          <Input
            label="Telefone"
            fullWidth
            value={form.phone}
            onChange={(event) => set("phone", maskPhoneInput(event.target.value))}
            placeholder="(11) 99999-9999"
            disabled={isSaving || loading}
          />
          <Input
            label="Data de Nascimento"
            type="date"
            fullWidth
            value={form.dateOfBirth}
            onChange={(event) => set("dateOfBirth", event.target.value)}
            disabled={isSaving || loading}
          />
          <Input label="CPF" fullWidth value={form.cpf} disabled />
        </FormGrid>
      </FormCard>

      <FormCard>
        <FormCardTitle>Endereco</FormCardTitle>
        <FormGrid>
          <FullWidthField>
            <Input
              label="Endereco"
              fullWidth
              value={form.street}
              onChange={(event) => set("street", event.target.value)}
              disabled={isSaving || loading}
            />
          </FullWidthField>
          <Input
            label="Numero"
            fullWidth
            value={form.number}
            onChange={(event) => set("number", event.target.value)}
            disabled={isSaving || loading}
          />
          <Input
            label="Complemento"
            fullWidth
            value={form.complement}
            onChange={(event) => set("complement", event.target.value)}
            disabled={isSaving || loading}
          />
          <Input
            label="Bairro"
            fullWidth
            value={form.neighborhood}
            onChange={(event) => set("neighborhood", event.target.value)}
            disabled={isSaving || loading}
          />
          <Input
            label="Cidade"
            fullWidth
            value={form.city}
            onChange={(event) => set("city", event.target.value)}
            disabled={isSaving || loading}
          />
          <Input
            label="Estado"
            fullWidth
            maxLength={2}
            value={form.state}
            onChange={(event) => set("state", event.target.value.toUpperCase())}
            placeholder="SP"
            disabled={isSaving || loading}
          />
          <Input
            label="CEP"
            fullWidth
            value={form.zipCode}
            onChange={(event) => set("zipCode", maskZipCode(event.target.value))}
            placeholder="00000-000"
            disabled={isSaving || loading}
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
            value={passwordForm.currentPassword}
            onChange={(event) => setPassword("currentPassword", event.target.value)}
            placeholder="********"
            rightIcon={showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowCurrentPassword((previous) => !previous)}
            disabled={isSaving || loading}
          />
        </FullWidthField>
        <FormGrid>
          <Input
            label="Nova Senha"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={passwordForm.newPassword}
            onChange={(event) => setPassword("newPassword", event.target.value)}
            placeholder="********"
            rightIcon={showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowNewPassword((previous) => !previous)}
            disabled={isSaving || loading}
          />
          <Input
            label="Confirmar Nova Senha"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={passwordForm.confirmPassword}
            onChange={(event) => setPassword("confirmPassword", event.target.value)}
            placeholder="********"
            rightIcon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowConfirmPassword((previous) => !previous)}
            disabled={isSaving || loading}
          />
        </FormGrid>
        <PasswordRequirements>{PASSWORD_REQUIREMENTS_MESSAGE}</PasswordRequirements>
      </FormCard>

      <FormCard>
        <FormCardTitle>Papéis de acesso</FormCardTitle>
        <RoleCheckboxList>
          <RoleCheckboxItem $disabled>
            <RoleToggle $checked $disabled />
            <RoleCheckboxInfo>
              <RoleCheckboxLabel>Paciente</RoleCheckboxLabel>
              <RoleCheckboxDesc>Papel principal. Acesso ao portal do paciente, agendamentos e clínicas.</RoleCheckboxDesc>
            </RoleCheckboxInfo>
          </RoleCheckboxItem>
        </RoleCheckboxList>
      </FormCard>

      <TwoFactorCard />

      <ActionRow>
        <Button variant="outline" onClick={() => navigate("/paciente/perfil")} disabled={isSaving || loading}>
          Cancelar
        </Button>
        <Button
          icon={<Save size={16} />}
          onClick={() => void handleSave()}
          disabled={isSaving || loading}
        >
          {isSaving ? "Salvando..." : "Salvar Alteracoes"}
        </Button>
      </ActionRow>
    </PageWrapper>
  );
};

export default PatientEditProfilePage;
