import { Check, Heart, MapPin, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { Tabs } from "../../../components/Tabs";
import { AddressTab } from "./AddressTab";
import { MedicalInfoTab } from "./MedicalInfoTab";
import { PersonalDataTab } from "./PersonalDataTab";
import { Container, Title } from "./styles";

const RegisterComplete = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Complete Registration:", formData);
    // TODO: Submit registration data
    navigate("/dashboard");
  };

  const steps = [
    { label: "Início", status: "completed" as const },
    { label: "Verificação", status: "completed" as const },
    { label: "Completar", status: "active" as const },
  ];

  const tabs = [
    { id: "personal", label: "Dados Pessoais", icon: <User /> },
    { id: "address", label: "Endereço", icon: <MapPin /> },
    { id: "medical", label: "Info Médicas", icon: <Heart /> },
  ];

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Completar Cadastro</Title>

          <Stepper steps={steps} />

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
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

            <Button
              type="submit"
              variant="primary"
              size="medium"
              fullWidth
              icon={<Check />}
              iconPosition="left"
            >
              Concluir Cadastro
            </Button>
          </form>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterComplete;
