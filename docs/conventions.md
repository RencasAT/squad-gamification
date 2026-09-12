# Convenciones del proyecto

Guía para mantener el backoffice de gamificación **escalable y consistente** entre equipos.

Stack: React + Vite + TypeScript, PrimeReact, Tailwind, React Router, TanStack Query, Keycloak (roles), Zod, RHF, Zustand.

- **UI y textos de producto**: español.
- **Código** (archivos, símbolos, roles Keycloak): inglés / kebab-case / PascalCase, según las reglas abajo.

---

## Arquitectura

```
apps/
  host-shell/       # shell standalone: layout, rutas, login/sesión, roles, perfil
  <remote>/         # un remote autónomo
packages/
  shared-ui/        # design system
  shared-utils/     # helpers, http, env, roles Keycloak
mocks/              # MSW
```

### Qué va en cada capa

| Capa                    | Incluye                                           | No incluye                                     |
| ----------------------- | ------------------------------------------------- | ---------------------------------------------- |
| `apps/<remote>`         | Página, API, `export-*.tsx`, Vite MF si se federá | Login/sesión, layout del producto, otro remote |
| `apps/host-shell`       | Layout, guards, router, login, roles, perfil      | Dominio de un remote                           |
| `packages/shared-ui`    | Componentes, CSS, theme, assets                   | Llamadas API de un remote                      |
| `packages/shared-utils` | `cn`, http, env, `hasAppRole`                     | Pantallas, login, `/me`                        |
| `mocks/`                | Handlers MSW                                      | Lógica de UI                                   |

### Reglas de dependencia

1. Un **remote no importa** de otro remote ni de `host-shell`.
2. `shared-ui` / `shared-utils` no importan `host-shell`.
3. Si dos remotes necesitan lo mismo, subir a un package.

### Imports

- `@gamification/shared-ui/...` y `@gamification/shared-utils/...`
- `@gamification/<remote>/...`
- Mocks: `@mocks/...`
- En el mismo remote, relativo: `./login.schema`
- Tests: mismos aliases de package
- Sesión standalone: `@gamification/host-shell/auth/auth` (solo el shell)

### Build de remotes (un dominio, un path)

Cada remote tiene su Vite. **No se fusionan en un bundler**: `pnpm build` recorre `apps/*/module-federation.config.ts` y los compila en serie a `dist/[modulo]/`.

```
pnpm build
# dist/busqueda-clientes/remoteEntry.js
# dist/users/remoteEntry.js
```

Un remote más = `vite.config.ts` + `module-federation.config.ts` en su `apps/<modulo>/` (`base: '/<modulo>/'`, `outDir: dist/<modulo>`). `preview:remotes` sirve `dist/` como un solo origen.

`host-shell` sigue importando el código del workspace (`@gamification/users/...`) para el standalone; el `remoteEntry` es para el host de producto.

Diagramas (build, runtime, host ATBO, UI propia del remote): **[architecture-microfrontends.md](./architecture-microfrontends.md)**.

---

## Naming

Enforced por ESLint (`eslint-plugin-check-file`): carpetas y archivos en **kebab-case**.

| Tipo                 | Convención                     | Ejemplo                   |
| -------------------- | ------------------------------ | ------------------------- |
| Carpeta feature      | kebab-case                     | `contenido-gamification/` |
| Página               | `<nombre>-page.tsx`            | `users-list-page.tsx`     |
| Modal                | `<accion>-<entidad>-modal.tsx` | `create-user-modal.tsx`   |
| Schema Zod           | `*.schema.ts`                  | `login.schema.ts`         |
| Tipos                | `*.types.ts`                   | `auth.types.ts`           |
| Guard                | `*.guard.tsx`                  | `auth.guard.tsx`          |
| Componente exportado | PascalCase                     | `UsersListPage`           |
| Hook                 | `use` + PascalCase             | `useAuth`, `useAccess`    |
| Rol Keycloak         | kebab-case                     | `users`, `logs-monitoreo` |

---

## Crear un feature nuevo

### Padres de menú vs features

Algunos ítems del sidebar son **solo agrupadores** (p. ej. Administración, Clientes):

- Viven en `nav-modules.ts` con `children`.
- **No** tienen carpeta en `features/`.
- Cada hijo del menú es un **feature real** (`users`, `roles`, `busqueda-clientes`).

### 1. Carpeta

**Feature simple** (pocos archivos):

```
apps/<nombre>/
  <nombre>-page.tsx          # obligatorio (entry)
  <accion>-<entidad>-modal.tsx
  <nombre>.schema.ts
  <nombre>.types.ts
```

**Feature con varias pantallas / tabs / modales** (referencia: `busqueda-clientes`):

```
apps/<nombre>/
  <nombre>-page.tsx     # Entry: ruta, query params, orquestación
  README.md             # Opcional: contrato del feature
  model/                # types, schemas, mocks, (luego api/hooks)
  components/           # UI interna del feature (cards, tables shell)
  tabs/                 # Un panel por tab / sección
  modals/               # <accion>-<entidad>-modal.tsx
```

Orden de lectura recomendado: `page` → `model` → `components` → `tabs` → `modals`.

### 2. Ruta

Registrar en [`app.routes.tsx`](../apps/host-shell/src/app.routes.tsx):

- Módulo con permisos: usar `moduleRoute('path', 'rol-keycloak', <Page />)`.
- Si el menú tiene padre (p. ej. `/clientes/...`), anidar bajo ese path con `RoleGuard`.
- Página personal autenticada (ej. notificaciones): ruta hija de `ShellLayout` sin `RoleGuard`.

### 3. Permisos (si aplica)

1. Rol de Keycloak en [`access.ts`](../packages/shared-utils/src/access.ts) (`APP_ROLES`) y en [`nav-modules.ts`](../apps/host-shell/src/layout/nav-modules.ts).
2. Ruta con `RoleGuard` / `moduleRoute`.
3. Si aparece en el CRUD de roles (standalone): catálogo `GET /permissions` ([`permissions.mock.ts`](../mocks/data/permissions.mock.ts)).
4. Mock local: el módulo habilitado se traduce a nombre de rol en [`resolve-session-roles.ts`](../mocks/lib/resolve-session-roles.ts). El API/Keycloak es la fuente de verdad.

### 4. Breadcrumb

Rutas de menú se resuelven desde `navModules`. Rutas fuera del menú (settings, notificaciones) se manejan en [`shell-layout.tsx`](../apps/host-shell/src/layout/shell-layout.tsx).

### Checklist

- [ ] Carpeta bajo `apps/` en kebab-case (remote real, no el padre de menú)
- [ ] Estructura plana o `model` / `components` / `tabs` / `modals` según complejidad
- [ ] `*-page.tsx` exportando el componente de página
- [ ] Ruta en `app.routes.tsx`
- [ ] Rol Keycloak + catálogo `/permissions` en mock si el módulo es de negocio
- [ ] Nav y/o breadcrumb
- [ ] UI en español; sin importar otros features
- [ ] `pnpm lint` y `pnpm typecheck` OK

---

## UI y formularios

- Contenedor de página: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm` (ver usuarios/roles).
- Botones e iconos: **PrimeReact** desde `@primereact/ui/*` (con estilos) + **primeicons**.
  - Usar `import { Button } from '@primereact/ui/button'`.
  - No usar `primereact/button` para UI con tema (viene sin estilos en v11).
- Formularios: **react-hook-form** + **zod** + `@hookform/resolvers/zod`.
- Inputs nativos con clases Tailwind consistentes (ver `create-user-modal.tsx`), salvo que el diseño del módulo use un componente Prime específico.
- Permisos en UI: `<HasRole role="users">` o `useAccess().hasRole('users')`.
- No añadir `useMemo` / `useCallback` por defecto; solo si el patrón del repo ya lo requiere.

---

## Auth y permisos

| Pieza                       | Uso                                                                         |
| --------------------------- | --------------------------------------------------------------------------- |
| `useAuth()`                 | Sesión, login, logout, `updateProfile`, `changePassword` (host-shell)       |
| `AuthGuard`                 | Rutas autenticadas; redirige a cambio de contraseña si `mustChangePassword` |
| `PasswordChangeGuard`       | Solo usuarios que deben actualizar la contraseña temporal                   |
| `RoleGuard`                 | Rutas por rol de Keycloak (host-shell)                                      |
| `accessRoles` / token roles | Lista de roles (`users`, `clientes`, `admin`, …)                            |
| `HasRole` / `useAccess`     | Condicionar UI en remotes                                                   |

El rol `admin` abre todos los módulos. Tener el rol del módulo basta para ver la pantalla y las acciones.

La fuente de verdad de **quién puede qué** es Keycloak (JWT) y el API. El front solo cablea rol → ruta/menú/botón.

Al refrescar, los roles deben estar en el mismo render que el usuario (`AccessProvider` con los roles de `/me` o del token).

---

## Estado y datos

- Estado de servidor / auth: **TanStack Query** (y `react-query-auth`).
- Estado UI del shell: **Zustand** (`apps/host-shell/src/store/ui-store.ts`: sidebar, nav móvil).
- Estado de pantalla: `useState` local en el remote.
- Mocks: dentro del remote (o `packages/shared-ui/src/assets` si son estáticos compartidos). No dejar datos de demo en `shared` de plataforma.

---

## Imports

```ts
// ✅ Dentro del feature: relativos
import { RoleFormDrawer } from './drawers/role-form-drawer';

// ✅ Shared desde el remote
import { cn } from '@gamification/shared-utils/utils/cn';
import { http } from '@gamification/shared-utils/api/http';

// ✅ Sesión solo en host-shell
import { useAuth } from './auth/auth';

// ❌ Remote A → Remote B
import { Something } from '../users/something';
```

---

## Colores

La paleta de marca vive en `packages/shared-ui/src/index.css` (`@theme`). Usar utilidades Tailwind, no hex en componentes:

| Token             | Utilidad                         |
| ----------------- | -------------------------------- |
| `--color-brand`   | `text-brand`, `bg-brand`         |
| `--color-ink`     | `text-ink`                       |
| `--color-field`   | `bg-field`                       |
| `--color-success` | `text-success`, `border-success` |

Prime (`app-theme.ts`) sigue en slate para el chrome del backoffice.

---

## Scripts

```bash
pnpm dev            # desarrollo
pnpm build          # typecheck + remotes (dist/[modulo]/)
pnpm lint           # ESLint + Prettier (check)
pnpm format         # Prettier (escribe)
pnpm typecheck      # TypeScript
pnpm test           # Unitarias (Vitest)
pnpm test:e2e       # Integrales (Playwright)
```

Flags de Vitest: `--coverage`, `--watch`. Playwright: `--ui`.

---

## Tests

Dos comandos. Vitest cubre unitarias; Playwright las integrales (flujo real en el browser, con MSW vía `pnpm dev`).

```
test/
  setup/          # jest-dom
  unit/
    functions/    # schemas, utils, ability
    components/   # UI (Testing Library)
  e2e/            # Playwright
```

| Capa       | Carpeta      | Setup                   | Comando         |
| ---------- | ------------ | ----------------------- | --------------- |
| Unitarias  | `test/unit/` | `test/setup/unit.ts`    | `pnpm test`     |
| Integrales | `test/e2e/`  | Playwright + `pnpm dev` | `pnpm test:e2e` |

- Las unitarias no levantan HTTP: schemas, UI y helpers.
- Las integrales recorren la UI contra la app en marcha (MSW en el worker del browser).
- Un flujo nuevo de usuario va en `test/e2e/` (`login.spec.ts`, `clientes.spec.ts`, …).

### Qué cuenta como flujo integral

Un spec de Playwright cubre un **trabajo que un usuario termina en la UI**: entra, ve el resultado, y el router/auth/roles/API participan. Happy path + el fallo que importa (credenciales malas, 404, sin permiso).

No es integral: pantalla placeholder (`ModulePage`), catálogo UiKit, notificaciones de demo, ni “abrir la ruta y que el título exista”.

### Flujos actuales (producto real)

| Flujo                                 | Actor                 | Qué se valida                              | Spec                                |
| ------------------------------------- | --------------------- | ------------------------------------------ | ----------------------------------- |
| Login ok / error / sesión al recargar | Admin                 | Entra al dashboard o toast de error        | `login.spec.ts`                     |
| Visitar `/dashboard` sin sesión       | Anónimo               | Redirect a login                           | _pendiente_                         |
| Primer login obliga a cambiar clave   | Usuario nuevo         | Guard, no entra al shell, luego dashboard  | `change-password.spec.ts`           |
| Logout                                | Usuario nuevo / admin | Vuelve a login y otro puede entrar         | `change-password.spec.ts` (parcial) |
| Menú y guard por rol                  | Operador vs Admin     | Sin Administración; admin entra a usuarios | `sidebar-permissions.spec.ts`       |
| Buscar cliente                        | Admin                 | Perfil + tabs; empty state si no existe    | `clientes.spec.ts`                  |
| Agregar / quitar grupo del cliente    | Admin                 | Modal + listado actualizado                | _pendiente_                         |
| Gestión de usuarios                   | Admin                 | Listar, crear, editar, desactivar          | _pendiente_                         |
| Gestión de roles                      | Admin                 | Listar, crear, editar permisos, eliminar   | _pendiente_                         |

**Fuera de alcance hasta que tengan UI de negocio:** Premios, Contenido Gamification, Análisis, Simulaciones, Media, Logs (`ModulePage`). Dashboard (calendario) y Settings (perfil) son UI real de menor riesgo: se agregan si empiezan a romper.

Cuando un feature deje de ser placeholder, su happy path entra a esta tabla y a `test/e2e/`.

## Calidad de código (ESLint + Prettier + Husky)

| Herramienta                | Rol                                                                    |
| -------------------------- | ---------------------------------------------------------------------- |
| **ESLint**                 | Reglas TS/React + naming kebab-case (`check-file`)                     |
| **Prettier**               | Formato consistente (comillas simples, `;`, trailing commas)           |
| **eslint-config-prettier** | Desactiva reglas ESLint que chocan con Prettier                        |
| **Husky**                  | Hook `pre-commit`                                                      |
| **lint-staged**            | En cada commit: `eslint --fix` + `prettier --write` en archivos staged |

Config: [`.prettierrc.json`](../.prettierrc.json), [`eslint.config.js`](../eslint.config.js), [`.husky/pre-commit`](../.husky/pre-commit).

Tras `pnpm install`, el script `prepare` registra Husky automáticamente.

---

## Qué no hacer

- Meter pantallas de negocio en `core/`.
- Compartir lógica de un solo dominio en `shared/`.
- Importar entre features.
- Crear archivos en PascalCase o camelCase (`UsersPage.tsx` → `users-page.tsx`).
- Añadir un módulo en la UI sin el rol Keycloak, la ruta/`RoleGuard` y el menú.
- Dejar el README del template de Vite como única documentación de arquitectura.
