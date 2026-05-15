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
    SpecialtySelect,
    TitleBlock,
    TopRow,
    ViewProfessionalsBtn,
} from "./styles";

const MAX_VISIBLE_SPECIALTIES = 3;

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
    const availableSpecialtiesRef = useRef<string[]>([]);
    const allClinicsRef = useRef<ClinicDirectoryItem[] | null>(null);

    const [clinics, setClinics] = useState<ClinicDirectoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());
    const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);

    const [searchName, setSearchName] = useState("");
    const [searchCity, setSearchCity] = useState("");
    const [searchSpecialty, setSearchSpecialty] = useState("");

    // Load all clinics on mount to populate the specialty dropdown and initial list
    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const capitalizeFirst = (s: string) =>
            s.trim().charAt(0).toUpperCase() + s.trim().slice(1);

        const normalizeKey = (s: string) =>
            s.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        searchClinicDirectory({})
            .then((all) => {
                if (!mounted) return;
                // Deduplica por valor sem acento e sem diferença de case
                const seen = new Map<string, string>();
                for (const n of all.flatMap((c) => c.specialtyNames)) {
                    const key = normalizeKey(n);
                    if (!seen.has(key)) seen.set(key, capitalizeFirst(n));
                }
                const specialties = Array.from(seen.values()).sort((a, b) =>
                    a.localeCompare(b, "pt-BR"),
                );
                availableSpecialtiesRef.current = specialties;
                setAvailableSpecialties(specialties);
                setClinics(all);
                allClinicsRef.current = all;
            })
            .catch((error: unknown) => {
                if (!mounted) return;
                notifyError(getApiErrorMessage(error, "Não foi possível carregar as clínicas."));
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    // Filter client-side whenever any filter changes (avoids extra API calls and handles accent normalization)
    useEffect(() => {
        if (loading && allClinicsRef.current === null) return; // skip during initial load

        const normalize = (s: string) =>
            s.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        const all = allClinicsRef.current ?? [];
        const normName = normalize(searchName);
        const normCity = normalize(searchCity);
        const normSpecialty = normalize(searchSpecialty);

        const filtered = all.filter((clinic) => {
            const matchesName =
                !normName ||
                normalize(clinic.tradeName).includes(normName);
            const matchesCity =
                !normCity || (clinic.city ? normalize(clinic.city).includes(normCity) : false);
            const matchesSpecialty =
                !normSpecialty ||
                clinic.specialtyNames.some((s) => normalize(s).includes(normSpecialty));
            return matchesName && matchesCity && matchesSpecialty;
        });

        setClinics(filtered);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchName, searchCity, searchSpecialty]);

    const handleViewProfessionals = (clinic: ClinicDirectoryItem) => {
        navigate(`/paciente/clinicas/${clinic.id}/profissionais`, {
            state: { clinicName: clinic.tradeName },
        });
    };

    const handleLogoError = (clinicId: string) => {
        setLogoErrors((prev) => new Set(prev).add(clinicId));
    };

    const hasFilters = searchName || searchCity || searchSpecialty;

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
                    placeholder="Nome da clínica..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    icon={<Search size={16} />}
                    fullWidth
                />
                <Input
                    placeholder="Cidade..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    icon={<MapPin size={16} />}
                    fullWidth
                />
                <SpecialtySelect
                    value={searchSpecialty}
                    onChange={(e) => setSearchSpecialty(e.target.value)}
                    aria-label="Filtrar por especialidade"
                >
                    <option value="">Todas as especialidades</option>
                    {availableSpecialties.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </SpecialtySelect>
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
                    {hasFilters
                        ? "Nenhuma clínica encontrada para os filtros aplicados."
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
