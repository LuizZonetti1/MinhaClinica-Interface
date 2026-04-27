import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  path: string;
  icon: LucideIcon;
  altPaths?: string[];
}

export interface BreadcrumbItem {
  grandParent?: string;
  grandParentPath?: string;
  parent: string;
  parentPath?: string;
  current: string;
  currentPath?: string;
}
