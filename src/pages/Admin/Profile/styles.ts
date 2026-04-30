import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HeroBanner = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border-radius: ${theme.borderRadius.lg};
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
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

export const HeroName = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
`;

export const HeroRole = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
`;

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const EditButton = styled.button<{ $variant?: "primary" | "ghost" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background-color: ${({ $variant }) =>
    $variant === "ghost" ? "transparent" : "rgba(255, 255, 255, 0.12)"};
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === "ghost" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.22)"};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// ─── Grid ─────────────────────────────────────────────────────────────────────

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

// ─── Info Card ────────────────────────────────────────────────────────────────

export const InfoCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px;
  box-shadow: ${theme.shadows.sm};
`;

export const EditForm = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 12px;
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

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.border.lighter};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const InfoLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${theme.colors.text.muted};
  flex-shrink: 0;
`;

export const InfoLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
`;

export const InfoValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  text-align: right;
`;

export const InfoValueHighlight = styled(InfoValue)`
  color: ${theme.colors.primary};
  font-weight: 600;
`;

export const LoadingMessage = styled.p`
  margin: 0 0 20px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;
