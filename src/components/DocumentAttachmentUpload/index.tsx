import { ExternalLink, File, Paperclip, Trash2, UploadCloud } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { DocumentAttachmentUploadProps } from "../../types/components";
import {
  AttachmentActions,
  AttachmentError,
  AttachmentFileMeta,
  AttachmentFileName,
  AttachmentFilePlaceholder,
  AttachmentIconBtn,
  AttachmentInfo,
  AttachmentItem,
  AttachmentList,
  AttachmentSection,
  AttachmentSectionTitle,
  AttachmentThumb,
  UploadZone,
  UploadZoneHint,
  UploadZoneInput,
  UploadZoneText,
} from "./styles";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

const ACCEPTED = "image/jpeg,image/png,image/gif,image/webp,application/pdf";
const MAX_SIZE_MB = 5;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

// ─── Component ────────────────────────────────────────────────────────────────

const DocumentAttachmentUpload = ({
  attachments,
  canEdit = false,
  onUpload,
  onDelete,
}: DocumentAttachmentUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${MAX_SIZE_MB} MB.`);
        return;
      }
      setUploading(true);
      try {
        await onUpload(file);
      } catch {
        setError("Não foi possível fazer o upload. Tente novamente.");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onUpload],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch {
      setError("Não foi possível remover o anexo. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AttachmentSection>
      <AttachmentSectionTitle>
        <Paperclip size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
        Anexos ({attachments.length})
      </AttachmentSectionTitle>

      {/* Upload zone — apenas para quem pode editar */}
      {canEdit && (
        <UploadZone
          $dragOver={dragOver}
          $disabled={uploading}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <UploadZoneInput
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            onChange={handleInputChange}
            disabled={uploading}
          />
          <UploadCloud size={22} />
          <UploadZoneText>
            {uploading ? "Enviando..." : "Clique ou arraste um arquivo aqui"}
          </UploadZoneText>
          <UploadZoneHint>JPEG, PNG, GIF, WEBP ou PDF — máximo {MAX_SIZE_MB} MB</UploadZoneHint>
        </UploadZone>
      )}

      {error && <AttachmentError>{error}</AttachmentError>}

      {/* Lista de anexos existentes */}
      {attachments.length > 0 && (
        <AttachmentList>
          {attachments.map((att) => (
            <AttachmentItem key={att.id}>
              {isImage(att.mimeType) ? (
                <AttachmentThumb
                  src={`${API_BASE}/uploads/documents/${att.url.split("/").pop()}`}
                  alt={att.fileName}
                  loading="lazy"
                />
              ) : (
                <AttachmentFilePlaceholder>
                  <File size={18} />
                </AttachmentFilePlaceholder>
              )}

              <AttachmentInfo>
                <AttachmentFileName title={att.fileName}>{att.fileName}</AttachmentFileName>
                <AttachmentFileMeta>
                  {formatBytes(att.sizeBytes)} &middot;{" "}
                  {new Date(att.uploadedAt).toLocaleDateString("pt-BR")}
                </AttachmentFileMeta>
              </AttachmentInfo>

              <AttachmentActions>
                <AttachmentIconBtn
                  type="button"
                  title="Abrir em nova aba"
                  onClick={() =>
                    window.open(`${API_BASE}/uploads/documents/${att.url.split("/").pop()}`, "_blank")
                  }
                >
                  <ExternalLink size={14} />
                </AttachmentIconBtn>

                {canEdit && (
                  <AttachmentIconBtn
                    type="button"
                    data-danger=""
                    title="Remover anexo"
                    disabled={deletingId === att.id}
                    onClick={() => void handleDelete(att.id)}
                  >
                    <Trash2 size={14} />
                  </AttachmentIconBtn>
                )}
              </AttachmentActions>
            </AttachmentItem>
          ))}
        </AttachmentList>
      )}
    </AttachmentSection>
  );
};

export default DocumentAttachmentUpload;
