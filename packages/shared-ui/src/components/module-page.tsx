type ModulePageProps = {
  title: string;
  description?: string;
};

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {description ?? 'Módulo en construcción.'}
      </p>
    </section>
  );
}
