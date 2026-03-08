import { AlertIcon, AlertText, AlertWrapper } from './styles';

type AlertType = 'warning' | 'success' | 'info';

interface AlertItemProps {
  type: AlertType;
  icon: string;
  message: string;
}

export const AlertItem = ({ type, icon, message }: AlertItemProps) => {
  return (
    <AlertWrapper $type={type}>
      <AlertIcon src={icon} alt={type} />
      <AlertText>{message}</AlertText>
    </AlertWrapper>
  );
};
