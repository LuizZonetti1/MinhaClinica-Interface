import { ArrowLeft, Building2, Clock3, Stethoscope, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Skeleton } from "../../../../components/Skeleton";
import { listClinicDirectoryProfessionals } from "../../../../services/clinic-directory.service";
import type { ClinicProfessionalDirectoryItem } from "../../../../types/clinic-directory";
import { getInitials } from "../../../../utils/formatters";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";
import { notifyError } from "../../../../utils/toast";
import {
    AffiliatedClinicRow,
    BackButton,
    BackRow,
    Divider,
    EmptyState,
    PageSubtitle,
    PageTitle,
    PageWrapper,
    ProfAvatarImg,
    ProfAvatarWrapper,
    ProfBioText,
    ProfCard,
    ProfCardBody,
    ProfCardHeader,
    ProfFormationsText,
    ProfHeaderInfo,
    ProfName,
    ProfRegistry,
    ProfSectionLabel,
    ProfTextBlock,
    ProfessionalsGrid,
    ScheduleDay,
    ScheduleGrid,
    ScheduleRow,
    ScheduleTime,
    SkeletonCard,
    SkeletonGrid,
    SpecialtiesRow,
    SpecialtyChip,
    TitleBlock,
} from "./styles";

const DAY_LABELS: Record<string, string> = {
    MONDAY: "Seg",
    TUESDAY: "Ter",
    WEDNESDAY: "Qua",
    THURSDAY: "Qui",
    FRIDAY: "Sex",
    SATURDAY: "Sáb",
    SUNDAY: "Dom",
};

const DAY_ORDER: Record<string, number> = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
};

const formatTime = (time: string): string => {
    // Already "HH:mm" — just returns as-is
    if (/^\d{2}:\d{2}$/.test(time)) return time;
    return time;
};

const PatientClinicProfessionalsPage = () => {
    const { clinicId } = useParams<{ clinicId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const clinicName = (location.state as { clinicName?: string } | null)?.clinicName ?? "Clínica";

    const [professionals, setProfessionals] = useState<ClinicProfessionalDirectoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [avatarErrors, setAvatarErrors] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!clinicId) return;

        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const data = await listClinicDirectoryProfessionals(clinicId);
                if (!mounted) return;
                setProfessionals(data);
            } catch (error: unknown) {
                if (!mounted) return;
                notifyError(getApiErrorMessage(error, "Não foi possível carregar os profissionais."));
                setProfessionals([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void load();

        return () => {
            mounted = false;
        };
    }, [clinicId]);

    const handleAvatarError = (profId: string) => {
        setAvatarErrors((prev) => new Set(prev).add(profId));
    };

    return (
        <PageWrapper>
            <BackRow>
                <BackButton onClick={() => navigate("/paciente/clinicas")}>
                    <ArrowLeft size={14} />
                    Voltar para Clínicas
                </BackButton>
            </BackRow>

            <TitleBlock>
                <PageTitle>Profissionais</PageTitle>
                <PageSubtitle>{clinicName}</PageSubtitle>
            </TitleBlock>

            {loading ? (
                <SkeletonGrid>
                    {Array.from({ length: 4 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                        <SkeletonCard key={i}>
                            <Skeleton height="100%" />
                        </SkeletonCard>
                    ))}
                </SkeletonGrid>
            ) : professionals.length === 0 ? (
                <EmptyState>
                    <UserRound size={36} strokeWidth={1.5} />
                    Nenhum profissional cadastrado nesta clínica.
                </EmptyState>
            ) : (
                <ProfessionalsGrid>
                    {professionals.map((prof) => {
                        const showAvatar = Boolean(prof.avatarUrl) && !avatarErrors.has(prof.id);
                        const initials = getInitials(prof.name);
                        const registry = `${prof.professionalCouncil} ${prof.registrationNumber}/${prof.registrationState}`;

                        const sortedWorkingHours = [...prof.workingHours].sort(
                            (a, b) => (DAY_ORDER[a.dayOfWeek] ?? 99) - (DAY_ORDER[b.dayOfWeek] ?? 99),
                        );

                        return (
                            <ProfCard key={prof.id}>
                                <ProfCardHeader>
                                    <ProfAvatarWrapper>
                                        {showAvatar ? (
                                            <ProfAvatarImg
                                                src={prof.avatarUrl ?? ""}
                                                alt={prof.name}
                                                onError={() => handleAvatarError(prof.id)}
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </ProfAvatarWrapper>
                                    <ProfHeaderInfo>
                                        <ProfName>{prof.name}</ProfName>
                                        <ProfRegistry>{registry}</ProfRegistry>
                                    </ProfHeaderInfo>
                                </ProfCardHeader>

                                <ProfCardBody>
                                    {/* Especialidades */}
                                    {prof.specialties.length > 0 && (
                                        <ProfTextBlock>
                                            <ProfSectionLabel>
                                                <Stethoscope size={10} /> Especialidades
                                            </ProfSectionLabel>
                                            <SpecialtiesRow>
                                                {prof.specialties.map((s) => (
                                                    <SpecialtyChip key={s.name} $primary={s.isPrimary}>
                                                        {s.name}
                                                    </SpecialtyChip>
                                                ))}
                                            </SpecialtiesRow>
                                        </ProfTextBlock>
                                    )}

                                    {/* Formações */}
                                    {prof.formations && (
                                        <ProfTextBlock>
                                            <ProfSectionLabel>Formações</ProfSectionLabel>
                                            <ProfFormationsText>{prof.formations}</ProfFormationsText>
                                        </ProfTextBlock>
                                    )}

                                    {/* Bio */}
                                    {prof.bio && (
                                        <ProfTextBlock>
                                            <ProfSectionLabel>Sobre</ProfSectionLabel>
                                            <ProfBioText>{prof.bio}</ProfBioText>
                                        </ProfTextBlock>
                                    )}

                                    {/* Horários de atendimento */}
                                    {sortedWorkingHours.length > 0 && (
                                        <ProfTextBlock>
                                            <ProfSectionLabel>
                                                <Clock3 size={10} /> Horários de atendimento
                                            </ProfSectionLabel>
                                            <ScheduleGrid>
                                                {sortedWorkingHours.map((wh) => {
                                                    const label = DAY_LABELS[wh.dayOfWeek] ?? wh.dayOfWeek;
                                                    const timeRange = `${formatTime(wh.startTime)} – ${formatTime(wh.endTime)}`;
                                                    const lunchInfo =
                                                        wh.lunchBreakStart && wh.lunchBreakEnd
                                                            ? ` (almoço ${formatTime(wh.lunchBreakStart)}–${formatTime(wh.lunchBreakEnd)})`
                                                            : "";
                                                    return (
                                                        <ScheduleRow key={wh.dayOfWeek}>
                                                            <ScheduleDay>{label}</ScheduleDay>
                                                            <ScheduleTime>
                                                                {timeRange}
                                                                {lunchInfo}
                                                            </ScheduleTime>
                                                        </ScheduleRow>
                                                    );
                                                })}
                                            </ScheduleGrid>
                                        </ProfTextBlock>
                                    )}

                                    <Divider />

                                    {/* Clínica vinculada */}
                                    <AffiliatedClinicRow>
                                        <Building2 size={13} />
                                        {prof.affiliatedClinic.tradeName}
                                        {prof.affiliatedClinic.city && (
                                            <> · {prof.affiliatedClinic.city}/{prof.affiliatedClinic.state}</>
                                        )}
                                    </AffiliatedClinicRow>
                                </ProfCardBody>
                            </ProfCard>
                        );
                    })}
                </ProfessionalsGrid>
            )}
        </PageWrapper>
    );
};

export default PatientClinicProfessionalsPage;
