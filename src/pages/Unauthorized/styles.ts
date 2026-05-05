import styled from "styled-components";
import { theme } from "../../themes/themes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
  color: ${theme.colors.error};
  margin-bottom: 1rem;
`;

export const Message = styled.p`
  font-size: 1.2rem;
  color: ${theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

export const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  background-color: ${theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;
