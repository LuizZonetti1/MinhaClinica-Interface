import { CheckCircle, KeyRound, ShieldCheck, ShieldOff, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { disable2FA, enable2FA, get2FAStatus } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../utils/toast";
import { Card, CardTitle, StatusBadge, StatusRow, StepHint, StepTitle } from "./styles";

interface TwoFactorCardProps {
    className?: string;
}

export const TwoFactorCard = ({ className }: TwoFactorCardProps) => {
    const [enabled, setEnabled] = useState<boolean | null>(null);
    const [trustedCount, setTrustedCount] = useState(0);
    const [confirmDisable, setConfirmDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(true);

    useEffect(() => {
        let cancelled = false;
        get2FAStatus()
            .then((r) => {
                if (!cancelled) {
                    setEnabled(r.enabled);
                    setTrustedCount(r.trustedDeviceCount);
                }
            })
            .catch(() => {
                if (!cancelled) setEnabled(false);
            })
            .finally(() => {
                if (!cancelled) setLoadingStatus(false);
            });
        return () => { cancelled = true; };
    }, []);

    const handleEnable = async () => {
        setLoading(true);
        try {
            await enable2FA();
            setEnabled(true);
            notifySuccess("Autenticação em dois fatores ativada! Você precisará verificar seu email no próximo login de um dispositivo novo.");
        } catch (err) {
            notifyError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        setLoading(true);
        try {
            await disable2FA();
            setEnabled(false);
            setTrustedCount(0);
            setConfirmDisable(false);
            notifySuccess("Autenticação em dois fatores desativada. Todos os dispositivos confiáveis foram removidos.");
        } catch (err) {
            notifyError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (loadingStatus) return null;

    return (
        <Card className={className}>
            <CardTitle>
                <KeyRound size={18} />
                Autenticação em Dois Fatores
            </CardTitle>

            <StatusRow>
                {enabled ? (
                    <StatusBadge $active>
                        <CheckCircle size={14} />
                        Ativa
                    </StatusBadge>
                ) : (
                    <StatusBadge>
                        <XCircle size={14} />
                        Inativa
                    </StatusBadge>
                )}
                {enabled && trustedCount > 0 && (
                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                        {trustedCount} dispositivo{trustedCount !== 1 ? "s" : ""} confiável{trustedCount !== 1 ? "is" : ""}
                    </span>
                )}
            </StatusRow>

            {!enabled ? (
                <>
                    <StepHint>
                        Adicione uma camada extra de segurança: receba um código por email sempre que fizer login em um dispositivo novo.
                    </StepHint>
                    <Button
                        type="button"
                        variant="primary"
                        size="small"
                        onClick={handleEnable}
                        disabled={loading}
                    >
                        <ShieldCheck size={14} style={{ marginRight: 4 }} />
                        Ativar 2FA
                    </Button>
                </>
            ) : confirmDisable ? (
                <>
                    <StepTitle>Confirmar desativação</StepTitle>
                    <StepHint>
                        Todos os dispositivos confiáveis serão removidos e você precisará verificar seu email no próximo login.
                    </StepHint>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <Button
                            type="button"
                            variant="outline"
                            size="small"
                            onClick={handleDisable}
                            disabled={loading}
                            style={{ color: "#ef4444", borderColor: "#ef4444" }}
                        >
                            <ShieldOff size={14} style={{ marginRight: 4 }} />
                            Confirmar desativação
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="small"
                            onClick={() => setConfirmDisable(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => setConfirmDisable(true)}
                    style={{ marginTop: 8, color: "#ef4444", borderColor: "#ef4444" }}
                >
                    <ShieldOff size={14} style={{ marginRight: 4 }} />
                    Desativar 2FA
                </Button>
            )}
        </Card>
    );
};