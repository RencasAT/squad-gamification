import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@primereact/ui/button';
import { z } from 'zod';
import { useAuth } from '../auth/auth';
import { cn } from '@gamification/shared-utils/utils/cn';
import { buildDicebearAvatarUrl } from '@gamification/shared-utils/utils/dicebear-avatar';

const profileSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.email('Email inválido'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const name = useWatch({ control, name: 'name' }) ?? '';

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      email: user.email,
    });
  }, [user, reset]);

  const onSave = handleSubmit(async (values) => {
    await updateProfile({
      name: values.name,
      email: values.email,
    });
    reset(values);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  });

  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Mi perfil</h2>
        <p className="mt-1 text-sm text-slate-500">
          Edita tu nombre y correo. El avatar se genera con tu nombre.
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
          <img
            src={buildDicebearAvatarUrl(name)}
            alt="Avatar de perfil"
            className="h-24 w-24 rounded-2xl border border-slate-200 bg-slate-950"
          />
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-slate-700">Avatar</p>
            <p className="mt-1 text-xs text-slate-500">
              DiceBear pixel-art según el nombre.
            </p>
          </div>
        </div>

        <Field
          label="Nombre"
          error={errors.name?.message}
          control={
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={inputClass(Boolean(errors.name))}
                  placeholder="Nombre completo"
                />
              )}
            />
          }
        />

        <Field
          label="Correo"
          error={errors.email?.message}
          control={
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className={inputClass(Boolean(errors.email))}
                  placeholder="correo@apuestatotal.com"
                />
              )}
            />
          }
        />

        <div className="flex items-center justify-end gap-3 pt-1">
          {saved && (
            <span className="text-xs font-medium text-emerald-600">
              Perfil actualizado
            </span>
          )}
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            <i className="pi pi-save mr-2" />
            {isSubmitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </section>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-800 outline-none',
    hasError ? 'border-red-400' : 'border-slate-200 focus:border-slate-400',
  );
}

function Field({
  label,
  error,
  control,
}: {
  label: string;
  error?: string;
  control: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-600">
        {label}
      </label>
      {control}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
