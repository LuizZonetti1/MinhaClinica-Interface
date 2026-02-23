// ─── Clinic ───────────────────────────────────────────────────────────────────
export interface Clinic {
    id: string;
    name: string;
    cnpj: string;
    phone: string;
    email: string;
    address: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateClinicPayload {
    name: string;
    cnpj: string;
    phone: string;
    email: string;
    address: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };
}

export type UpdateClinicPayload = Partial<CreateClinicPayload>;

export interface ClinicListResponse {
    data: Clinic[];
    total: number;
}
