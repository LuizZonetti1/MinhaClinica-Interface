import {
    Building2,
    ChevronRight,
    Hospital,
    MapPin,
    Phone,
    Search,
    Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../../components/Input";
import { Skeleton } from "../../../components/Skeleton";
import { searchClinicDirectory } from "../../../services/clinic-directory.service";
import type { ClinicDirectoryItem } from "../../../types/clinic-directory";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError } from "../../../utils/toast";
import {
    ClinicCard,
    ClinicCardBody,
    ClinicCardFooter,
    ClinicCardHeader,
    ClinicLogoImg,
    ClinicLogoWrapper,
    ClinicMeta,
    ClinicName,
    ClinicsGrid,
    EmptyState,
    MoreSpecialtiesChip,
    PageSubtitle,
    PageTitle,
    PageWrapper,
    ProfCountBadge,
    SearchRow,
    SkeletonCard,
    SkeletonGrid,
    SpecialtiesRow,
    SpecialtyChip,
    TitleBlock,
    TopRow,
    ViewProfessionalsBtn,
} from "./styles";

const MAX_VISIBLE_SPECIALTIES = 3;

const normalizeSearch = (value: string): string =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const filterClinics = (clinics: ClinicDirectoryItem[], query: string): ClinicDirectoryItem[] => {
    const q = normalizeSearch(query);
    if (!q) return clinics;
    return clinics.filter((clinic) => {
        const haystack = normalizeSearch(
            `${clinic.tradeName} ${clinic.city} ${clinic.state} ${clinic.neighborhood}`,
        );
        return haystack.includes(q);
    });
};

const formatAddress = (clinic: ClinicDirectoryItem): string => {
    const parts: string[] = [];
    if (clinic.street) {
        parts.push(clinic.number ? `${clinic.street}, ${clinic.number}` : clinic.street);
    }
    if (clinic.neighborhood) parts.push(clinic.neighborhood);
    if (clinic.city && clinic.state) parts.push(`${clinic.city} - ${clinic.state}`);
    else if (clinic.city) parts.push(clinic.city);
    return parts.join(" · ");
};

const PatientClinicsPage = () => {
    const navigate = useNavigate();
    const allClinicsRef = useRef<ClinicDirectoryItem[] | null>(null);

    const [clinics, setClinics] = useState<ClinicDirectoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    // Load all clinics once, then filter client-side — same pattern as PatientAgendamentos
    useEffect(() => {
        let mounted = true;

        const loadClinics = async () => {
            setLoading(true);

            // Already cached
            if (allClinicsRef.current) {
                setClinics(filterClinics(allClinicsRef.current, searchQuery));
                setLoading(false);
                return;
            }

            try {
                const all = await searchClinicDirectory("");
                if (!mounted) return;
                allClinicsRef.current = all;
                setClinics(filterClinics(all, searchQuery));
            } catch (error: unknown) {
                if (!mounted) return;
                notifyError(getApiErrorMessage(error, "Não foi possível carregar as clínicas."));
                setClinics([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void loadClinics();

        return () => {
            mounted = false;
        };
        // intentionally only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter client-side on every query change (after initial load)
    useEffect(() => {
        if (!allClinicsRef.current) return;
        const timer = window.setTimeout(() => {
            setClinics(filterClinics(allClinicsRef.current ?? [], searchQuery));
        }, 180);
        return () => window.clearTimeout(timer);
    }, [searchQuery]);

    const handleViewProfessionals = (clinic: ClinicDirectoryItem) => {
        navigate(`/paciente/clinicas/${clinic.id}/profissionais`, {
            state: { clinicName: clinic.tradeName },
        });
    };

    const handleLogoError = (clinicId: string) => {
        setLogoErrors((prev) => new Set(prev).add(clinicId));
    };

    return (
        <PageWrapper>
            <TopRow>
                <TitleBlock>
                    <PageTitle>Clínicas</PageTitle>
                    <PageSubtitle>Encontre clínicas cadastradas e conheça seus profissionais</PageSubtitle>
                </TitleBlock>
            </TopRow>

            <SearchRow>
                <Input
                    placeholder="Buscar por nome da clínica ou cidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    iconLeft={<Search size={16} />}
                    fullWidth
                />
            </SearchRow>

            {loading ? (
                <SkeletonGrid>
                    {Array.from({ length: 6 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                        <SkeletonCard key={i}>
                            <Skeleton height="100%" />
                        </SkeletonCard>
                    ))}
                </SkeletonGrid>
            ) : clinics.length === 0 ? (
                <EmptyState>
                    <Building2 size={36} strokeWidth={1.5} />
                    {searchQuery
                        ? `Nenhuma clínica encontrada para "${searchQuery}".`
                        : "Nenhuma clínica disponível no momento."}
                </EmptyState>
            ) : (
                <ClinicsGrid>
                    {clinics.map((clinic) => {
                        const address = formatAddress(clinic);
                        const visibleSpecialties = clinic.specialtyNames.slice(0, MAX_VISIBLE_SPECIALTIES);
                        const extraCount = clinic.specialtyNames.length - MAX_VISIBLE_SPECIALTIES;
                        const showLogo =
                            Boolean(clinic.logoUrl) && !logoErrors.has(clinic.id);

                        return (
                            <ClinicCard key={clinic.id}>
                                <ClinicCardHeader>
                                    <ClinicLogoWrapper>
                                        {showLogo ? (
                                            <ClinicLogoImg
                                                src={clinic.logoUrl ?? ""}
                                                alt={clinic.tradeName}
                                                onError={() => handleLogoError(clinic.id)}
                                            />
                                        ) : (
                                            <Hospital size={24} strokeWidth={1.5} />
                                        )}
                                    </ClinicLogoWrapper>
                                    <ClinicName>{clinic.tradeName}</ClinicName>
                                </ClinicCardHeader>

                                <ClinicCardBody>
                                    {address && (
                                        <ClinicMeta>
                                            <MapPin size={13} />
                                            {address}
                                        </ClinicMeta>
                                    )}
                                    {clinic.phone && (
                                        <ClinicMeta>
                                            <Phone size={13} />
                                            {clinic.phone}
                                        </ClinicMeta>
                                    )}

                                    {visibleSpecialties.length > 0 && (
                                        <SpecialtiesRow>
                                            {visibleSpecialties.map((name) => (
                                                <SpecialtyChip key={name}>{name}</SpecialtyChip>
                                            ))}
                                            {extraCount > 0 && (
                                                <MoreSpecialtiesChip>+{extraCount}</MoreSpecialtiesChip>
                                            )}
                                        </SpecialtiesRow>
                                    )}
                                </ClinicCardBody>

                                <ClinicCardFooter>
                                    <ProfCountBadge>
                                        <Users size={13} />
                                        {clinic.professionalsCount}{" "}
                                        {clinic.professionalsCount === 1 ? "profissional" : "profissionais"}
                                    </ProfCountBadge>
                                    <ViewProfessionalsBtn onClick={() => handleViewProfessionals(clinic)}>
                                        Ver profissionais
                                        <ChevronRight size={14} />
                                    </ViewProfessionalsBtn>
                                </ClinicCardFooter>
                            </ClinicCard>
                        );
                    })}
                </ClinicsGrid>
            )}
        </PageWrapper>
    );
};

export default PatientClinicsPage;
