import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  color: ${theme.colors.text.muted};
`;

export const SearchRow = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;

  > * {
    flex: 1 1 180px;
    min-width: 140px;
    max-width: 340px;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    > * {
      max-width: 100%;
    }
  }
`;

export const SpecialtySelect = styled.select`
  height: 40px;
  width: 100%;
  padding: 0 12px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }
`;

export const ClinicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ClinicCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: var(--mc-border-focus, ${theme.colors.primary});
    box-shadow: ${theme.shadows.md};
  }
`;

export const ClinicCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 0;
`;

export const ClinicLogoWrapper = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: ${theme.borderRadius.md};
  background: var(--mc-color-surface-muted, #f1f5f9);
  border: 1px solid ${theme.colors.border.light};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.muted};
`;

export const ClinicLogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ClinicName = styled.h2`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1.3;
`;

export const ClinicCardBody = styled.div`
  padding: 10px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const ClinicMeta = styled.p`
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.secondary};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const SpecialtiesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const SpecialtyChip = styled.span`
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid var(--mc-status-progress-border, #93c5fd);
  background: var(--mc-status-progress-bg, #dbeafe);
  color: var(--mc-status-progress-text, #1e40af);
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

export const MoreSpecialtiesChip = styled(SpecialtyChip)`
  background: ${theme.colors.surfaceMuted};
  border-color: ${theme.colors.border.default};
  color: ${theme.colors.text.muted};
`;

export const ProfCountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.text.muted};
`;

export const ClinicCardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ViewProfessionalsBtn = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid var(--mc-action-border, #bfdbfe);
  background: var(--mc-action-edit-bg, #eff6ff);
  color: var(--mc-action-edit-text, #1d4ed8);
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.06);
  }
`;

export const EmptyState = styled.div`
  min-height: 160px;
  border: 1px dashed ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.muted};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  text-align: center;
`;

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const SkeletonCard = styled.div`
  height: 220px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
`;
