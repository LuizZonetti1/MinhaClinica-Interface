import styled from "styled-components";
import { theme } from "../../../../themes/themes";

// ─── Wrapper ──────────────────────────────────────────────────────────────────

export const ViewPageWrapper = styled.div`
  padding: 24px 20px 64px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media print {
    padding: 0;
    gap: 0;
  }
`;

export const ViewPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  @media print {
    display: none;
  }
`;

export const ViewHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// ─── Print layout wrapper (the "paper") ──────────────────────────────────────

export const PrintWrapper = styled.div`
  background: #fff;
  border: 1px solid ${theme.colors.border.light};
  border-radius: 12px;
  overflow: hidden;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;

  @media print {
    border: none;
    border-radius: 0;
    max-width: none;
    margin: 0;
  }
`;

// ─── Document header (clinic info) ───────────────────────────────────────────

export const DocHeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px 20px;
  border-bottom: 2px solid ${theme.colors.primary};
`;

export const ClinicLogoMark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: ${theme.colors.primary};
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  font-family: "Roboto", sans-serif;
  flex-shrink: 0;
`;

export const ClinicHeaderInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ClinicName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const ClinicDetail = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

export const DocTypeTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
`;

export const DocTypeLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.primary};
`;

export const DocNumberLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  color: ${theme.colors.text.muted};
`;

// ─── Addendum banner ─────────────────────────────────────────────────────────

export const AddendumBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 32px;
  background: #ede9fe;
  border-bottom: 1px solid #c4b5fd;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: #5b21b6;
`;

// ─── Identification block ─────────────────────────────────────────────────────

export const IdentificationBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-bottom: 1px solid ${theme.colors.border.light};

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const IdentificationCell = styled.div`
  padding: 12px 32px;
  border-right: 1px solid ${theme.colors.border.light};

  &:last-child {
    border-right: none;
  }

  @media (max-width: 600px) {
    &:nth-child(2) {
      border-right: none;
    }
  }
`;

export const IdentificationLabel = styled.span`
  display: block;
  font-family: "Roboto", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.text.muted};
  margin-bottom: 2px;
`;

export const IdentificationValue = styled.span`
  display: block;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.primary};
`;

// ─── Document body ────────────────────────────────────────────────────────────

export const DocBody = styled.div`
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DocSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DocSectionTitle = styled.h3`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.text.muted};
  padding-bottom: 4px;
  border-bottom: 1px solid ${theme.colors.border.light};
`;

export const DocSectionText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13.5px;
  color: ${theme.colors.text.primary};
  line-height: 1.65;
  white-space: pre-wrap;
`;

export const DocFieldRow = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

export const DocField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const DocFieldLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.text.muted};
`;

export const DocFieldValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13.5px;
  color: ${theme.colors.text.primary};
`;

// ─── Highlight / alert blocks ─────────────────────────────────────────────────

export const DocHighlightBlock = styled.div<{
  $color?: "amber" | "purple" | "blue" | "green" | "red";
}>`
  padding: 14px 18px;
  border-radius: 8px;
  background: ${({ $color }) =>
    $color === "amber"
      ? "#fef3c7"
      : $color === "purple"
        ? "#ede9fe"
        : $color === "blue"
          ? "#dbeafe"
          : $color === "green"
            ? "#dcfce7"
            : $color === "red"
              ? "#fee2e2"
              : theme.colors.surfaceMuted};
  border: 1px solid ${({ $color }) =>
    $color === "amber"
      ? "#fcd34d"
      : $color === "purple"
        ? "#c4b5fd"
        : $color === "blue"
          ? "#93c5fd"
          : $color === "green"
            ? "#86efac"
            : $color === "red"
              ? "#fca5a5"
              : theme.colors.border.light};
`;

export const DocHighlightTitle = styled.p`
  margin: 0 0 4px;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: inherit;
`;

export const DocHighlightText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  line-height: 1.55;
  white-space: pre-wrap;
`;

// ─── Medication / item list ───────────────────────────────────────────────────

export const MedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MedItem = styled.div`
  padding: 14px 18px;
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  background: ${theme.colors.surfaceMuted};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MedItemName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const MedItemDetail = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12.5px;
  color: ${theme.colors.text.secondary};
`;

// ─── Budget table ─────────────────────────────────────────────────────────────

export const BudgetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const BudgetTh = styled.th`
  padding: 8px 12px;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${theme.colors.text.muted};
  text-align: left;
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.light};
`;

export const BudgetTd = styled.td`
  padding: 8px 12px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  border: 1px solid ${theme.colors.border.light};
`;

export const BudgetTotals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-top: 8px;
`;

export const BudgetTotalRow = styled.div<{ $highlight?: boolean }>`
  display: flex;
  gap: 16px;
  font-family: "Roboto", sans-serif;
  font-size: ${({ $highlight }) => ($highlight ? "15px" : "13px")};
  font-weight: ${({ $highlight }) => ($highlight ? "700" : "400")};
  color: ${({ $highlight }) => ($highlight ? theme.colors.text.primary : theme.colors.text.secondary)};
`;

// ─── Signature line ───────────────────────────────────────────────────────────

export const SignatureBlock = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const SignatureLine = styled.div`
  width: 260px;
  border-bottom: 1px solid ${theme.colors.text.primary};
`;

export const SignatureLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

export const DocFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 32px 28px;
  border-top: 1px solid ${theme.colors.border.light};
  align-items: center;
`;

export const DocFooterProfessional = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const DocFooterCouncil = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

export const DocFooterIssuedAt = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  color: ${theme.colors.text.muted};
  margin-top: 4px;
`;

// ─── Badge ────────────────────────────────────────────────────────────────────

export const DocBadge = styled.span<{ $color?: "amber" | "red" | "green" | "purple" | "blue" }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $color }) =>
    $color === "amber"
      ? "#fef3c7"
      : $color === "red"
        ? "#fee2e2"
        : $color === "green"
          ? "#dcfce7"
          : $color === "purple"
            ? "#ede9fe"
            : "#dbeafe"};
  color: ${({ $color }) =>
    $color === "amber"
      ? "#92400e"
      : $color === "red"
        ? "#991b1b"
        : $color === "green"
          ? "#166534"
          : $color === "purple"
            ? "#5b21b6"
            : "#1e40af"};
  border: 1px solid ${({ $color }) =>
    $color === "amber"
      ? "#fcd34d"
      : $color === "red"
        ? "#fca5a5"
        : $color === "green"
          ? "#86efac"
          : $color === "purple"
            ? "#c4b5fd"
            : "#93c5fd"};
`;

// ─── Loading / Error ──────────────────────────────────────────────────────────

export const ViewStatusMessage = styled.p<{ $error?: boolean }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${({ $error }) => ($error ? theme.colors.error : theme.colors.text.muted)};
  text-align: center;
  padding: 64px 0;
`;
