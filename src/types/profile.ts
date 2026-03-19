export interface ProfileData {
  // Informacoes pessoais
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  avatarUrl: string;

  // Informacoes da clinica
  clinicName: string;
  clinicRole: string;
  foundedAt: string;
  totalProfessionals: number;

  // Acesso e permissoes
  accessLevel: string;
  lastAccess: string;
  twoFactor: string;
  activeSession: string;

  // Estatisticas gerais
  totalPatients: number;
  activeProfessionals: number;
  appointmentsThisMonth: number;
  revenueCurrentMonth: string;
}

export interface ReceptionProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
  role: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatarFile?: File;
}

export interface UpdateProfilePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserMeResponse {
  [key: string]: unknown;
}
