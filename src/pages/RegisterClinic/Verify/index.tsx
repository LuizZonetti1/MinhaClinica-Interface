import { Clock, Loader, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { clinicRegisterResend } from "../../../services/clinic.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import {
  Container,
  Description,
  EmailIcon,
  InfoBox,
  InfoText,
  ResendButton,
  ResendText,
  Title,
} from "./styles";

// O backend faz um redirect 302 para o frontend após verificar o token.
// Por isso, redirecionamos o BROWSER direto para a URL do backend,
// deixando o redirect nativo acontecer sem passar pelo Axios (que causaria CORS).
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type VerifyStatus = "redirecting" | "no-token";

const RegisterClinicVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status] = useState<VerifyStatus>(token ? "redirecting" : "no-token");
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(56);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const email = localStorage.getItem("@minhaclinica:clinic_register_email") ?? "";

  // Redireciona o browser para o backend, que verifica o token e faz 302
  // para /clinica/completar-cadastro?tempToken=JWT com role=ADMIN no payload.
  // ClinicCompleteRedirect lê o `role` do JWT e decide o destino final.
  useEffect(() => {
    if (!token) return;
    window.location.replace(`${API_URL}/api/clinics/verify-email/${token}`);
  }, [token]);

  // ─── Contador de reenvio (apenas quando aguardando e-mail) ───────────────
  useEffect(() => {
    if (status !== "no-token") return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, status]);

  const handleResend = async () => {
    if (!email.trim()) return;
    setResending(true);
    setError("");
    setResendSuccess(false);
    try {
      await clinicRegisterResend({ email });
      setResendSuccess(true);
      setCanResend(false);
      setCountdown(56);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao reenviar. Tente novamente."));
    } finally {
      setResending(false);
    }
  };

  const steps = [
    { label: "Início", status: "completed" as const },
    { label: "Verificação", status: "active" as const },
    { label: "Completar", status: "inactive" as const },
  ];

  const renderContent = () => {
    // ─── Redirecionando para o backend verificar ──────────────
    if (status === "redirecting") {
      return (
        <>
          <EmailIcon>
            <Loader size={40} strokeWidth={1.5} style={{ animation: "spin 1s linear infinite" }} />
          </EmailIcon>
          <Title>Verificando e-mail...</Title>
          <Description>Você será redirecionado em instantes.</Description>
        </>
      );
    }

    // ─── Aguardando clique no link do e-mail ──────────────────
    return (
      <>
        <EmailIcon>
          <Mail size={40} strokeWidth={1.5} />
        </EmailIcon>
        <Title>Verifique seu e-mail</Title>
        <Description>
          Enviamos um link de verificação para <strong>{email || "o e-mail do responsável"}</strong>
          . Clique no link para confirmar o cadastro da clínica.
        </Description>

        <InfoBox>
          <Clock size={18} />
          <div>
            <InfoText>O link expira em 30 minutos. Verifique também a pasta de spam.</InfoText>
          </div>
        </InfoBox>

        {resendSuccess && (
          <p style={{ color: "#22c55e", fontSize: 13, margin: 0 }}>
            Novo link enviado! Verifique sua caixa de entrada.
          </p>
        )}

        {error && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>}

        {canResend ? (
          <ResendButton onClick={handleResend} disabled={resending}>
            {resending ? "Reenviando..." : "Reenviar e-mail de verificação"}
          </ResendButton>
        ) : (
          <ResendText>Você poderá reenviar em {countdown}s</ResendText>
        )}
      </>
    );
  };

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Stepper steps={steps} />
          {renderContent()}
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterClinicVerify;
