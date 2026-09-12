import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermissionsQuery } from '@gamification/atenea-administracion-roles/api/use-permissions';
import { useRoleQuery } from '@gamification/atenea-administracion-roles/api/use-roles';
import { roleSchema } from '@gamification/atenea-administracion-roles/model/role.schema';
import {
  emptyRolePermissions,
  moduleAccessFromState,
  type ModulePermissionState,
  type PermissionAccess,
  type RoleFormValues,
  type RolePermission,
  type RolePermissionModuleDef,
  type RolePermissionsState,
} from '@gamification/atenea-administracion-roles/model/role.types';
import type { RoleFormContentProps } from './role-form-drawer';

const EMPTY_CATALOG: RolePermissionModuleDef[] = [];

const defaultFormValues: RoleFormValues = {
  name: '',
  permissions: emptyRolePermissions([]),
};

function initialExpanded(
  catalog: RolePermissionModuleDef[],
  permissions?: RolePermissionsState,
): RolePermission[] {
  if (catalog.length === 0) {
    return [];
  }

  if (permissions) {
    const enabled = catalog
      .filter((module) => permissions[module.id]?.enabled)
      .map((module) => module.id);
    if (enabled.length > 0) {
      return [enabled[0]!];
    }
  }

  return [catalog[0]!.id];
}

type UseRoleFormOptions = {
  open: boolean;
  roleId?: number | null;
  sessionKey?: number;
  onSaved?: (values: RoleFormValues) => void | Promise<void>;
  onClose: () => void;
};

export function useRoleForm({
  open,
  roleId = null,
  sessionKey = 0,
  onSaved,
  onClose,
}: UseRoleFormOptions) {
  const nextSessionRoleId =
    typeof roleId === 'number' && roleId > 0 ? roleId : null;
  const [sessionRoleId, setSessionRoleId] = useState(nextSessionRoleId);
  const [expandedOverride, setExpandedOverride] = useState<
    RolePermission[] | null
  >(null);
  const [prevSessionKey, setPrevSessionKey] = useState(sessionKey);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<RoleFormValues | null>(
    null,
  );

  if (prevSessionKey !== sessionKey) {
    setPrevSessionKey(sessionKey);
    setSessionRoleId(nextSessionRoleId);
    setExpandedOverride(null);
    setConfirmOpen(false);
    setPendingValues(null);
  }

  const effectiveRoleId = open ? nextSessionRoleId : sessionRoleId;
  const isEdit = typeof effectiveRoleId === 'number' && effectiveRoleId > 0;
  const roleQuery = useRoleQuery(open && isEdit ? effectiveRoleId : null);
  const permissionsQuery = usePermissionsQuery({ enabled: open });
  const catalog = permissionsQuery.data ?? EMPTY_CATALOG;
  const loading =
    (permissionsQuery.isPending && catalog.length === 0) ||
    (isEdit && roleQuery.isPending && !roleQuery.data);

  const formValues = useMemo((): RoleFormValues => {
    if (isEdit && roleQuery.data) {
      return {
        name: roleQuery.data.name,
        permissions: roleQuery.data.permissions,
      };
    }

    return {
      name: '',
      permissions: emptyRolePermissions(catalog),
    };
  }, [catalog, isEdit, roleQuery.data]);

  const expandedModules =
    expandedOverride ??
    initialExpanded(catalog, isEdit ? roleQuery.data?.permissions : undefined);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: defaultFormValues,
    values: formValues,
    resetOptions: { keepDirtyValues: true },
  });

  const permissions = useWatch({ control, name: 'permissions' });
  const name = useWatch({ control, name: 'name' }) ?? '';

  const toggleModuleExpanded = useCallback(
    (moduleId: RolePermission) => {
      setExpandedOverride((prev) => {
        const current = prev ?? expandedModules;
        return current.includes(moduleId)
          ? current.filter((id) => id !== moduleId)
          : [...current, moduleId];
      });
    },
    [expandedModules],
  );

  const toggleModule = (moduleId: RolePermission) => {
    const current = getValues('permissions');
    const moduleDef = catalog.find((module) => module.id === moduleId);
    if (!moduleDef) {
      return;
    }

    const enabled = !current[moduleId].enabled;
    const access = moduleAccessFromState(current[moduleId]);
    const nextFeatures = Object.fromEntries(
      moduleDef.features.map((feature) => [
        feature.id,
        {
          enabled,
          access: current[moduleId].features[feature.id]?.access ?? access,
        },
      ]),
    );

    setValue(
      'permissions',
      {
        ...current,
        [moduleId]: { enabled, features: nextFeatures },
      },
      { shouldDirty: true },
    );
  };

  const setModuleAccess = (
    moduleId: RolePermission,
    access: PermissionAccess,
  ) => {
    const current = getValues('permissions');
    const moduleState = current[moduleId];
    const nextFeatures = Object.fromEntries(
      Object.entries(moduleState.features).map(([featureId, feature]) => [
        featureId,
        { ...feature, access },
      ]),
    );

    setValue(
      'permissions',
      {
        ...current,
        [moduleId]: { ...moduleState, features: nextFeatures },
      },
      { shouldDirty: true },
    );
  };

  const toggleFeature = (moduleId: RolePermission, featureId: string) => {
    const current = getValues('permissions');
    const feature = current[moduleId].features[featureId];
    if (!feature) {
      return;
    }

    const nextModule: ModulePermissionState = {
      ...current[moduleId],
      features: {
        ...current[moduleId].features,
        [featureId]: { ...feature, enabled: !feature.enabled },
      },
    };
    const anyFeatureEnabled = Object.values(nextModule.features).some(
      (item) => item.enabled,
    );

    setValue(
      'permissions',
      {
        ...current,
        [moduleId]: { ...nextModule, enabled: anyFeatureEnabled },
      },
      { shouldDirty: true },
    );
  };

  const setFeatureAccess = (
    moduleId: RolePermission,
    featureId: string,
    access: PermissionAccess,
  ) => {
    const current = getValues('permissions');
    const feature = current[moduleId].features[featureId];
    if (!feature) {
      return;
    }

    setValue(
      'permissions',
      {
        ...current,
        [moduleId]: {
          ...current[moduleId],
          features: {
            ...current[moduleId].features,
            [featureId]: { ...feature, access },
          },
        },
      },
      { shouldDirty: true },
    );
  };

  const onSubmit = handleSubmit(async (values) => {
    setPendingValues(values);
    setConfirmOpen(true);
  });

  const confirmSave = async () => {
    if (!pendingValues) {
      return;
    }
    await onSaved?.(pendingValues);
  };

  const cancelConfirm = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  const finishConfirmSuccess = () => {
    setConfirmOpen(false);
    setPendingValues(null);
    onClose();
  };

  const canSubmit = name.trim().length >= 2 && !isSubmitting && !loading;

  return {
    isEdit,
    loading,
    isSubmitting,
    canSubmit,
    onSubmit,
    confirmOpen,
    pendingRoleName: pendingValues?.name?.trim() || name.trim(),
    confirmSave,
    cancelConfirm,
    finishConfirmSuccess,
    contentProps: {
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
    } satisfies RoleFormContentProps,
  };
}
