import { DashboardCard } from './dashboard-card';
import { WEEKLY_GGR_POINTS } from './dashboard.mock';

const SERIES = [
  { key: 'apuestas', label: 'Apuestas', color: '#22c55e' },
  { key: 'premios', label: 'Premios', color: '#ef4444' },
  { key: 'total', label: 'Total', color: '#3b82f6' },
] as const;

const WIDTH = 640;
const HEIGHT = 240;
const PAD = { top: 16, right: 12, bottom: 36, left: 78 };
const Y_MAX = 70_000_000;
const Y_TICKS = [0, 20_000_000, 40_000_000, 60_000_000];

function formatAxisValue(value: number): string {
  return value.toLocaleString('en-US');
}

function toX(index: number): number {
  const inner = WIDTH - PAD.left - PAD.right;
  if (WEEKLY_GGR_POINTS.length <= 1) {
    return PAD.left;
  }
  return PAD.left + (index * inner) / (WEEKLY_GGR_POINTS.length - 1);
}

function toY(value: number): number {
  const inner = HEIGHT - PAD.top - PAD.bottom;
  return PAD.top + inner - (value / Y_MAX) * inner;
}

function toPath(values: number[]): string {
  return values
    .map((value, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${toX(index)} ${toY(value)}`;
    })
    .join(' ');
}

export function WeeklyGgrChart() {
  return (
    <DashboardCard>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-gobold flex items-center gap-2 text-sm tracking-wide text-slate-800 uppercase">
          <i className="pi pi-chart-line text-xs" aria-hidden />
          GGR semanal
        </h2>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {SERIES.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-56 w-full"
        role="img"
        aria-label="GGR semanal de apuestas, premios y total"
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
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400"
                fontSize="10"
              >
                {formatAxisValue(tick)}
              </text>
            </g>
          );
        })}

        {SERIES.map((item) => (
          <path
            key={item.key}
            d={toPath(WEEKLY_GGR_POINTS.map((point) => point[item.key]))}
            fill="none"
            stroke={item.color}
            strokeWidth="2.25"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {WEEKLY_GGR_POINTS.map((point, index) => (
          <text
            key={point.date}
            x={toX(index)}
            y={HEIGHT - 10}
            textAnchor="middle"
            className="fill-slate-400"
            fontSize="9"
          >
            {point.date}
          </text>
        ))}
      </svg>
    </DashboardCard>
  );
}
