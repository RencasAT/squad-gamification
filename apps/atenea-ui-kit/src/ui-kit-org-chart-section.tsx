import { Demo, Section } from './ui-kit-primitives';

type OrgPerson = {
  id: string;
  name: string;
  role: string;
};

const LEVELS: OrgPerson[][] = [
  [{ id: 'ceo', name: 'Eduardo Escudero', role: 'CEO' }],
  [
    { id: 'ops', name: 'Pilar Milla', role: 'Ops' },
    { id: 'product', name: 'Operador Demo', role: 'Product' },
  ],
  [
    { id: 'ops-1', name: 'Ana Ríos', role: 'Soporte' },
    { id: 'ops-2', name: 'Luis Vega', role: 'Operaciones' },
    { id: 'prod-1', name: 'María Sol', role: 'Diseño' },
    { id: 'prod-2', name: 'Diego Paz', role: 'Frontend' },
  ],
];

function OrgCard({ person }: { person: OrgPerson }) {
  return (
    <div className="w-40 rounded-xl border border-slate-300 bg-white px-3 py-3 text-center shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{person.name}</p>
      <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
        {person.role}
      </p>
    </div>
  );
}

export function UiKitOrgChartSection() {
  return (
    <Section
      id="faltantes-data-org"
      title="Organization chart"
      description="Jerarquía visual de equipos o roles."
    >
      <Demo name="Jerarquía de ejemplo">
        <div className="w-full rounded-xl border border-slate-200 bg-slate-100 p-6">
          <div className="flex flex-col items-center gap-2">
            {LEVELS.map((level, levelIndex) => (
              <div
                key={`level-${levelIndex}`}
                className="flex flex-col items-center gap-2"
              >
                {levelIndex > 0 ? (
                  <div className="h-5 w-0.5 bg-slate-400" aria-hidden />
                ) : null}
                <div className="flex flex-wrap justify-center gap-3">
                  {level.map((person) => (
                    <OrgCard key={person.id} person={person} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Demo>
    </Section>
  );
}
