import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const HeroBanner = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: ${theme.borderRadius.lg};
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const AvatarCircle = styled.div`
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HeroName = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 33px;
  font-weight: 700;
  color: #ffffff;
`;

export const HeroRole = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
`;

export const EditButton = styled.button`
  margin-top: 10px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.24);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: 16px 18px 8px;
`;

export const FullWidthCard = styled(InfoCard)`
  width: 100%;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  padding-bottom: 12px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.border.lighter};
`;

export const InfoLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.text.link};
`;

export const InfoLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export const InfoValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  text-align: right;
`;

export const TagsWrap = styled.div`
  padding: 14px 0 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.span`
  height: 24px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  background: #fee2e2;
  color: #dc2626;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
`;

export const EmptyText = styled.p`
  margin: 14px 0 10px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;

export const LoadingMessage = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;
