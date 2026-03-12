import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "../layout/AppLayout";
import AdminDashboard from "../pages/admin/deshboard";
import ProfessionalsPage from "../pages/admin/Professionals";
import ProfilePage from "../pages/admin/Profile";
import ReportsPage from "../pages/admin/Reports";
import SettingsPage from "../pages/admin/Settings";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PatientAccess from "../pages/Patient/Access";
import PatientDashboard from "../pages/Patient/deshboard";
import ProfessionalDashboard from "../pages/professional/deshboard";
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
import ReceptionDashboard from "../pages/reception/deshboard";
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
        {/* ─── Rotas públicas ─────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nao-autorizado" element={<Unauthorized />} />

        {/* ─── Registro (Paciente) ─────────────────────────────── */}
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

        {/* ─── Registro (Clínica) ──────────────────────────────── */}
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

        {/* ─── Rotas privadas (exigem autenticação) ───────────── */}
        <Route element={<PrivateRoutes />}>
          {/* Redireciona /dashboard para o dashboard correto da role */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* ── Paciente ── */}
          <Route element={<RoleGuard allowedRoles={[UserRole.PATIENT]} />}>
            <Route element={<AppLayout />}>
              <Route path="/paciente/dashboard" element={<PatientDashboard />} />
            </Route>
          </Route>

          {/* ── Recepção ── */}
          <Route element={<RoleGuard allowedRoles={[UserRole.RECEPTIONIST, UserRole.ADMIN]} />}>
            <Route element={<AppLayout />}>
              <Route path="/recepcao/dashboard" element={<ReceptionDashboard />} />
            </Route>
          </Route>

          {/* ── Profissional ── */}
          <Route element={<RoleGuard allowedRoles={[UserRole.PROFESSIONAL]} />}>
            <Route element={<AppLayout />}>
              <Route path="/profissional/dashboard" element={<ProfessionalDashboard />} />
            </Route>
          </Route>

          {/* ── Admin ── */}
          <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/profissional" element={<ProfessionalsPage />} />
              <Route path="/admin/profissional/dashboard" element={<ProfessionalsPage />} />
              <Route path="/admin/paciente/dashboard" element={<PatientDashboard />} />
              <Route path="/admin/relatorios" element={<ReportsPage />} />
              <Route path="/admin/configuracoes" element={<SettingsPage />} />
              <Route path="/admin/perfil" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>
        {/* ────────────────────────────────────────────────────── */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
