import styled from "styled-components";
import { theme } from "../../../../themes/themes";
import { PrintWrapper } from "../../../Professional/Documentos/View/styles";

/**
 * Envolve o DocumentPrintLayout na visão do paciente.
 * Em tela: adapta o fundo/borda do "papel" ao tema escuro via CSS variables.
 * Em impressão: não muda nada — o @media print do PrintWrapper permanece intacto.
 */
export const PatientScreenViewWrapper = styled.div`
  @media screen {
    ${PrintWrapper} {
      background: ${theme.colors.surface};
      border-color: ${theme.colors.border.default};
    }
  }
`;
