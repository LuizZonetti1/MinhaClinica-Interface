import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts";
import type { UserRole } from "../types/enums";

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

/**
 * Wrapper de rota que exige um papel específico.
 * Deve ser usado dentro de <PrivateRoutes />.
 * Se o usuário não tiver o papel exigido, redireciona para /nao-autorizado.
 *
 * <Route element={<PrivateRoutes />}>
 *   <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
 *     <Route element={<AppLayout />}>
 *       <Route path="/admin/dashboard" element={<AdminDashboard />} />
 *     </Route>
 *   </Route>
 * </Route>
 */
export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/nao-autorizado" replace />;

  const userRoles = user.roles ?? [user.role];
  if (!userRoles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/nao-autorizado" replace />;
  }

  return <Outlet />;
};
