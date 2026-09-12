/** Rol de display (nombre en Keycloak o en el mock). */
export type AuthRoleRef = {
  id: number;
  name: string;
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: AuthRoleRef[];
  /** Roles de acceso, mismos nombres que en Keycloak (`users`, `clientes`, `admin`). */
  accessRoles: string[];
  /** True si el usuario debe cambiar la contraseña temporal del alta. */
  mustChangePassword: boolean;
}
