# Gamification Backoffice Web

Backoffice de gamificación (Apuesta Total): React + Vite + TypeScript, PrimeReact, Tailwind, React Router, TanStack Query, roles Keycloak.

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/)

## Scripts

```bash
pnpm install
pnpm dev              # shell standalone http://127.0.0.1:5173
pnpm dev:busqueda     # remote MF (path /busqueda-clientes/) en :5173
pnpm dev:users        # remote MF (path /users/) en :5173
pnpm build            # typecheck + todos los remotes → dist/[modulo]/
pnpm build:shell      # Vite del shell standalone
pnpm preview          # preview del shell (:5173)
pnpm preview:remotes  # sirve dist/ como entorno de hijos (:5173)
pnpm lint           # ESLint + Prettier (check)
pnpm format         # Prettier (escribe)
pnpm typecheck      # TypeScript
pnpm test           # Unitarias (Vitest)
pnpm test:e2e       # Integrales (Playwright)
```

Flags (se pasan al comando):

```bash
pnpm test -- --coverage
pnpm test -- --watch
pnpm test -- --mode ci          # usa .env.ci (pipelines)
pnpm build -- --mode ci
pnpm test:e2e -- --ui
pnpm exec playwright show-report
```

En cada **commit**, Husky + lint-staged ejecutan ESLint y Prettier sobre los archivos staged.

En cada **push**, Husky `pre-push` corre `pnpm typecheck` y `pnpm test`. Si fallan, el push se cancela.

En **GitHub Actions** (`.github/workflows/ci.yml`) corren lint, typecheck y unitarios en push/PR a `main`, `staging` y `develop`. Playwright solo en **push a `main` y `staging`**.

## Tests

| Tipo       | Herramienta              | Ubicación    | Comando         |
| ---------- | ------------------------ | ------------ | --------------- |
| Unitarias  | Vitest + Testing Library | `test/unit/` | `pnpm test`     |
| Integrales | Playwright               | `test/e2e/`  | `pnpm test:e2e` |

`pnpm test` corre unitarias. `pnpm test:e2e` recorre la UI en el browser.

Los flujos que sí van a Playwright (login, password, permisos, clientes, usuarios, roles) están listados en [docs/conventions.md](docs/conventions.md#flujos-actuales-producto-real).

Playwright levanta `pnpm dev` (con MSW) vía `playwright.config.ts`. En local, el HTML queda en `playwright-report/` (`pnpm exec playwright show-report`). En CI solo se imprime el listado.

## Estructura

```
apps/
  host-shell/          # shell local (:5173): login, layout, public
  busqueda-clientes/   # remote
  dashboard/
  …
packages/
  shared-ui/
  shared-utils/
mocks/                 # handlers MSW
test/
```

El host de producto es `web-digital-atbo` (`:5174`), no `apps/host-shell`.
Detalle: [docs/architecture-microfrontends.md](docs/architecture-microfrontends.md).

## Convenciones

Antes de contribuir o crear un módulo nuevo, lee:

- **[docs/conventions.md](docs/conventions.md)** — arquitectura, naming, features, roles Keycloak y checklist
- Reglas Cursor en `.cursor/rules/` (mismas convenciones para el agente)

## Stack principal

| Área        | Tecnología                                               |
| ----------- | -------------------------------------------------------- |
| UI          | PrimeReact 11 (`@primereact/ui`), Tailwind, primeicons   |
| Forms       | react-hook-form + Zod                                    |
| Auth / data | react-query-auth, TanStack Query, axios, **MSW** (mocks) |
| Acceso      | Roles de Keycloak (`hasAppRole`, `HasRole`)              |
| Estado UI   | Zustand                                                  |

## Variables de entorno

Vite carga `.env.[mode]` automáticamente:

| Archivo                       | Uso                                                              |
| ----------------------------- | ---------------------------------------------------------------- |
| `.env.example`                | Plantilla (commiteada)                                           |
| `.env`                        | Defaults compartidos                                             |
| `.env.development`            | `pnpm dev`                                                       |
| `.env.production`             | `pnpm build`                                                     |
| `.env.ci`                     | Pipelines (`pnpm test -- --mode ci` / `pnpm build -- --mode ci`) |
| `.env.test`                   | Vitest (`pnpm test`)                                             |
| `.env.local` / `.env.*.local` | Overrides locales (gitignored)                                   |

Variables (mapeo en `packages/shared-utils/src/environments/environment.ts`):

| Env                    | Campo                  | Ejemplo          |
| ---------------------- | ---------------------- | ---------------- |
| `VITE_PRODUCTION`      | `production`           | `false`          |
| `VITE_API_URL`         | `apiUrl`               | `/api`           |
| `VITE_USE_MOCKS`       | `useMocks`             | `true`           |
| `VITE_PRIMEUI_LICENSE` | `VITE_PRIMEUI_LICENSE` | token PrimeReact |

## Mock API (MSW)

Con `VITE_USE_MOCKS=true` (default en desarrollo/CI), al levantar `pnpm dev` se inicia **Mock Service Worker** y responde los endpoints de `docs/Servicios_Backend.md` bajo `/api/*`.

- Handlers: `mocks/handlers/`
- Data seed: `mocks/data/`
- Store en memoria: `mocks/db/`
- Worker: `apps/host-shell/public/mockServiceWorker.js`

Para hablar con un backend real, poné `VITE_USE_MOCKS=false` y ajustá `VITE_API_URL` (por ejemplo en `.env.local`).

## Microfrontend (hijo)

Este repo publica **remotes**. El host de producto es `web-digital-atbo`
(sesión, layout, registro MF). Guía: [docs/architecture-microfrontends.md](docs/architecture-microfrontends.md).

`pnpm dev` es el backoffice standalone (`host-shell`). No publica `remoteEntry.js`.

Para el host, `pnpm build` descubre cada `apps/*/module-federation.config.ts` y escribe `dist/[modulo]/`:

```bash
pnpm build              # typecheck + remotes en serie
pnpm preview            # sirve dist/ como origen de hijos
```

En ATBO el registro (`src/core/mf/microfrontends.ts`) apunta, por ejemplo:

- `atenea-clientes-buscador/module` → `http://localhost:5176/atenea-clientes-buscador/remoteEntry.js`

Los remotes de este equipo **no** usan `host/ui`, `host/layout` ni los tokens
ATBO: cada micro-front lleva su propia UI y paleta. Lo compartido con el host
es el contrato (`./module`, singletons de React), no la estética.
