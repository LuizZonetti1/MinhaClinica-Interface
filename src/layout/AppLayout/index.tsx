import {
  Bell,
  Briefcase,
  Building2,
  ChevronRight,
  LogOut,
  Moon,
  Pencil,
  Search,
  Sun,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth, useThemeMode } from "../../contexts";
import { getProfile } from "../../services/profile.service";
import { theme } from "../../themes/themes";
import type { BreadcrumbItem } from "../../types/layout";
import { Sidebar } from "../Sidebar";
import {
  BellWrapper,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbText,
  ContentArea,
  HeaderAvatar,
  HeaderRight,
  LayoutWrapper,
  MainContent,
  NotificationBadge,
  PageTitle,
  ProfileMenuActionButton,
  ProfileMenuActions,
  ProfileMenuAvatar,
  ProfileMenuCard,
  ProfileMenuHeader,
  ProfileMenuIdentity,
  ProfileMenuInfo,
  ProfileMenuName,
  ProfileMenuWrapper,
  SearchBox,
  ThemeToggleButton,
  TopBar,
} from "./styles";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Inicio",
  "/admin/profissional": "Profissionais",
  "/admin/profissional/dashboard": "Profissionais",
  "/admin/paciente/dashboard": "Pacientes",
  "/admin/relatorios": "Relatorios",
  "/admin/configuracoes": "Configuracoes",
  "/admin/perfil": "Meu Perfil",
  "/admin/perfil/editar": "Editar Perfil",
  "/paciente/dashboard": "Painel do Paciente",
  "/recepcao/dashboard": "Inicio",
  "/recepcao/marcar-consulta": "Marcar Consulta",
  "/recepcao/cadastrar-paciente": "Cadastrar Paciente",
  "/recepcao/agendas": "Ver Agendas",
  "/recepcao/checkin": "Check-in",
  "/recepcao/perfil": "Meu Perfil",
  "/profissional/dashboard": "Painel do Profissional",
};

const PAGE_BREADCRUMBS: Record<string, BreadcrumbItem> = {
  "/admin/profissional/dashboard": {
    parent: "Inicio",
    parentPath: "/admin/dashboard",
    current: "Profissionais",
    currentPath: "/admin/profissional",
  },
  "/admin/profissional": {
    parent: "Inicio",
    parentPath: "/admin/dashboard",
    current: "Profissionais",
    currentPath: "/admin/profissional",
  },
  "/admin/paciente/dashboard": {
    parent: "Inicio",
    parentPath: "/admin/dashboard",
    current: "Pacientes",
    currentPath: "/admin/paciente/dashboard",
  },
  "/admin/relatorios": {
    parent: "Inicio",
    parentPath: "/admin/dashboard",
    current: "Relatorios",
    currentPath: "/admin/relatorios",
  },
  "/admin/configuracoes": {
    parent: "Inicio",
    parentPath: "/admin/dashboard",
    current: "Configuracoes",
    currentPath: "/admin/configuracoes",
  },
  "/admin/perfil": {
    parent: "Inicio",
    parentPath: "/admin/dashboard",
    current: "Meu Perfil",
    currentPath: "/admin/perfil",
  },
  "/admin/perfil/editar": {
    grandParent: "Inicio",
    grandParentPath: "/admin/dashboard",
    parent: "Perfil",
    parentPath: "/admin/perfil",
    current: "Editar",
    currentPath: "/admin/perfil/editar",
  },
  "/recepcao/marcar-consulta": {
    parent: "Inicio",
    parentPath: "/recepcao/dashboard",
    current: "Marcar Consulta",
    currentPath: "/recepcao/marcar-consulta",
  },
  "/recepcao/cadastrar-paciente": {
    parent: "Inicio",
    parentPath: "/recepcao/dashboard",
    current: "Cadastrar Paciente",
    currentPath: "/recepcao/cadastrar-paciente",
  },
  "/recepcao/agendas": {
    parent: "Inicio",
    parentPath: "/recepcao/dashboard",
    current: "Ver Agendas",
    currentPath: "/recepcao/agendas",
  },
  "/recepcao/checkin": {
    parent: "Inicio",
    parentPath: "/recepcao/dashboard",
    current: "Check-in",
    currentPath: "/recepcao/checkin",
  },
  "/recepcao/perfil": {
    parent: "Inicio",
    parentPath: "/recepcao/dashboard",
    current: "Meu Perfil",
    currentPath: "/recepcao/perfil",
  },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const getRoleLabel = (role?: string) => {
  const labels: Record<string, string> = {
    ADMIN: "Administrador",
    PROFESSIONAL: "Profissional",
    RECEPTIONIST: "Recepcionista",
    PATIENT: "Paciente",
  };

  if (!role) return "Usuario";
  return labels[role] ?? role;
};

const toDash = (value?: string) => {
  if (!value) return "-";
  const normalized = value.trim();
  if (!normalized || normalized === "-") return "-";
  return normalized;
};

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl ?? "");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [staffRoleOrSpecialty, setStaffRoleOrSpecialty] = useState<string>("-");
  const [staffClinicName, setStaffClinicName] = useState<string>("-");

  const title = PAGE_TITLES[location.pathname] ?? "Dashboard";
  const breadcrumb = PAGE_BREADCRUMBS[location.pathname];

  useEffect(() => {
    setAvatarUrl(user?.avatarUrl ?? "");
  }, [user?.avatarUrl]);

  useEffect(() => {
    if (!user || user.role === "PATIENT" || user.role === "RECEPTIONIST") return;

    let cancelled = false;

    getProfile()
      .then((profile) => {
        if (cancelled) return;

        const nextName = profile.fullName !== "-" ? profile.fullName : user.name;
        const nextAvatarUrl = profile.avatarUrl.trim();
        const nextClinicRole = toDash(profile.clinicRole);
        const nextClinicName = toDash(profile.clinicName);
        setAvatarUrl(nextAvatarUrl);
        setStaffRoleOrSpecialty(nextClinicRole);
        setStaffClinicName(nextClinicName);

        if (nextName !== user.name || nextAvatarUrl !== (user.avatarUrl ?? "")) {
          setUser({
            ...user,
            name: nextName,
            avatarUrl: nextAvatarUrl || undefined,
          });
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current?.contains(event.target as Node)) return;
      setIsProfileMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const initials = useMemo(() => getInitials(user?.name ?? "U"), [user?.name]);
  const roleLabel = useMemo(() => getRoleLabel(user?.role), [user?.role]);
  const functionLabel = user?.role === "PROFESSIONAL" ? "Especializacao" : "Funcao";
  const functionValue = useMemo(() => {
    if (user?.role === "PROFESSIONAL") {
      if (staffRoleOrSpecialty !== "-") return staffRoleOrSpecialty;
      return "Profissional";
    }

    if (staffRoleOrSpecialty !== "-") return staffRoleOrSpecialty;
    return roleLabel;
  }, [roleLabel, staffRoleOrSpecialty, user?.role]);
  const clinicValue = staffClinicName !== "-" ? staffClinicName : "-";
  const profilePath =
    user?.role === "ADMIN"
      ? "/admin/perfil"
      : user?.role === "RECEPTIONIST"
        ? "/recepcao/perfil"
        : null;
  const editProfilePath = user?.role === "ADMIN" ? "/admin/perfil/editar" : null;

  const handleOpenProfile = () => {
    if (!profilePath) return;
    setIsProfileMenuOpen(false);
    navigate(profilePath);
  };

  const handleOpenEditProfile = () => {
    if (!editProfilePath) return;
    setIsProfileMenuOpen(false);
    navigate(editProfilePath);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const renderCrumb = (label: string, path: string | undefined, isCurrent = false) => {
    if (path) {
      return (
        <BreadcrumbLink to={path} $current={isCurrent}>
          {label}
        </BreadcrumbLink>
      );
    }

    return <BreadcrumbText $current={isCurrent}>{label}</BreadcrumbText>;
  };

  return (
    <LayoutWrapper>
      <Sidebar />

      <ContentArea>
        <TopBar>
          <PageTitle>
            {breadcrumb ? (
              <Breadcrumb>
                {breadcrumb.grandParent && (
                  <>
                    {renderCrumb(breadcrumb.grandParent, breadcrumb.grandParentPath)}
                    <ChevronRight size={14} color={theme.colors.text.muted} />
                  </>
                )}
                {renderCrumb(breadcrumb.parent, breadcrumb.parentPath)}
                <ChevronRight size={14} color={theme.colors.text.muted} />
                {renderCrumb(breadcrumb.current, breadcrumb.currentPath, true)}
              </Breadcrumb>
            ) : (
              title
            )}
          </PageTitle>
          <HeaderRight>
            <ThemeToggleButton
              type="button"
              onClick={toggleMode}
              title={mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              aria-label={mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {mode === "dark" ? <Sun /> : <Moon />}
            </ThemeToggleButton>
            <SearchBox>
              <Search />
              <span>Buscar...</span>
            </SearchBox>
            <BellWrapper>
              <Bell />
              <NotificationBadge>2</NotificationBadge>
            </BellWrapper>
            <ProfileMenuWrapper ref={profileMenuRef}>
              <HeaderAvatar
                type="button"
                $active={isProfileMenuOpen}
                title="Abrir menu do usuario"
                aria-label="Abrir menu do usuario"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              >
                {avatarUrl ? <img src={avatarUrl} alt="Foto do usuario" /> : <span>{initials}</span>}
              </HeaderAvatar>

              {isProfileMenuOpen && (
                <ProfileMenuCard role="menu" aria-label="Menu do usuario">
                  <ProfileMenuHeader>
                    <ProfileMenuAvatar
                      type="button"
                      onClick={handleOpenProfile}
                      disabled={!profilePath}
                      title="Abrir perfil"
                      aria-label="Abrir perfil"
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Foto de perfil" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </ProfileMenuAvatar>
                    <ProfileMenuIdentity>
                      <ProfileMenuName>{user?.name ?? "Usuario"}</ProfileMenuName>
                      <ProfileMenuInfo>
                        <Briefcase />
                        <span>
                          {functionLabel}: {functionValue}
                        </span>
                      </ProfileMenuInfo>
                      <ProfileMenuInfo>
                        <Building2 />
                        <span>Clinica: {clinicValue}</span>
                      </ProfileMenuInfo>
                    </ProfileMenuIdentity>
                  </ProfileMenuHeader>

                  <ProfileMenuActions>
                    <ProfileMenuActionButton
                      type="button"
                      onClick={handleOpenEditProfile}
                      disabled={!editProfilePath}
                    >
                      <Pencil />
                      Editar perfil
                    </ProfileMenuActionButton>
                    <ProfileMenuActionButton type="button" onClick={handleLogout} $danger>
                      <LogOut />
                      Sair
                    </ProfileMenuActionButton>
                  </ProfileMenuActions>
                </ProfileMenuCard>
              )}
            </ProfileMenuWrapper>
          </HeaderRight>
        </TopBar>

        <MainContent>
          <Outlet />
        </MainContent>
      </ContentArea>
    </LayoutWrapper>
  );
};
