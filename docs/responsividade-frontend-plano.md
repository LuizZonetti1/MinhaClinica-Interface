# Plano de Responsividade - Frontend MinhaClinica

Status: `draft para validacao`
Escopo: `todas as telas mapeadas em src/routes/index.tsx`

## 1) Objetivo

Padronizar responsividade de todas as telas (publicas e privadas) mantendo o visual atual, reduzindo quebra de layout em mobile e tablet, e criando uma base reutilizavel para telas novas.

## 2) Breakpoints de trabalho

- `mobile-sm`: `<= 480px`
- `mobile`: `<= 768px`
- `tablet`: `769px a 1024px`
- `desktop`: `>= 1025px`

## 3) Fundacao global (antes das telas)

1. `AppLayout`:
- Sidebar fixa em desktop.
- Sidebar em drawer no mobile.
- TopBar com busca simplificada no mobile.
- Breadcrumb com truncamento e quebra controlada.

2. `Sidebar`:
- Versao compacta (icone + tooltip) em tablet.
- Versao drawer em mobile com overlay e botao de fechar.
- Scroll interno e area de usuario fixa no rodape.

3. Containers e espacamentos:
- Padrao de padding por breakpoint:
`32px` desktop, `24px` tablet, `16px` mobile.
- Remover alturas fixas desnecessarias, privilegiar `min-height`.

4. Componentes base:
- Tabelas com wrapper horizontal (`overflow-x: auto`).
- Grids com colunas fluidas (`repeat(auto-fit, minmax(...))`).
- Formularios com colunas progressivas (2->1 no mobile).
- Botoes/inputs com altura minima de toque no mobile (`>= 40px`).

## 4) Templates responsivos (reuso por tipo de tela)

- `T1 Auth/Cadastro`: formularios centrados, largura maxima, CTA full-width no mobile.
- `T2 Dashboard`: cards e KPIs em grid responsivo, blocos empilhados no mobile.
- `T3 Lista/Tabela`: filtros empilhados, tabela com scroll horizontal, acoes com wrap.
- `T4 Formulario longo`: secoes em cards, grids 2/3 colunas para 1 coluna no mobile.
- `T5 Perfil`: cabecalho de perfil adaptativo, secoes stack no mobile.
- `T6 Notificacoes`: lista vertical com densidade menor no mobile.
- `T7 Documentos`: area principal fluida, painel/acoes responsivo, impressao preservada.
- `T8 Redirect/guard`: telas simples centralizadas, sem overflow.

## 5) Matriz completa de telas

## 5.1 Publicas e autenticacao

| Rota | Componente | Template | Foco responsivo |
|---|---|---|---|
| `/` | `Home` | `T1` | Hero e secoes com stack em mobile |
| `/login` | `Login` | `T1` | Card fluido, campos full-width, links sem sobreposicao |
| `/nao-autorizado` | `Unauthorized` | `T8` | Conteudo central + botoes com wrap |
| `/paciente/acesso` | `PatientAccess` | `T1` | Formulario e CTA com largura fluida |
| `/registro/inicial` | `RegisterStart` | `T1` | Etapas e campos em 1 coluna no mobile |
| `/registro/verificar` | `RegisterVerify` | `T1` | Inputs de codigo/email sem quebra |
| `/verify-email` | `RegisterVerify` | `T1` | Mesmo comportamento da tela acima |
| `/completar-cadastro` | `CompleteRedirect` | `T8` | Tela de transicao sem overflow |
| `/profissional/completar-cadastro` | `CompleteRedirect` | `T8` | Tela de transicao sem overflow |
| `/recepcao/completar-cadastro` | `CompleteRedirect` | `T8` | Tela de transicao sem overflow |
| `/registro/completo` | `RegisterComplete` | `T4` | Tabs e blocos empilhados no mobile |
| `/clinica/registro/inicial` | `RegisterClinicStart` | `T4` | Multietapas responsivo |
| `/clinica/registro/verificar` | `RegisterClinicVerify` | `T1` | Verificacao com campos fluidos |
| `/clinica/verify-email` | `RegisterClinicVerify` | `T1` | Mesmo comportamento da tela acima |
| `/clinica/completar-cadastro` | `ClinicCompleteRedirect` | `T8` | Tela de transicao sem overflow |
| `/clinica/registro/completo` | `RegisterClinicComplete` | `T4` | Formularios e secoes stack |
| `/profissional/registro/completo` | `RegisterProfessionalComplete` | `T4` | Formulario com grids adaptativos |
| `/recepcao/registro/completo` | `RegisterReceptionComplete` | `T4` | Formulario com grids adaptativos |

## 5.2 Rotas privadas gerais

| Rota | Componente | Template | Foco responsivo |
|---|---|---|---|
| `/dashboard` | `RoleRedirect` | `T8` | Redirecionamento sem flicker visual |

## 5.3 Admin

| Rota | Componente | Template | Foco responsivo |
|---|---|---|---|
| `/admin/dashboard` | `AdminDashboard` | `T2` | KPIs, chart card e quick actions |
| `/admin/profissional` | `ProfessionalsPage` | `T3` | Lista/filtros e acoes |
| `/admin/paciente/dashboard` | `PatientsPage` | `T3` | Lista/filtros e paginacao |
| `/admin/relatorios` | `ReportsPage` | `T3` | Filtros + visualizacao de relatorios |
| `/admin/documentos` | `AdminDocumentosPage` | `T3` | Tabela de documentos com scroll |
| `/admin/documentos/visualizar` | `ProfessionalDocumentoViewPage` | `T7` | Visualizacao legivel em mobile |
| `/admin/configuracoes` | `SettingsPage` | `T4` | Blocos de configuracao com stack |
| `/admin/notificacoes` | `AdminNotificationsPage` | `T6` | Lista e acoes por item |
| `/admin/perfil` | `ProfilePage` | `T5` | Header de perfil responsivo |
| `/admin/perfil/editar` | `EditProfilePage` | `T4` | Upload avatar + form grid 2->1 |

## 5.4 Paciente

| Rota | Componente | Template | Foco responsivo |
|---|---|---|---|
| `/paciente/dashboard` | `PatientDashboard` | `T2` | Cards de resumo e proximas acoes |
| `/paciente/agendamentos` | `PatientAppointmentsPage` | `T3` | Filtros e lista de agendamentos |
| `/paciente/historico` | `PatientHistoryPage` | `T3` | Cards/lista com informacoes densas |
| `/paciente/documentos` | `PatientDocumentosPage` | `T3` | Tabela/lista de documentos |
| `/paciente/documentos/visualizar` | `PatientDocumentoViewPage` | `T7` | Visualizador responsivo |
| `/paciente/notificacoes` | `PatientNotificationsPage` | `T6` | Lista e marcacao de leitura |
| `/paciente/clinicas` | `PatientClinicsPage` | `T3` | Cards/grid de clinicas |
| `/paciente/clinicas/:clinicId/profissionais` | `PatientClinicProfessionalsPage` | `T3` | Cards/lista de profissionais |
| `/paciente/perfil` | `PatientProfilePage` | `T5` | Dados pessoais e secoes |
| `/paciente/perfil/editar` | `PatientEditProfilePage` | `T4` | Formulario completo responsivo |

## 5.5 Recepcao

| Rota | Componente | Template | Foco responsivo |
|---|---|---|---|
| `/recepcao/dashboard` | `ReceptionDashboard` | `T2` | Cards e atalhos |
| `/recepcao/marcar-consulta` | `ReceptionMarcarConsultaPage` | `T4` | Fluxo de form e horario |
| `/recepcao/cadastrar-paciente` | `ReceptionCadastrarPacientePage` | `T4` | Cadastro longo 2->1 colunas |
| `/recepcao/agendas` | `ReceptionAgendasPage` | `T3` | Grade/lista de agendas |
| `/recepcao/checkin` | `ReceptionCheckinPage` | `T3` | Busca + tabela/lista |
| `/recepcao/historico` | `ReceptionHistoricoPage` | `T3` | Historico com filtros |
| `/recepcao/documentos` | `ReceptionDocumentosPage` | `T3` | Lista de documentos |
| `/recepcao/documentos/visualizar` | `ProfessionalDocumentoViewPage` | `T7` | Visualizacao responsiva |
| `/recepcao/transacoes` | `ReceptionTransacoesPage` | `T3` | Tabela financeira com scroll |
| `/recepcao/notificacoes` | `ReceptionNotificationsPage` | `T6` | Lista de notificacoes |
| `/recepcao/perfil` | `ReceptionProfilePage` | `T5` | Perfil responsivo |
| `/recepcao/perfil/editar` | `ReceptionEditProfilePage` | `T4` | Formulario e upload |

## 5.6 Profissional

| Rota | Componente | Template | Foco responsivo |
|---|---|---|---|
| `/profissional/dashboard` | `ProfessionalDashboard` | `T2` | KPIs e resumo de agenda |
| `/profissional/agenda` | `ProfessionalAgendaPage` | `T3` | Grade/lista de slots e filtros |
| `/profissional/comentarios` | `ProfessionalCommentsPage` | `T3` | Lista de comentarios |
| `/profissional/notificacoes` | `ProfessionalNotificationsPage` | `T6` | Lista de notificacoes |
| `/profissional/documentos` | `ProfessionalDocumentosPage` | `T3` | Lista de documentos da consulta |
| `/profissional/documentos/formulario` | `ProfessionalDocumentoFormPage` | `T4` | Formulario complexo + footer fixo |
| `/profissional/documentos/visualizar` | `ProfessionalDocumentoViewPage` | `T7` | Visualizador responsivo |
| `/profissional/perfil` | `ProfessionalProfilePage` | `T5` | Perfil com informacoes clinicas |
| `/profissional/perfil/editar` | `ProfessionalEditProfilePage` | `T4` | Formulario completo responsivo |

## 5.7 Legadas e fallback

| Rota | Tipo | Acao |
|---|---|---|
| `/admin/deshboard` | Alias legado | Validar redirecionamento no mobile |
| `/paciente/deshboard` | Alias legado | Validar redirecionamento no mobile |
| `/recepcao/deshboard` | Alias legado | Validar redirecionamento no mobile |
| `/profissional/deshboard` | Alias legado | Validar redirecionamento no mobile |
| `/patient/dashboard` | Alias legado | Validar redirecionamento no mobile |
| `/professional/dashboard` | Alias legado | Validar redirecionamento no mobile |
| `/reception/dashboard` | Alias legado | Validar redirecionamento no mobile |
| `*` | Fallback | Confirmar destino para `/dashboard` |

## 6) Ordem de execucao sugerida

1. Fase A - Fundacao global:
- `AppLayout`, `Sidebar`, `TopBar`, containers e tokens responsivos.

2. Fase B - Telas publicas e auth:
- `Home`, `Login`, `Register*`, `Unauthorized`.

3. Fase C - Dashboards e listas:
- Todos os `T2` e `T3` de Admin/Paciente/Recepcao/Profissional.

4. Fase D - Formularios e perfil:
- Todos os `T4` e `T5`.

5. Fase E - Documentos e ajuste fino:
- `T7`, aliases legados e fallback.

## 7) Criterios de aceite por tela

- Nenhum overflow horizontal em `360px`, `390px`, `768px`, `1024px`, `1366px`.
- Sidebar e TopBar navegaveis por toque/teclado.
- Conteudo principal sempre legivel sem sobreposicao.
- Acoes principais visiveis sem "sumir" abaixo da dobra em mobile.
- Tabelas com rolagem horizontal controlada quando necessario.
- Formularios com foco/erro sem quebrar layout.

## 8) Entregaveis antes do coding pesado

1. Ajuste da fundacao (`AppLayout` + `Sidebar`) em branch.
2. Checklist marcado por tela conforme matriz acima.
3. Capturas por viewport para validacao:
- Mobile: `390x844`
- Tablet: `768x1024`
- Desktop: `1366x768`

