import type { LucideIcon } from "lucide-react";

export interface NavLink {
    label: string;
    path: string;
    icon: LucideIcon;
}

export interface BreadcrumbItem {
    parent: string;
    current: string;
}
