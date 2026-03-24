import { api } from "../config/api";
import type {
  CommentConsultationType,
  CreateCommentPayload,
  PatientComment,
  UpdateCommentPayload,
} from "../types/comment";

type ApiRecord = Record<string, unknown>;

const BASE_PATH = "/professionals/me/comments";

export type CompletedConsultationPatient = {
  patientId: string;
  name: string;
  avatarUrl: string | null;
  lastCompletedAt: string;
};

const toRecord = (value: unknown): ApiRecord | null =>
  typeof value === "object" && value !== null ? (value as ApiRecord) : null;

const toStringValue = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const extractArray = (
  payload: unknown,
  keys: string[] = ["data", "items", "results", "comments"],
): ApiRecord[] => {
  if (Array.isArray(payload)) return payload as ApiRecord[];

  const root = toRecord(payload);
  if (!root) return [];

  for (const key of keys) {
    if (Array.isArray(root[key])) return root[key] as ApiRecord[];
  }

  return [];
};

const readValue = (sources: Array<ApiRecord | null | undefined>, keys: string[]): unknown => {
  for (const source of sources) {
    if (!source) continue;

    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
  }

  return undefined;
};

const readString = (
  sources: Array<ApiRecord | null | undefined>,
  keys: string[],
  fallback = "",
): string => {
  const value = readValue(sources, keys);
  return value === undefined ? fallback : toStringValue(value, fallback).trim();
};

const normalizeDate = (value: string): string => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return new Date().toISOString().slice(0, 10);

  const directMatch = trimmedValue.match(/^\d{4}-\d{2}-\d{2}/);
  if (directMatch) return directMatch[0];

  const parsedDate = new Date(trimmedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const mapConsultationType = (value: string): CommentConsultationType | null => {
  const normalizedValue = value.trim().toUpperCase();

  if (!normalizedValue) return null;
  if (["FIRST_CONSULTATION", "FIRST", "INITIAL", "INITIAL_CONSULTATION"].includes(normalizedValue)) {
    return "FIRST_CONSULTATION";
  }
  if (["CONSULTATION", "CONSULTA"].includes(normalizedValue)) {
    return "CONSULTATION";
  }
  if (["RETURN", "RETORNO", "FOLLOW_UP"].includes(normalizedValue)) {
    return "RETURN";
  }
  if (["ROUTINE", "ROTINA"].includes(normalizedValue)) {
    return "ROUTINE";
  }
  if (["EXAM", "EXAME"].includes(normalizedValue)) {
    return "EXAM";
  }
  if (["EMERGENCY", "URGENCIA", "URGÊNCIA"].includes(normalizedValue)) {
    return "EMERGENCY";
  }

  return null;
};

const sortComments = (comments: PatientComment[]): PatientComment[] =>
  [...comments].sort((left, right) => {
    const rightKey = right.createdAt ?? right.date;
    const leftKey = left.createdAt ?? left.date;
    return rightKey.localeCompare(leftKey);
  });

const sortCompletedPatients = (
  patients: CompletedConsultationPatient[],
): CompletedConsultationPatient[] =>
  [...patients].sort((left, right) => {
    if (left.lastCompletedAt !== right.lastCompletedAt) {
      return right.lastCompletedAt.localeCompare(left.lastCompletedAt);
    }

    return left.name.localeCompare(right.name);
  });

const normalizeComment = (payload: unknown): PatientComment => {
  const root = toRecord(payload) ?? {};
  const patient = toRecord(root.patient);
  const appointment = toRecord(root.appointment);
  const appointmentPatient = toRecord(appointment?.patient);
  const sources = [root, patient, appointment, appointmentPatient];
  const patientSources = [patient, appointmentPatient, root];
  const typeSources = [root, appointment];

  const createdAt = readString(
    sources,
    ["createdAt", "created_at", "updatedAt", "updated_at", "dateTime", "datetime"],
    "",
  );
  const dateSource = readString(
    sources,
    ["date", "appointmentDate", "consultationDate", "createdAt", "created_at", "updatedAt", "updated_at"],
    "",
  );

  return {
    id: readString(sources, ["id", "_id", "commentId"], crypto.randomUUID()),
    patientId: readString(patientSources, ["patientId", "patient_id", "id", "_id"], "") || null,
    patientName: readString(
      patientSources,
      ["patientName", "name", "fullName", "full_name", "nome"],
      "Paciente",
    ),
    patientAvatarUrl: readString(
      patientSources,
      ["patientAvatarUrl", "avatarUrl", "avatar", "photoUrl", "imageUrl"],
      "",
    ) || null,
    consultationType: mapConsultationType(
      readString(typeSources, ["consultationType", "appointmentType", "type"], ""),
    ),
    date: normalizeDate(dateSource || createdAt),
    createdAt: createdAt || null,
    content: readString(sources, ["content", "comment", "text", "description", "body"], ""),
  };
};

const normalizeCompletedPatient = (payload: unknown): CompletedConsultationPatient | null => {
  const root = toRecord(payload);
  if (!root) return null;

  const patientId = readString([root], ["patientId", "patient_id", "id"], "");
  if (!patientId) return null;

  const name = readString([root], ["name", "patientName", "fullName", "full_name"], "");
  if (!name) return null;

  return {
    patientId,
    name,
    avatarUrl:
      readString([root], ["avatarUrl", "patientAvatarUrl", "avatar", "photoUrl", "imageUrl"], "") ||
      null,
    lastCompletedAt: normalizeDate(readString([root], ["lastCompletedAt", "completedAt", "date"], "")),
  };
};

export const listCompletedConsultationPatients = async (): Promise<CompletedConsultationPatient[]> => {
  const response = await api.get<unknown>("/professionals/me/patients/completed");
  const rows = extractArray(response.data, ["data", "items", "results", "patients"]);

  return sortCompletedPatients(
    rows
      .map(normalizeCompletedPatient)
      .filter((patient): patient is CompletedConsultationPatient => patient !== null),
  );
};

export const commentService = {
  list: async (): Promise<PatientComment[]> => {
    const response = await api.get<unknown>(BASE_PATH);
    return sortComments(extractArray(response.data).map(normalizeComment));
  },

  create: async (payload: CreateCommentPayload): Promise<PatientComment> => {
    const response = await api.post<unknown>(BASE_PATH, payload);
    return normalizeComment(response.data);
  },

  update: async (id: string, payload: UpdateCommentPayload): Promise<PatientComment> => {
    try {
      const response = await api.put<unknown>(`${BASE_PATH}/${id}`, payload);
      return normalizeComment(response.data);
    } catch (error) {
      const statusCode = (error as { response?: { status?: number } })?.response?.status;
      if (statusCode !== 404 && statusCode !== 405) {
        throw error;
      }

      const response = await api.patch<unknown>(`${BASE_PATH}/${id}`, payload);
      return normalizeComment(response.data);
    }
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },
};
