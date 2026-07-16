# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SPA frontend for **Minha Clínica**, a multi-tenant clinic-management SaaS (React 19 + Vite 7 + TypeScript + styled-components + react-router 7). It consumes the REST API in a **separate repository** (`MinhaClinica-api`). Users have one of four roles: `ADMIN` (clinic owner), `RECEPTIONIST`, `PROFESSIONAL` (health provider), `PATIENT` — most of the app is role-gated.

Codebase language is **Portuguese**: identifiers, comments, commit messages, user-facing strings, and route paths (`/paciente`, `/recepcao`, `/profissional`, `/admin`) are pt-BR. Match this when writing code. Both `yarn.lock` and `package-lock.json` are committed.

## Commands

```bash
npm run dev              # vite dev server (default :5173)
npm run build            # tsc -b && vite build → dist/
npm run preview          # preview the production build
npm run lint             # eslint .
```

There is no test runner configured. **Lint is ESLint** (`eslint.config.js`), even though a `biome.json` is also present — use `npm run lint`.

## Architecture

- **Entry:** `main.tsx` → `App.tsx` wraps everything in `AuthProvider` → `NotificationProvider` → `AppRoutes` + toast container.
- **Routing** (`routes/index.tsx`) — public marketing/auth routes, a multi-step registration flow, then role-gated app routes. Private area nests: `PrivateRoutes` (auth check) → `RoleGuard allowedRoles={[...]}` → `AppLayout` (sidebar shell) → pages. `RoleRedirect` sends `/dashboard` to the current role's home. Per-flow registration guards (`ClinicRegisterCompleteGuard`, `ProfessionalRegisterCompleteGuard`, etc.) live in `routes/`. Paths are Portuguese and role-prefixed; `LEGACY_DASHBOARD_ROUTE_ALIASES` redirects old bookmarks.
- **API client** (`config/api.ts`) — a single axios instance with `baseURL = VITE_API_URL + "/api"`. A **request interceptor** injects the `Bearer` token from `utils/authStorage` on every non-public route; a **response interceptor** clears auth storage and redirects to `/login` on `401`. `PUBLIC_ROUTES` lists endpoints that must never receive the token. **Always call the backend through this `api` instance** — never import axios directly in features.
- **Service layer** (`services/*.service.ts`) — one module per domain (auth, appointment, clinic, patient, reports, notification, …), wrapping `api` calls and returning typed data. Pages and components call services, not axios.
- **State** via React Context (`contexts/`):
  - `AuthContext` — user, roles, and auth state, persisted through `utils/authStorage`. `useAuth()` exposes `isAuthenticated`, `hasRole`/`hasAnyRole`, and role predicates (`isAdmin`, `isPatient`, …). A user may have multiple roles (`user.roles`).
  - `NotificationContext`, `ThemeModeContext` (light/dark, mounted only inside private routes), `ProfessionalAgendaContext` (scoped to the professional agenda page only).
- **Styling** — styled-components with a typed theme (`themes/themes.ts`, `themes/styled.d.ts`). Icons from `lucide-react`; charts from `recharts`; toasts from `react-toastify`.
- **Structure** — `pages/` grouped by role (`Admin/`, `Patient/`, `Reception/`, `Professional/`) plus public/register pages; reusable UI in `components/`; shared `hooks/`, `types/`, `utils/`.
- Enum string values (roles, statuses) in `types/enums.ts` mirror the backend — keep them in sync.

## Environment & deploy

`VITE_API_URL` points at the backend (e.g. `http://localhost:3001`; the client appends `/api`). Set it in `.env` / `.env.local`. Deployed on Vercel (`vercel.json`).
