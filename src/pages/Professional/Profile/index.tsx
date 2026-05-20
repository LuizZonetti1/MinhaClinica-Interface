import { Building2, Pencil, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts";
import { get2FAStatus } from "../../../services/auth.service";
import { getProfessionalProfile } from "../../../services/professional-profile.service";
import type { ProfessionalProfileData, WorkingHour } from "../../../types/professional-profile";
import { formatPhoneNumber, getInitials } from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError } from "../../../utils/toast";
import {
  AvatarCircle,
  CardTitle,
  ContentCard,
  ContentGrid,
  DayName,
  DayRow,
  DaySchedule,
  EditButton,
  FormationLine,
  HeroActions,
  HeroBanner,
  HeroInfo,
  HeroLeft,
  HeroName,
  HeroSubtitle,
  HeroTag,
  HeroTagsRow,
  LoadingMessage,
  PageWrapper,
  Section,
  SectionDivider,
  SectionText,
  SectionTitle,
  SpecialtyTag,
  SpecialtyTagRow,
  StatItem,
  StatLabel,
  StatMeta,
  StatsRow,
  StatValue,
} from "./styles";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const formatSchedule = (workingHour: WorkingHour): string => {
  if (!workingHour.isWorking) return "Fechado";
  if (workingHour.lunchBreakStart && workingHour.lunchBreakEnd) {
    return `${workingHour.startTime} - ${workingHour.lunchBreakStart} / ${workingHour.lunchBreakEnd} - ${workingHour.endTime}`;
  }

  return `${workingHour.startTime} - ${workingHour.endTime}`;
};

const sortedWorkingHours = (hours: WorkingHour[]): WorkingHour[] => {
  const map = new Map(hours.map((hour) => [hour.dayOfWeek, hour]));

  return DAY_ORDER.map(
    (day) =>
      map.get(day) ?? {
        dayOfWeek: day,
        isWorking: false,
        startTime: "",
        endTime: "",
        lunchBreakStart: null,
        lunchBreakEnd: null,
      },
  );
};

const ProfessionalProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfessionalProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    get2FAStatus()
      .then((r) => setTwoFactorEnabled(r.enabled))
      .catch(() => setTwoFactorEnabled(false));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProfessionalProfile();
        setProfile(data);
      } catch (error: unknown) {
        notifyError(getApiErrorMessage(error, "Não foi possível carregar o perfil."));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const profileName = profile?.name ?? user?.name ?? "Profissional";
  const initials = getInitials(profileName);

  const primarySpecialty = profile?.specialties.find((specialty) => specialty.isPrimary);
  const heroSubtitle = profile
    ? [
      primarySpecialty?.name,
      `${profile.professionalCouncil} ${profile.registrationNumber}/${profile.registrationState}`,
    ]
      .filter(Boolean)
      .join(" - ")
    : "";

  const formations = profile?.formations ? profile.formations.split("\n").filter(Boolean) : [];
  const orderedHours = sortedWorkingHours(profile?.workingHours ?? []);
  const phone = profile?.phone ? formatPhoneNumber(profile.phone) : "-";

  return (
    <PageWrapper>
      <HeroBanner>
        <HeroLeft>
          <AvatarCircle>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profileName} />
            ) : (
              initials || "P"
            )}
          </AvatarCircle>

          <HeroInfo>
            <HeroName>{profileName}</HeroName>
            {heroSubtitle && <HeroSubtitle>{heroSubtitle}</HeroSubtitle>}
            <HeroTagsRow>
              {profile?.specialties.map((specialty) => (
                <HeroTag key={specialty.specialtyId}>{specialty.name}</HeroTag>
              ))}
              {profile?.isActive && <HeroTag $variant="active">Ativo</HeroTag>}
            </HeroTagsRow>
          </HeroInfo>
        </HeroLeft>

        <HeroActions>
          <EditButton
            type="button"
            onClick={() => navigate("/profissional/perfil/editar")}
            disabled={loading}
          >
            <Pencil size={15} />
            Editar Perfil
          </EditButton>
        </HeroActions>
      </HeroBanner>

      {loading && <LoadingMessage>Carregando perfil...</LoadingMessage>}

      {profile && (
        <>
          <StatsRow>
            <StatItem>
              <StatValue>{profile.totalPatientsAttended.toLocaleString("pt-BR")}</StatValue>
              <StatMeta>
                <Users size={14} />
                <StatLabel>Pacientes atendidos</StatLabel>
              </StatMeta>
            </StatItem>

            <StatItem>
              <StatValue>
                {profile.yearsAtClinic} {profile.yearsAtClinic === 1 ? "ano" : "anos"}
              </StatValue>
              <StatMeta>
                <Building2 size={14} />
                <StatLabel>Na clínica</StatLabel>
              </StatMeta>
            </StatItem>
          </StatsRow>

          <ContentGrid>
            <ContentCard>
              {profile.bio && (
                <>
                  <Section>
                    <SectionTitle>Sobre</SectionTitle>
                    <SectionText>{profile.bio}</SectionText>
                  </Section>
                  <SectionDivider />
                </>
              )}

              <Section>
                <SectionTitle>Especialidades</SectionTitle>
                <SpecialtyTagRow>
                  {profile.specialties.length > 0 ? (
                    profile.specialties.map((specialty) => (
                      <SpecialtyTag key={specialty.specialtyId}>{specialty.name}</SpecialtyTag>
                    ))
                  ) : (
                    <SectionText>Nenhuma especialidade cadastrada.</SectionText>
                  )}
                </SpecialtyTagRow>
              </Section>

              {formations.length > 0 && (
                <>
                  <SectionDivider />
                  <Section>
                    <SectionTitle>Formação</SectionTitle>
                    {formations.map((line, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static formation list
                      <FormationLine key={index}>{line}</FormationLine>
                    ))}
                  </Section>
                </>
              )}

              {!profile.bio && formations.length === 0 && (
                <Section>
                  <SectionText>Nenhuma informação profissional cadastrada.</SectionText>
                </Section>
              )}
            </ContentCard>

            <ContentCard>
              <CardTitle>Horários de Atendimento</CardTitle>
              {orderedHours.map((workingHour) => {
                const schedule = formatSchedule(workingHour);
                return (
                  <DayRow key={workingHour.dayOfWeek}>
                    <DayName>{DAY_LABELS[workingHour.dayOfWeek] ?? workingHour.dayOfWeek}</DayName>
                    <DaySchedule $closed={!workingHour.isWorking}>{schedule}</DaySchedule>
                  </DayRow>
                );
              })}
            </ContentCard>
          </ContentGrid>

          {phone !== "-" && (
            <p
              style={{
                margin: "16px 0 0",
                fontFamily: "Roboto, sans-serif",
                fontSize: 13,
                color: "var(--mc-text-muted, #6B7280)",
              }}
            >
              Contato: {phone} - {profile.email}
            </p>
          )}

          <ContentCard style={{ marginTop: 16 }}>
            <Section>
              <SectionTitle>
                <Shield size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                Acesso e Seguranca
              </SectionTitle>
              <SectionDivider />
              <SectionText>
                Verificacao em dois fatores (2FA):{" "}
                <strong>
                  {twoFactorEnabled === null ? "-" : twoFactorEnabled ? "Ativado" : "Desativado"}
                </strong>
              </SectionText>
            </Section>
          </ContentCard>
        </>
      )}
    </PageWrapper>
  );
};

export default ProfessionalProfilePage;
