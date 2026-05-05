import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { QuickAccessCard } from "../QuickAccessCard";
import { QuickActionsGrid, QuickActionsSection, QuickActionsTitle } from "./styles";

export interface QuickAction {
    icon: ReactNode;
    label: string;
    color: string;
    path: string;
}

interface QuickActionsProps {
    actions: QuickAction[];
    title?: string;
}

export const QuickActions = ({ actions, title = "Acesso Rápido" }: QuickActionsProps) => {
    const navigate = useNavigate();
    return (
        <QuickActionsSection>
            <QuickActionsTitle>{title}</QuickActionsTitle>
            <QuickActionsGrid>
                {actions.map((action) => (
                    <QuickAccessCard
                        key={action.path}
                        icon={action.icon}
                        label={action.label}
                        color={action.color}
                        onClick={() => navigate(action.path)}
                    />
                ))}
            </QuickActionsGrid>
        </QuickActionsSection>
    );
};

export default QuickActions;
