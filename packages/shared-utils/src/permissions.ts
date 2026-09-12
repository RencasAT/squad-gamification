/** Permisos finos: `{entorno}.{modulo}.{recurso}.{accion}` */
export const PERMISSIONS = {
  /** Administración · usuarios */
  USUARIO_CONSULTAR: 'gamificacion.administracion.usuario.consultar',
  USUARIO_CREAR: 'gamificacion.administracion.usuario.crear',
  USUARIO_EDITAR: 'gamificacion.administracion.usuario.editar',
  USUARIO_ELIMINAR: 'gamificacion.administracion.usuario.eliminar',

  /** Administración · roles */
  ROL_CONSULTAR: 'gamificacion.administracion.rol.consultar',
  ROL_CREAR: 'gamificacion.administracion.rol.crear',
  ROL_EDITAR: 'gamificacion.administracion.rol.editar',
  ROL_ELIMINAR: 'gamificacion.administracion.rol.eliminar',

  /** Clientes · búsqueda */
  CLIENTES_BUSQUEDA_CONSULTAR: 'gamificacion.clientes.busqueda.consultar',

  /** Contenido */
  CONTENIDO_TORNEOS_CONSULTAR: 'gamificacion.contenido.torneos.consultar',
  CONTENIDO_MISIONES_CONSULTAR: 'gamificacion.contenido.misiones.consultar',
  CONTENIDO_RACHAS_CONSULTAR: 'gamificacion.contenido.rachas.consultar',
} as const;

export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Roles compuestos de Keycloak (agrupan permisos). */
export const COMPOSITE_ROLES = {
  ADMINISTRADOR: 'administrador',
} as const;

export const APP_PERMISSIONS = Object.values(PERMISSIONS);

const PERMISSION_SET = new Set<string>(APP_PERMISSIONS);

export function isAppPermission(value: string): value is AppPermission {
  return PERMISSION_SET.has(value.trim().toLowerCase());
}
