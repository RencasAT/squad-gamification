import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button } from '@primereact/ui/button';
import { toast } from '@primereact/ui/toaster';
import { useAuth } from './auth';
import { ApuestaTotalLogo } from '@gamification/shared-ui/components/apuesta-total-logo';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { cn } from '@gamification/shared-utils/utils/cn';
import { getApiErrorMessage } from '@gamification/shared-utils/utils/get-api-error-message';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from './change-password.schema';
import { passwordRequirements } from './password-policy';

export function ChangePasswordPage() {
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = useWatch({ control, name: 'newPassword' }) ?? '';

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success({
        title: 'Contraseña actualizada',
        description: 'Ya puedes usar tu nueva contraseña.',
      });
      void navigate('/dashboard');
    } catch (error) {
      toast.error({
        title: 'No se pudo cambiar la contraseña',
        description: getApiErrorMessage(
          error,
          'Verifica la contraseña actual e inténtalo de nuevo.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      void navigate('/auth/login');
    } catch {
      void navigate('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const canSubmit = isValid && !isSubmitting && !isLoggingOut;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8">
          <ApuestaTotalLogo />
          <p className="mt-4 text-center text-sm text-slate-500">
            Ingresa la contraseña anterior para cambiar tu contraseña. Debe
            cumplir con los requisitos mínimos.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <FloatInput
                {...field}
                id="currentPassword"
                label="Contraseña actual"
                type="password"
                autoComplete="current-password"
                invalid={Boolean(errors.currentPassword)}
                error={errors.currentPassword?.message}
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <FloatInput
                {...field}
                id="newPassword"
                label="Nueva contraseña"
                type="password"
                autoComplete="new-password"
                invalid={Boolean(errors.newPassword)}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FloatInput
                {...field}
                id="confirmPassword"
                label="Repetir nueva contraseña"
                type="password"
                autoComplete="new-password"
                invalid={Boolean(errors.confirmPassword)}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <ul className="space-y-1 pt-1 text-xs text-slate-500">
            {passwordRequirements.map((requirement) => {
              const met = requirement.test(newPassword);
              return (
                <li
                  key={requirement.id}
                  className={cn(met && newPassword ? 'text-success' : '')}
                >
                  {requirement.label}
                </li>
              );
            })}
          </ul>

          <Button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'mt-3! h-12! w-full! justify-center rounded-xl! border-0! text-sm! font-semibold!',
              canSubmit
                ? 'bg-brand! text-white! shadow-none! hover:bg-brand-hover!'
                : 'bg-disabled! text-slate-400! shadow-sm! hover:bg-disabled! disabled:opacity-100!',
            )}
          >
            {isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => void onLogout()}
          disabled={isSubmitting || isLoggingOut}
          className="mt-4 w-full text-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 disabled:opacity-50"
        >
          {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );
}
