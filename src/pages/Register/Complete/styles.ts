import styled from 'styled-components';
import { theme } from '../../../themes/themes';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
  align-self: flex-start;
  line-height: 1.2;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm};
  width: 100%;
  min-width: 0;
  
  > * {
    min-width: 0;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  width: 100%;
`;

export const Label = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  margin-bottom: 4px;
`;

export const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.sm};
  width: 100%;
`;

export const RadioButton = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.xs};
  border: 2px solid ${props => (props.$checked ? theme.colors.primary : theme.colors.border.lighter)};
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => (props.$checked ? `${theme.colors.primary}08` : theme.colors.surface)};
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    border-color: ${theme.colors.primary};
  }

  input {
    display: none;
  }
`;

export const Select = styled.select`
  height: 48px;
  padding: 0 ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border: 2px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.disabled};
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  width: 100%;
  min-width: 0;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const EmergencyBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 14px;
`;

export const EmergencyTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

export const RequirementsText = styled.p`
  margin: 2px 0 0;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: ${theme.colors.text.muted};
`;
