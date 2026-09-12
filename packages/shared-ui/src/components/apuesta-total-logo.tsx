import { cn } from '@gamification/shared-utils/utils/cn';

type ApuestaTotalLogoProps = {
  className?: string;
  tagline?: string;
};

export function ApuestaTotalLogo({
  className,
  tagline = 'Plataforma de Gamificación',
}: ApuestaTotalLogoProps) {
  return (
    <div className={cn('text-center', className)}>
      <h1 className="text-[42px] leading-none font-extrabold tracking-tight">
        <span className="text-brand">apuesta</span>
        <span className="text-ink">total</span>
      </h1>
      {tagline ? <p className="mt-3 text-xl text-black">{tagline}</p> : null}
    </div>
  );
}
