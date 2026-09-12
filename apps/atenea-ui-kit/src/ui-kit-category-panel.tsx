import type { ReactNode } from 'react';
import { useState } from 'react';
import type { UiKitCategory } from './ui-kit-categories';

type UiKitCategoryPanelProps = {
  category: UiKitCategory;
  children: (subsectionId: string) => ReactNode;
};

export function UiKitCategoryPanel({
  category,
  children,
}: UiKitCategoryPanelProps) {
  const defaultSubsection = category.subsections[0]?.id ?? '';
  const [subsection, setSubsection] = useState(defaultSubsection);
  const hasSubtabs = category.subsections.length > 1;
  const activeSubsection = hasSubtabs ? subsection : defaultSubsection;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <i className={`pi ${category.icon} text-sm`} />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-800">
              {category.label}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {category.description}
            </p>
          </div>
        </div>

        {hasSubtabs ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {category.subsections.map((item) => {
              const active = item.id === activeSubsection;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSubsection(item.id)}
                  className={
                    active
                      ? 'rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white'
                      : 'rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100'
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {children(activeSubsection)}
    </div>
  );
}
