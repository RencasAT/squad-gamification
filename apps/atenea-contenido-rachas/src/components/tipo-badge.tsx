import { cn } from '@gamification/shared-utils/utils/cn';
import {
  CAMPAIGN_TIPO_LABEL,
  type CampaignRachaTipo,
} from '../model/racha.types';

const TIPO_CLASS: Record<CampaignRachaTipo, string> = {
  casino: 'bg-ink text-white',
  deportivas: 'bg-slate-200 text-slate-700',
  misiones: 'bg-slate-400 text-white',
};

type TipoBadgeProps = {
  tipo: CampaignRachaTipo;
  className?: string;
};

export function TipoBadge({ tipo, className }: TipoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold',
        TIPO_CLASS[tipo],
        className,
      )}
    >
      {CAMPAIGN_TIPO_LABEL[tipo]}
    </span>
  );
}
