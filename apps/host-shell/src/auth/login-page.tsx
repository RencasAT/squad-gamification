import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from 'react-router';
import { Button } from '@primereact/ui/button';
import { toast } from '@primereact/ui/toaster';
import { useAuth } from './auth';
import { ApuestaTotalLogo } from '@gamification/shared-ui/components/apuesta-total-logo';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';
import { cn } from '@gamification/shared-utils/utils/cn';
import { getApiErrorMessage } from '@gamification/shared-utils/utils/get-api-error-message';
import { loginSchema, type LoginFormValues } from './login.schema';

function CalimacoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16.4 7.2a6.4 6.4 0 1 0 0 9.6"
        stroke="#12B76A"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16.4 7.2c.85.7 1.5 1.7 1.85 2.85"
        stroke="#0E8F9A"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginPage() {
  const { login, loginMutation, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = useWatch({ control, name: 'email' }) ?? '';
  const password = useWatch({ control, name: 'password' }) ?? '';
  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    !loginMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const sessionUser = await login(values);
      if (!sessionUser) {
        return;
      }
      void navigate(
        sessionUser.mustChangePassword ? '/auth/change-password' : '/dashboard',
      );
    } catch (error) {
      toast.error({
        title: 'No se pudo iniciar sesión',
        description: getApiErrorMessage(
          error,
          'Credenciales inválidas. Verifica tu correo y contraseña.',
        ),
      });
    }
  });

  const onCalimacoLogin = () => {
    // Placeholder: integración SSO Calimaco
  };

  if (isLoading) {
    return <ModuleLoader variant="fullscreen" label="Cargando sesión" />;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.mustChangePassword ? '/auth/change-password' : '/dashboard'}
        replace
      />
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md">
        <ApuestaTotalLogo className="mb-10" />

        <form onSubmit={onSubmit} className="space-y-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FloatInput
                {...field}
                id="email"
                label="Correo electrónico"
                type="email"
                icon="pi-user"
                autoComplete="username"
                invalid={Boolean(errors.email)}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FloatInput
                {...field}
                id="password"
                label="Contraseña"
                type="password"
                icon="pi-key"
                togglePassword={false}
                autoComplete="current-password"
                invalid={Boolean(errors.password)}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'mt-1! h-12! w-full! justify-center rounded-xl! border-0! text-sm! font-semibold!',
              canSubmit
                ? 'bg-brand! text-white! shadow-none! hover:bg-brand-hover!'
                : 'bg-disabled! text-slate-400! shadow-sm! hover:bg-disabled! disabled:opacity-100!',
            )}
          >
            {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <button
          type="button"
          onClick={onCalimacoLogin}
          className="mt-10 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand bg-white text-sm font-medium text-slate-700 transition-colors hover:bg-brand/5"
        >
          <span>Valida tu sesión con</span>
          <span className="inline-flex items-center gap-1.5 font-semibold tracking-tight text-ink">
            <CalimacoMark />
            Calimaco
          </span>
        </button>
      </div>
    </div>
  );
}
