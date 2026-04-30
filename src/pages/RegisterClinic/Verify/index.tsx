import { Clock, Loader, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { clinicRegisterResend } from "../../../services/clinic.service";
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
} from "./styles";

const API_URL = import.meta.env.VITE_API_URL;

type VerifyStatus = "redirecting" | "no-token";

const RegisterClinicVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status] = useState<VerifyStatus>(token ? "redirecting" : "no-token");
  const [countdown, setCountdown] = useState(56);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const email = localStorage.getItem("@minhaclinica:clinic_register_email") ?? "";

  useEffect(() => {
    if (!token) return;
    window.location.replace(`${API_URL}/api/clinics/verify-email/${token}`);
  }, [token]);

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
    if (!email.trim()) {
      notifyInfo("Nao encontramos o email do responsavel. Recomece o cadastro.");
      return;
    }

    setResending(true);
    try {
      await clinicRegisterResend({ email });
      notifySuccess("Novo link enviado. Verifique a caixa de entrada.");
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
          <Title>Verificando e-mail...</Title>
          <Description>Voce sera redirecionado em instantes.</Description>
        </>
      );
    }

    return (
      <>
        <EmailIcon>
          <Mail size={40} strokeWidth={1.5} />
        </EmailIcon>
        <Title>Verifique seu e-mail</Title>
        <Description>
          Enviamos um link de verificacao para <strong>{email || "o email do responsavel"}</strong>
          . Clique no link para confirmar o cadastro da clinica.
        </Description>

        <InfoBox>
          <Clock size={18} />
          <div>
            <InfoText>O link expira em 30 minutos. Verifique tambem a pasta de spam.</InfoText>
          </div>
        </InfoBox>

        {canResend ? (
          <ResendButton onClick={handleResend} disabled={resending}>
            {resending ? "Reenviando..." : "Reenviar e-mail de verificacao"}
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

export default RegisterClinicVerify;
