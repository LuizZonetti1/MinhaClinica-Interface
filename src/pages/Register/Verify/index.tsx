import { AlertTriangle, Clock, Loader, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { resendVerification } from "../../../services/patient.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifyInfo, notifySuccess } from "../../../utils/toast";
import {
  Container,
  Description,
  EmailIcon,
  InfoBox,
  InfoText,
  ResendButton,
  ResendText,
  Title,
  WarningBox,
  WarningText,
} from "./styles";

const API_URL = import.meta.env.VITE_API_URL;

type VerifyStatus = "redirecting" | "no-token";

const RegisterVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type") ?? undefined;

  const erro = searchParams.get("erro");
  const linkDesativado = erro === "token_invalido";
  const linkExpirado = erro === "token_expirado";
  const hasLinkError = linkDesativado || linkExpirado;

  const [status] = useState<VerifyStatus>(token ? "redirecting" : "no-token");
  const [countdown, setCountdown] = useState(56);
  const [canResend, setCanResend] = useState(hasLinkError);
  const [resending, setResending] = useState(false);

  const email = localStorage.getItem("@minhaclinica:register_email") ?? "";

  useEffect(() => {
    if (!token) return;
    const typeParam = type ? `type=${type}` : "";
    const query = typeParam ? `?${typeParam}` : "";
    window.location.replace(`${API_URL}/api/auth/verify-email/${token}${query}`);
  }, [token, type]);

  useEffect(() => {
    if (status !== "no-token") return;
    if (canResend) return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, status, canResend]);

  const handleResend = async () => {
    if (!email.trim()) {
      notifyInfo("Nao encontramos seu email. Recomece o cadastro.");
      return;
    }

    setResending(true);
    try {
      await resendVerification({ email, type });
      notifySuccess("Novo link enviado. Verifique sua caixa de entrada.");
      setCanResend(false);
      setCountdown(56);
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Erro ao reenviar. Tente novamente."));
    } finally {
      setResending(false);
    }
  };

  const steps = [
    { label: "Inicio", status: "completed" as const },
    { label: "Verificacao", status: "active" as const },
    { label: "Completar", status: "inactive" as const },
  ];

  const renderContent = () => {
    if (status === "redirecting") {
      return (
        <>
          <EmailIcon>
            <Loader size={40} strokeWidth={1.5} style={{ animation: "spin 1s linear infinite" }} />
          </EmailIcon>
          <Title>Verificando email...</Title>
          <Description>Voce sera redirecionado em instantes.</Description>
        </>
      );
    }

    return (
      <>
        <EmailIcon>
          <Mail size={40} strokeWidth={1.5} />
        </EmailIcon>
        <Title>Verifique seu email</Title>

        {hasLinkError && (
          <WarningBox>
            <AlertTriangle size={16} />
            <WarningText>
              {linkDesativado
                ? "Este link foi desativado porque um novo email foi solicitado. Use o link mais recente ou solicite um novo abaixo."
                : "Este link de verificacao expirou. Solicite um novo email abaixo."}
            </WarningText>
          </WarningBox>
        )}

        {!hasLinkError && (
          <Description>
            Enviamos um link de verificacao para <strong>{email || "seu email"}</strong>. Clique no
            link do email para confirmar seu cadastro.
          </Description>
        )}

        <InfoBox>
          <Clock size={18} />
          <div>
            <InfoText>O link expira em 30 minutos. Verifique tambem a pasta de spam.</InfoText>
          </div>
        </InfoBox>

        {canResend ? (
          <ResendButton onClick={handleResend} disabled={resending}>
            {resending ? "Reenviando..." : "Reenviar email de verificacao"}
          </ResendButton>
        ) : (
          <ResendText>Voce podera reenviar em {countdown}s</ResendText>
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

export default RegisterVerify;
