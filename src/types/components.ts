import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { HistoricalItem } from "./dashboard";

// ─── ActionIconButton ─────────────────────────────────────────────────────────
export type ActionIconButtonVariant = "view" | "edit" | "delete";

export interface ActionIconButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ActionIconButtonVariant;
    icon: ReactNode;
}

// ─── AlertItem ────────────────────────────────────────────────────────────────
export type AlertType = "warning" | "success" | "info";

export interface AlertItemProps {
    type: AlertType;
    icon: string;
    message: string;
}

// ─── AuthLayout ───────────────────────────────────────────────────────────────
export interface AuthLayoutProps {
    children: ReactNode;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export type BadgeVariant = "info" | "success" | "neutral";

export interface BadgeProps {
    variant: BadgeVariant;
    children: ReactNode;
}

// ─── Button ───────────────────────────────────────────────────────────────────
export type ButtonVariant = "primary" | "secondary" | "outline" | "text";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export interface CardProps {
    children: ReactNode;
    padding?: "small" | "medium" | "large";
}

// ─── ConsultationsChart ───────────────────────────────────────────────────────
export interface ConsultationsChartProps {
    data: HistoricalItem[];
}

// ─── Input ────────────────────────────────────────────────────────────────────
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    rightIcon?: ReactNode;
    onRightIconClick?: () => void;
    fullWidth?: boolean;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
export interface LogoProps {
    showSubtitle?: boolean;
    variant?: "default" | "auth";
}

// ─── QuickAccessCard ──────────────────────────────────────────────────────────
export interface QuickAccessCardProps {
    icon: string;
    label: string;
    color: string;
    onClick?: () => void;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export interface StatCardProps {
    icon: string;
    iconBg: string;
    label: string;
    value: string;
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
export interface Step {
    label: string;
    status: "completed" | "active" | "inactive";
}

export interface StepperProps {
    steps: Step[];
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    completed?: boolean;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    children: ReactNode;
}
