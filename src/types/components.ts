import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { ClinicalDocumentDetail, DocumentAttachment } from "./clinical-document";
import type { HistoricalItem } from "./dashboard";

// ─── ActionIconButton ─────────────────────────────────────────────────────────
export type ActionIconButtonVariant = "view" | "edit" | "delete";

export interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ActionIconButtonVariant;
  icon: ReactNode;
}

// ─── AlertItem ────────────────────────────────────────────────────────────────
export type AlertType = "warning" | "success" | "info";

export interface AlertItemProps {
  type: AlertType;
  icon: ReactNode | string;
  message: string;
}

// ─── AuthLayout ───────────────────────────────────────────────────────────────
export interface AuthLayoutProps {
  children: ReactNode;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export type BadgeVariant = "info" | "success" | "neutral" | "warning";

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

// ─── Toggle ───────────────────────────────────────────────────────────────────
export interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

// ─── QuickAccessCard ──────────────────────────────────────────────────────────
export interface QuickAccessCardProps {
  icon: ReactNode | string;
  label: string;
  color: string;
  onClick?: () => void;
}

// ─── GroupedBarChart ─────────────────────────────────────────────────────────
export interface BarSeries {
  dataKey: string;
  name: string;
  color: string;
  yAxisId?: "left" | "right";
}

export interface GroupedBarChartProps {
  data: object[];
  series: BarSeries[];
  leftFormatter?: (v: number) => string;
  rightFormatter?: (v: number) => string;
  height?: number;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export interface StatCardProps {
  icon: ReactNode | string;
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

// ─── Modal ────────────────────────────────────────────────────────────────────
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export type SkeletonVariant = "rect" | "text" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  variant?: SkeletonVariant;
}

// ─── AnnouncementModal ────────────────────────────────────────────────────────
export type DestType = "TODOS" | "PERFIL" | "PARTICULAR";

export interface UserResult {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (sent: number) => void;
}

// ─── DocumentAttachmentUpload ─────────────────────────────────────────────────
export interface DocumentAttachmentUploadProps {
  attachments: DocumentAttachment[];
  /** Se false, apenas visualização (sem upload/delete) */
  canEdit?: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: (attachmentId: string) => Promise<void>;
}

// ─── DocumentPrintLayout ──────────────────────────────────────────────────────
export interface DocumentPrintLayoutProps {
  doc: ClinicalDocumentDetail;
  children: ReactNode;
  /** Mostra linha de assinatura do paciente no rodapé */
  patientSignature?: boolean;
}
