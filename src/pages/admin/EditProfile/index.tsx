import { Camera, Eye, EyeOff, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { useAuth } from "../../../contexts";
import {
  getProfile,
  updateProfile,
  updateProfilePassword,
} from "../../../services/profile.service";
import type { ProfileData, UpdateProfilePayload } from "../../../types/profile";
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

const normalizeApiValue = (value: string, fallback = "") => (value === "-" ? fallback : value);

const PASSWORD_REQUIREMENTS_MESSAGE =
  "A nova senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.";

const isPasswordStrong = (password: string) =>
  password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
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

    if (!profileChanged && !isChangingPassword && !hasAvatarChange) {
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
