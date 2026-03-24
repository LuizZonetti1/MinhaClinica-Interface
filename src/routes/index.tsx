import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ProfessionalAgendaProvider, ThemeModeProvider } from "../contexts";
import { AppLayout } from "../layout/AppLayout";
import AdminDashboard from "../pages/admin/deshboard";
import EditProfilePage from "../pages/admin/EditProfile";
import PatientsPage from "../pages/admin/Patients";
import ProfessionalsPage from "../pages/admin/Professionals";
import ProfilePage from "../pages/admin/Profile";
import ReportsPage from "../pages/admin/Reports";
import SettingsPage from "../pages/admin/Settings";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PatientAccess from "../pages/Patient/Access";
import PatientAppointmentsPage from "../pages/Patient/Agendamentos";
import PatientDashboard from "../pages/Patient/deshboard";
import PatientHistoryPage from "../pages/Patient/Historico";
import PatientNotificationsPage from "../pages/Patient/Notificacoes";
import PatientProfilePage from "../pages/Patient/Profile";
import ProfessionalAgendaPage from "../pages/professional/Agenda";
import ProfessionalCommentsPage from "../pages/professional/Comments";
import ProfessionalDashboard from "../pages/professional/deshboard";
import ProfessionalEditProfilePage from "../pages/professional/EditProfile";
import ProfessionalProfilePage from "../pages/professional/Profile";
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
import ReceptionAgendasPage from "../pages/reception/Agendas";
import ReceptionCadastrarPacientePage from "../pages/reception/CadastrarPaciente";
import ReceptionCheckinPage from "../pages/reception/Checkin";
import ReceptionDashboard from "../pages/reception/deshboard";
import ReceptionEditProfilePage from "../pages/reception/EditProfile";
import ReceptionMarcarConsultaPage from "../pages/reception/MarcarConsulta";
import ReceptionProfilePage from "../pages/reception/Profile";
import { Unauthorized } from "../pages/Unauthorized";
import { UserRole } from "../types/enums";
import { ClinicRegisterCompleteGuard } from "./ClinicRegisterCompleteGuard";
import { PrivateRoutes } from "./PrivateRoutes";
import { ProfessionalRegisterCompleteGuard } from "./ProfessionalRegisterCompleteGuard";
import { ReceptionRegisterCompleteGuard } from "./ReceptionRegisterCompleteGuard";
import { RegisterCompleteGuard } from "./RegisterCompleteGuard";
import { RoleGuard } from "./RoleGuard";
import { RoleRedirect } from "./RoleRedirect";

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
              <Route path="/profissional/perfil" element={<ProfessionalProfilePage />} />
              <Route path="/profissional/perfil/editar" element={<ProfessionalEditProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
