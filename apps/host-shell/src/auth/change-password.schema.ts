import { z } from 'zod';
import { isValidNewPassword } from './password-policy';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa la contraseña actual'),
    newPassword: z
      .string()
      .min(1, 'Ingresa la nueva contraseña')
      .refine(isValidNewPassword, 'No cumple los requisitos mínimos'),
    confirmPassword: z.string().min(1, 'Repite la nueva contraseña'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
