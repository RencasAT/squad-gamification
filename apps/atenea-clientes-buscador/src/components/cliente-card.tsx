import type { ReactNode } from 'react';
import { cn } from '@gamification/shared-utils/utils/cn';

/** Superficie de card del módulo clientes (Figma). */
const clienteCardClassName =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(148,163,184,0.22)]';

type ClienteCardProps = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'article' | 'div';
};

export function ClienteCard({
  children,
  className,
  as: Tag = 'section',
}: ClienteCardProps) {
  return <Tag className={cn(clienteCardClassName, className)}>{children}</Tag>;
}
