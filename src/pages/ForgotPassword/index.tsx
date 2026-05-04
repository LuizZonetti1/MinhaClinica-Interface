import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { AuthLayout } from "../../components/AuthLayout";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Logo } from "../../components/Logo";
import { forgotPassword } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import {
    BackLink,
    Container,
    Description,
    ErrorText,
    Form,
    SuccessBox,
    Title,
} from "./styles";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(getApiErrorMessage(err, "Erro ao enviar email. Tente novamente."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card>
                <Container>
                    <Logo variant="auth" showSubtitle={false} />
                    <Title>Esqueceu a senha?</Title>

                    {!sent ? (
                        <>
                            <Description>
                                Informe o email cadastrado e enviaremos um link para você criar uma
                                nova senha.
                            </Description>

                            <Form onSubmit={handleSubmit}>
                                <Input
                                    type="email"
                                    placeholder="Email cadastrado"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                    }}
                                    icon={<Mail />}
                                    fullWidth
                                    required
                                />

                                {error && <ErrorText>{error}</ErrorText>}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="medium"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading ? "Enviando..." : "Enviar link de recuperação"}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <SuccessBox>
                            <p>
                                ✅ Se o email <strong>{email}</strong> estiver cadastrado, você
                                receberá as instruções em breve.
                            </p>
                            <p>Verifique sua caixa de entrada e a pasta de spam.</p>
                        </SuccessBox>
                    )}

                    <BackLink as={Link} to="/login">
                        <ArrowLeft size={16} />
                        Voltar para o login
                    </BackLink>
                </Container>
            </Card>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
