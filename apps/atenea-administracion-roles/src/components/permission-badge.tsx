import { HoverPopup } from '@gamification/shared-ui/components/hover-popup';
import { PermissionAccessMark } from '@gamification/shared-ui/components/permission-access-mark';
import {
  getRoleModuleDetails,
  type ModulePermissionState,
  type RolePermissionModuleDef,
} from '../model/role.types';

type PermissionBadgeProps = {
  module: RolePermissionModuleDef;
  moduleState?: ModulePermissionState;
};

export function PermissionBadge({ module, moduleState }: PermissionBadgeProps) {
  const label = module.badgeLabel ?? module.label;
  const details = getRoleModuleDetails(module, moduleState);

  return (
    <HoverPopup
      label={label}
      infoLabel={`Detalle de permisos: ${label}`}
      popupLabel={`Permisos de ${label}`}
      disabled={details.length === 0}
      placement="right"
      triggerClassName="rounded-full bg-[#A4A4A4] text-white"
      popupClassName="min-w-60 max-w-75"
    >
      <ul className="space-y-2">
        {details.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-6 text-[13px]"
          >
            <span className="font-medium text-ink">{item.label}</span>
            <PermissionAccessMark access={item.access} />
          </li>
        ))}
      </ul>
    </HoverPopup>
  );
}
