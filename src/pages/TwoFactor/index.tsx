import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../components/AuthLayout";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { useAuth } from "../../contexts";
import { validate2FA } from "../../services/auth.service";
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

const TwoFactorValidation = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const tempToken = sessionStorage.getItem(TWO_FACTOR_TEMP_KEY) ?? "";
    const rememberMe = sessionStorage.getItem(TWO_FACTOR_REMEMBER_KEY) === "true";

    useEffect(() => {
        if (!tempToken) {
            navigate("/login", { replace: true });
        } else {
            inputRef.current?.focus();
        }
    }, [tempToken, navigate]);

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
            sessionStorage.removeItem(TWO_FACTOR_TEMP_KEY);
            sessionStorage.removeItem(TWO_FACTOR_REMEMBER_KEY);
            setUser(result.user as Parameters<typeof setUser>[0]);
            // Navegar direto para o dashboard da role (evita race condition no PrivateRoutes)
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
