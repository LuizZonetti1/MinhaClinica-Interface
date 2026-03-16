import { ArrowRight, Building2, Check, MapPin, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { Tabs } from "../../../components/Tabs";
import { clinicRegisterStart } from "../../../services/clinic.service";
import { storeAuthToken } from "../../../utils/authStorage";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { ClinicAddressTab } from "./ClinicAddressTab";
import { ClinicInfoTab } from "./ClinicInfoTab";
import { OwnerTab } from "./OwnerTab";
import { Container, Footer, FooterLink, FooterText, RequirementsText, Title } from "./styles";

type TabId = "clinic" | "address" | "owner";

const TAB_ORDER: TabId[] = ["clinic", "address", "owner"];

const TAB_REQUIREMENTS: Record<TabId, string> = {
  clinic:
    "Aba Clinica: informe nome legal, nome fantasia, CNPJ, telefone e email da clinica.",
  address:
    "Aba Endereco: preencha CEP, rua, numero, bairro, cidade e estado para prosseguir.",
  owner:
    "Aba Responsavel: informe nome e email validos do responsavel para envio da verificacao.",
};

const RegisterClinicStart = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("clinic");
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(new Set());
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    legalName: "",
    tradeName: "",
    cnpj: "",
    phone: "",
    email: "",
    website: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    ownerName: "",
    ownerEmail: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isClinicTabValid = () =>
    Boolean(
      formData.legalName.trim() &&
        formData.tradeName.trim() &&
        formData.cnpj.trim() &&
        formData.phone.trim() &&
        formData.email.trim(),
    );

  const isAddressValid = () =>
    Boolean(
      formData.zipCode.trim() &&
        formData.street.trim() &&
        formData.number.trim() &&
        formData.neighborhood.trim() &&
        formData.city.trim() &&
        formData.state.trim(),
    );

  const isOwnerValid = () => Boolean(formData.ownerName.trim() && formData.ownerEmail.trim());

  const isCurrentTabValid = () => {
    if (activeTab === "clinic") return isClinicTabValid();
    if (activeTab === "address") return isAddressValid();
    if (activeTab === "owner") return isOwnerValid();
    return false;
  };

  const isLastTab = activeTab === "owner";

  const isAllTabsValid = () => isClinicTabValid() && isAddressValid() && isOwnerValid();

  const handleContinue = () => {
    if (!isCurrentTabValid()) return;
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    setCompletedTabs((prev) => new Set(prev).add(activeTab));
    setActiveTab(TAB_ORDER[currentIndex + 1]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllTabsValid()) return;
    setLoading(true);
    try {
      const response = await clinicRegisterStart({
        legalName: formData.legalName,
        tradeName: formData.tradeName,
        cnpj: formData.cnpj.replace(/\D/g, ""),
        phone: formData.phone.replace(/\D/g, ""),
        clinicEmail: formData.email,
        website: formData.website || undefined,
        zipCode: formData.zipCode.replace(/\D/g, ""),
        street: formData.street,
        number: formData.number,
        complement: formData.complement || undefined,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
      });

      localStorage.setItem("@minhaclinica:clinic_register_email", formData.ownerEmail);

      if (response.redirectToComplete && response.tempToken) {
        storeAuthToken(response.tempToken);
        notifySuccess("Email do responsavel ja verificado. Complete o cadastro.");
        navigate("/clinica/registro/completo");
      } else {
        notifySuccess("Link de verificacao enviado para o responsavel.");
        navigate("/clinica/registro/verificar");
      }
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Erro ao iniciar cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Inicio", status: "active" as const },
    { label: "Verificacao", status: "inactive" as const },
    { label: "Completar", status: "inactive" as const },
  ];

  const tabs = [
    {
      id: "clinic",
      label: "Clinica",
      icon: <Building2 />,
      disabled: false,
      completed: completedTabs.has("clinic"),
    },
    {
      id: "address",
      label: "Endereco",
      icon: <MapPin />,
      disabled: !completedTabs.has("clinic"),
      completed: completedTabs.has("address"),
    },
    {
      id: "owner",
      label: "Responsavel",
      icon: <User />,
      disabled: !completedTabs.has("address"),
      completed: completedTabs.has("owner"),
    },
  ];

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />

          <Stepper steps={steps} />

          <Title>Cadastrar Clinica</Title>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as TabId)}
            >
              {activeTab === "clinic" && (
                <ClinicInfoTab formData={formData} onChange={handleChange} />
              )}
              {activeTab === "address" && (
                <ClinicAddressTab formData={formData} onChange={handleChange} />
              )}
              {activeTab === "owner" && <OwnerTab formData={formData} onChange={handleChange} />}
            </Tabs>

            <RequirementsText>{TAB_REQUIREMENTS[activeTab]}</RequirementsText>

            {isLastTab ? (
              <Button
                type="submit"
                variant="primary"
                size="medium"
                fullWidth
                icon={<Check />}
                iconPosition="left"
                disabled={!isAllTabsValid() || loading}
              >
                {loading ? "Enviando..." : "Enviar e verificar e-mail"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="medium"
                fullWidth
                icon={<ArrowRight />}
                iconPosition="right"
                onClick={handleContinue}
                disabled={!isCurrentTabValid()}
              >
                Continuar
              </Button>
            )}
          </form>

          <Footer>
            <FooterText>
              Ja possui uma clinica cadastrada?
              <FooterLink to="/login">Entrar</FooterLink>
            </FooterText>
          </Footer>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterClinicStart;
