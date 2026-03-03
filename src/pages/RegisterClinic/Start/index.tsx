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
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { ClinicAddressTab } from "./ClinicAddressTab";
import { ClinicInfoTab } from "./ClinicInfoTab";
import { OwnerTab } from "./OwnerTab";
import { Container, Footer, FooterLink, FooterText, Title } from "./styles";

type TabId = "clinic" | "address" | "owner";

const TAB_ORDER: TabId[] = ["clinic", "address", "owner"];

const RegisterClinicStart = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("clinic");
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Dados da Clínica
    legalName: "",
    tradeName: "",
    cnpj: "",
    phone: "",
    email: "",
    website: "",

    // Endereço
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",

    // Responsável
    ownerName: "",
    ownerEmail: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Validações por aba ───────────────────────────────────────────────────
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
    setError("");
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
        localStorage.setItem("@minhaclinica:token", response.tempToken);
        navigate("/clinica/registro/completo");
      } else {
        navigate("/clinica/registro/verificar");
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao iniciar cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Início", status: "active" as const },
    { label: "Verificação", status: "inactive" as const },
    { label: "Completar", status: "inactive" as const },
  ];

  const tabs = [
    {
      id: "clinic",
      label: "Clínica",
      icon: <Building2 />,
      disabled: false,
      completed: completedTabs.has("clinic"),
    },
    {
      id: "address",
      label: "Endereço",
      icon: <MapPin />,
      disabled: !completedTabs.has("clinic"),
      completed: completedTabs.has("address"),
    },
    {
      id: "owner",
      label: "Responsável",
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

          <Title>Cadastrar Clínica</Title>

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

            {isLastTab ? (
              <>
                {error && <p style={{ color: "red", fontSize: 13, margin: "0 0 8px" }}>{error}</p>}
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
              </>
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
              Já possui uma clínica cadastrada?
              <FooterLink to="/login">Entrar</FooterLink>
            </FooterText>
          </Footer>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterClinicStart;
