import {
  BarChart2,
  CalendarCheck2,
  CalendarPlus2,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts";
import { UserRole } from "../../types/enums";
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
  UserRole as UserRoleLabel,
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

const RECEPTION_NAV_LINKS: NavLink[] = [
  { label: "Início", path: "/recepcao/dashboard", icon: LayoutDashboard },
  { label: "Marcar Consulta", path: "/recepcao/marcar-consulta", icon: CalendarPlus2 },
  { label: "Cadastrar Paciente", path: "/recepcao/cadastrar-paciente", icon: UserPlus },
  { label: "Ver Agendas", path: "/recepcao/agendas", icon: CalendarCheck2 },
  { label: "Check-in", path: "/recepcao/checkin", icon: ClipboardCheck },
  { label: "Perfil", path: "/recepcao/perfil", icon: User },
];

const PROFESSIONAL_NAV_LINKS: NavLink[] = [
  { label: "Início", path: "/profissional/dashboard", icon: LayoutDashboard },
];

const PATIENT_NAV_LINKS: NavLink[] = [
  { label: "Início", path: "/paciente/dashboard", icon: LayoutDashboard },
];

const getRoleNavLinks = (role?: string): NavLink[] => {
  switch (role) {
    case UserRole.ADMIN:
      return ADMIN_NAV_LINKS;
    case UserRole.RECEPTIONIST:
      return RECEPTION_NAV_LINKS;
    case UserRole.PROFESSIONAL:
      return PROFESSIONAL_NAV_LINKS;
    case UserRole.PATIENT:
      return PATIENT_NAV_LINKS;
    default:
      return [];
  }
};

const getProfilePathByRole = (role?: string): string | null => {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin/perfil";
    case UserRole.RECEPTIONIST:
      return "/recepcao/perfil";
    default:
      return null;
  }
};

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

  const navLinks = getRoleNavLinks(user?.role);
  const profilePath = getProfilePathByRole(user?.role);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user ? getInitials(user.name) : "U";
  const roleLabel = user ? getRoleLabel(user.role) : "";
  const avatarUrl = user?.avatarUrl?.trim() ?? "";

  return (
    <SidebarWrapper>
      <LogoRow>
        <LogoIconWrapper>
          <Stethoscope size={18} />
        </LogoIconWrapper>
        <LogoText>Minha Clínica</LogoText>
      </LogoRow>

      <Nav>
        {navLinks.map((link) => (
          <NavItem key={link.path} to={link.path} end={link.path.endsWith("/dashboard")}>
            <link.icon size={20} />
            {link.label}
          </NavItem>
        ))}
      </Nav>

      <UserSection>
        <UserRow
          type="button"
          onClick={() => profilePath && navigate(profilePath)}
          aria-label="Abrir perfil"
          disabled={!profilePath}
        >
          <Avatar>
            {avatarUrl ? (
              <img src={avatarUrl} alt={`Foto de ${user?.name ?? "Usuário"}`} />
            ) : (
              <span>{initials}</span>
            )}
          </Avatar>
          <UserInfo>
            <UserName>{user?.name ?? "Usuário"}</UserName>
            <UserRoleLabel>{roleLabel}</UserRoleLabel>
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
