import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { cn } from '@gamification/shared-utils/utils/cn';
import {
  FEATURE_ACCESS_OPTIONS,
  PERMISSION_ACCESS_ICONS,
  PERMISSION_ACCESS_OPTIONS,
  moduleAccessFromState,
  type PermissionAccess,
  type RoleFormValues,
  type RolePermission,
  type RolePermissionModuleDef,
} from '@gamification/atenea-administracion-roles/model/role.types';

export type RoleFormContentProps = {
  control: Control<RoleFormValues>;
  errors: FieldErrors<RoleFormValues>;
  catalog: RolePermissionModuleDef[];
  permissions: RoleFormValues['permissions'] | undefined;
  expandedModules: RolePermission[];
  toggleModule: (moduleId: RolePermission) => void;
  toggleModuleExpanded: (moduleId: RolePermission) => void;
  setModuleAccess: (moduleId: RolePermission, access: PermissionAccess) => void;
  toggleFeature: (moduleId: RolePermission, featureId: string) => void;
  setFeatureAccess: (
    moduleId: RolePermission,
    featureId: string,
    access: PermissionAccess,
  ) => void;
};

/** Contenido del formulario de rol (sin shell del drawer). */
export function RoleFormContent({
  control,
  errors,
  catalog,
  permissions,
  expandedModules,
  toggleModule,
  toggleModuleExpanded,
  setModuleAccess,
  toggleFeature,
  setFeatureAccess,
}: RoleFormContentProps) {
  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <FloatInput
            {...field}
            id="role-form-name"
            label="Nombre del rol"
            autoComplete="off"
            invalid={Boolean(errors.name)}
            error={errors.name?.message}
          />
        )}
      />

      <div className="space-y-3">
        <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
          Permisos
        </h3>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          {catalog.map((module) => {
            const moduleState = permissions?.[module.id];
            const expanded = expandedModules.includes(module.id);
            const checked = Boolean(moduleState?.enabled);
            const moduleAccess = moduleAccessFromState(moduleState);

            return (
              <div
                key={module.id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3',
                    expanded && 'bg-[#eef3f8]',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className={cn(
                      'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm border',
                      checked
                        ? 'border-brand bg-brand text-white'
                        : 'border-slate-300 bg-white',
                    )}
                    aria-pressed={checked}
                    aria-label={`Activar ${module.label}`}
                  >
                    {checked && <i className="pi pi-check text-[10px]" />}
                  </button>

                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                    {module.label}
                  </span>

                  <AccessSelect
                    value={moduleAccess}
                    disabled={!checked}
                    ariaLabel={`Nivel de acceso de ${module.label}`}
                    options={PERMISSION_ACCESS_OPTIONS}
                    onChange={(access) => setModuleAccess(module.id, access)}
                  />

                  <button
                    type="button"
                    onClick={() => toggleModuleExpanded(module.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/70 hover:text-slate-700"
                    aria-expanded={expanded}
                    aria-label={`Ver permisos de ${module.label}`}
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
                  <div className="space-y-2 bg-[#eef3f8] px-4 py-3">
                    {module.features.map((feature) => {
                      const featureState = moduleState?.features[feature.id];
                      const featureChecked = Boolean(featureState?.enabled);

                      return (
                        <div
                          key={feature.id}
                          className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                        >
                          <button
                            type="button"
                            onClick={() => toggleFeature(module.id, feature.id)}
                            className={cn(
                              'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm border',
                              featureChecked
                                ? 'border-brand bg-brand text-white'
                                : 'border-slate-300 bg-white',
                            )}
                            aria-pressed={featureChecked}
                            aria-label={`Activar ${feature.label}`}
                          >
                            {featureChecked && (
                              <i className="pi pi-check text-[10px]" />
                            )}
                          </button>

                          <span className="min-w-0 flex-1 text-sm font-medium text-slate-700">
                            {feature.label}
                          </span>

                          <AccessSelect
                            value={
                              featureState?.access === 'ambas'
                                ? 'edicion'
                                : (featureState?.access ?? 'edicion')
                            }
                            disabled={!featureChecked}
                            ariaLabel={`Nivel de acceso de ${feature.label}`}
                            options={FEATURE_ACCESS_OPTIONS}
                            onChange={(access) =>
                              setFeatureAccess(module.id, feature.id, access)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AccessSelect({
  value,
  disabled,
  ariaLabel,
  options,
  onChange,
}: {
  value: PermissionAccess;
  disabled?: boolean;
  ariaLabel: string;
  options: readonly { value: PermissionAccess; label: string }[];
  onChange: (value: PermissionAccess) => void;
}) {
  return (
    <label
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {value === 'ambas' ? (
        <span
          className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-slate-500"
          aria-hidden
        >
          <span className="block h-0.5 w-2 rounded-sm bg-slate-500" />
        </span>
      ) : (
        <i
          className={cn(
            'pi text-[12px] text-slate-500',
            PERMISSION_ACCESS_ICONS[value],
          )}
          aria-hidden
        />
      )}
      <select
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value as PermissionAccess)}
        className="appearance-none border-0 bg-transparent pr-1 outline-none disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
