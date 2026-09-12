import { cn } from '@gamification/shared-utils/utils/cn';
import type { ClienteTabId } from '../model/cliente.types';

const CLIENT_TABS: { id: ClienteTabId; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'grupos', label: 'Grupos' },
  { id: 'logros', label: 'Logros' },
  { id: 'torneos', label: 'Competencias' },
  { id: 'misiones', label: 'Misiones' },
];

type ClienteSectionTabsProps = {
  activeTab: ClienteTabId;
  onChange: (tab: ClienteTabId) => void;
};

export function ClienteSectionTabs({
  activeTab,
  onChange,
}: ClienteSectionTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Secciones del cliente"
      className="flex w-full gap-1.5 overflow-x-auto rounded-full bg-[#e8eef4] p-1.5"
    >
      {CLIENT_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'min-h-12 min-w-28 flex-1 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
              isActive
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-white/80',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
