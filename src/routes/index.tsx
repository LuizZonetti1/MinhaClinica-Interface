import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ProfessionalAgendaProvider, ThemeModeProvider } from "../contexts";
import { AppLayout } from "../layout/AppLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import EditProfilePage from "../pages/Admin/EditProfile";
import PatientsPage from "../pages/Admin/Patients";
import ProfessionalsPage from "../pages/Admin/Professionals";
import ProfilePage from "../pages/Admin/Profile";
import ReportsPage from "../pages/Admin/Reports";
import SettingsPage from "../pages/Admin/Settings";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PatientAccess from "../pages/Patient/Access";
import PatientAppointmentsPage from "../pages/Patient/Agendamentos";
import PatientDashboard from "../pages/Patient/Dashboard";
import PatientEditProfilePage from "../pages/Patient/EditProfile";
import PatientHistoryPage from "../pages/Patient/Historico";
import PatientNotificationsPage from "../pages/Patient/Notificacoes";
import PatientProfilePage from "../pages/Patient/Profile";
import ProfessionalAgendaPage from "../pages/Professional/Agenda";
import ProfessionalCommentsPage from "../pages/Professional/Comments";
import ProfessionalDashboard from "../pages/Professional/Dashboard";
import ProfessionalDocumentosPage from "../pages/Professional/Documentos";
import ProfessionalDocumentoFormPage from "../pages/Professional/Documentos/Form";
import ProfessionalDocumentoViewPage from "../pages/Professional/Documentos/View";
import ProfessionalEditProfilePage from "../pages/Professional/EditProfile";
import ProfessionalProfilePage from "../pages/Professional/Profile";
import ReceptionAgendasPage from "../pages/Reception/Agendas";
import ReceptionCadastrarPacientePage from "../pages/Reception/CadastrarPaciente";
import ReceptionCheckinPage from "../pages/Reception/Checkin";
import ReceptionDashboard from "../pages/Reception/Dashboard";
import ReceptionEditProfilePage from "../pages/Reception/EditProfile";
import ReceptionHistoricoPage from "../pages/Reception/Historico";
import ReceptionMarcarConsultaPage from "../pages/Reception/MarcarConsulta";
import ReceptionProfilePage from "../pages/Reception/Profile";
import ReceptionTransacoesPage from "../pages/Reception/Transacoes";
import RegisterComplete from "../pages/Register/Complete";
import CompleteRedirect from "../pages/Register/CompleteRedirect";
import RegisterStart from "../pages/Register/Start";
import RegisterVerify from "../pages/Register/Verify";
import RegisterClinicComplete from "../pages/RegisterClinic/Complete";
import ClinicCompleteRedirect from "../pages/RegisterClinic/CompleteRedirect";
import RegisterClinicStart from "../pages/RegisterClinic/Start";
import RegisterClinicVerify from "../pages/RegisterClinic/Verify";
import RegisterProfessionalComplete from "../pages/RegisterProfessional/Complete";
import RegisterReceptionComplete from "../pages/RegisterReception/Complete";
import { Unauthorized } from "../pages/Unauthorized";
import { UserRole } from "../types/enums";
import { ClinicRegisterCompleteGuard } from "./ClinicRegisterCompleteGuard";
import { PrivateRoutes } from "./PrivateRoutes";
import { ProfessionalRegisterCompleteGuard } from "./ProfessionalRegisterCompleteGuard";
import { ReceptionRegisterCompleteGuard } from "./ReceptionRegisterCompleteGuard";
import { RegisterCompleteGuard } from "./RegisterCompleteGuard";
import { RoleGuard } from "./RoleGuard";
import { RoleRedirect } from "./RoleRedirect";

/**
 * Compatibilidade temporaria para links/bookmarks legados.
 * Remover apos: 2026-09-30.
 */
const LEGACY_DASHBOARD_ROUTE_ALIASES: ReadonlyArray<{ from: string; to: string }> = [
  { from: "/admin/deshboard", to: "/admin/dashboard" },
  { from: "/paciente/deshboard", to: "/paciente/dashboard" },
  { from: "/recepcao/deshboard", to: "/recepcao/dashboard" },
  { from: "/profissional/deshboard", to: "/profissional/dashboard" },
  { from: "/patient/dashboard", to: "/paciente/dashboard" },
  { from: "/professional/dashboard", to: "/profissional/dashboard" },
  { from: "/reception/dashboard", to: "/recepcao/dashboard" },
];

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nao-autorizado" element={<Unauthorized />} />

        {/* Patient register */}
        <Route path="/paciente/acesso" element={<PatientAccess />} />
        <Route path="/registro/inicial" element={<RegisterStart />} />
        <Route path="/registro/verificar" element={<RegisterVerify />} />
        <Route path="/verify-email" element={<RegisterVerify />} />
        <Route path="/completar-cadastro" element={<CompleteRedirect />} />
        <Route path="/profissional/completar-cadastro" element={<CompleteRedirect />} />
        <Route path="/recepcao/completar-cadastro" element={<CompleteRedirect />} />
        <Route
          path="/registro/completo"
          element={
            <RegisterCompleteGuard>
              <RegisterComplete />
            </RegisterCompleteGuard>
          }
        />

        {/* Clinic register */}
        <Route path="/clinica/registro/inicial" element={<RegisterClinicStart />} />
        <Route path="/clinica/registro/verificar" element={<RegisterClinicVerify />} />
        <Route path="/clinica/verify-email" element={<RegisterClinicVerify />} />
        <Route path="/clinica/completar-cadastro" element={<ClinicCompleteRedirect />} />
        <Route
          path="/clinica/registro/completo"
          element={
            <ClinicRegisterCompleteGuard>
              <RegisterClinicComplete />
            </ClinicRegisterCompleteGuard>
          }
        />
        <Route
          path="/profissional/registro/completo"
          element={
            <ProfessionalRegisterCompleteGuard>
              <RegisterProfessionalComplete />
            </ProfessionalRegisterCompleteGuard>
          }
        />
        <Route
          path="/recepcao/registro/completo"
          element={
            <ReceptionRegisterCompleteGuard>
              <RegisterReceptionComplete />
            </ReceptionRegisterCompleteGuard>
          }
        />

        {/* Private routes */}
        <Route
          element={
            <ThemeModeProvider>
              <PrivateRoutes />
            </ThemeModeProvider>
          }
        >
          <Route path="/dashboard" element={<RoleRedirect />} />
          {LEGACY_DASHBOARD_ROUTE_ALIASES.map((alias) => (
            <Route
              key={alias.from}
              path={alias.from}
              element={<Navigate to={alias.to} replace />}
            />
          ))}

          <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/profissional" element={<ProfessionalsPage />} />
              <Route path="/admin/paciente/dashboard" element={<PatientsPage />} />
              <Route path="/admin/relatorios" element={<ReportsPage />} />
              <Route path="/admin/configuracoes" element={<SettingsPage />} />
              <Route path="/admin/perfil" element={<ProfilePage />} />
              <Route path="/admin/perfil/editar" element={<EditProfilePage />} />
            </Route>
          </Route>

          <Route element={<RoleGuard allowedRoles={[UserRole.PATIENT]} />}>
            <Route element={<AppLayout />}>
              <Route path="/paciente/dashboard" element={<PatientDashboard />} />
              <Route path="/paciente/agendamentos" element={<PatientAppointmentsPage />} />
              <Route path="/paciente/historico" element={<PatientHistoryPage />} />
              <Route path="/paciente/notificacoes" element={<PatientNotificationsPage />} />
              <Route path="/paciente/perfil" element={<PatientProfilePage />} />
              <Route path="/paciente/perfil/editar" element={<PatientEditProfilePage />} />
            </Route>
          </Route>

          <Route element={<RoleGuard allowedRoles={[UserRole.RECEPTIONIST]} />}>
            <Route element={<AppLayout />}>
              <Route path="/recepcao/dashboard" element={<ReceptionDashboard />} />
              <Route path="/recepcao/marcar-consulta" element={<ReceptionMarcarConsultaPage />} />
              <Route
                path="/recepcao/cadastrar-paciente"
                element={<ReceptionCadastrarPacientePage />}
              />
              <Route path="/recepcao/agendas" element={<ReceptionAgendasPage />} />
              <Route path="/recepcao/checkin" element={<ReceptionCheckinPage />} />
              <Route path="/recepcao/historico" element={<ReceptionHistoricoPage />} />
              <Route path="/recepcao/transacoes" element={<ReceptionTransacoesPage />} />
              <Route path="/recepcao/perfil" element={<ReceptionProfilePage />} />
              <Route path="/recepcao/perfil/editar" element={<ReceptionEditProfilePage />} />
            </Route>
          </Route>

          <Route element={<RoleGuard allowedRoles={[UserRole.PROFESSIONAL]} />}>
            <Route element={<AppLayout />}>
              <Route path="/profissional/dashboard" element={<ProfessionalDashboard />} />
              <Route
                path="/profissional/agenda"
                element={
                  <ProfessionalAgendaProvider>
                    <ProfessionalAgendaPage />
                  </ProfessionalAgendaProvider>
                }
              />
              <Route path="/profissional/comentarios" element={<ProfessionalCommentsPage />} />
              <Route path="/profissional/documentos" element={<ProfessionalDocumentosPage />} />
              <Route
                path="/profissional/documentos/formulario"
                element={<ProfessionalDocumentoFormPage />}
              />
              <Route
                path="/profissional/documentos/visualizar"
                element={<ProfessionalDocumentoViewPage />}
              />
              <Route path="/profissional/perfil" element={<ProfessionalProfilePage />} />
              <Route path="/profissional/perfil/editar" element={<ProfessionalEditProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
