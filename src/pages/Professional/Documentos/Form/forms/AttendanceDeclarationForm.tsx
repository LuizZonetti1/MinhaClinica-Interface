import type {
  AttendanceDeclarationContent,
  DeclarationType,
  DocumentAppointmentContext,
} from "../../../../../types/clinical-document";
import { formatIsoDateToBr } from "../../../../../utils/dateParsers";
import {
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormRow,
  FormSelect,
  PreviewBlock,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface AttendanceDeclarationFormProps {
  content: AttendanceDeclarationContent;
  onChange: <K extends keyof AttendanceDeclarationContent>(
    field: K,
    value: AttendanceDeclarationContent[K],
  ) => void;
  errors: Partial<Record<keyof AttendanceDeclarationContent, string>>;
  appointmentContext: DocumentAppointmentContext;
  disabled?: boolean;
}

const DECLARATION_TYPE_LABELS: Record<DeclarationType, string> = {
  ATTENDANCE: "Comparecimento",
  INCAPACITY: "Incapacidade temporaria",
  MEDICAL_FOLLOW_UP: "Acompanhamento medico",
};

const AttendanceDeclarationForm = ({
  content,
  onChange,
  errors,
  appointmentContext,
  disabled,
}: AttendanceDeclarationFormProps) => {
  const previewDate = content.attendanceDate
    ? formatIsoDateToBr(content.attendanceDate)
    : "__/__/____";
  const previewArrival = content.arrivalTime || "__:__";
  const previewDeparture = content.departureTime || "__:__";
  const previewPurpose = content.purpose || "[finalidade]";
  const patientName = appointmentContext.patientName || "[nome do paciente]";

  const previewText = `Declaro que ${patientName} compareceu a esta clinica no dia ${previewDate} no horario das ${previewArrival} as ${previewDeparture} para ${previewPurpose}.`;

  return (
    <SectionCard>
      <SectionTitle>Conteudo da Declaracao de Comparecimento</SectionTitle>
      <SectionBanner>
        Comprovante de presenca do paciente na clinica. Os horarios sao preenchidos automaticamente
        pela consulta.
      </SectionBanner>

      <FormFieldGroup $error={Boolean(errors.declarationType)}>
        <FormLabel>Tipo de declaracao *</FormLabel>
        <FormSelect
          value={content.declarationType}
          onChange={(e) => onChange("declarationType", e.target.value as DeclarationType | "")}
          disabled={disabled}
        >
          <option value="">Selecione...</option>
          {(Object.keys(DECLARATION_TYPE_LABELS) as DeclarationType[]).map((key) => (
            <option key={key} value={key}>
              {DECLARATION_TYPE_LABELS[key]}
            </option>
          ))}
        </FormSelect>
      </FormFieldGroup>

      <FormRow>
        <FormFieldGroup $error={Boolean(errors.attendanceDate)}>
          <FormLabel>Data do atendimento *</FormLabel>
          <FormInput
            type="date"
            value={content.attendanceDate}
            onChange={(e) => onChange("attendanceDate", e.target.value)}
            disabled={disabled}
          />
        </FormFieldGroup>

        <FormFieldGroup $error={Boolean(errors.arrivalTime)}>
          <FormLabel>Horario de chegada *</FormLabel>
          <FormInput
            type="time"
            value={content.arrivalTime}
            onChange={(e) => onChange("arrivalTime", e.target.value)}
            disabled={disabled}
          />
        </FormFieldGroup>
      </FormRow>

      <FormRow>
        <FormFieldGroup>
          <FormLabel>Horario de saida</FormLabel>
          <FormInput
            type="time"
            value={content.departureTime}
            onChange={(e) => onChange("departureTime", e.target.value)}
            disabled={disabled}
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <FormLabel>Finalidade</FormLabel>
          <FormInput
            value={content.purpose}
            onChange={(e) => onChange("purpose", e.target.value)}
            placeholder="Ex: Consulta medica, Procedimento odontologico"
            disabled={disabled}
          />
        </FormFieldGroup>
      </FormRow>

      <FormFieldGroup>
        <FormLabel>Previa do documento</FormLabel>
        <PreviewBlock>{previewText}</PreviewBlock>
      </FormFieldGroup>
    </SectionCard>
  );
};

export default AttendanceDeclarationForm;
