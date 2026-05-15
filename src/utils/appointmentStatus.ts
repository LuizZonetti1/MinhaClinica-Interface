/**
 * Utilitario de classificacao de status de agendamentos.
 * Define quais status sao "ativos" (aparecem em Agendamentos)
 * e quais sao "historicos" (aparecem em Historico de Consultas).
 */

/** Status que pertencem ao Historico de Consultas */
export const HISTORICAL_STATUSES = new Set([
  "COMPLETED",
  "COMPLETED_WITH_ADDENDUM",
  "CANCELLED",
  "NO_SHOW",
]);

/** Status que pertencem a lista de Agendamentos ativos */
export const ACTIVE_STATUSES = new Set([
  "SCHEDULED",
  "CONFIRMED",
  "WAITING",
  "IN_PROGRESS",
  "RESCHEDULED",
]);

export function isHistoricalStatus(status: string): boolean {
  return HISTORICAL_STATUSES.has(status.trim().toUpperCase());
}

export function isActiveStatus(status: string): boolean {
  return ACTIVE_STATUSES.has(status.trim().toUpperCase());
}
