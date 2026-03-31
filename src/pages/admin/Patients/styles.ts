import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 22px;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 20px;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div<{ $borderColor: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 24px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-left: 4px solid ${({ $borderColor }) => $borderColor};
  border-radius: ${theme.borderRadius.md};
`;

export const SummaryLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const SummaryValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchField = styled.div`
  width: 380px;
  max-width: 100%;

  @media (max-width: ${theme.breakpoints.desktop}) {
    width: 100%;
  }
`;

export const TableCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  overflow: auto;
`;

export const TableElement = styled.table`
  width: 100%;
  min-width: 880px;
  border-collapse: collapse;

  td {
    padding: 16px 24px;
    font-family: "Roboto", sans-serif;
    font-size: 15px;
    color: ${theme.colors.text.primary};
    border-top: 1px solid ${theme.colors.border.light};
    vertical-align: middle;

    @media (max-width: ${theme.breakpoints.wide}) {
      font-size: 14px;
    }
  }
`;

export const TableHeaderRow = styled.tr`
  background-color: ${theme.colors.surfaceMuted};
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 14px 24px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  letter-spacing: 0.04em;
  font-weight: 700;
  color: ${theme.colors.text.secondary};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 12px;
  }
`;

export const TableRow = styled.tr``;

export const PatientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const Avatar = styled.div<{ $bgColor: string }>`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background-color: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.inverse};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const PatientMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PatientName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 15px;
  }
`;

export const PatientEmail = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.text.muted};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 12px;
  }
`;

export const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmptyStateCell = styled.td`
  text-align: center;
  color: ${theme.colors.text.secondary};
  padding: 24px;
`;

export const StatusMessage = styled.p<{ $variant?: "error" | "success" }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${({ $variant }) =>
    $variant === "error"
      ? theme.colors.error
      : $variant === "success"
        ? theme.colors.success
        : theme.colors.text.secondary};
  text-align: center;
  padding: 32px 0;
`;

export const PhoneText = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.surfaceMuted};
`;

export const DetailLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
`;

export const DetailValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;
