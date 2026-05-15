import { Check, ExternalLink, File, Paperclip, Pencil, Trash2, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentAttachmentUploadProps } from "../../types/components";
import { fetchAttachmentFile } from "../../services/clinical-documents.service";
import {
  AttachmentActions,
  AttachmentCaption,
  AttachmentCaptionEdit,
  AttachmentCaptionInput,
  AttachmentError,
  AttachmentFileMeta,
  AttachmentFileName,
  AttachmentFilePlaceholder,
  AttachmentIconBtn,
  AttachmentImageFull,
  AttachmentImageMeta,
  AttachmentInfo,
  AttachmentItem,
  AttachmentItemImage,
  AttachmentList,
  AttachmentSection,
  AttachmentSectionTitle,
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
  onUpdateCaption,
}: DocumentAttachmentUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const revokeListRef = useRef<string[]>([]);

  useEffect(() => {
    // Revoke URLs from the previous render
    const prev = revokeListRef.current;
    revokeListRef.current = [];

    const controller = new AbortController();

    const loadBlobs = async () => {
      const next: Record<string, string> = {};
      for (const att of attachments) {
        if (controller.signal.aborted) break;
        if (!att.url || !att.url.startsWith("/appointments/")) continue;
        try {
          const blob = await fetchAttachmentFile(att.url);
          if (controller.signal.aborted) break;
          const objectUrl = URL.createObjectURL(blob);
          revokeListRef.current.push(objectUrl);
          next[att.id] = objectUrl;
        } catch {
          // silent — attachment will show broken state
        }
      }
      if (!controller.signal.aborted) setBlobUrls(next);
    };

    void loadBlobs();

    return () => {
      controller.abort();
      for (const url of prev) URL.revokeObjectURL(url);
    };
  }, [attachments]);

  // caption editing state: { [attachmentId]: draftText | null (not editing) }
  const [editingCaption, setEditingCaption] = useState<Record<string, string | null>>({});
  const [savingCaptionId, setSavingCaptionId] = useState<string | null>(null);

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

  const startEditCaption = (id: string, currentCaption: string | null) => {
    setEditingCaption((prev) => ({ ...prev, [id]: currentCaption ?? "" }));
  };

  const cancelEditCaption = (id: string) => {
    setEditingCaption((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveCaption = async (id: string) => {
    if (!onUpdateCaption) return;
    const draft = editingCaption[id] ?? "";
    setSavingCaptionId(id);
    try {
      await onUpdateCaption(id, draft.trim() || null);
      cancelEditCaption(id);
    } catch {
      setError("Não foi possível salvar a legenda. Tente novamente.");
    } finally {
      setSavingCaptionId(null);
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
          {attachments.map((att) => {
            const isEditingThis = att.id in editingCaption;
            const imgSrc = blobUrls[att.id] ?? (att.url.startsWith("http") ? att.url : `${API_BASE}${att.url}`);

            // ── Imagem: card vertical com preview completo ──
            if (isImage(att.mimeType)) {
              return (
                <AttachmentItemImage key={att.id}>
                  <AttachmentImageFull
                    src={imgSrc}
                    alt={att.caption ?? att.fileName}
                    loading="lazy"
                    onClick={() => window.open(imgSrc, "_blank")}
                  />

                  <AttachmentImageMeta>
                    <AttachmentInfo>
                      <AttachmentFileName title={att.fileName}>{att.fileName}</AttachmentFileName>
                      <AttachmentFileMeta>
                        {formatBytes(att.sizeBytes)} &middot;{" "}
                        {new Date(att.uploadedAt).toLocaleDateString("pt-BR")}
                      </AttachmentFileMeta>

                      {isEditingThis && canEdit ? (
                        <AttachmentCaptionEdit>
                          <AttachmentCaptionInput
                            type="text"
                            value={editingCaption[att.id] ?? ""}
                            placeholder="Ex: antes, depois, detalhe..."
                            maxLength={120}
                            onChange={(e) =>
                              setEditingCaption((prev) => ({ ...prev, [att.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") void saveCaption(att.id);
                              if (e.key === "Escape") cancelEditCaption(att.id);
                            }}
                            autoFocus
                            disabled={savingCaptionId === att.id}
                          />
                          <AttachmentIconBtn
                            type="button"
                            title="Salvar legenda"
                            disabled={savingCaptionId === att.id}
                            onClick={() => void saveCaption(att.id)}
                          >
                            <Check size={13} />
                          </AttachmentIconBtn>
                          <AttachmentIconBtn
                            type="button"
                            title="Cancelar"
                            onClick={() => cancelEditCaption(att.id)}
                          >
                            <X size={13} />
                          </AttachmentIconBtn>
                        </AttachmentCaptionEdit>
                      ) : (
                        att.caption && <AttachmentCaption>{att.caption}</AttachmentCaption>
                      )}
                    </AttachmentInfo>

                    <AttachmentActions>
                      {canEdit && onUpdateCaption && !isEditingThis && (
                        <AttachmentIconBtn
                          type="button"
                          title={att.caption ? "Editar legenda" : "Adicionar legenda"}
                          onClick={() => startEditCaption(att.id, att.caption)}
                        >
                          <Pencil size={13} />
                        </AttachmentIconBtn>
                      )}
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
                  </AttachmentImageMeta>
                </AttachmentItemImage>
              );
            }

            // ── PDF / outros: linha compacta ──
            return (
              <AttachmentItem key={att.id}>
                <AttachmentFilePlaceholder>
                  <File size={18} />
                </AttachmentFilePlaceholder>

                <AttachmentInfo>
                  <AttachmentFileName title={att.fileName}>{att.fileName}</AttachmentFileName>
                  <AttachmentFileMeta>
                    {formatBytes(att.sizeBytes)} &middot;{" "}
                    {new Date(att.uploadedAt).toLocaleDateString("pt-BR")}
                  </AttachmentFileMeta>

                  {isEditingThis && canEdit ? (
                    <AttachmentCaptionEdit>
                      <AttachmentCaptionInput
                        type="text"
                        value={editingCaption[att.id] ?? ""}
                        placeholder="Ex: antes, depois, detalhe..."
                        maxLength={120}
                        onChange={(e) =>
                          setEditingCaption((prev) => ({ ...prev, [att.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void saveCaption(att.id);
                          if (e.key === "Escape") cancelEditCaption(att.id);
                        }}
                        autoFocus
                        disabled={savingCaptionId === att.id}
                      />
                      <AttachmentIconBtn
                        type="button"
                        title="Salvar legenda"
                        disabled={savingCaptionId === att.id}
                        onClick={() => void saveCaption(att.id)}
                      >
                        <Check size={13} />
                      </AttachmentIconBtn>
                      <AttachmentIconBtn
                        type="button"
                        title="Cancelar"
                        onClick={() => cancelEditCaption(att.id)}
                      >
                        <X size={13} />
                      </AttachmentIconBtn>
                    </AttachmentCaptionEdit>
                  ) : (
                    att.caption && <AttachmentCaption>{att.caption}</AttachmentCaption>
                  )}
                </AttachmentInfo>

                <AttachmentActions>
                  <AttachmentIconBtn
                    type="button"
                    title="Abrir em nova aba"
                    onClick={() => window.open(imgSrc, "_blank")}
                  >
                    <ExternalLink size={14} />
                  </AttachmentIconBtn>

                  {canEdit && onUpdateCaption && !isEditingThis && (
                    <AttachmentIconBtn
                      type="button"
                      title={att.caption ? "Editar legenda" : "Adicionar legenda"}
                      onClick={() => startEditCaption(att.id, att.caption)}
                    >
                      <Pencil size={13} />
                    </AttachmentIconBtn>
                  )}

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
            );
          })}
        </AttachmentList>
      )}
    </AttachmentSection>
  );
};

export default DocumentAttachmentUpload;
