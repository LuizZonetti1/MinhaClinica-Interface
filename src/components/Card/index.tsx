import { StyledCard } from './styles';

interface CardProps {
  children: React.ReactNode;
  padding?: 'small' | 'medium' | 'large';
}

export const Card = ({ children, padding = 'large' }: CardProps) => {
  return <StyledCard $padding={padding}>{children}</StyledCard>;
};
