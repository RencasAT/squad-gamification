import { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@primereact/ui/button';
import { z } from 'zod';
import { AppDrawer } from '@gamification/shared-ui/components/app-drawer';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { PermissionAccessMark } from '@gamification/shared-ui/components/permission-access-mark';
import { cn } from '@gamification/shared-utils/utils/cn';
import { useAssignableRolesQuery, useUserQuery } from '../api/use-users';
import { CrearUsuarioModal } from '../modals/crear-usuario-modal';
import type { AssignableRole, UserRoleRef } from '../model/user.types';

const createUserSchema = z.object({
  email: z.email('Correo inválido'),
  roleIds: z.array(z.number()).min(1, 'Selecciona al menos un rol'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema> & {
  roles: UserRoleRef[];
};

type CreateUserDrawerProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (values: CreateUserFormValues) => void | Promise<void>;
  userId?: number | null;
};

const defaultFormValues = {
  email: '',
  roleIds: [] as number[],
};

export function CreateUserDrawer({
  open,
  onClose,
  onCreated,
  userId = null,
}: CreateUserDrawerProps) {
  const isEdit = typeof userId === 'number' && userId > 0;
  const editUserId = open && isEdit ? userId : null;
  const userQuery = useUserQuery(editUserId);
  const rolesQuery = useAssignableRolesQuery(open);
  const catalog = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const loading =
    (rolesQuery.isPending && catalog.length === 0) ||
    (isEdit && (userQuery.isLoading || userQuery.isFetching));

  const [roleSearch, setRoleSearch] = useState('');
  const [expandedRoleIds, setExpandedRoleIds] = useState<number[]>([]);
  const [prevOpen, setPrevOpen] = useState(open);
  const [hydratedUserId, setHydratedUserId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<CreateUserFormValues | null>(null);
  const [confirmSucceeded, setConfirmSucceeded] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; roleIds: number[] }>({
    resolver: zodResolver(createUserSchema),
    defaultValues: defaultFormValues,
  });

  const roleIds = useWatch({ control, name: 'roleIds' }) ?? [];
  const email = useWatch({ control, name: 'email' }) ?? '';

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      reset(defaultFormValues);
      setRoleSearch('');
      setExpandedRoleIds([]);
      setHydratedUserId(null);
      setConfirmOpen(false);
      setPendingValues(null);
      setConfirmSucceeded(false);
    } else {
      setHydratedUserId(null);
      setConfirmOpen(false);
      setPendingValues(null);
      setConfirmSucceeded(false);
    }
  }

  if (
    open &&
    isEdit &&
    userQuery.data &&
    userQuery.data.id !== hydratedUserId
  ) {
    const selectedIds = userQuery.data.roles.map((role) => role.id);
    setHydratedUserId(userQuery.data.id);
    reset({
      email: userQuery.data.email,
      roleIds: selectedIds,
    });
    setExpandedRoleIds(selectedIds.length > 0 ? [selectedIds[0]!] : []);
  }

  if (
    open &&
    !isEdit &&
    catalog.length > 0 &&
    expandedRoleIds.length === 0 &&
    hydratedUserId === null
  ) {
    setExpandedRoleIds([catalog[0]!.id]);
    setHydratedUserId(0);
  }

  const filteredRoles = useMemo(() => {
    const term = roleSearch.trim().toLowerCase();
    if (!term) {
      return catalog;
    }
    return catalog.filter((role) => role.name.toLowerCase().includes(term));
  }, [catalog, roleSearch]);

  const toggleRoleExpanded = (roleId: number) => {
    setExpandedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const toggleRole = (role: AssignableRole) => {
    const current = getValues('roleIds');
    const next = current.includes(role.id)
      ? current.filter((id) => id !== role.id)
      : [...current, role.id];
    setValue('roleIds', next, { shouldDirty: true, shouldValidate: true });
  };

  const buildFormValues = (values: {
    email: string;
    roleIds: number[];
  }): CreateUserFormValues => {
    const roles = catalog
      .filter((role) => values.roleIds.includes(role.id))
      .map((role) => ({ id: role.id, name: role.name }));

    return {
      ...values,
      roles,
    };
  };

  const onSubmit = handleSubmit(async (values) => {
    const nextValues = buildFormValues(values);

    if (isEdit) {
      await onCreated?.(nextValues);
      onClose();
      return;
    }

    setPendingValues(nextValues);
    setConfirmOpen(true);
  });

  const handleConfirmClose = () => {
    const shouldCloseDrawer = confirmSucceeded;
    setConfirmSucceeded(false);
    setConfirmOpen(false);
    setPendingValues(null);
    if (shouldCloseDrawer) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!pendingValues) {
      return;
    }
    await onCreated?.(pendingValues);
    setConfirmSucceeded(true);
  };

  const canSubmit =
    email.trim().length > 0 && roleIds.length > 0 && !isSubmitting && !loading;

  return (
    <>
      <AppDrawer
        open={open}
        onClose={onClose}
        title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
        description={
          isEdit
            ? 'Actualiza el correo y los roles del usuario.'
            : 'Ingresa el correo corporativo del usuario nuevo y selecciona los roles correspondientes.'
        }
        titleId="create-user-title"
        onSubmit={onSubmit}
        loading={loading}
        loadingLabel="Cargando roles..."
        footer={
          <Button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'h-12! w-full! justify-center! rounded-xl! border-0! text-sm! font-semibold! shadow-none!',
              canSubmit
                ? 'bg-brand! text-white! hover:bg-brand-hover!'
                : 'bg-[#F5F5F5]! text-slate-400! hover:bg-[#F5F5F5]! disabled:opacity-100!',
            )}
          >
            {isEdit
              ? isSubmitting
                ? 'Guardando...'
                : 'Guardar cambios'
              : isSubmitting
                ? 'Creando...'
                : 'Crear usuario'}
          </Button>
        }
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FloatInput
              {...field}
              id="create-user-email"
              label="Correo corporativo"
              type="email"
              autoComplete="off"
              readOnly={isEdit}
              invalid={Boolean(errors.email)}
              error={errors.email?.message}
            />
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-gobold shrink-0 text-sm tracking-wide text-slate-800 uppercase">
              Roles
            </h3>
            <FloatInput
              id="create-user-role-search"
              label="Buscar rol"
              value={roleSearch}
              onChange={(event) => setRoleSearch(event.target.value)}
              autoComplete="off"
              className="min-w-0 max-w-55 flex-1"
            />
          </div>

          {errors.roleIds && (
            <p className="text-xs text-red-500">{errors.roleIds.message}</p>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {filteredRoles.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                No se encontraron roles.
              </p>
            ) : (
              filteredRoles.map((role) => {
                const checked = roleIds.includes(role.id);
                const expanded = expandedRoleIds.includes(role.id);

                return (
                  <div
                    key={role.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 bg-white px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={cn(
                          'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm border',
                          checked
                            ? 'border-brand bg-brand text-white'
                            : 'border-slate-300 bg-white',
                        )}
                        aria-pressed={checked}
                        aria-label={`Seleccionar rol ${role.name}`}
                      >
                        {checked && <i className="pi pi-check text-[10px]" />}
                      </button>

                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                        {role.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleRoleExpanded(role.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-expanded={expanded}
                        aria-label={`Ver permisos de ${role.name}`}
                      >
                        <i
                          className={cn(
                            'pi text-xs',
                            expanded ? 'pi-chevron-up' : 'pi-chevron-down',
                          )}
                          aria-hidden
                        />
                      </button>
                    </div>

                    {expanded && (
                      <div className="space-y-2 bg-[#f4f7f9] px-4 py-3 pl-12">
                        {role.modules.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            Este rol no tiene permisos configurados.
                          </p>
                        ) : (
                          role.modules.map((module) => (
                            <div key={module.id} className="space-y-0.5">
                              <div className="flex items-center justify-start gap-3 py-0.5">
                                <span className="text-[13px] font-semibold text-slate-800">
                                  {module.label}
                                </span>
                                <PermissionAccessMark access={module.access} />
                              </div>

                              {module.features.map((feature) => (
                                <div
                                  key={feature.id}
                                  className="flex items-center justify-start gap-3 py-0.5 pl-4"
                                >
                                  <span className="text-[13px] text-slate-600">
                                    {feature.label}
                                  </span>
                                  <PermissionAccessMark
                                    access={feature.access}
                                  />
                                </div>
                              ))}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </AppDrawer>

      {!isEdit ? (
        <CrearUsuarioModal
          open={confirmOpen}
          email={pendingValues?.email.trim() || null}
          onClose={handleConfirmClose}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}
