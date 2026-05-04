import { ArrowLeft, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "../../components/AuthLayout";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Logo } from "../../components/Logo";
import { resetPassword } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { notifySuccess } from "../../utils/toast";
import {
    BackLink,
    Container,
    Description,
    ErrorText,
    Form,
    Title,
} from "../ForgotPassword/styles";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Token ausente na URL → exibe erro imediato
    if (!token) {
        return (
            <AuthLayout>
                <Card>
                    <Container>
                        <Logo variant="auth" showSubtitle={false} />
                        <Title>Link inválido</Title>
                        <Description>
                            O link de redefinição de senha é inválido ou expirou. Solicite um novo
                            link.
                        </Description>
                        <BackLink as={Link} to="/forgot-password">
                            <ArrowLeft size={16} />
                            Solicitar novo link
                        </BackLink>
                    </Container>
                </Card>
            </AuthLayout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password, confirmPassword);
            notifySuccess("Senha redefinida com sucesso! Faça login com sua nova senha.");
            navigate("/login", { replace: true });
        } catch (err) {
            setError(
                getApiErrorMessage(err, "Token inválido ou expirado. Solicite um novo link."),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card>
                <Container>
                    <Logo variant="auth" showSubtitle={false} />
                    <Title>Criar nova senha</Title>
                    <Description>
                        Escolha uma senha segura com pelo menos 8 caracteres.
                    </Description>

                    <Form onSubmit={handleSubmit}>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nova senha"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError("");
                            }}
                            icon={<Lock />}
                            iconPosition="left"
                            rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            onRightIconClick={() => setShowPassword((v) => !v)}
                            fullWidth
                            required
                            minLength={8}
                        />

                        <Input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirmar nova senha"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error) setError("");
                            }}
                            icon={<KeyRound />}
                            iconPosition="left"
                            rightIcon={showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            onRightIconClick={() => setShowConfirm((v) => !v)}
                            fullWidth
                            required
                            minLength={8}
                        />

                        {error && <ErrorText>{error}</ErrorText>}

                        <Button
                            type="submit"
                            variant="primary"
                            size="medium"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Salvar nova senha"}
                        </Button>
                    </Form>

                    <BackLink as={Link} to="/login">
                        <ArrowLeft size={16} />
                        Voltar para o login
                    </BackLink>
                </Container>
            </Card>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
