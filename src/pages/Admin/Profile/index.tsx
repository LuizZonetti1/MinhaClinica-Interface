import {
  BarChart2,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Mail,
  MapPin,
  Monitor,
  Pencil,
  Phone,
  Shield,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts";
import { getDashboardSummary } from "../../../services/admin.service";
import { getProfile } from "../../../services/profile.service";
import type { ProfileData } from "../../../types/profile";
import {
  formatCurrencyBRL,
  formatDateDayMonthYear,
  formatPhoneNumber,
  getInitials,
} from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError } from "../../../utils/toast";
import {
  AvatarCircle,
  CardGrid,
  CardTitle,
  EditButton,
  HeroActions,
  HeroBanner,
  HeroName,
  HeroRole,
  InfoCard,
  InfoLabel,
  InfoLeft,
  InfoRow,
  InfoValue,
  InfoValueHighlight,
  LoadingMessage,
  PageWrapper,
} from "./styles";

const EMPTY_PROFILE: ProfileData = {
  fullName: "-",
  email: "-",
  phone: "-",
  address: "-",
  city: "-",
  state: "-",
  avatarUrl: "",
  clinicName: "-",
  clinicRole: "-",
  foundedAt: "-",
  totalProfessionals: 0,
  accessLevel: "-",
  lastAccess: "-",
  twoFactor: "-",
  activeSession: "-",
  totalPatients: 0,
  activeProfessionals: 0,
  appointmentsThisMonth: 0,
  revenueCurrentMonth: "-",
};

const toDash = (value: string) => {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "-";
};

const isMissingValue = (value: string) => {
  const normalized = value.trim();
  return normalized.length === 0 || normalized === "-";
};

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const [profileResult, dashboardResult] = await Promise.allSettled([
          getProfile(),
          getDashboardSummary(),
        ]);

        const resolvedProfile: ProfileData =
          profileResult.status === "fulfilled"
            ? profileResult.value
            : {
              ...EMPTY_PROFILE,
              fullName: user?.name ?? EMPTY_PROFILE.fullName,
              email: user?.email ?? EMPTY_PROFILE.email,
            };

        if (profileResult.status === "rejected") {
          notifyError(
            getApiErrorMessage(profileResult.reason, "Não foi possível carregar o perfil."),
          );
        }

        if (
          dashboardResult.status === "fulfilled" &&
          isMissingValue(resolvedProfile.revenueCurrentMonth)
        ) {
          const monthlyBalance = Number(dashboardResult.value.monthlyBalance);
          if (Number.isFinite(monthlyBalance)) {
            resolvedProfile.revenueCurrentMonth = formatCurrencyBRL(monthlyBalance);
          }
        }

        setProfile(resolvedProfile);
      } catch (error: unknown) {
        notifyError(getApiErrorMessage(error, "Não foi possível carregar o perfil."));
        setProfile({
          ...EMPTY_PROFILE,
          fullName: user?.name ?? EMPTY_PROFILE.fullName,
          email: user?.email ?? EMPTY_PROFILE.email,
        });
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [user?.email, user?.name]);

  const profileData: ProfileData = profile ?? {
    ...EMPTY_PROFILE,
    fullName: user?.name ?? EMPTY_PROFILE.fullName,
    email: user?.email ?? EMPTY_PROFILE.email,
  };

  const heroInitials = getInitials(profileData.fullName || user?.name || "U");

  return (
    <PageWrapper>
      <HeroBanner>
        <AvatarCircle>
          {profileData.avatarUrl ? (
            <img src={profileData.avatarUrl} alt={profileData.fullName} />
          ) : (
            heroInitials || "U"
          )}
        </AvatarCircle>
        <HeroName>{toDash(profileData.fullName)}</HeroName>
        <HeroRole>{toDash(profileData.clinicRole)}</HeroRole>

        <HeroActions>
          <EditButton
            type="button"
            onClick={() => navigate("/admin/perfil/editar")}
            disabled={loading}
          >
            <Pencil size={15} />
            Editar Perfil
          </EditButton>
        </HeroActions>
      </HeroBanner>

      {loading && <LoadingMessage>Carregando perfil...</LoadingMessage>}

      <CardGrid>
        <InfoCard>
          <CardTitle>Informações Pessoais</CardTitle>
          <InfoRow>
            <InfoLeft>
              <User size={16} />
              <InfoLabel>Nome Completo</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.fullName)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Mail size={16} />
              <InfoLabel>Email</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.email)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Phone size={16} />
              <InfoLabel>Telefone</InfoLabel>
            </InfoLeft>
            <InfoValue>{formatPhoneNumber(profileData.phone)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <MapPin size={16} />
              <InfoLabel>Endereço</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.address)}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <CardTitle>Informações da Clínica</CardTitle>
          <InfoRow>
            <InfoLeft>
              <Building2 size={16} />
              <InfoLabel>Clínica</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.clinicName)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Briefcase size={16} />
              <InfoLabel>Função</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.clinicRole)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Calendar size={16} />
              <InfoLabel>Fundação</InfoLabel>
            </InfoLeft>
            <InfoValue>{formatDateDayMonthYear(profileData.foundedAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Users size={16} />
              <InfoLabel>Profissionais</InfoLabel>
            </InfoLeft>
            <InfoValue>{`${profileData.totalProfessionals} ativos`}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <CardTitle>Acesso e Permissões</CardTitle>
          <InfoRow>
            <InfoLeft>
              <Shield size={16} />
              <InfoLabel>Nível de Acesso</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.accessLevel)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Mail size={16} />
              <InfoLabel>2FA</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.twoFactor)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <Monitor size={16} />
              <InfoLabel>Sessão Ativa</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.activeSession)}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <CardTitle>Estatísticas Gerais</CardTitle>
          <InfoRow>
            <InfoLeft>
              <Users size={16} />
              <InfoLabel>Total de Pacientes</InfoLabel>
            </InfoLeft>
            <InfoValueHighlight>
              {profileData.totalPatients.toLocaleString("pt-BR")}
            </InfoValueHighlight>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <UserCheck size={16} />
              <InfoLabel>Profissionais Ativos</InfoLabel>
            </InfoLeft>
            <InfoValueHighlight>
              {profileData.activeProfessionals.toLocaleString("pt-BR")}
            </InfoValueHighlight>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <BarChart2 size={16} />
              <InfoLabel>Consultas este Mês</InfoLabel>
            </InfoLeft>
            <InfoValueHighlight>
              {profileData.appointmentsThisMonth.toLocaleString("pt-BR")}
            </InfoValueHighlight>
          </InfoRow>
          <InfoRow>
            <InfoLeft>
              <DollarSign size={16} />
              <InfoLabel>Receita (Mês atual)</InfoLabel>
            </InfoLeft>
            <InfoValueHighlight>{toDash(profileData.revenueCurrentMonth)}</InfoValueHighlight>
          </InfoRow>
        </InfoCard>
      </CardGrid>
    </PageWrapper>
  );
};

export default ProfilePage;
