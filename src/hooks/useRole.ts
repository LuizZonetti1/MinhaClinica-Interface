import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types/enums";

/**
 * Hook para verificar se o usuário é um paciente
 * @returns true se o usuário logado é um paciente
 */
export function useIsPatient(): boolean {
    const { isPatient } = useAuth();
    return isPatient();
}

/**
 * Hook para verificar se o usuário é um recepcionista
 * @returns true se o usuário logado é um recepcionista
 */
export function useIsReceptionist(): boolean {
    const { isReceptionist } = useAuth();
    return isReceptionist();
}

/**
 * Hook para verificar se o usuário é um profissional
 * @returns true se o usuário logado é um profissional
 */
export function useIsProfessional(): boolean {
    const { isProfessional } = useAuth();
    return isProfessional();
}

/**
 * Hook para verificar se o usuário é um administrador/dono
 * @returns true se o usuário logado é um administrador
 */
export function useIsAdmin(): boolean {
    const { isAdmin } = useAuth();
    return isAdmin();
}

/**
 * Hook para verificar se o usuário tem um papel específico
 * @param role - O papel a ser verificado
 * @returns true se o usuário tem o papel especificado
 */
export function useHasRole(role: UserRole): boolean {
    const { hasRole } = useAuth();
    return hasRole(role);
}

/**
 * Hook para obter o papel do usuário atual
 * @returns O papel do usuário ou null se não autenticado
 */
export function useUserRole(): UserRole | null {
    const { user } = useAuth();
    return user?.role ?? null;
}
