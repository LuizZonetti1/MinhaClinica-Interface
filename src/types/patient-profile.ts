export interface PatientProfilePersonalInfo {
  name: string;
  email: string;
  phone: string | null;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  addressFormatted: string | null;
}

export interface PatientProfileMedicalInfo {
  bloodType: string | null;
  allergies: string | null;
  medications: string | null;
  conditions: string | null;
  observations: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

export interface PatientProfileData {
  personal: PatientProfilePersonalInfo;
  medical: PatientProfileMedicalInfo;
}

export interface UpdatePatientProfilePayload {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  street?: string;
  number?: string;
  complement?: string | null;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
