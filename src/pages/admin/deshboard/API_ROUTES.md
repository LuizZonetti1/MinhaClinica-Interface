# Dashboard Admin - Rotas de API Necessarias

Documento atualizado com o escopo combinado:
- `overview` permanece
- financeiro vem de `transaction/summary`
- notificacoes ficam para outra etapa
- evolucao mensal vem de rota `historical`

## 1) Dados mockados hoje na tela

Arquivo atual: `src/pages/admin/deshboard/index.tsx`

- `STATS`
- `ALERTS` (permanece mock nesta etapa)
- texto fixo no `HeroSubtitle` (`Hoje ha 32 consultas agendadas`)
- `ConsultationsChart` (`src/components/ConsultationsChart/index.tsx`, `chartData` hardcoded)

## 2) Rotas desta etapa

## 2.1 Resumo geral do dashboard

`GET /api/admin/dashboard/overview`

Objetivo:
- trazer os indicadores gerais da clinica (exceto financeiro mensal).

Resposta sugerida:

```json
{
  "totalPatients": 1247,
  "consultationsToday": 32,
  "activeProfessionals": 15,
  "todayDate": "2026-03-04",
  "greetingName": "Luiz"
}
```

Campos usados na UI:
- `totalPatients` -> card "Total de Pacientes"
- `consultationsToday` -> card "Consultas Hoje" + texto do banner
- `activeProfessionals` -> card "Profissionais Ativos"

Observacao:
- `todayDate` e `greetingName` sao opcionais, pois a UI ja gera localmente.

## 2.2 Resumo financeiro mensal (transaction/summary)

`GET /api/transaction/summary?from=2026-03-01&to=2026-03-31`

Objetivo:
- retornar os totais financeiros do periodo.

Resposta sugerida:

```json
{
  "totalIncome": 90000,
  "totalExpense": 48000,
  "amount": 42000
}
```

Campos usados na UI:
- `amount` -> card "Receita Mensal"
- `totalIncome` -> total de entradas
- `totalExpense` -> total de saidas

Regra:
- `amount = totalIncome - totalExpense`

## 2.3 Evolucao por meses (historical)

`GET /api/admin/dashboard/historical?months=6`

Objetivo:
- alimentar o grafico mensal do dashboard.

Resposta sugerida:

```json
{
  "items": [
    { "month": "Set", "consultations": 215, "revenue": 32000 },
    { "month": "Out", "consultations": 248, "revenue": 38000 },
    { "month": "Nov", "consultations": 210, "revenue": 32000 },
    { "month": "Dez", "consultations": 198, "revenue": 30000 },
    { "month": "Jan", "consultations": 240, "revenue": 44000 },
    { "month": "Fev", "consultations": 262, "revenue": 44000 }
  ]
}
```

Campos usados na UI:
- `month`
- `consultations`
- `revenue`

## 3) Fora desta etapa

- Notificacoes/alertas (`ALERTS`) serao implementados depois.
- Nao criar rota de alertas agora.

## 4) Checklist frontend (substituir mocks)

- Trocar `STATS` por:
  - `totalPatients`, `consultationsToday`, `activeProfessionals` de `overview`
  - `amount` de `transaction/summary` para "Receita Mensal"
- Trocar numero fixo do `HeroSubtitle` por `consultationsToday`.
- Trocar `chartData` por dados da rota `historical`.
- Manter `ALERTS` mockados nesta etapa.
