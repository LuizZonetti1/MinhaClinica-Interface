import { ArrowRight, Check, Heart, MapPin, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { Tabs } from "../../../components/Tabs";
import { registerComplete } from "../../../services/auth.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { AddressTab } from "./AddressTab";
import { MedicalInfoTab } from "./MedicalInfoTab";
import { PersonalDataTab } from "./PersonalDataTab";
import { Container, Title } from "./styles";

type TabId = "personal" | "address" | "medical";

const TAB_ORDER: TabId[] = ["personal", "address", "medical"];

const RegisterComplete = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Personal Data
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",

    // Address
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",

    // Medical Info
    bloodType: "",
    allergies: "",
    medications: "",
    conditions: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Validações por aba ---
  const isPersonalValid = () =>
    Boolean(
      formData.cpf.trim() &&
        formData.phone.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim() &&
        formData.birthDate.trim() &&
        formData.gender.trim(),
    );

  const isAddressValid = () =>
    Boolean(
      formData.cep.trim() &&
        formData.street.trim() &&
        formData.number.trim() &&
        formData.neighborhood.trim() &&
        formData.city.trim() &&
        formData.state.trim(),
    );

  const isMedicalValid = () =>
    Boolean(
      formData.bloodType.trim() &&
        formData.allergies.trim() &&
        formData.medications.trim() &&
        formData.conditions.trim() &&
        formData.emergencyName.trim() &&
        formData.emergencyPhone.trim(),
    );

  const isCurrentTabValid = () => {
    if (activeTab === "personal") return isPersonalValid();
    if (activeTab === "address") return isAddressValid();
    if (activeTab === "medical") return isMedicalValid();
    return false;
  };

  const isLastTab = activeTab === "medical";

  const handleContinue = () => {
    if (!isCurrentTabValid()) return;

    const currentIndex = TAB_ORDER.indexOf(activeTab);
    setCompletedTabs((prev) => new Set(prev).add(activeTab));

    if (!isLastTab) {
      setActiveTab(TAB_ORDER[currentIndex + 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentTabValid()) return;
    setError("");
    setLoading(true);
    try {
      await registerComplete({
        cpf: formData.cpf,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.birthDate,
        gender: formData.gender as "masculino" | "feminino" | "outro",
        address: {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
        medicalInfo: {
          bloodType: formData.bloodType,
          allergies: formData.allergies,
          medications: formData.medications,
          conditions: formData.conditions,
          emergencyName: formData.emergencyName,
          emergencyPhone: formData.emergencyPhone,
        },
      });
      localStorage.removeItem("@minhaclinica:register_email");
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao concluir cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Início", status: "completed" as const },
    { label: "Verificação", status: "completed" as const },
    { label: "Completar", status: "active" as const },
  ];

  const tabs = [
    {
      id: "personal",
      label: "Dados Pessoais",
      icon: <User />,
      disabled: false,
      completed: completedTabs.has("personal"),
    },
    {
      id: "address",
      label: "Endereço",
      icon: <MapPin />,
      disabled: !completedTabs.has("personal"),
      completed: completedTabs.has("address"),
    },
    {
      id: "medical",
      label: "Info Médicas",
      icon: <Heart />,
      disabled: !completedTabs.has("address"),
      completed: completedTabs.has("medical"),
    },
  ];

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Completar Cadastro</Title>

          <Stepper steps={steps} />

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as TabId)}
            >
              {activeTab === "personal" && (
                <PersonalDataTab formData={formData} onChange={handleChange} />
              )}
              {activeTab === "address" && (
                <AddressTab formData={formData} onChange={handleChange} />
              )}
              {activeTab === "medical" && (
                <MedicalInfoTab formData={formData} onChange={handleChange} />
              )}
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
                  disabled={!isCurrentTabValid() || loading}
                >
                  {loading ? "Enviando..." : "Concluir Cadastro"}
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
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterComplete;
