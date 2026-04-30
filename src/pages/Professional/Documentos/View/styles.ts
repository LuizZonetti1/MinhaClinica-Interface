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
  border-radius: 8px;
  overflow: hidden;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;

  @media print {
    border: none;
    border-radius: 0;
    max-width: none;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

// ─── Document header (clinic info) ───────────────────────────────────────────

export const DocHeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px 20px;
  border-bottom: 1px solid #c8c8c8;
`;

export const ClinicLogoMark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  border: 1px solid #c8c8c8;
  background: #fff;
  color: #1a1a1a;
  font-size: 20px;
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
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`;

export const ClinicDetail = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11.5px;
  color: #555;
`;

export const DocTypeTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  flex-shrink: 0;
`;

export const DocTypeLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1a1a1a;
`;

export const DocNumberLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  color: #777;
`;

// ─── Addendum banner ─────────────────────────────────────────────────────────

export const AddendumBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 32px;
  background: #f5f5f5;
  border-bottom: 1px solid #c8c8c8;
  font-family: "Roboto", sans-serif;
  font-size: 11.5px;
  color: #444;
  font-style: italic;
`;

// ─── Identification block ─────────────────────────────────────────────────────

export const IdentificationBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-bottom: 1px solid #c8c8c8;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const IdentificationCell = styled.div`
  padding: 10px 32px;
  border-right: 1px solid #c8c8c8;

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
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #777;
  margin-bottom: 2px;
`;

export const IdentificationValue = styled.span`
  display: block;
  font-family: "Roboto", sans-serif;
  font-size: 12.5px;
  color: #1a1a1a;
`;

// ─── Document body ────────────────────────────────────────────────────────────

export const DocBody = styled.div`
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media print {
    flex: 1;
  }
`;

export const DocSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DocSectionTitle = styled.h3`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #555;
  padding-bottom: 4px;
  border-bottom: 1px solid #c8c8c8;
`;

export const DocSectionText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: #1a1a1a;
  line-height: 1.7;
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
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #777;
`;

export const DocFieldValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: #1a1a1a;
`;

// ─── Medication / item list ───────────────────────────────────────────────────

export const MedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const MedItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MedItemName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

export const MedItemDetail = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: #555;
`;

// ─── Budget table ─────────────────────────────────────────────────────────────

export const BudgetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const BudgetTh = styled.th`
  padding: 7px 12px;
  font-family: "Roboto", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #555;
  text-align: left;
  background: #f5f5f5;
  border: 1px solid #c8c8c8;
`;

export const BudgetTd = styled.td`
  padding: 7px 12px;
  font-family: "Roboto", sans-serif;
  font-size: 12.5px;
  color: #1a1a1a;
  border: 1px solid #c8c8c8;
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
  font-size: ${({ $highlight }) => ($highlight ? "14px" : "12.5px")};
  font-weight: ${({ $highlight }) => ($highlight ? "700" : "400")};
  color: #1a1a1a;
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
  border-bottom: 1px solid #1a1a1a;
`;

export const SignatureLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11.5px;
  color: #555;
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

export const DocFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 32px 24px;
  border-top: 1px solid #c8c8c8;
  align-items: center;
`;

export const DocFooterProfessional = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #1a1a1a;
`;

export const DocFooterCouncil = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11.5px;
  color: #555;
`;

export const DocFooterIssuedAt = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 10px;
  color: #888;
  margin-top: 4px;
`;

// ─── Badge ────────────────────────────────────────────────────────────────────
/* Badges no documento impresso são sempre neutros — sem cores. */

export const DocBadge = styled.span<{ $color?: "amber" | "red" | "green" | "purple" | "blue" }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 600;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #c8c8c8;
`;

// ─── Loading / Error ──────────────────────────────────────────────────────────

export const ViewStatusMessage = styled.p<{ $error?: boolean }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${({ $error }) => ($error ? theme.colors.error : theme.colors.text.muted)};
  text-align: center;
  padding: 64px 0;
`;

// ─── Item list (campos com múltiplos itens) ───────────────────────────────────

export const DocItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DocItemListItem = styled.li`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: #1a1a1a;
  line-height: 1.7;
  padding-left: 16px;
  position: relative;

  &::before {
    content: "—";
    position: absolute;
    left: 0;
    color: #888;
    font-size: 11px;
  }
`;
