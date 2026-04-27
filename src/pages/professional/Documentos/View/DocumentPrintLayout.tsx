import { GitCompareArrows } from "lucide-react";
import type { ClinicalDocumentDetail } from "../../../../types/clinical-document";
import { formatIsoDateTimeToBr, formatIsoDateToBr } from "../../../../utils/dateParsers";
import {
  AddendumBanner,
  ClinicDetail,
  ClinicHeaderInfo,
  ClinicLogoMark,
  ClinicName,
  DocBody,
  DocFooter,
  DocFooterCouncil,
  DocFooterIssuedAt,
  DocFooterProfessional,
  DocHeaderSection,
  DocNumberLabel,
  DocTypeLabel as DocTypeLabelStyled,
  DocTypeTag,
  IdentificationBlock,
  IdentificationCell,
  IdentificationLabel,
  IdentificationValue,
  PrintWrapper,
  SignatureBlock,
  SignatureLabel,
  SignatureLine,
} from "./styles";

// ─── Label map ────────────────────────────────────────────────────────────────

const DOC_TYPE_LABEL: Record<string, string> = {
  CLINICAL_REPORT: "Relatório Clínico",
  CERTIFICATE: "Atestado",
  ATTENDANCE_DECLARATION: "Declaração de Comparecimento",
  PRESCRIPTION: "Receita",
  CONTROLLED_PRESCRIPTION: "Receita Controlada",
  EXAM_REQUEST: "Solicitação de Exame",
  REFERRAL: "Encaminhamento",
  MEDICAL_REPORT: "Laudo",
  CONSENT_FORM: "Termo de Consentimento",
  TREATMENT_PLAN: "Plano Terapêutico",
  BUDGET: "Orçamento",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface DocumentPrintLayoutProps {
  doc: ClinicalDocumentDetail;
  children: React.ReactNode;
  /** Mostra linha de assinatura do paciente no rodape */
  patientSignature?: boolean;
}

const DocumentPrintLayout = ({
  doc,
  children,
  patientSignature = false,
}: DocumentPrintLayoutProps) => {
  const { clinicInfo, appointmentContext } = doc;
  const timezone = clinicInfo?.timezone;

  // Clinic header
  const clinicName = clinicInfo?.tradeName ?? "Minha Clinica";
  const clinicInitial = clinicName.trim().charAt(0).toUpperCase();

  const addressLine = clinicInfo?.address
    ? [
        clinicInfo.address.street,
        clinicInfo.address.number,
        clinicInfo.address.neighborhood,
        clinicInfo.address.city,
        clinicInfo.address.state,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  const clinicDetails: string[] = [];
  if (clinicInfo?.cnpj) clinicDetails.push(`CNPJ ${clinicInfo.cnpj}`);
  if (clinicInfo?.phone) clinicDetails.push(clinicInfo.phone);
  if (clinicInfo?.email) clinicDetails.push(clinicInfo.email);
  if (addressLine) clinicDetails.push(addressLine);

  const isAddendum = doc.status === "ADDENDUM";
  const typeLabel = DOC_TYPE_LABEL[doc.type] ?? doc.type;

  const appointmentDateFormatted = doc.appointmentContext.appointmentDate
    ? formatIsoDateToBr(doc.appointmentContext.appointmentDate)
    : "--/--/----";

  return (
    <PrintWrapper>
      {/* Clinic header */}
      <DocHeaderSection>
        <ClinicLogoMark>{clinicInitial}</ClinicLogoMark>
        <ClinicHeaderInfo>
          <ClinicName>{clinicName}</ClinicName>
          {clinicDetails.slice(0, 2).map((d) => (
            <ClinicDetail key={d}>{d}</ClinicDetail>
          ))}
          {clinicDetails.slice(2).map((d) => (
            <ClinicDetail key={d}>{d}</ClinicDetail>
          ))}
        </ClinicHeaderInfo>
        <DocTypeTag>
          <DocTypeLabelStyled>{typeLabel}</DocTypeLabelStyled>
          {doc.documentNumber && <DocNumberLabel>N.{doc.documentNumber}</DocNumberLabel>}
          {doc.issuedAt && (
            <DocNumberLabel>
              Emitido em {formatIsoDateTimeToBr(doc.issuedAt, timezone)}
            </DocNumberLabel>
          )}
        </DocTypeTag>
      </DocHeaderSection>

      {/* Addendum banner */}
      {isAddendum && (
        <AddendumBanner>
          <GitCompareArrows size={14} />
          <span>
            <strong>Adendo</strong>
            {doc.addendumAt ? ` — ${formatIsoDateTimeToBr(doc.addendumAt, timezone)}` : ""}
            {doc.addendumAuthor ? ` — ${doc.addendumAuthor}` : ""}
            {doc.originalDocumentId ? (
              <>
                {" "}
                &bull; Documento original:{" "}
                <span style={{ fontWeight: 600 }}>{doc.originalDocumentId}</span>
              </>
            ) : null}
          </span>
        </AddendumBanner>
      )}

      {/* Identification block */}
      <IdentificationBlock>
        <IdentificationCell>
          <IdentificationLabel>Paciente</IdentificationLabel>
          <IdentificationValue>{appointmentContext.patientName}</IdentificationValue>
        </IdentificationCell>
        <IdentificationCell>
          <IdentificationLabel>Data da Consulta</IdentificationLabel>
          <IdentificationValue>
            {appointmentDateFormatted} às {appointmentContext.startTime}
          </IdentificationValue>
        </IdentificationCell>
        <IdentificationCell>
          <IdentificationLabel>Profissional</IdentificationLabel>
          <IdentificationValue>
            {appointmentContext.professionalName}
            {appointmentContext.councilRegistration
              ? ` — ${appointmentContext.councilRegistration}`
              : ""}
          </IdentificationValue>
        </IdentificationCell>
      </IdentificationBlock>

      {/* Document body (type-specific renderer) */}
      <DocBody>{children}</DocBody>

      {/* Signature line for patient consent/budget */}
      {patientSignature && (
        <DocFooter>
          <SignatureBlock>
            <SignatureLine />
            <SignatureLabel>Assinatura do Paciente / Responsavel</SignatureLabel>
          </SignatureBlock>
        </DocFooter>
      )}

      {/* Footer */}
      <DocFooter>
        <SignatureBlock>
          <SignatureLine />
          <DocFooterProfessional>{appointmentContext.professionalName}</DocFooterProfessional>
          {appointmentContext.councilRegistration && (
            <DocFooterCouncil>{appointmentContext.councilRegistration}</DocFooterCouncil>
          )}
        </SignatureBlock>
        {doc.issuedAt && (
          <DocFooterIssuedAt>
            Documento emitido em {formatIsoDateTimeToBr(doc.issuedAt, timezone)}
          </DocFooterIssuedAt>
        )}
      </DocFooter>
    </PrintWrapper>
  );
};

export default DocumentPrintLayout;
