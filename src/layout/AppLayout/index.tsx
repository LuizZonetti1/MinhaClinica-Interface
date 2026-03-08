import { ChevronRight } from 'lucide-react';
import { Outlet, useLocation } from 'react-router';
import styled from 'styled-components';
import { theme } from '../../themes/themes';
import { Sidebar } from '../Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Inicio',
  '/admin/profissional': 'Profissionais',
  '/admin/profissional/dashboard': 'Profissionais',
  '/admin/paciente/dashboard': 'Pacientes',
  '/admin/relatorios': 'Relatorios',
  '/admin/configuracoes': 'Configuracoes',
  '/admin/perfil': 'Perfil',
  '/paciente/dashboard': 'Painel do Paciente',
  '/recepcao/dashboard': 'Recepcao',
  '/profissional/dashboard': 'Painel do Profissional',
};

interface BreadcrumbItem {
  parent: string;
  current: string;
}

const PAGE_BREADCRUMBS: Record<string, BreadcrumbItem> = {
  '/admin/profissional/dashboard': {
    parent: 'Inicio',
    current: 'Profissionais',
  },
  '/admin/profissional': {
    parent: 'Inicio',
    current: 'Profissionais',
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
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

const Breadcrumb = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const BreadcrumbMuted = styled.span`
  color: ${theme.colors.text.muted};
  font-weight: 400;
`;

const BreadcrumbCurrent = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: 600;
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

  img {
    width: 18px;
    height: 18px;
    opacity: 0.5;
  }

  span {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: ${theme.colors.text.disabled};
  }
`;

const BellWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #ef4444;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  font-weight: 700;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${theme.colors.primaryHover};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  span {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: white;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
`;

export const AppLayout = () => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'Dashboard';
  const breadcrumb = PAGE_BREADCRUMBS[location.pathname];

  return (
    <LayoutWrapper>
      <Sidebar />

      <ContentArea>
        <TopBar>
          <PageTitle>
            {breadcrumb ? (
              <Breadcrumb>
                <BreadcrumbMuted>{breadcrumb.parent}</BreadcrumbMuted>
                <ChevronRight size={14} color={theme.colors.text.muted} />
                <BreadcrumbCurrent>{breadcrumb.current}</BreadcrumbCurrent>
              </Breadcrumb>
            ) : (
              title
            )}
          </PageTitle>
          <HeaderRight>
            <SearchBox>
              <img src="/icons/search.svg" alt="Buscar" />
              <span>Buscar...</span>
            </SearchBox>
            <BellWrapper>
              <img src="/icons/notification.svg" alt="Notificacoes" />
              <NotificationBadge>2</NotificationBadge>
            </BellWrapper>
            <HeaderAvatar>
              <span>RL</span>
            </HeaderAvatar>
          </HeaderRight>
        </TopBar>

        <MainContent>
          <Outlet />
        </MainContent>
      </ContentArea>
    </LayoutWrapper>
  );
};
