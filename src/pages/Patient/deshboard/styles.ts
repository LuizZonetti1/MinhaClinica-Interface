import styled, { css } from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const HeroBanner = styled.div`
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeroTitle = styled.h1`
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.inverse};
  margin: 0;
`;

export const HeroSubtitle = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${theme.colors.text.inverse};
  opacity: 0.9;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const NextAppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const NextAppointmentCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1.5px solid ${theme.colors.border.lighter};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

export const AppointmentTopBar = styled.div`
  min-height: 40px;
  background: ${theme.colors.featureBg.blue};
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export type AppointmentStatusVariant = "success" | "info" | "warning" | "neutral" | "danger";

const statusVariantStyle: Record<AppointmentStatusVariant, ReturnType<typeof css>> = {
  success: css`
    color: #15803d;
    background: #d9f4e3;
  `,
  info: css`
    color: #1e40af;
    background: #dbeafe;
  `,
  warning: css`
    color: #b45309;
    background: #fef3c7;
  `,
  neutral: css`
    color: #334155;
    background: #e2e8f0;
  `,
  danger: css`
    color: #b91c1c;
    background: #fee2e2;
  `,
};

export const StatusBadge = styled.span<{ $variant: AppointmentStatusVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;

  ${({ $variant }) => statusVariantStyle[$variant]}
`;

export const DetailLink = styled.button`
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text.link};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${theme.colors.text.linkHover};
  }
`;

export const NextAppointmentContent = styled.div`
  padding: 18px 16px;
`;

export const AppointmentBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const AppointmentProfessional = styled.h3`
  margin: 0 0 6px;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const AppointmentMeta = styled.p`
  margin: 0 0 8px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
`;

export const AppointmentDateRow = styled.p`
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.link};
`;

export const AppointmentAction = styled.div`
  flex-shrink: 0;
`;

export const ConfirmPresenceButton = styled.button`
  border: 0;
  border-radius: 10px;
  height: 40px;
  padding: 0 18px;
  background: ${theme.colors.successHover};
  color: ${theme.colors.text.inverse};
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${theme.colors.successActive};
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;

export const EmptyCardText = styled.p`
  margin: 0;
  padding: 18px 16px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;

export const QuickAccessSection = styled.div``;

export const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 680px;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.lg};
  padding: 22px;
`;

export const ModalTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 21px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const ModalCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.border.focus};
    color: ${theme.colors.text.primary};
  }
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  padding: 12px;
`;

export const DetailLabel = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text.muted};
`;

export const DetailValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;
