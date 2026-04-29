import { api } from "../config/api";
import type {
    ClinicDirectoryItem,
    ClinicProfessionalDirectoryItem,
    ClinicProfessionalSpecialty,
    ClinicProfessionalWorkingHour,
} from "../types/clinic-directory";
import {
    toBooleanValue,
    toNumberValue,
    toRecord,
    toTrimmedStringValue,
} from "../utils/parsers";

const BASE_PATH = "/clinic-directory";

const readArray = (payload: unknown): unknown[] => {
    if (Array.isArray(payload)) return payload;
    const root = toRecord(payload) ?? {};
    const data = root.data;
    if (Array.isArray(data)) return data;
    const nested = toRecord(data);
    if (!nested) return [];
    for (const key of ["items", "results", "clinics", "professionals"]) {
        if (Array.isArray(nested[key])) return nested[key] as unknown[];
    }
    return [];
};

const normalizeClinic = (value: unknown): ClinicDirectoryItem | null => {
    const item = toRecord(value);
    if (!item) return null;

    const raw: ClinicDirectoryItem = {
        id: toTrimmedStringValue(item.id),
        tradeName: toTrimmedStringValue(item.tradeName ?? item.name),
        logoUrl: toTrimmedStringValue(item.logoUrl, "") || null,
        phone: toTrimmedStringValue(item.phone, "") || null,
        street: toTrimmedStringValue(item.street),
        number: toTrimmedStringValue(item.number),
        neighborhood: toTrimmedStringValue(item.neighborhood),
        city: toTrimmedStringValue(item.city),
        state: toTrimmedStringValue(item.state),
        specialtyNames: Array.isArray(item.specialtyNames)
            ? (item.specialtyNames as unknown[])
                .map((s) => (typeof s === "string" ? s.trim() : ""))
                .filter(Boolean)
            : [],
        professionalsCount: toNumberValue(item.professionalsCount, 0),
    };

    if (!raw.id || !raw.tradeName) return null;
    return raw;
};

const normalizeProfessional = (value: unknown): ClinicProfessionalDirectoryItem | null => {
    const item = toRecord(value);
    if (!item) return null;

    const specialties: ClinicProfessionalSpecialty[] = Array.isArray(item.specialties)
        ? (item.specialties as unknown[]).flatMap((s) => {
            const rec = toRecord(s);
            if (!rec) return [];
            return [
                {
                    name: toTrimmedStringValue(rec.name),
                    isPrimary: toBooleanValue(rec.isPrimary, false),
                },
            ];
        })
        : [];

    const workingHours: ClinicProfessionalWorkingHour[] = Array.isArray(item.workingHours)
        ? (item.workingHours as unknown[]).flatMap((wh) => {
            const rec = toRecord(wh);
            if (!rec) return [];
            return [
                {
                    dayOfWeek: toTrimmedStringValue(rec.dayOfWeek),
                    startTime: toTrimmedStringValue(rec.startTime),
                    endTime: toTrimmedStringValue(rec.endTime),
                    lunchBreakStart: toTrimmedStringValue(rec.lunchBreakStart, "") || null,
                    lunchBreakEnd: toTrimmedStringValue(rec.lunchBreakEnd, "") || null,
                },
            ];
        })
        : [];

    const affiliatedRaw = toRecord(item.affiliatedClinic) ?? {};
    const affiliatedClinic = {
        id: toTrimmedStringValue(affiliatedRaw.id),
        tradeName: toTrimmedStringValue(affiliatedRaw.tradeName ?? affiliatedRaw.name),
        city: toTrimmedStringValue(affiliatedRaw.city),
        state: toTrimmedStringValue(affiliatedRaw.state),
    };

    const normalized: ClinicProfessionalDirectoryItem = {
        id: toTrimmedStringValue(item.id),
        name: toTrimmedStringValue(item.name),
        avatarUrl: toTrimmedStringValue(item.avatarUrl, "") || null,
        professionalCouncil: toTrimmedStringValue(item.professionalCouncil, "CRM"),
        registrationNumber: toTrimmedStringValue(item.registrationNumber),
        registrationState: toTrimmedStringValue(item.registrationState),
        bio: toTrimmedStringValue(item.bio, "") || null,
        formations: toTrimmedStringValue(item.formations, "") || null,
        specialties,
        workingHours,
        affiliatedClinic,
    };

    if (!normalized.id || !normalized.name) return null;
    return normalized;
};

export const searchClinicDirectory = async (
    query: string,
): Promise<ClinicDirectoryItem[]> => {
    const { data } = await api.get<unknown>(BASE_PATH, {
        params: { q: query },
    });

    return readArray(data)
        .map(normalizeClinic)
        .filter((item): item is ClinicDirectoryItem => item !== null);
};

export const listClinicDirectoryProfessionals = async (
    clinicId: string,
): Promise<ClinicProfessionalDirectoryItem[]> => {
    const { data } = await api.get<unknown>(`${BASE_PATH}/${clinicId}/professionals`);

    return readArray(data)
        .map(normalizeProfessional)
        .filter((item): item is ClinicProfessionalDirectoryItem => item !== null);
};
