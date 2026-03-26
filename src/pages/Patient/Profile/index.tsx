import {
  CalendarDays,
  Droplet,
  Mail,
  MapPin,
  NotebookPen,
  Pencil,
  Phone,
  User,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts";
import { getPatientProfile } from "../../../services/patient-profile.service";
import type { PatientProfileData } from "../../../types/patient-profile";
import { formatPhoneNumber } from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError } from "../../../utils/toast";
import {
  AvatarCircle,
  CardGrid,
  CardTitle,
  EditButton,
  EmptyText,
  FullWidthCard,
  HeroBanner,
  HeroName,
  HeroRole,
  InfoCard,
  InfoLabel,
  InfoLeft,
  InfoRow,
  InfoValue,
  LoadingMessage,
  PageWrapper,
  Tag,
  TagsWrap,
} from "./styles";

const EMPTY_PROFILE: PatientProfileData = {
  personal: {
    name: "-",
    email: "-",
    phone: null,
    cpf: "-",
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

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const toDash = (value: string | null | undefined) => {
  const normalized = (value ?? "").trim();
  return normalized.length > 0 ? normalized : "-";
};

const formatDateBr = (value: string | null | undefined) => {
  if (!value) return "-";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "-";
  return `${match[3]}/${match[2]}/${match[1]}`;
};

const splitTags = (...sources: Array<string | null | undefined>): string[] =>
  sources
    .flatMap((source) => (source ?? "").split(","))
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const PatientProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PatientProfileData>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getPatientProfile();
        if (!mounted) return;
        setProfile(data);
      } catch (error: unknown) {
        if (!mounted) return;
        notifyError(getApiErrorMessage(error, "Nao foi possivel carregar o perfil."));
        setProfile({
          ...EMPTY_PROFILE,
          personal: {
            ...EMPTY_PROFILE.personal,
            name: user?.name ?? EMPTY_PROFILE.personal.name,
            email: user?.email ?? EMPTY_PROFILE.personal.email,
            avatarUrl: user?.avatarUrl ?? null,
          },
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

  const fullName = toDash(profile.personal.name || user?.name);
  const email = toDash(profile.personal.email || user?.email);
  const phone = formatPhoneNumber(profile.personal.phone);
  const birthDate = formatDateBr(profile.personal.dateOfBirth);
  const address = toDash(profile.personal.addressFormatted);
  const medical = profile.medical;
  const emergencyContact = `${toDash(medical.emergencyContactName)}${
    medical.emergencyContactPhone ? ` - ${formatPhoneNumber(medical.emergencyContactPhone)}` : ""
  }`;
  const avatarUrl = profile.personal.avatarUrl ?? user?.avatarUrl ?? "";

  const conditionTags = useMemo(
    () => splitTags(medical.conditions, medical.allergies),
    [medical.allergies, medical.conditions],
  );

  return (
    <PageWrapper>
      <HeroBanner>
        <AvatarCircle>
          {avatarUrl ? <img src={avatarUrl} alt={fullName} /> : getInitials(fullName) || "U"}
        </AvatarCircle>
        <HeroName>{fullName}</HeroName>
        <HeroRole>Paciente</HeroRole>
        <EditButton type="button" onClick={() => navigate("/paciente/perfil/editar")} disabled={loading}>
          <Pencil size={15} />
          Editar Perfil
        </EditButton>
      </HeroBanner>

      {loading && <LoadingMessage>Carregando perfil...</LoadingMessage>}

      <CardGrid>
        <InfoCard>
          <CardTitle>Informacoes Pessoais</CardTitle>
          <InfoRow>
            <InfoLeft>
              <User size={16} />
              <InfoLabel>Nome Completo</InfoLabel>
            </InfoLeft>
            <InfoValue>{fullName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Mail size={16} />
              <InfoLabel>Email</InfoLabel>
            </InfoLeft>
            <InfoValue>{email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Phone size={16} />
              <InfoLabel>Telefone</InfoLabel>
            </InfoLeft>
            <InfoValue>{phone}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <CalendarDays size={16} />
              <InfoLabel>Data de Nascimento</InfoLabel>
            </InfoLeft>
            <InfoValue>{birthDate}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <MapPin size={16} />
              <InfoLabel>Endereco</InfoLabel>
            </InfoLeft>
            <InfoValue>{address}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <CardTitle>Informacoes Medicas</CardTitle>
          <InfoRow>
            <InfoLeft>
              <Droplet size={16} />
              <InfoLabel>Tipo Sanguineo</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(medical.bloodType)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <UserRoundCheck size={16} />
              <InfoLabel>Contato de Emergencia</InfoLabel>
            </InfoLeft>
            <InfoValue>{emergencyContact}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <NotebookPen size={16} />
              <InfoLabel>Medicacoes</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(medical.medications)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <NotebookPen size={16} />
              <InfoLabel>Observacoes</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(medical.observations)}</InfoValue>
          </InfoRow>
        </InfoCard>
      </CardGrid>

      <FullWidthCard>
        <CardTitle>Condicoes e Alergias</CardTitle>
        {conditionTags.length > 0 ? (
          <TagsWrap>
            {conditionTags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsWrap>
        ) : (
          <EmptyText>Nenhuma condicao ou alergia informada.</EmptyText>
        )}
      </FullWidthCard>
    </PageWrapper>
  );
};

export default PatientProfilePage;
