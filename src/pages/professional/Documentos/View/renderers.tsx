import type {
  AttendanceDeclarationContent,
  BudgetContent,
  CertificateContent,
  ClinicalDocumentDetail,
  ClinicalReportContent,
  ConsentFormContent,
  ControlledPrescriptionContent,
  ExamRequestContent,
  MedicalReportContent,
  PrescriptionContent,
  ReferralContent,
  TreatmentPlanContent,
} from "../../../../../types/clinical-document";
import { formatIsoDateToBr } from "../../../../utils/dateParsers";
import {
  BudgetTable,
  BudgetTd,
  BudgetTh,
  BudgetTotalRow,
  BudgetTotals,
  DocBadge,
  DocField,
  DocFieldLabel,
  DocFieldRow,
  DocFieldValue,
  DocHighlightBlock,
  DocHighlightText,
  DocHighlightTitle,
  DocItemList,
  DocItemListItem,
  DocSection,
  DocSectionText,
  DocSectionTitle,
  MedItem,
  MedItemDetail,
  MedItemName,
  MedList,
} from "./styles";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const DECLARATION_TYPE_LABEL: Record<string, string> = {
  ATTENDANCE: "Comparecimento",
  INCAPACITY: "Incapacidade",
  MEDICAL_FOLLOW_UP: "Acompanhamento medico",
};

const INTERVENTION_TYPE_LABEL: Record<string, string> = {
  MEDICATION: "Medicamento",
  LIFESTYLE: "Estilo de vida",
  MONITORING: "Monitoramento",
  PHYSIOTHERAPY: "Fisioterapia",
  PROCEDURE: "Procedimento",
};

// ─── 1. Clinical Report ───────────────────────────────────────────────────────

const renderSectionValue = (value: string) => {
  const items = value.split("\n").filter((s) => s.trim() !== "");
  if (items.length > 1) {
    return (
      <DocItemList>
        {items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: valor estável de exibição
          <DocItemListItem key={i}>{item}</DocItemListItem>
        ))}
      </DocItemList>
    );
  }
  return <DocSectionText>{value}</DocSectionText>;
};

export const ClinicalReportRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as ClinicalReportContent;
  const fields: [string, string][] = [
    ["Anamnese", c.anamnesis],
    ["Historico", c.history],
    ["Exame Fisico", c.physicalExam],
    ["Exames Complementares", c.complementaryExams],
    ["Diagnostico", c.diagnosis],
    ["Tratamento", c.treatment],
    ["Prognostico", c.prognosis],
  ];
  return (
    <>
      {fields.map(([label, value]) =>
        value ? (
          <DocSection key={label}>
            <DocSectionTitle>{label}</DocSectionTitle>
            {renderSectionValue(value)}
          </DocSection>
        ) : null,
      )}
      {c.cid && (
        <DocFieldRow>
          <DocField>
            <DocFieldLabel>CID</DocFieldLabel>
            <DocFieldValue>{c.cid}</DocFieldValue>
          </DocField>
        </DocFieldRow>
      )}
    </>
  );
};

// ─── 2. Certificate ───────────────────────────────────────────────────────────

export const CertificateRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as CertificateContent;
  return (
    <>
      <DocFieldRow>
        {c.daysOfRest !== null && c.daysOfRest !== undefined && (
          <DocField>
            <DocFieldLabel>Dias de Afastamento</DocFieldLabel>
            <DocFieldValue>{c.daysOfRest} dia(s)</DocFieldValue>
          </DocField>
        )}
        {c.startDate && (
          <DocField>
            <DocFieldLabel>Inicio</DocFieldLabel>
            <DocFieldValue>{c.startDate}</DocFieldValue>
          </DocField>
        )}
        {c.endDate && (
          <DocField>
            <DocFieldLabel>Termino</DocFieldLabel>
            <DocFieldValue>{c.endDate}</DocFieldValue>
          </DocField>
        )}
        {c.cid && (
          <DocField>
            <DocFieldLabel>CID</DocFieldLabel>
            <DocFieldValue>{c.cid}</DocFieldValue>
          </DocField>
        )}
      </DocFieldRow>
      {c.diagnosisDescription && (
        <DocSection>
          <DocSectionTitle>Descricao do Diagnostico</DocSectionTitle>
          <DocSectionText>{c.diagnosisDescription}</DocSectionText>
        </DocSection>
      )}
      {c.purpose && (
        <DocSection>
          <DocSectionTitle>Finalidade</DocSectionTitle>
          <DocSectionText>{c.purpose}</DocSectionText>
        </DocSection>
      )}
      {c.observations && (
        <DocSection>
          <DocSectionTitle>Observacoes</DocSectionTitle>
          <DocSectionText>{c.observations}</DocSectionText>
        </DocSection>
      )}
    </>
  );
};

// ─── 3. Attendance Declaration ────────────────────────────────────────────────

export const AttendanceDeclarationRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as AttendanceDeclarationContent;
  const patientName = doc.appointmentContext.patientName || "[nome do paciente]";
  const dateFormatted = c.attendanceDate ? formatIsoDateToBr(c.attendanceDate) : "__/__/____";
  const arrival = c.arrivalTime || null;
  const departure = c.departureTime || null;
  const purposeText = c.purpose || null;

  let declarationText = `Declaramos que ${patientName} compareceu a esta clínica no dia ${dateFormatted}`;
  if (arrival) {
    declarationText += `, no horário das ${arrival}`;
    if (departure) declarationText += ` às ${departure}`;
  }
  if (purposeText) declarationText += `, para ${purposeText}`;
  declarationText += ".";

  return (
    <>
      {c.declarationType && (
        <DocFieldRow>
          <DocField>
            <DocFieldLabel>Tipo de Declaracao</DocFieldLabel>
            <DocFieldValue>
              {DECLARATION_TYPE_LABEL[c.declarationType] ?? c.declarationType}
            </DocFieldValue>
          </DocField>
        </DocFieldRow>
      )}
      <DocSection>
        <DocSectionText>{declarationText}</DocSectionText>
      </DocSection>
    </>
  );
};

// ─── 4. Prescription ─────────────────────────────────────────────────────────

export const PrescriptionRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as PrescriptionContent;
  return (
    <MedList>
      {c.medications.map((med, i) => (
        <MedItem key={`presc-${i}-${med.name}`}>
          <MedItemName>
            {i + 1}. {med.name || "Medicamento"}
          </MedItemName>
          {med.dosage && <MedItemDetail>Dosagem: {med.dosage}</MedItemDetail>}
          {med.frequency && <MedItemDetail>Frequencia: {med.frequency}</MedItemDetail>}
          {med.duration && <MedItemDetail>Duracao: {med.duration}</MedItemDetail>}
          {med.instructions && <MedItemDetail>Instrucoes: {med.instructions}</MedItemDetail>}
        </MedItem>
      ))}
    </MedList>
  );
};

// ─── 5. Controlled Prescription ──────────────────────────────────────────────

export const ControlledPrescriptionRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as ControlledPrescriptionContent;
  return (
    <>
      <DocHighlightBlock $color="amber">
        <DocHighlightTitle style={{ color: "#92400e" }}>
          Receituario de Controle Especial
        </DocHighlightTitle>
        <DocHighlightText style={{ color: "#92400e" }}>
          A dispensacao deste medicamento esta sujeita a normas da ANVISA (Portaria SVS/MS
          344/1998).
        </DocHighlightText>
      </DocHighlightBlock>
      <DocFieldRow>
        {c.notificationNumber && (
          <DocField>
            <DocFieldLabel>Numero da Notificacao</DocFieldLabel>
            <DocFieldValue>{c.notificationNumber}</DocFieldValue>
          </DocField>
        )}
        {c.patientAddress && (
          <DocField>
            <DocFieldLabel>Endereco do Paciente</DocFieldLabel>
            <DocFieldValue>{c.patientAddress}</DocFieldValue>
          </DocField>
        )}
      </DocFieldRow>
      <MedList>
        {c.medications.map((med, i) => (
          <MedItem key={`ctrl-${i}-${med.name}`}>
            <MedItemName>
              {i + 1}. {med.name || "Medicamento"}
            </MedItemName>
            {med.dosage && <MedItemDetail>Dosagem: {med.dosage}</MedItemDetail>}
            {med.frequency && <MedItemDetail>Frequencia: {med.frequency}</MedItemDetail>}
            {med.duration && <MedItemDetail>Duracao: {med.duration}</MedItemDetail>}
            {med.quantity && <MedItemDetail>Quantidade: {med.quantity}</MedItemDetail>}
            {med.instructions && <MedItemDetail>Instrucoes: {med.instructions}</MedItemDetail>}
          </MedItem>
        ))}
      </MedList>
    </>
  );
};

// ─── 6. Exam Request ─────────────────────────────────────────────────────────

export const ExamRequestRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as ExamRequestContent;
  const urgencyColor = c.urgency === "URGENT" || c.urgency === "ALTA" ? "red" : "blue";
  return (
    <>
      <DocFieldRow>
        {c.urgency && (
          <DocField>
            <DocFieldLabel>Urgência</DocFieldLabel>
            <DocFieldValue>
              <DocBadge $color={urgencyColor}>{c.urgency}</DocBadge>
            </DocFieldValue>
          </DocField>
        )}
        {c.cid && (
          <DocField>
            <DocFieldLabel>CID</DocFieldLabel>
            <DocFieldValue>{c.cid}</DocFieldValue>
          </DocField>
        )}
      </DocFieldRow>
      {c.clinicalIndication && (
        <DocSection>
          <DocSectionTitle>Indicação Clínica</DocSectionTitle>
          <DocSectionText>{c.clinicalIndication}</DocSectionText>
        </DocSection>
      )}
      <DocSection>
        <DocSectionTitle>Exames Solicitados</DocSectionTitle>
        {c.exams.map((exam, i) => (
          <MedItem key={`exam-${i}-${exam.name}`}>
            <MedItemName>
              {i + 1}. {exam.name || "Exame"}
              {exam.code ? ` (${exam.code})` : ""}
            </MedItemName>
            {exam.instructions && <MedItemDetail>Preparo: {exam.instructions}</MedItemDetail>}
          </MedItem>
        ))}
      </DocSection>
    </>
  );
};

// ─── 7. Referral ─────────────────────────────────────────────────────────────

export const ReferralRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as ReferralContent;
  const urgencyColor = c.urgency === "URGENT" || c.urgency === "ALTA" ? "red" : "blue";
  return (
    <>
      <DocFieldRow>
        {c.referredTo && (
          <DocField>
            <DocFieldLabel>Encaminhado para</DocFieldLabel>
            <DocFieldValue>{c.referredTo}</DocFieldValue>
          </DocField>
        )}
        {c.targetProfessional && (
          <DocField>
            <DocFieldLabel>Profissional Alvo</DocFieldLabel>
            <DocFieldValue>{c.targetProfessional}</DocFieldValue>
          </DocField>
        )}
        {c.urgency && (
          <DocField>
            <DocFieldLabel>Urgência</DocFieldLabel>
            <DocFieldValue>
              <DocBadge $color={urgencyColor}>{c.urgency}</DocBadge>
            </DocFieldValue>
          </DocField>
        )}
        {c.cid && (
          <DocField>
            <DocFieldLabel>CID</DocFieldLabel>
            <DocFieldValue>{c.cid}</DocFieldValue>
          </DocField>
        )}
      </DocFieldRow>
      {c.reason && (
        <DocSection>
          <DocSectionTitle>Motivo do Encaminhamento</DocSectionTitle>
          <DocSectionText>{c.reason}</DocSectionText>
        </DocSection>
      )}
      {c.clinicalHistory && (
        <DocSection>
          <DocSectionTitle>Histórico Clínico</DocSectionTitle>
          <DocSectionText>{c.clinicalHistory}</DocSectionText>
        </DocSection>
      )}
    </>
  );
};

// ─── 8. Medical Report (Laudo) ────────────────────────────────────────────────

export const MedicalReportRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as MedicalReportContent;
  return (
    <>
      <DocFieldRow>
        {c.examType && (
          <DocField>
            <DocFieldLabel>Tipo de Exame</DocFieldLabel>
            <DocFieldValue>{c.examType}</DocFieldValue>
          </DocField>
        )}
        {c.examDate && (
          <DocField>
            <DocFieldLabel>Data do Exame</DocFieldLabel>
            <DocFieldValue>{c.examDate}</DocFieldValue>
          </DocField>
        )}
        {c.cid && (
          <DocField>
            <DocFieldLabel>CID</DocFieldLabel>
            <DocFieldValue>{c.cid}</DocFieldValue>
          </DocField>
        )}
      </DocFieldRow>
      {c.purpose && (
        <DocSection>
          <DocSectionTitle>Finalidade</DocSectionTitle>
          <DocSectionText>{c.purpose}</DocSectionText>
        </DocSection>
      )}
      {c.findings && (
        <DocSection>
          <DocSectionTitle>Achados</DocSectionTitle>
          <DocSectionText>{c.findings}</DocSectionText>
        </DocSection>
      )}
      {c.conclusion && (
        <DocHighlightBlock $color="blue">
          <DocHighlightTitle style={{ color: "#1e40af" }}>Conclusao</DocHighlightTitle>
          <DocHighlightText style={{ color: "#1e40af" }}>{c.conclusion}</DocHighlightText>
        </DocHighlightBlock>
      )}
    </>
  );
};

// ─── 9. Consent Form ─────────────────────────────────────────────────────────

export const ConsentFormRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as ConsentFormContent;
  return (
    <>
      {c.procedureName && (
        <DocFieldRow>
          <DocField>
            <DocFieldLabel>Procedimento</DocFieldLabel>
            <DocFieldValue style={{ fontSize: 15, fontWeight: 600 }}>
              {c.procedureName}
            </DocFieldValue>
          </DocField>
        </DocFieldRow>
      )}
      {c.procedureDescription && (
        <DocSection>
          <DocSectionTitle>Descricao</DocSectionTitle>
          <DocSectionText>{c.procedureDescription}</DocSectionText>
        </DocSection>
      )}
      {c.risks && (
        <DocHighlightBlock $color="amber">
          <DocHighlightTitle style={{ color: "#92400e" }}>Riscos</DocHighlightTitle>
          <DocHighlightText style={{ color: "#92400e" }}>{c.risks}</DocHighlightText>
        </DocHighlightBlock>
      )}
      {c.benefits && (
        <DocSection>
          <DocSectionTitle>Beneficios</DocSectionTitle>
          <DocSectionText>{c.benefits}</DocSectionText>
        </DocSection>
      )}
      {c.alternatives && (
        <DocSection>
          <DocSectionTitle>Alternativas</DocSectionTitle>
          <DocSectionText>{c.alternatives}</DocSectionText>
        </DocSection>
      )}
      {c.witnessName && (
        <DocFieldRow>
          <DocField>
            <DocFieldLabel>Testemunha</DocFieldLabel>
            <DocFieldValue>{c.witnessName}</DocFieldValue>
          </DocField>
        </DocFieldRow>
      )}
      {c.patientAcknowledged && (
        <DocHighlightBlock $color="green">
          <DocHighlightText style={{ color: "#166534", fontWeight: 600 }}>
            Paciente declarou estar ciente e assinou o termo.
          </DocHighlightText>
        </DocHighlightBlock>
      )}
    </>
  );
};

// ─── 10. Treatment Plan ───────────────────────────────────────────────────────

export const TreatmentPlanRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as TreatmentPlanContent;
  return (
    <>
      <DocFieldRow>
        {c.diagnosis && (
          <DocField>
            <DocFieldLabel>Diagnostico</DocFieldLabel>
            <DocFieldValue>{c.diagnosis}</DocFieldValue>
          </DocField>
        )}
        {c.cid && (
          <DocField>
            <DocFieldLabel>CID</DocFieldLabel>
            <DocFieldValue>{c.cid}</DocFieldValue>
          </DocField>
        )}
        {c.followUpIntervalDays !== null && c.followUpIntervalDays !== undefined && (
          <DocField>
            <DocFieldLabel>Retorno em</DocFieldLabel>
            <DocFieldValue>{c.followUpIntervalDays} dia(s)</DocFieldValue>
          </DocField>
        )}
      </DocFieldRow>
      {c.goals.filter(Boolean).length > 0 && (
        <DocSection>
          <DocSectionTitle>Objetivos</DocSectionTitle>
          {c.goals.filter(Boolean).map((goal, i) => (
            <DocSectionText key={`goal-${i}-${goal}`}>
              {i + 1}. {goal}
            </DocSectionText>
          ))}
        </DocSection>
      )}
      {c.interventions.length > 0 && (
        <DocSection>
          <DocSectionTitle>Intervencoes</DocSectionTitle>
          {c.interventions.map((intv, i) => (
            <MedItem key={`intv-${i}-${intv.description}`}>
              {intv.type && (
                <MedItemName>{INTERVENTION_TYPE_LABEL[intv.type] ?? intv.type}</MedItemName>
              )}
              <MedItemDetail>{intv.description}</MedItemDetail>
            </MedItem>
          ))}
        </DocSection>
      )}
    </>
  );
};

// ─── 11. Budget ───────────────────────────────────────────────────────────────

export const BudgetRenderer = ({ doc }: { doc: ClinicalDocumentDetail }) => {
  const c = doc.content as BudgetContent;
  return (
    <>
      <DocSection>
        <DocSectionTitle>Itens do Orcamento</DocSectionTitle>
        <BudgetTable>
          <thead>
            <tr>
              <BudgetTh>Descricao</BudgetTh>
              <BudgetTh>Qtd</BudgetTh>
              <BudgetTh>Valor Unitario</BudgetTh>
              <BudgetTh>Total</BudgetTh>
            </tr>
          </thead>
          <tbody>
            {c.items.map((item, i) => (
              <tr key={`budget-${i}-${item.description}`}>
                <BudgetTd>{item.description}</BudgetTd>
                <BudgetTd>{item.quantity ?? 1}</BudgetTd>
                <BudgetTd>
                  {item.unitPrice !== null ? formatCurrency(item.unitPrice ?? 0) : "--"}
                </BudgetTd>
                <BudgetTd>{formatCurrency(item.total)}</BudgetTd>
              </tr>
            ))}
          </tbody>
        </BudgetTable>
        <BudgetTotals>
          <BudgetTotalRow>
            <span>Subtotal</span>
            <span>{formatCurrency(c.subtotal)}</span>
          </BudgetTotalRow>
          {c.discount > 0 && (
            <BudgetTotalRow>
              <span>Desconto</span>
              <span>- {formatCurrency(c.discount)}</span>
            </BudgetTotalRow>
          )}
          <BudgetTotalRow $highlight>
            <span>Total</span>
            <span>{formatCurrency(c.total)}</span>
          </BudgetTotalRow>
        </BudgetTotals>
      </DocSection>
      {c.paymentMethods.length > 0 && (
        <DocFieldRow>
          <DocField>
            <DocFieldLabel>Formas de Pagamento</DocFieldLabel>
            <DocFieldValue>{c.paymentMethods.join(", ")}</DocFieldValue>
          </DocField>
          {c.validityDays !== null && c.validityDays !== undefined && (
            <DocField>
              <DocFieldLabel>Validade</DocFieldLabel>
              <DocFieldValue>{c.validityDays} dia(s)</DocFieldValue>
            </DocField>
          )}
        </DocFieldRow>
      )}
      {c.observations && (
        <DocSection>
          <DocSectionTitle>Observacoes</DocSectionTitle>
          <DocSectionText>{c.observations}</DocSectionText>
        </DocSection>
      )}
      {c.patientAcknowledged && (
        <DocHighlightBlock $color="green">
          <DocHighlightText style={{ color: "#166534", fontWeight: 600 }}>
            Paciente ciente e de acordo com os valores apresentados.
          </DocHighlightText>
        </DocHighlightBlock>
      )}
    </>
  );
};
