import { z } from 'zod';
import type { RolePermissionsState } from './role.types';

export const roleSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  permissions: z.custom<RolePermissionsState>(
    (value) => typeof value === 'object' && value !== null,
  ),
});
