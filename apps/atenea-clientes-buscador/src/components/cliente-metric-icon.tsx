import type { ReactNode, SVGProps } from 'react';
import { cn } from '@gamification/shared-utils/utils/cn';

export type ClienteMetricIconName =
  'soccer' | 'odds' | 'wallet' | 'chart' | 'star' | 'slots' | 'ticket' | 'pin';

type ClienteMetricIconProps = {
  name: ClienteMetricIconName;
  className?: string;
};

const ICONS: Record<
  ClienteMetricIconName,
  (props: SVGProps<SVGSVGElement>) => ReactNode
> = {
  soccer: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8.2 14.4 10l-.9 2.8h-3L9.6 10 12 8.2Z" fill="currentColor" />
      <path
        d="m14.4 10 2.8-.4M9.6 10l-2.8-.4M13.5 12.8l1.7 2.6M10.5 12.8l-1.7 2.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  odds: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M7.2 8.2A6.2 6.2 0 0 1 18 10.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16.8 15.8A6.2 6.2 0 0 1 6 13.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16.5 7.2v3.2h3.2M7.5 16.8v-3.2H4.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.4v5.2M10.6 10.6c.3-.7.9-1.1 1.6-1.1.9 0 1.5.5 1.5 1.2 0 1.6-3.1 1-3.1 2.5 0 .8.7 1.4 1.6 1.4.8 0 1.4-.4 1.6-1.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  wallet: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="3.5"
        y="6.5"
        width="17"
        height="12"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.5 10h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16.2" cy="14.2" r="1" fill="currentColor" />
    </svg>
  ),
  chart: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4.5 16.5 9 12l3.2 3.2 7.3-7.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2 7.5h4.3v4.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  star: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="m12 4.2 2.1 4.4 4.8.7-3.4 3.4.8 4.8L12 15.2l-4.3 2.3.8-4.8-3.4-3.4 4.8-.7L12 4.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  ),
  slots: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    </svg>
  ),
  ticket: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4.5 8.2c0-.9.7-1.7 1.7-1.7h11.6c.9 0 1.7.8 1.7 1.7v1.2a1.6 1.6 0 1 0 0 3.2v1.2c0 .9-.8 1.7-1.7 1.7H6.2c-1 0-1.7-.8-1.7-1.7v-1.2a1.6 1.6 0 1 0 0-3.2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 7.5v9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeDasharray="1.6 2.2"
      />
    </svg>
  ),
  pin: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9.6 10.4 1.6 1.6 3.3-3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function ClienteMetricIcon({ name, className }: ClienteMetricIconProps) {
  const Icon = ICONS[name];

  return <Icon className={cn('h-6 w-6 shrink-0 text-brand', className)} />;
}
