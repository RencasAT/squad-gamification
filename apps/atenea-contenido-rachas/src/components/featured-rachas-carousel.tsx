import { Skeleton } from '@primereact/ui/skeleton';
import type { FeaturedRacha } from '../model/racha.types';
import { FeaturedRachaCard } from './featured-racha-card';

type FeaturedRachasCarouselProps = {
  items: FeaturedRacha[];
  isLoading: boolean;
};

export function FeaturedRachasCarousel({
  items,
  isLoading,
}: FeaturedRachasCarouselProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton
            key={index}
            height="14rem"
            borderRadius="1rem"
            className="w-full!"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-400">
        No hay rachas destacadas para este filtro.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((racha) => (
        <FeaturedRachaCard key={racha.id} racha={racha} />
      ))}
    </div>
  );
}
