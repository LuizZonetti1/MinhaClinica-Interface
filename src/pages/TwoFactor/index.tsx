import { ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../components/AuthLayout";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { useAuth } from "../../contexts";
import { resend2FA, validate2FA } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import {
    CodeHint,
    CodeInput,
    CodeInputWrapper,
    Container,
    ErrorText,
    IconWrapper,
    Subtitle,
    Title,
} from "./styles";

const TWO_FACTOR_TEMP_KEY = "mc_2fa_temp";
const TWO_FACTOR_REMEMBER_KEY = "mc_2fa_remember";
const RESEND_COOLDOWN = 60;

const TwoFactorValidation = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendSuccess, setResendSuccess] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isValidatedRef = useRef(false);

    const tempToken = sessionStorage.getItem(TWO_FACTOR_TEMP_KEY) ?? "";
    const rememberMe = sessionStorage.getItem(TWO_FACTOR_REMEMBER_KEY) === "true";

    useEffect(() => {
        if (!tempToken && !isValidatedRef.current) {
            navigate("/login", { replace: true });
        } else {
            inputRef.current?.focus();
        }
    }, [tempToken, navigate]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startCooldown = useCallback(() => {
        setResendCooldown(RESEND_COOLDOWN);
        timerRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(value);
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError("Digite os 6 dígitos do código.");
            return;
        }
        setLoading(true);
        try {
            const result = await validate2FA({ tempToken, code }, rememberMe);
            isValidatedRef.current = true;
            sessionStorage.removeItem(TWO_FACTOR_TEMP_KEY);
            sessionStorage.removeItem(TWO_FACTOR_REMEMBER_KEY);
            setUser(result.user as Parameters<typeof setUser>[0]);
            const roleRoutes: Record<string, string> = {
                ADMIN: "/admin/dashboard",
                PATIENT: "/paciente/dashboard",
                PROFESSIONAL: "/profissional/dashboard",
                RECEPTIONIST: "/recepcao/dashboard",
            };
            navigate(roleRoutes[result.user.role] ?? "/dashboard", { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err, "Código inválido. Tente novamente."));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setResendSuccess("");
        setError("");
        try {
            await resend2FA(tempToken);
            setResendSuccess("Novo código enviado para o seu email.");
            startCooldown();
        } catch (err) {
            setError(getApiErrorMessage(err, "Não foi possível reenviar o código."));
        }
    };

    const handleBack = () => {
        sessionStorage.removeItem(TWO_FACTOR_TEMP_KEY);
        sessionStorage.removeItem(TWO_FACTOR_REMEMBER_KEY);
        navigate("/login", { replace: true });
    };

    return (
        <AuthLayout>
            <Card>
                <Container>
                    <IconWrapper>
                        <ShieldCheck size={40} />
                    </IconWrapper>
                    <Title>Verificação em duas etapas</Title>
                    <Subtitle>
                        Enviamos um código de 6 dígitos para o seu email. Insira-o abaixo para confirmar seu
                        acesso.
                    </Subtitle>

                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <CodeInputWrapper>
                            <CodeInput
                                ref={inputRef}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="000000"
                                value={code}
                                onChange={handleChange}
                                maxLength={6}
                                autoComplete="one-time-code"
                            />
                        </CodeInputWrapper>

                        {error && <ErrorText>{error}</ErrorText>}
                        {resendSuccess && (
                            <p style={{ fontSize: 13, color: "#16a34a", textAlign: "center", margin: "8px 0 0" }}>
                                {resendSuccess}
                            </p>
                        )}

                        <CodeHint>Verifique sua caixa de entrada. O código expira em 10 minutos.</CodeHint>

                        <Button
                            type="submit"
                            variant="primary"
                            size="medium"
                            fullWidth
                            disabled={loading || code.length !== 6}
                            style={{ marginTop: "16px" }}
                        >
                            {loading ? "Verificando..." : "Confirmar"}
                        </Button>
                    </form>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                        style={{
                            marginTop: "12px",
                            background: "none",
                            border: "none",
                            cursor: resendCooldown > 0 ? "default" : "pointer",
                            fontSize: 13,
                            color: resendCooldown > 0 ? "#9ca3af" : "#3b82f6",
                            textDecoration: resendCooldown > 0 ? "none" : "underline",
                            padding: 0,
                        }}
                    >
                        {resendCooldown > 0
                            ? `Reenviar código (${resendCooldown}s)`
                            : "Não recebeu? Reenviar código"}
                    </button>

                    <Button
                        type="button"
                        variant="outline"
                        size="small"
                        fullWidth
                        onClick={handleBack}
                        style={{ marginTop: "8px" }}
                    >
                        Voltar ao login
                    </Button>
                </Container>
            </Card>
        </AuthLayout>
    );
};

export default TwoFactorValidation;
export { TWO_FACTOR_TEMP_KEY, TWO_FACTOR_REMEMBER_KEY };
