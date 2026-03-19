import { Card, Description, PageWrapper, Title } from "./styles";

interface ReceptionPlaceholderProps {
  title: string;
  description: string;
}

export const ReceptionPlaceholder = ({ title, description }: ReceptionPlaceholderProps) => {
  return (
    <PageWrapper>
      <Card>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Card>
    </PageWrapper>
  );
};
