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
import { Skeleton } from "../../../components/Skeleton";
import { useAuth } from "../../../contexts";
import { getPatientProfile } from "../../../services/patient-profile.service";
import type { PatientProfileData } from "../../../types/patient-profile";
import { formatIsoDateToBr } from "../../../utils/dateParsers";
import { formatPhoneNumber, getInitials } from "../../../utils/formatters";
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

const toDash = (value: string | null | undefined) => {
  const normalized = (value ?? "").trim();
  return normalized.length > 0 ? normalized : "-";
};

const formatDateBr = (value: string | null | undefined) =>
  formatIsoDateToBr(value, "-", { strictIsoOnly: true });

const splitTags = (...sources: Array<string | null | undefined>): string[] => {
  const tags = sources
    .flatMap((source) => (source ?? "").split(","))
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return [...new Set(tags)];
};

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
        notifyError(getApiErrorMessage(error, "Não foi possível carregar o perfil."));
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
          {loading ? (
            <Skeleton variant="circle" width={70} height={70} />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt={fullName} />
          ) : (
            getInitials(fullName) || "U"
          )}
        </AvatarCircle>
        <HeroName>{loading ? <Skeleton width={220} height={34} /> : fullName}</HeroName>
        <HeroRole>{loading ? <Skeleton width={78} height={14} /> : "Paciente"}</HeroRole>
        <EditButton
          type="button"
          onClick={() => navigate("/paciente/perfil/editar")}
          disabled={loading}
        >
          <Pencil size={15} />
          Editar Perfil
        </EditButton>
      </HeroBanner>

      <CardGrid>
        <InfoCard>
          <CardTitle>Informações Pessoais</CardTitle>
          <InfoRow>
            <InfoLeft>
              <User size={16} />
              <InfoLabel>Nome Completo</InfoLabel>
            </InfoLeft>
            <InfoValue>{loading ? <Skeleton width={170} height={14} /> : fullName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Mail size={16} />
              <InfoLabel>Email</InfoLabel>
            </InfoLeft>
            <InfoValue>{loading ? <Skeleton width={200} height={14} /> : email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Phone size={16} />
              <InfoLabel>Telefone</InfoLabel>
            </InfoLeft>
            <InfoValue>{loading ? <Skeleton width={122} height={14} /> : phone}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <CalendarDays size={16} />
              <InfoLabel>Data de Nascimento</InfoLabel>
            </InfoLeft>
            <InfoValue>{loading ? <Skeleton width={92} height={14} /> : birthDate}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <MapPin size={16} />
              <InfoLabel>Endereço</InfoLabel>
            </InfoLeft>
            <InfoValue>{loading ? <Skeleton width={240} height={14} /> : address}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <CardTitle>Informações Médicas</CardTitle>
          <InfoRow>
            <InfoLeft>
              <Droplet size={16} />
              <InfoLabel>Tipo Sanguineo</InfoLabel>
            </InfoLeft>
            <InfoValue>
              {loading ? <Skeleton width={56} height={14} /> : toDash(medical.bloodType)}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <UserRoundCheck size={16} />
              <InfoLabel>Contato de Emergencia</InfoLabel>
            </InfoLeft>
            <InfoValue>
              {loading ? <Skeleton width={220} height={14} /> : emergencyContact}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <NotebookPen size={16} />
              <InfoLabel>Medicacoes</InfoLabel>
            </InfoLeft>
            <InfoValue>
              {loading ? <Skeleton width={180} height={14} /> : toDash(medical.medications)}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <NotebookPen size={16} />
              <InfoLabel>Observacoes</InfoLabel>
            </InfoLeft>
            <InfoValue>
              {loading ? <Skeleton width={180} height={14} /> : toDash(medical.observations)}
            </InfoValue>
          </InfoRow>
        </InfoCard>
      </CardGrid>

      <FullWidthCard>
        <CardTitle>Condicoes e Alergias</CardTitle>
        {loading ? (
          <TagsWrap>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`condition-skeleton-${index}`} width={110} height={24} radius={999} />
            ))}
          </TagsWrap>
        ) : conditionTags.length > 0 ? (
          <TagsWrap>
            {conditionTags.map((tag, index) => (
              <Tag key={`${tag}-${index}`}>{tag}</Tag>
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
