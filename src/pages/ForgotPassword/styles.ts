import styled from "styled-components";
import { theme } from "../../themes/themes";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.lg};
    width: 100%;
`;

export const Title = styled.h1`
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0;
    text-align: center;
`;

export const Subtitle = styled.p`
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: ${theme.colors.text.muted};
    margin: 0;
    text-align: center;
`;

export const Description = styled.p`
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    margin: 0;
    text-align: center;
    line-height: 1.6;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
    width: 100%;
`;

export const ErrorText = styled.p`
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    color: ${theme.colors.error};
    margin: 0;
    text-align: center;
`;

export const SuccessBox = styled.div`
    background-color: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-radius: 8px;
    padding: ${theme.spacing.lg};
    width: 100%;

    p {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        color: #166534;
        margin: 0 0 8px;
        line-height: 1.6;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

export const BackLink = styled.a`
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${theme.colors.text.link};
    text-decoration: none;
    transition: color 0.2s;
    margin-top: ${theme.spacing.sm};

    &:hover {
        color: ${theme.colors.text.linkHover};
        text-decoration: underline;
    }
`;
