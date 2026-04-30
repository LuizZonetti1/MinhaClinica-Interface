import { useState } from "react";
import { Button } from "../../../../components/Button";
import { Modal } from "../../../../components/Modal";
import { AutosaveIndicator, FooterActions, FormFooterWrapper } from "./styles";

interface DocumentFormFooterProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onFinalize: () => void;
  saving: boolean;
  finalizing: boolean;
  canFinalize: boolean;
  lastSavedAt: string | null;
  autosaveError: boolean;
  disabled?: boolean;
  finalizeLabel?: string;
}

const DocumentFormFooter = ({
  onCancel,
  onSaveDraft,
  onFinalize,
  saving,
  finalizing,
  canFinalize,
  lastSavedAt,
  autosaveError,
  disabled,
  finalizeLabel = "Finalizar documento",
}: DocumentFormFooterProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFinalizeClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmFinalize = () => {
    setShowConfirm(false);
    onFinalize();
  };

  return (
    <>
      <FormFooterWrapper>
        {lastSavedAt && !autosaveError && (
          <AutosaveIndicator>Salvo automaticamente as {lastSavedAt}</AutosaveIndicator>
        )}
        {autosaveError && (
          <AutosaveIndicator style={{ color: "#DC2626" }}>
            Falha ao salvar automaticamente
          </AutosaveIndicator>
        )}

        <FooterActions>
          <Button variant="outline" size="small" onClick={onCancel} disabled={saving || finalizing}>
            Cancelar
          </Button>

          <Button
            variant="outline"
            size="small"
            onClick={onSaveDraft}
            disabled={saving || finalizing || disabled}
          >
            {saving ? "Salvando..." : "Salvar rascunho"}
          </Button>

          <Button
            variant="primary"
            size="small"
            onClick={handleFinalizeClick}
            disabled={!canFinalize || finalizing || saving || disabled}
          >
            {finalizing ? "Finalizando..." : finalizeLabel}
          </Button>
        </FooterActions>
      </FormFooterWrapper>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={finalizeLabel}
        actions={
          <>
            <Button variant="outline" size="small" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="small" onClick={handleConfirmFinalize}>
              Confirmar
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, fontFamily: "Roboto, sans-serif", fontSize: 14, lineHeight: 1.5 }}>
          Ao finalizar, o documento ficara pronto para envio. Voce ainda podera edita-lo ate
          concluir a consulta.
        </p>
      </Modal>
    </>
  );
};

export default DocumentFormFooter;
