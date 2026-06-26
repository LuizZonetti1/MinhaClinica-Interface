/**
 * Barrel de páginas públicas institucionais.
 * Cada sub-pasta contém seu próprio index.tsx com o componente específico.
 *
 * Estrutura:
 *   Funcionalidades/  -- Recursos da plataforma
 *   Precos/           -- Planos e modelo de cobrança
 *   Integracoes/      -- Conectores e API
 *   Seguranca/        -- Controles de segurança e LGPD
 *   Ajuda/            -- Central de Ajuda (guias por fluxo)
 *   Blog/             -- Conteúdo editorial
 *   Suporte/          -- Canal de atendimento técnico
 *   Sobre/            -- Missão, visão e time
 *   Contato/          -- Canais de contato por finalidade
 *   Privacidade/      -- Política de Privacidade (LGPD)
 *   Termos/           -- Termos de Uso
 *
 * Template compartilhado: ./PublicPage.tsx
 * Conteúdo por chave:     ./content.ts
 * Estilos:                ./styles.ts
 */

export { default as FuncionalidadesPage } from "./Funcionalidades";
export { default as PrecosPage } from "./Precos";
export { default as IntegracoesPage } from "./Integracoes";
export { default as SegurancaPage } from "./Seguranca";
export { default as AjudaPage } from "./Ajuda";
export { default as BlogPage } from "./Blog";
export { default as SuportePage } from "./Suporte";
export { default as SobrePage } from "./Sobre";
export { default as ContatoPage } from "./Contato";
export { default as PrivacidadePage } from "./Privacidade";
export { default as TermosPage } from "./Termos";
