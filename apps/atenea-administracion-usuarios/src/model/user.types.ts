export type PermissionAccess = 'lectura' | 'edicion' | 'ambas';

export type UserRoleRef = {
  id: number;
  name: string;
};

export type BackofficeUser = {
  /** ID interno (columna DB). */
  id: number;
  /** Identificador de usuario en plataforma (columna ID). */
  externalId: number;
  email: string;
  name: string;
  active: boolean;
  roles: UserRoleRef[];
};

export type UsersListFilters = {
  q?: string;
  active?: boolean;
  roleId?: number;
};

/** Feature visible al expandir un rol en el drawer de usuario. */
export type AssignableRoleFeature = {
  id: string;
  label: string;
  access: PermissionAccess;
};

/** Módulo habilitado de un rol (solo lectura en el drawer). */
export type AssignableRoleModule = {
  id: string;
  label: string;
  access: PermissionAccess;
  features: AssignableRoleFeature[];
};

/**
 * Rol seleccionable al crear/editar usuario.
 * Los módulos vienen de GET /roles + GET /permissions (MSW/backend).
 */
export type AssignableRole = {
  id: number;
  name: string;
  modules: AssignableRoleModule[];
};

export const ROLE_ACCESS_LABELS: Record<PermissionAccess, string> = {
  lectura: 'Lectura',
  edicion: 'Edición',
  ambas: 'Combinado',
};

export const ROLE_ACCESS_ICONS: Record<PermissionAccess, string> = {
  lectura: 'pi-eye',
  edicion: 'pi-pencil',
  /** Cuadrado con guion (Figma Combinado). */
  ambas: 'pi-minus',
};
