import type { ReactNode } from 'react';
import { cn } from '@gamification/shared-utils/utils/cn';

const rachasCardClassName =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(148,163,184,0.22)]';

type RachasCardProps = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'article' | 'div';
};

export function RachasCard({
  children,
  className,
  as: Tag = 'section',
}: RachasCardProps) {
  return <Tag className={cn(rachasCardClassName, className)}>{children}</Tag>;
}
