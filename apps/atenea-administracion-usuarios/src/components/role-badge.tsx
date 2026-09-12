import { HoverPopup } from '@gamification/shared-ui/components/hover-popup';
import type { AssignableRoleModule, UserRoleRef } from '../model/user.types';

type RoleBadgeProps = {
  role: UserRoleRef;
  modules?: AssignableRoleModule[];
};

export function RoleBadge({ role, modules = [] }: RoleBadgeProps) {
  const hasModules = modules.length > 0;

  return (
    <HoverPopup
      label={role.name}
      infoLabel={hasModules ? `Permisos del rol ${role.name}` : role.name}
      popupLabel={`Permisos de ${role.name}`}
      disabled={!hasModules}
      placement="right"
      triggerClassName="rounded-full bg-[#A4A4A4] text-white"
      popupClassName="min-w-60 max-w-75"
    >
      <ul className="space-y-2">
        {modules.map((module) => (
          <li key={module.id} className="text-[13px] font-medium text-ink">
            {module.label}
          </li>
        ))}
      </ul>
    </HoverPopup>
  );
}
