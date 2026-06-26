import PublicPage from "../PublicPage";

/**
 * Página pública — Segurança
 *
 * Explica os controles de segurança da plataforma:
 * autenticação com JWT + 2FA, proteção de dados (LGPD),
 * permissões por perfil, infraestrutura cloud e auditoria.
 *
 * Acesso público em: /seguranca
 */
const SegurancaPage = () => <PublicPage pageKey="seguranca" />;

export default SegurancaPage;
