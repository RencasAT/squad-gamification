import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(4, 'Mínimo 4 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
