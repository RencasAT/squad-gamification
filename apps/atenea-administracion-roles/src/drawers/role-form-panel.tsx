import { useRef } from 'react';
import { Button } from '@primereact/ui/button';
import { AppDrawer } from '@gamification/shared-ui/components/app-drawer';
import { cn } from '@gamification/shared-utils/utils/cn';
import { ActualizarPermisosRolModal } from '@gamification/atenea-administracion-roles/modals/actualizar-permisos-rol-modal';
import { CrearRolModal } from '@gamification/atenea-administracion-roles/modals/crear-rol-modal';
import { type RoleFormValues } from '@gamification/atenea-administracion-roles/model/role.types';
import { RoleFormContent } from './role-form-drawer';
import { useRoleForm } from './use-role-form';

type RoleFormPanelProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (values: RoleFormValues) => void | Promise<void>;
  roleId?: number | null;
  sessionKey?: number;
};

export function RoleFormPanel({
  open,
  onClose,
  onSaved,
  roleId = null,
  sessionKey = 0,
}: RoleFormPanelProps) {
  const savedRef = useRef(false);
  const roleForm = useRoleForm({
    open,
    roleId,
    sessionKey,
    onSaved,
    onClose,
  });

  const handleConfirmClose = () => {
    if (savedRef.current) {
      savedRef.current = false;
      roleForm.finishConfirmSuccess();
      return;
    }
    roleForm.cancelConfirm();
  };

  const handleConfirm = async () => {
    await roleForm.confirmSave();
    savedRef.current = true;
  };

  return (
    <>
      <AppDrawer
        open={open}
        onClose={onClose}
        title={roleForm.isEdit ? 'Editar rol' : 'Nuevo rol'}
        description={
          roleForm.isEdit
            ? 'Selecciona los permisos para el rol que vas a editar.'
            : 'Selecciona los permisos para el rol que vas a crear.'
        }
        titleId="role-form-title"
        onSubmit={roleForm.onSubmit}
        loading={roleForm.loading}
        loadingLabel="Cargando permisos..."
        footer={
          <Button
            type="submit"
            disabled={!roleForm.canSubmit}
            className={cn(
              'h-12! w-full! justify-center! rounded-xl! border-0! text-sm! font-semibold! shadow-none!',
              roleForm.canSubmit
                ? 'bg-brand! text-white! hover:bg-brand-hover!'
                : 'bg-[#F5F5F5]! text-slate-400! hover:bg-[#F5F5F5]! disabled:opacity-100!',
            )}
          >
            {roleForm.isEdit
              ? roleForm.isSubmitting
                ? 'Actualizando...'
                : 'Actualizar rol'
              : roleForm.isSubmitting
                ? 'Creando...'
                : 'Crear rol'}
          </Button>
        }
      >
        <RoleFormContent {...roleForm.contentProps} />
      </AppDrawer>

      {roleForm.isEdit ? (
        <ActualizarPermisosRolModal
          open={roleForm.confirmOpen}
          roleName={roleForm.pendingRoleName || null}
          onClose={handleConfirmClose}
          onConfirm={handleConfirm}
        />
      ) : (
        <CrearRolModal
          open={roleForm.confirmOpen}
          roleName={roleForm.pendingRoleName || null}
          onClose={handleConfirmClose}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
