import styled from "styled-components";
import { theme } from "../../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BackRow = styled.div`
  display: flex;
  align-items: center;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
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

export const ProfessionalsGrid = styled.div`
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

export const ProfCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ProfCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 18px 0;
`;

export const ProfAvatarWrapper = styled.div`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${theme.colors.surfaceMuted};
  border: 2px solid ${theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: ${theme.colors.text.muted};
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 700;
`;

export const ProfAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ProfHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const ProfName = styled.h2`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1.3;
`;

export const ProfRegistry = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.text.muted};
`;

export const ProfCardBody = styled.div`
  padding: 12px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

export const ProfSectionLabel = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${theme.colors.text.muted};
`;

export const SpecialtiesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const SpecialtyChip = styled.span<{ $primary?: boolean }>`
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border: 1px solid
    ${({ $primary }) =>
        $primary ? "var(--mc-status-progress-border, #93c5fd)" : "var(--mc-border-default, #D1D5DB)"};
  background: ${({ $primary }) =>
        $primary ? "var(--mc-status-progress-bg, #dbeafe)" : "transparent"};
  color: ${({ $primary }) =>
        $primary
            ? "var(--mc-status-progress-text, #1e40af)"
            : "var(--mc-text-secondary, #4B5563)"};
`;

export const ProfTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProfBioText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProfFormationsText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ScheduleGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.secondary};
`;

export const ScheduleDay = styled.span`
  min-width: 36px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const ScheduleTime = styled.span`
  color: ${theme.colors.text.secondary};
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border.light};
  margin: 2px 0;
`;

export const AffiliatedClinicRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};

  svg {
    flex-shrink: 0;
    color: ${theme.colors.primary};
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
  height: 280px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
`;
