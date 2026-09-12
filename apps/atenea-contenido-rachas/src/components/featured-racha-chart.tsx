import type { RachaMonthlyPoint } from '../model/racha.types';

const WIDTH = 560;
const HEIGHT = 168;
const PAD = { top: 28, right: 8, bottom: 36, left: 42 };
const Y_MAX = 20_000;
const Y_TICKS = [0, 5_000, 10_000, 15_000, 20_000];

function formatY(value: number): string {
  if (value === 0) {
    return 'S/0';
  }
  return `S/${value / 1000}K`;
}

function barX(index: number, count: number): number {
  const inner = WIDTH - PAD.left - PAD.right;
  const slot = inner / count;
  return PAD.left + slot * index + slot * 0.2;
}

function barWidth(count: number): number {
  const inner = WIDTH - PAD.left - PAD.right;
  return (inner / count) * 0.6;
}

function toY(value: number): number {
  const inner = HEIGHT - PAD.top - PAD.bottom;
  return PAD.top + inner - (Math.min(value, Y_MAX) / Y_MAX) * inner;
}

type FeaturedRachaChartProps = {
  series: RachaMonthlyPoint[];
  yearLabel: string;
};

export function FeaturedRachaChart({
  series,
  yearLabel,
}: FeaturedRachaChartProps) {
  const count = series.length;
  const width = barWidth(count);
  const baseline = toY(0);

  return (
    <div className="flex h-full w-full flex-col">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[9.5rem] w-full"
        role="img"
        aria-label={`Serie mensual ${yearLabel}`}
      >
        {Y_TICKS.map((tick) => {
          const y = toY(tick);
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                stroke="#e8edf2"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400"
                fontSize="10"
              >
                {formatY(tick)}
              </text>
            </g>
          );
        })}

        {series.map((point, index) => {
          const x = barX(index, count);
          const y = toY(point.value);
          const height = Math.max(baseline - y, 0);

          return (
            <g key={point.month}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx="3"
                className="fill-slate-500"
              />
              {point.label ? (
                <g>
                  <rect
                    x={x + width / 2 - 22}
                    y={y - 22}
                    width="44"
                    height="16"
                    rx="4"
                    className="fill-ink"
                  />
                  <text
                    x={x + width / 2}
                    y={y - 11}
                    textAnchor="middle"
                    className="fill-white"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {point.label}
                  </text>
                </g>
              ) : null}
              <text
                x={x + width / 2}
                y={HEIGHT - 18}
                textAnchor="middle"
                className="fill-slate-400"
                fontSize="9"
              >
                {point.month}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-center text-xs text-slate-500">{yearLabel}</p>
    </div>
  );
}
