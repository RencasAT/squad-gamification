# Servicios Backend

> **Mock local:** con `environment.useMocks = true`, MSW intercepta estas rutas bajo `/api/*`
> (`mocks/handlers/`). Ver README → sección “Mock API (MSW)”.

## 1. Autenticación (Auth)

Ubicación:
Inicio > Administración > Auth

Servicios:

- POST /login
  - Iniciar sesión.
  - Respuesta: `{ accessToken, user }` donde `user` es el mismo shape que `/me`.

- GET /me
  - Obtener usuario de la sesión actual (Bearer token).
  - Shape de `user` / `data`:

```ts
{
  id: string;
  name: string;
  email: string;
  roles: { id: number; name: string }[];  // solo display
  permissions: {
    subject: string;   // p.ej. 'Users' | 'Premios' | 'Administracion'
    actions: string[]; // 'manage' | 'create' | 'read' | 'update' | 'delete'
  }[];
  mustChangePassword: boolean; // true si debe actualizar la contraseña temporal del alta
}
```

- **Autorización en el front:** roles de Keycloak (`realm_access` / `resource_access`). El rol `admin` abre todo.
- El API debe validar el JWT; el front solo oculta menú y botones.

- POST /logout
  - Cerrar sesión

- PUT /change-password
  - Cambiar contraseña. Body: `{ currentPassword, newPassword }`.
  - Tras un alta en Gestión de Usuarios, `/login` y `/me` devuelven
    `mustChangePassword: true` hasta que este endpoint se complete.
  - Requisitos de `newPassword`: mínimo 8 caracteres, 1 mayúscula, 1 minúscula,
    1 número, y no puede incluir `&` ni `#`.

Mock local (`useMocks`): cuentas en `mocks/data/auth.mock.ts`
(ej. `pilar.milla@apuestatotal.com` / `admin123`; `operador@apuestatotal.com` / `operador123`;
`nuevo@apuestatotal.com` / `TempPass1` fuerza cambio de contraseña).
Roles y permisos se resuelven desde `users.store` + `roles.store`
(`mocks/lib/resolve-effective-permissions.ts`).
Subjects fuera del catálogo CRUD (`Dashboard`, `Settings`, `UiKit`): el mock
otorga `read` a cualquier usuario con al menos un rol.

## 2. Gestión de Usuarios

Ubicación:
Inicio > Administración > Gestión de Usuarios

Mock local (`useMocks`): seed en `mocks/data/users.mock.ts`.

### Pantalla: Listado

Servicios:

- GET /users
  - Obtener listado de usuarios.
  - Filtros: `q` (ID o correo), `active` (true/false), `roleId`.

- GET /roles
  - Obtener roles para el filtro “Todos los roles”.

- PATCH /users/{id}/active
  - Activar o desactivar usuario (`{ active: boolean }`).

- DELETE /users/{id}
  - Eliminar usuario (disponible en mock; no usado en la UI actual).

### Drawer: Crear Usuario

Servicios:

- GET /roles
  - Obtener roles asignables (incluyen permisos por módulo).

- GET /permissions
  - Catálogo de módulos/features para armar el preview de cada rol.

- POST /users
  - Crear usuario (`email`, `roles`).
  - El backend genera la contraseña temporal y la envía por correo al usuario.
  - El front no envía `password`.

### Drawer: Editar Usuario

Servicios:

- GET /users/{id}
  - Obtener información del usuario.

- GET /roles
  - Obtener roles asignables.

- GET /permissions
  - Catálogo de módulos/features para el preview de cada rol.

- PUT /users/{id}
  - Actualizar usuario (`email`, `roles`).

## 3. Gestión de Roles

Ubicación:
Inicio > Administración > Gestión de roles

Mock local (`useMocks`): seed en `mocks/data/roles.mock.ts`.

### Pantalla: Listado

Servicios:

- GET /roles
  - Obtener listado de roles.
  - Permite búsqueda (`q` por nombre).

- DELETE /roles/{id}
  - Eliminar rol.

### Drawer: Crear rol

Servicios:

- GET /permissions
  - Obtener catálogo de módulos y features de permisos.

- POST /roles
  - Crear rol (nombre + permisos por módulo/feature).

### Drawer: Editar rol

Servicios:

- GET /permissions
  - Obtener catálogo de módulos y features de permisos.

- GET /roles/{id}
  - Obtener información del rol.

- PUT /roles/{id}
  - Actualizar rol.

Mock local (`useMocks`): catálogo en `mocks/data/permissions.mock.ts`.

## 4. Clientes

Ubicación:
Inicio > Clientes > Búsqueda de clientes

Ruta UI:
`/clientes/busqueda?num={id|dni}`

### Pantalla: Búsqueda

Servicios:

- GET /clients/{id}
  - Buscar / obtener información base del cliente (perfil).
  - `{id}` puede ser ID de cliente o N° de documento.

### Pantalla: Detalle del Cliente (compartido)

Se muestra tras una búsqueda exitosa. Incluye perfil (nombre, ID, último login, fecha de registro) y tabs:

- Resumen
- Grupos
- Logros
- Torneos
- Misiones

Servicios compartidos del detalle:

- GET /clients/{id}
  - Obtener información del perfil del cliente.

### Tab: Resumen

Servicios:

- GET /clients/{id}/summary
  - Obtener resumen del cliente.
  - Deportivas.
  - Casino.
  - Tipo de jugador.

### Tab: Grupos

Servicios:

- GET /clients/{id}/groups
  - Obtener listado de grupos del cliente.

- DELETE /clients/{id}/groups/{groupId}
  - Quitar cliente del grupo.

#### Modal: Agregar a Grupo

Servicios:

- GET /groups
  - Obtener grupos disponibles (catálogo).
  - Debe poder filtrarse / excluirse los grupos ya asignados.

- POST /clients/{id}/groups
  - Agregar cliente a uno o más grupos.

#### Modal: Confirmar quitar de Grupo

Servicios:

- DELETE /clients/{id}/groups/{groupId}
  - Confirmar y quitar cliente del grupo.

### Tab: Logros

Servicios:

- GET /clients/{id}/achievements
  - Obtener listado de logros del cliente.
  - Query sugeridos:
    - `period` → `7d` | `30d` | `90d` | `all`
    - `status` → `completed` | `pending` (multi)

### Tab: Torneos

Servicios:

- GET /clients/{id}/tournaments
  - Obtener listado de torneos del cliente.
  - Query sugeridos:
    - `period` → `7d` | `30d` | `90d` | `all`
    - `type` → `race` | `tournament` | `arena` (multi)

Notas UI (acciones locales / deep-link, no necesariamente backend propio):

- Abrir en web
- Ir al torneo

### Tab: Misiones

Servicios:

- GET /clients/{id}/missions
  - Obtener listado de misiones del cliente.
  - Query sugeridos:
    - `period` → `7d` | `30d` | `90d` | `all`
    - `status` → `completed` | `incomplete` (multi)

Notas UI (acciones locales / deep-link, no necesariamente backend propio):

- Abrir en web
- Ir a la misión
