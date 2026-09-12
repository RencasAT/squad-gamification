import type { ReactNode } from 'react';
import { cn } from '@gamification/shared-utils/utils/cn';

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-5',
        'shadow-[0_4px_18px_rgba(148,163,184,0.22)]',
        className,
      )}
    >
      {children}
    </section>
  );
}
