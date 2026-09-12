import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { cn } from '@gamification/shared-utils/utils/cn';
import type { FeaturedRacha } from '../model/racha.types';
import { FeaturedRachaChart } from './featured-racha-chart';

const SLIDE_COUNT = 3;

type FeaturedRachaCardProps = {
  racha: FeaturedRacha;
};

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 2.5c.4 2.2-.2 3.8-1.4 5.2-1 1.2-1.6 2.2-1.6 3.6 0 1.5.7 2.7 1.8 3.4-.5-.9-.6-1.9-.2-2.9.9 1.6 2.6 2.5 2.6 4.7 0 2.5-1.8 4.5-4.5 4.5S4.2 18.5 4.2 16c0-3.2 2.1-5.4 4.3-7.6C9.8 7 10.8 5.5 11 3.8c.3-.7.6-1.1 1-1.3Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M14.8 9.2c.8 1.1 1.2 2.2 1.2 3.5 0 3-2.2 5.3-5 5.3-.4 0-.8 0-1.1-.1 1.3-.5 2.2-1.8 2.2-3.3 0-1.5-.8-2.6-1.9-3.7-.3-.3-.6-.6-.8-1 .8-.2 1.7-.2 2.5.1 1 .4 1.9 1.1 2.9-.8Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

function MetricBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-h-[4.75rem] flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-3 text-center">
      <p className="font-gobold text-[1.35rem] leading-none tracking-wide text-slate-900 uppercase">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] leading-snug text-slate-500">{label}</p>
    </div>
  );
}

function NavArrow({
  direction,
  onClick,
  className,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Anterior' : 'Siguiente'}
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-slate-600',
        direction === 'prev' ? 'left-0' : 'right-0',
        className,
      )}
    >
      <i
        className={cn(
          'pi text-base',
          direction === 'prev' ? 'pi-chevron-left' : 'pi-chevron-right',
        )}
        aria-hidden
      />
    </button>
  );
}

export function FeaturedRachaCard({ racha }: FeaturedRachaCardProps) {
  const [slide, setSlide] = useState(0);

  const goPrev = () => setSlide((current) => Math.max(0, current - 1));
  const goNext = () =>
    setSlide((current) => Math.min(SLIDE_COUNT - 1, current + 1));

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl bg-white px-5 pt-4 pb-3 shadow-[0_4px_18px_rgba(148,163,184,0.18)]">
      <header className="flex items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
          <FlameIcon className="size-6" />
        </span>

        <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2">
          <h3 className="font-gobold min-w-0 text-[15px] leading-tight tracking-wide text-slate-900 uppercase">
            {racha.name}
          </h3>
          <div className="flex flex-wrap justify-end gap-1.5">
            {racha.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex min-h-7 items-center rounded-full bg-ink px-3 text-xs font-semibold whitespace-nowrap text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="relative min-h-[10.5rem] flex-1 px-6">
        {slide > 0 ? <NavArrow direction="prev" onClick={goPrev} /> : null}
        {slide < SLIDE_COUNT - 1 ? (
          <NavArrow direction="next" onClick={goNext} />
        ) : null}

        {slide === 0 ? (
          <div className="flex h-full items-center gap-2.5">
            <MetricBox
              value={racha.activePlayersLabel}
              label="Jugadores activos"
            />
            <MetricBox value={racha.maxStreakLabel} label="Racha Max." />
            <MetricBox
              value={String(racha.lostToday)}
              label="Rachas perdidas (hoy)"
            />
          </div>
        ) : null}

        {slide === 1 ? (
          <FeaturedRachaChart
            series={racha.monthlySeries}
            yearLabel={racha.yearLabel}
          />
        ) : null}

        {slide === 2 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-1">
            <div className="flex min-h-[5.5rem] w-full max-w-xs flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-4 text-center">
              <p className="font-gobold text-3xl leading-none tracking-wide text-slate-900">
                {racha.pendingClaims}
              </p>
              <p className="mt-2 text-sm text-slate-700">Reclamos pendientes</p>
            </div>
            <Button
              type="button"
              className="h-10! rounded-xl! border-0! bg-ink! px-6! text-sm! font-semibold! text-white! shadow-none! hover:bg-slate-800!"
            >
              Ir a AAC
            </Button>
          </div>
        ) : null}
      </div>

      <div
        className="flex items-center justify-center gap-2"
        aria-label="Slides de la racha"
      >
        {Array.from({ length: SLIDE_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Slide ${index + 1}`}
            aria-current={index === slide ? 'true' : undefined}
            onClick={() => setSlide(index)}
            className={cn(
              'size-2 rounded-full transition-colors',
              index === slide ? 'bg-slate-400' : 'bg-slate-300',
            )}
          />
        ))}
      </div>
    </article>
  );
}
