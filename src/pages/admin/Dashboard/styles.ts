import styled from 'styled-components';
import { theme } from '../../../themes/themes';

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
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.inverse};
  margin: 0;
`;

export const HeroSubtitle = styled.p`
  font-family: 'Roboto', sans-serif;
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

export const SectionTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 16px;
`;

export const AlertsSection = styled.div``;

export const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChartCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1.5px solid ${theme.colors.border.lighter};
  box-shadow: ${theme.shadows.sm};
  padding: 24px;
`;

export const ChartTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 24px;
`;

export const QuickAccessSection = styled.div``;

export const QuickAccessGrid = styled.div`
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
