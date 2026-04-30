import { Briefcase, Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts";
import { getReceptionProfile } from "../../../services/reception.service";
import type { ReceptionProfileData } from "../../../types/profile";
import { formatPhoneNumber, getInitials } from "../../../utils/formatters";
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
  LoadingMessage,
  PageWrapper,
} from "./styles";

const EMPTY_PROFILE: ReceptionProfileData = {
  fullName: "-",
  email: "-",
  phone: "-",
  address: "-",
  avatarUrl: "",
  role: "Recepcionista",
};

const toDash = (value: string) => {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "-";
};

const ReceptionProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ReceptionProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getReceptionProfile();
        setProfile(data);
      } catch (err: unknown) {
        notifyError(getApiErrorMessage(err, "Nao foi possivel carregar o perfil."));
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

  const profileData = profile ?? {
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
        <HeroRole>{toDash(profileData.role)}</HeroRole>

        <HeroActions>
          <EditButton
            type="button"
            onClick={() => navigate("/recepcao/perfil/editar")}
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
          <CardTitle>Informacoes Pessoais</CardTitle>
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
              <InfoLabel>Endereco</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.address)}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <CardTitle>Informacoes Profissionais</CardTitle>
          <InfoRow>
            <InfoLeft>
              <Briefcase size={16} />
              <InfoLabel>Cargo</InfoLabel>
            </InfoLeft>
            <InfoValue>{toDash(profileData.role)}</InfoValue>
          </InfoRow>
        </InfoCard>
      </CardGrid>
    </PageWrapper>
  );
};

export default ReceptionProfilePage;
