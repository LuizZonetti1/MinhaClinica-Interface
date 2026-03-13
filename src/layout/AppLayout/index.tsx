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
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { useAuth, useThemeMode } from "../../contexts";
import { getProfile } from "../../services/profile.service";
import { theme } from "../../themes/themes";
import type { BreadcrumbItem } from "../../types/layout";
import { Sidebar } from "../Sidebar";

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
  "/recepcao/dashboard": "Recepcao",
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
};

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: ${theme.colors.background};
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border.lighter};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const PageTitle = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

const Breadcrumb = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const BreadcrumbText = styled.span<{ $current?: boolean }>`
  color: ${({ $current }) => ($current ? theme.colors.text.primary : theme.colors.text.muted)};
  font-weight: ${({ $current }) => ($current ? 600 : 400)};
`;

const BreadcrumbLink = styled(Link)<{ $current?: boolean }>`
  text-decoration: none;
  color: ${({ $current }) => ($current ? theme.colors.text.primary : theme.colors.text.muted)};
  font-weight: ${({ $current }) => ($current ? 600 : 400)};
  transition: color 0.15s;

  &:hover {
    color: ${theme.colors.text.link};
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  padding: 0 12px;
  height: 36px;
  min-width: 280px;

  svg {
    width: 18px;
    height: 18px;
    color: ${theme.colors.text.muted};
  }

  span {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    color: ${theme.colors.text.disabled};
  }
`;

const BellWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  border: 1.5px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s;

  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.text.secondary};
  }

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }
`;

const ThemeToggleButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1.5px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #ef4444;
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 10px;
  font-weight: 700;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileMenuWrapper = styled.div`
  position: relative;
`;

const HeaderAvatar = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border.light};
  background-color: ${theme.colors.primaryHover};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: ${({ $active }) => ($active ? `0 0 0 2px ${theme.colors.border.focus}` : "none")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-family: "Roboto", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: white;
  }
`;

const ProfileMenuCard = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 300px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  overflow: hidden;
  z-index: 20;
`;

const ProfileMenuHeader = styled.div`
  padding: 14px;
  display: flex;
  gap: 10px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
`;

const ProfileMenuAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border.light};
  background-color: ${theme.colors.primaryHover};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: ${theme.colors.text.inverse};
  }
`;

const ProfileMenuIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const ProfileMenuName = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: ${theme.colors.text.primary};
  margin: 0;
  word-break: break-word;
`;

const ProfileMenuInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.text.secondary};

  span {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    line-height: 1.3;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

const ProfileMenuActions = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProfileMenuActionButton = styled.button<{ $danger?: boolean }>`
  width: 100%;
  border: none;
  background: transparent;
  border-radius: ${theme.borderRadius.sm};
  height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? theme.colors.error : theme.colors.text.primary)};
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
`;

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
    if (!user || user.role === "PATIENT") return;

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
  const editProfilePath = user?.role === "ADMIN" ? "/admin/perfil/editar" : null;

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
                    <ProfileMenuAvatar>
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
