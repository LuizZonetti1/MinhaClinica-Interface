import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HeroBanner = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border-radius: ${theme.borderRadius.lg};
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const AvatarCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const HeroInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeroName = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
`;

export const HeroSubtitle = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
`;

export const HeroTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

export const HeroTag = styled.span<{ $variant?: "specialty" | "active" }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $variant }) =>
    $variant === "active" ? "rgba(34, 197, 94, 0.25)" : "rgba(255, 255, 255, 0.15)"};
  color: ${({ $variant }) => ($variant === "active" ? "#86efac" : "rgba(255, 255, 255, 0.95)")};
  border: 1px solid ${({ $variant }) =>
    $variant === "active" ? "rgba(34, 197, 94, 0.4)" : "rgba(255, 255, 255, 0.25)"};
`;

export const HeroActions = styled.div`
  flex-shrink: 0;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.22);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// ─── Stats ────────────────────────────────────────────────────────────────────

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.surface};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  gap: 6px;
  border-right: 1px solid ${theme.colors.border.lighter};

  &:last-child {
    border-right: none;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    border-right: none;
    border-bottom: 1px solid ${theme.colors.border.lighter};

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const StatValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const StatMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.text.muted};
`;

export const StatLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
`;

// ─── Content ──────────────────────────────────────────────────────────────────

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

export const ContentCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px;
  box-shadow: ${theme.shadows.sm};
`;

export const CardTitle = styled.h3`
  margin: 0 0 20px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
`;

export const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0 0 10px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const SectionText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border.lighter};
  margin: 20px 0;
`;

export const SpecialtyTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SpecialtyTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  background-color: rgba(59, 130, 246, 0.08);
  color: ${theme.colors.primary};
  border: 1px solid rgba(59, 130, 246, 0.2);
`;

export const FormationLine = styled.p`
  margin: 0 0 6px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

// ─── Working Hours (view) ─────────────────────────────────────────────────────

export const DayRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid ${theme.colors.border.lighter};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const DayName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
`;

export const DaySchedule = styled.span<{ $closed?: boolean }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: ${({ $closed }) => ($closed ? 400 : 500)};
  color: ${({ $closed }) => ($closed ? theme.colors.text.disabled : theme.colors.text.primary)};
  text-align: right;
`;

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const LoadingMessage = styled.p`
  margin: 0 0 20px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;
