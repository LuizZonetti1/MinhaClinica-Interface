import {
  BarChart2,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts";
import type { NavLink } from "../../types/layout";
import {
  Avatar,
  LogoIconWrapper,
  LogoRow,
  LogoText,
  LogoutButton,
  Nav,
  NavItem,
  SidebarWrapper,
  UserInfo,
  UserName,
  UserRole,
  UserRow,
  UserSection,
} from "./styles";

const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "Início", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Profissionais", path: "/admin/profissional", icon: Stethoscope },
  { label: "Pacientes", path: "/admin/paciente/dashboard", icon: Users },
  { label: "Relatórios", path: "/admin/relatorios", icon: BarChart2 },
  { label: "Configurações", path: "/admin/configuracoes", icon: Settings },
  { label: "Perfil", path: "/admin/perfil", icon: User },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    ADMIN: "Proprietário",
    PROFESSIONAL: "Profissional",
    RECEPTIONIST: "Recepcionista",
    PATIENT: "Paciente",
  };
  return labels[role] ?? role;
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user ? getInitials(user.name) : "U";
  const roleLabel = user ? getRoleLabel(user.role) : "";

  return (
    <SidebarWrapper>
      <LogoRow>
        <LogoIconWrapper>
          <Stethoscope size={18} />
        </LogoIconWrapper>
        <LogoText>Minha Clínica</LogoText>
      </LogoRow>

      <Nav>
        {ADMIN_NAV_LINKS.map((link) => (
          <NavItem key={link.path} to={link.path} end={link.path === "/admin/dashboard"}>
            <link.icon size={20} />
            {link.label}
          </NavItem>
        ))}
      </Nav>

      <UserSection>
        <UserRow>
          <Avatar>
            <span>{initials}</span>
          </Avatar>
          <UserInfo>
            <UserName>{user?.name ?? "Usuário"}</UserName>
            <UserRole>{roleLabel}</UserRole>
          </UserInfo>
        </UserRow>

        <LogoutButton type="button" onClick={handleLogout}>
          <LogOut size={16} />
          Sair
        </LogoutButton>
      </UserSection>
    </SidebarWrapper>
  );
};
