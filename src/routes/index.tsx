import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "../layout/AppLayout";
import AdminDashboard from "../pages/admin/deshboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PatientAccess from "../pages/Patient/Access";
import PatientDashboard from "../pages/Patient/deshboard";
import ProfessionalDashboard from "../pages/professional/deshboard";
import RegisterComplete from "../pages/Register/Complete";
import CompleteRedirect from "../pages/Register/CompleteRedirect";
import RegisterStart from "../pages/Register/Start";
import RegisterVerify from "../pages/Register/Verify";
import ReceptionDashboard from "../pages/reception/deshboard";
import { Unauthorized } from "../pages/Unauthorized";
import { UserRole } from "../types/enums";
import { PrivateRoutes } from "./PrivateRoutes";
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

        {/* ─── Registro ───────────────────────────────────────── */}
        <Route path="/paciente/acesso" element={<PatientAccess />} />
        <Route path="/registro/inicial" element={<RegisterStart />} />
        <Route path="/registro/verificar" element={<RegisterVerify />} />
        <Route path="/verify-email" element={<RegisterVerify />} />
        <Route path="/completar-cadastro" element={<CompleteRedirect />} />
        <Route
          path="/registro/completo"
          element={
            <RegisterCompleteGuard>
              <RegisterComplete />
            </RegisterCompleteGuard>
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
          <Route element={<RoleGuard allowedRoles={[UserRole.PROFESSIONAL, UserRole.ADMIN]} />}>
            <Route element={<AppLayout />}>
              <Route path="/profissional/dashboard" element={<ProfessionalDashboard />} />
            </Route>
          </Route>

          {/* ── Admin ── */}
          <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
