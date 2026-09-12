import type { ReactNode } from 'react';

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </header>
      <div className="space-y-6 px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

export function Demo({
  name,
  description,
  children,
}: {
  name: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {name}
        </p>
        {description ? (
          <p className="text-xs text-slate-400">{description}</p>
        ) : null}
      </div>
      <div className="flex w-full flex-wrap items-start gap-3">{children}</div>
    </div>
  );
}

export function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">
      {children}
    </h4>
  );
}

export function Field({
  label,
  error,
  control,
}: {
  label: string;
  error?: string;
  control: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-600">
        {label}
      </label>
      {control}
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  );
}
