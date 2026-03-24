export type CommentConsultationType =
  | "FIRST_CONSULTATION"
  | "CONSULTATION"
  | "RETURN"
  | "ROUTINE"
  | "EXAM"
  | "EMERGENCY";

export interface PatientComment {
  id: string;
  patientId?: string | null;
  patientName: string;
  patientAvatarUrl?: string | null;
  consultationType?: CommentConsultationType | null;
  date: string; // ISO: YYYY-MM-DD
  createdAt?: string | null;
  content: string;
}

export interface CreateCommentPayload {
  patientId: string;
  content: string;
}

export interface UpdateCommentPayload {
  content: string;
}
