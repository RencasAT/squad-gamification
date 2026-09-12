import { useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '@primereact/ui/button';
import { AppDrawer } from '@gamification/shared-ui/components/app-drawer';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { FloatSelect } from '@gamification/shared-ui/components/float-select';
import { FloatTextarea } from '@gamification/shared-ui/components/float-textarea';
import { cn } from '@gamification/shared-utils/utils/cn';
import { TycRichEditor } from '../components/tyc-rich-editor';
import { ConfirmarCrearRachaModal } from '../modals/confirmar-crear-racha-modal';

const STEPS = 3;

const RACHA_TIPOS = [
  { value: 'apuestas-deportivas', label: 'Apuestas deportivas' },
  { value: 'casino', label: 'Casino' },
  { value: 'cross', label: 'Cross' },
  { value: 'misiones', label: 'Misiones' },
] as const;

const TIPO_APUESTA_OPTIONS = [
  { value: 'simple', label: 'Simple' },
  { value: 'combinada', label: 'Combinada' },
  { value: 'sistema', label: 'Sistema' },
] as const;

const TIPO_EVENTO_OPTIONS = [
  { value: 'partido', label: 'Partido' },
  { value: 'torneo', label: 'Torneo' },
  { value: 'liga', label: 'Liga' },
] as const;

const PERIODICIDAD_OPTIONS = [
  { value: 'diaria', label: 'Diaria' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
] as const;

const PREMIO_OPTIONS = [
  { value: 'freebet-5', label: 'Freebet S/5' },
  { value: 'freebet-10', label: 'Freebet S/10' },
  { value: 'bonus-20', label: 'Bonus S/20' },
  { value: 'giro-gratis', label: 'Giro gratis' },
] as const;

const TYC_TEMPLATES = [
  {
    value: 'champions-apuestas-diarias-tyc',
    label: 'Champions-apuestas-diarias-tyc',
  },
  {
    value: 'racha-login-tyc',
    label: 'Racha-login-tyc',
  },
  {
    value: 'apuesta-diaria-min-tyc',
    label: 'Apuesta-diaria-min-tyc',
  },
] as const;

const DEMO_TYC_HTML = `
<h2>Términos y Condiciones</h2>
<p>La promoción <strong>“Champions apuestas diarias”</strong> estará vigente del <strong>01/03/2026</strong> al <strong>30/06/2026</strong>.</p>
<p>Para participar, el usuario deberá realizar apuestas deportivas en partidos de la Champions League por un monto mínimo de <strong>S/10.00</strong> y con una cuota mínima de <strong>1.50</strong>.</p>
<ul>
  <li>La racha se contabiliza de forma diaria.</li>
  <li>Solo se consideran apuestas simples liquidables.</li>
  <li>Los premios se acreditan según los hitos configurados.</li>
</ul>
<p>ApostaTotal se reserva el derecho de modificar o cancelar la promoción ante fraude o incumplimiento de estos términos.</p>
`.trim();

type RachaTipoValue = (typeof RACHA_TIPOS)[number]['value'];

export type PremioHito = {
  id: string;
  streakNumber: string;
  premioId: string;
};

export type CrearRachaFormValues = {
  name: string;
  description: string;
  tipo: RachaTipoValue | '';
  repairable: boolean;
  tipoApuesta: string;
  tipoEvento: string;
  sportMarketEventId: string;
  montoMinimo: string;
  cuotaMinima: string;
  periodicidad: string;
  fechaInicio: string;
  fechaFinal: string;
  premios: PremioHito[];
  iconDataUrl: string;
  tycTemplateId: string;
  tycHtml: string;
};

function createHito(): PremioHito {
  return {
    id: crypto.randomUUID(),
    streakNumber: '',
    premioId: '',
  };
}

const EMPTY_FORM: CrearRachaFormValues = {
  name: '',
  description: '',
  tipo: '',
  repairable: false,
  tipoApuesta: '',
  tipoEvento: '',
  sportMarketEventId: '',
  montoMinimo: '',
  cuotaMinima: '',
  periodicidad: '',
  fechaInicio: '',
  fechaFinal: '',
  premios: [createHito()],
  iconDataUrl: '',
  tycTemplateId: '',
  tycHtml: '',
};

/** Icono demo (balón genérico) para el preview del paso 3. */
const DEMO_ICON_DATA_URL =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
  <circle cx="48" cy="48" r="44" fill="#0B1B33"/>
  <circle cx="48" cy="48" r="38" stroke="#C9A227" stroke-width="2.5"/>
  <path d="M48 18l3.2 9.8h10.3l-8.3 6 3.2 9.8L48 37.6 39.6 43.6l3.2-9.8-8.3-6h10.3L48 18z" fill="#C9A227"/>
  <path d="M48 28c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z" stroke="#E8EEF5" stroke-width="1.5" opacity=".55"/>
  <path d="M28 48h40M48 28v40M34 34l28 28M62 34L34 62" stroke="#E8EEF5" stroke-width="1.2" opacity=".35"/>
</svg>
`.trim(),
  );

/** Datos de demo (mock Figma) para prellenar el paso 1. */
const DEMO_FORM: CrearRachaFormValues = {
  name: 'Champions apuestas diarias',
  description:
    'Realiza apuestas en partidos de la Champions de monto mínimo S/10 y cuota mínima de 1.5.',
  tipo: 'apuestas-deportivas',
  repairable: true,
  tipoApuesta: 'simple',
  tipoEvento: 'partido',
  sportMarketEventId: 'champions-league-2026',
  montoMinimo: '10',
  cuotaMinima: '1.5',
  periodicidad: 'diaria',
  fechaInicio: '2026-03-01',
  fechaFinal: '2026-06-30',
  premios: [
    {
      id: 'demo-hito-1',
      streakNumber: '7',
      premioId: 'freebet-5',
    },
  ],
  iconDataUrl: DEMO_ICON_DATA_URL,
  tycTemplateId: 'champions-apuestas-diarias-tyc',
  tycHtml: DEMO_TYC_HTML,
};

function createDemoForm(): CrearRachaFormValues {
  return {
    ...DEMO_FORM,
    premios: DEMO_FORM.premios.map((hito) => ({
      ...hito,
      id: createHito().id,
    })),
  };
}

const STEP_DESCRIPTION: Record<number, string> = {
  1: 'Configura tu racha.',
  2: 'Selecciona los premios de la racha.',
  3: 'Configura el icono de la racha y los términos y condiciones.',
};

type CrearRachaDrawerProps = {
  open: boolean;
  onClose: () => void;
  onNext?: (values: CrearRachaFormValues) => void | Promise<void>;
};

function Stepper({ current }: { current: number }) {
  return (
    <div
      className="flex gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={STEPS}
      aria-valuenow={current}
      aria-label={`Paso ${current} de ${STEPS}`}
    >
      {Array.from({ length: STEPS }, (_, index) => {
        const step = index + 1;
        return (
          <span
            key={step}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              step <= current ? 'bg-ink' : 'bg-[#D7E3F4]',
            )}
          />
        );
      })}
    </div>
  );
}

function DeportivasFields({
  values,
  onChange,
}: {
  values: CrearRachaFormValues;
  onChange: <K extends keyof CrearRachaFormValues>(
    key: K,
    value: CrearRachaFormValues[K],
  ) => void;
}) {
  const tipoApuestaId = useId();
  const tipoEventoId = useId();
  const sportId = useId();
  const montoId = useId();
  const cuotaId = useId();
  const periodicidadId = useId();
  const inicioId = useId();
  const finalId = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <FloatSelect
          id={tipoApuestaId}
          label="Tipo de apuesta"
          value={values.tipoApuesta}
          onChange={(value) => onChange('tipoApuesta', value)}
          options={TIPO_APUESTA_OPTIONS}
        />
        <FloatSelect
          id={tipoEventoId}
          label="Tipo de evento"
          value={values.tipoEvento}
          onChange={(value) => onChange('tipoEvento', value)}
          options={TIPO_EVENTO_OPTIONS}
        />
      </div>

      <FloatInput
        id={sportId}
        label="ID del deporte/mercado/evento"
        value={values.sportMarketEventId}
        onChange={(event) => onChange('sportMarketEventId', event.target.value)}
        autoComplete="off"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <FloatInput
          id={montoId}
          label="Monto mínimo"
          inputMode="decimal"
          value={values.montoMinimo}
          onChange={(event) => onChange('montoMinimo', event.target.value)}
          autoComplete="off"
        />
        <FloatInput
          id={cuotaId}
          label="Cuota mínima"
          inputMode="decimal"
          value={values.cuotaMinima}
          onChange={(event) => onChange('cuotaMinima', event.target.value)}
          autoComplete="off"
        />
      </div>

      <FloatSelect
        id={periodicidadId}
        label="Periodicidad"
        value={values.periodicidad}
        onChange={(value) => onChange('periodicidad', value)}
        options={PERIODICIDAD_OPTIONS}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <FloatInput
          id={inicioId}
          label="Fecha de inicio"
          type="date"
          icon="pi-calendar"
          value={values.fechaInicio}
          onChange={(event) => onChange('fechaInicio', event.target.value)}
          className="[color-scheme:light]"
        />
        <FloatInput
          id={finalId}
          label="Fecha final"
          type="date"
          icon="pi-calendar"
          value={values.fechaFinal}
          onChange={(event) => onChange('fechaFinal', event.target.value)}
          className="[color-scheme:light]"
        />
      </div>
    </div>
  );
}

function EmptyCriteriaState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <span
        className="inline-flex size-14 items-center justify-center rounded-full bg-[#E8EEF6] text-[#9AA8BC]"
        aria-hidden
      >
        <i className="pi pi-info-circle text-3xl leading-none" />
      </span>
      <p className="max-w-xs text-sm leading-snug text-slate-400">{message}</p>
    </div>
  );
}

function PremiosStep({
  premios,
  onChange,
  onAdd,
  onRemove,
}: {
  premios: PremioHito[];
  onChange: (id: string, patch: Partial<PremioHito>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="relative flex flex-col gap-4 pl-1">
      {premios.map((hito, index) => {
        const isLast = index === premios.length - 1;
        const numeroId = `premio-numero-${hito.id}`;
        const premioId = `premio-select-${hito.id}`;

        return (
          <div key={hito.id} className="relative flex items-start gap-3">
            {!isLast ? (
              <span
                className="absolute top-10 left-[17px] h-[calc(100%+0.5rem)] w-px bg-slate-200"
                aria-hidden
              />
            ) : null}

            <span
              className="relative z-10 mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-[#F3F5F8] text-slate-500"
              aria-hidden
            >
              <i className="pi pi-gift text-sm" />
            </span>

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
              <div className="w-full max-w-40 min-w-28 flex-1">
                <FloatInput
                  id={numeroId}
                  label="Número de racha"
                  inputMode="numeric"
                  value={hito.streakNumber}
                  onChange={(event) =>
                    onChange(hito.id, { streakNumber: event.target.value })
                  }
                  autoComplete="off"
                />
              </div>
              <div className="min-w-0 flex-[1.4]">
                <FloatSelect
                  id={premioId}
                  label="Selección de premio"
                  value={hito.premioId}
                  onChange={(value) => onChange(hito.id, { premioId: value })}
                  options={PREMIO_OPTIONS}
                />
              </div>
              {premios.length > 1 ? (
                <button
                  type="button"
                  aria-label="Quitar hito"
                  onClick={() => onRemove(hito.id)}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <i className="pi pi-trash text-sm" />
                </button>
              ) : null}
            </div>
          </div>
        );
      })}

      <div className="relative flex items-center gap-3">
        {premios.length > 0 ? (
          <span
            className="absolute top-[-1rem] left-[17px] h-4 w-px bg-slate-200"
            aria-hidden
          />
        ) : null}
        <button
          type="button"
          onClick={onAdd}
          className="relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white hover:bg-slate-800"
          aria-label="Agregar otro hito de premio"
        >
          <i className="pi pi-plus text-sm" />
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          Agregar otro hito de premio
        </button>
      </div>
    </div>
  );
}

function canGoNextStep1(values: CrearRachaFormValues): boolean {
  if (!values.name.trim() || !values.tipo) {
    return false;
  }

  if (values.tipo !== 'apuestas-deportivas') {
    return false;
  }

  return Boolean(
    values.tipoApuesta &&
    values.tipoEvento &&
    values.sportMarketEventId.trim() &&
    values.montoMinimo.trim() &&
    values.cuotaMinima.trim() &&
    values.periodicidad &&
    values.fechaInicio &&
    values.fechaFinal,
  );
}

function canGoNextStep2(values: CrearRachaFormValues): boolean {
  if (values.premios.length === 0) {
    return false;
  }

  return values.premios.every(
    (hito) => hito.streakNumber.trim() && hito.premioId,
  );
}

function isTycEmpty(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text.length === 0;
}

function canFinishStep3(values: CrearRachaFormValues): boolean {
  return Boolean(values.tycTemplateId) && !isTycEmpty(values.tycHtml);
}

function RachaPreviewCard({
  name,
  description,
  totalDays,
  iconDataUrl,
}: {
  name: string;
  description: string;
  totalDays: number;
  iconDataUrl?: string;
}) {
  const days = Math.max(totalDays, 1);
  const segmentCount = Math.min(Math.max(days, 1), 10);

  return (
    <div className="rounded-2xl bg-white px-4 py-3.5 shadow-[0_6px_18px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex size-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
          {iconDataUrl ? (
            <img src={iconDataUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-slate-300">
              <i className="pi pi-image text-sm" aria-hidden />
            </span>
          )}
        </span>

        <p className="min-w-0 flex-1 font-gobold text-[13px] leading-tight tracking-wide text-slate-900 uppercase italic">
          {name || 'Nombre de la racha'}
        </p>

        <span
          className="inline-flex size-5 shrink-0 items-center justify-center text-slate-400"
          aria-hidden
        >
          <i className="pi pi-info-circle text-sm leading-none" />
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-slate-600">
        {description || 'Descripción de la racha'}
      </p>

      <div className="mt-4">
        <div className="flex gap-1.5">
          {Array.from({ length: segmentCount }, (_, index) => (
            <span
              key={index}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                index === 0
                  ? 'bg-linear-to-r from-[#3B82F6] to-[#93C5FD] shadow-[0_0_6px_rgba(59,130,246,0.55)]'
                  : 'bg-slate-200',
              )}
            />
          ))}
        </div>
        <p className="mt-1.5 text-right text-[11px] font-medium text-slate-600">
          1/{segmentCount} dias
        </p>
      </div>
    </div>
  );
}

function IconosTycStep({
  values,
  onPatch,
}: {
  values: CrearRachaFormValues;
  onPatch: (patch: Partial<CrearRachaFormValues>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tycSelectId = useId();
  const totalDays = Math.max(
    ...values.premios.map((hito) => Number(hito.streakNumber) || 0),
    7,
  );

  const handleIconPick = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPatch({ iconDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateChange = (templateId: string) => {
    if (templateId === 'champions-apuestas-diarias-tyc') {
      onPatch({ tycTemplateId: templateId, tycHtml: DEMO_TYC_HTML });
      return;
    }

    onPatch({
      tycTemplateId: templateId,
      tycHtml: values.tycHtml.trim()
        ? values.tycHtml
        : '<p><strong>Términos y Condiciones</strong></p><p></p>',
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-stretch gap-3">
        <div className="flex flex-col">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              handleIconPick(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'relative flex min-h-[6.5rem] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5',
              'text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600',
            )}
            aria-label="Subir icono de la racha"
          >
            {values.iconDataUrl ? (
              <img
                src={values.iconDataUrl}
                alt=""
                className="size-full object-contain"
              />
            ) : (
              <i className="pi pi-plus text-xl" aria-hidden />
            )}
          </button>
          {values.iconDataUrl ? (
            <button
              type="button"
              className="mt-1.5 text-left text-[11px] text-slate-500 hover:text-slate-800"
              onClick={() => onPatch({ iconDataUrl: '' })}
            >
              Quitar icono
            </button>
          ) : null}
        </div>

        <div className="flex items-center rounded-2xl bg-[#8B949E] p-3.5">
          <div className="w-full">
            <RachaPreviewCard
              name={values.name}
              description={values.description}
              totalDays={totalDays}
              iconDataUrl={values.iconDataUrl}
            />
          </div>
        </div>
      </div>

      <div>
        <FloatSelect
          id={tycSelectId}
          label="Selección de términos y condiciones"
          value={values.tycTemplateId}
          onChange={handleTemplateChange}
          options={TYC_TEMPLATES}
        />
      </div>

      <TycRichEditor
        value={values.tycHtml}
        onChange={(html) => onPatch({ tycHtml: html })}
      />
    </div>
  );
}

export function CrearRachaDrawer({
  open,
  onClose,
  onNext,
}: CrearRachaDrawerProps) {
  const nameId = useId();
  const descriptionId = useId();
  const tipoId = useId();
  const repairableId = useId();

  const [form, setForm] = useState<CrearRachaFormValues>(() =>
    createDemoForm(),
  );
  const [step, setStep] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setForm(createDemoForm());
      setStep(1);
      setConfirmOpen(false);
    } else {
      setForm(EMPTY_FORM);
      setStep(1);
      setConfirmOpen(false);
    }
  }

  const setField = <K extends keyof CrearRachaFormValues>(
    key: K,
    value: CrearRachaFormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const patchForm = (patch: Partial<CrearRachaFormValues>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleTipoChange = (value: string) => {
    setForm((current) => ({
      ...current,
      tipo: value as RachaTipoValue,
      tipoApuesta: '',
      tipoEvento: '',
      sportMarketEventId: '',
      montoMinimo: '',
      cuotaMinima: '',
      periodicidad: '',
      fechaInicio: '',
      fechaFinal: '',
    }));
  };

  const updatePremio = (id: string, patch: Partial<PremioHito>) => {
    setForm((current) => ({
      ...current,
      premios: current.premios.map((hito) =>
        hito.id === id ? { ...hito, ...patch } : hito,
      ),
    }));
  };

  const addPremio = () => {
    setForm((current) => ({
      ...current,
      premios: [...current.premios, createHito()],
    }));
  };

  const removePremio = (id: string) => {
    setForm((current) => ({
      ...current,
      premios:
        current.premios.length <= 1
          ? current.premios
          : current.premios.filter((hito) => hito.id !== id),
    }));
  };

  const nextEnabled =
    step === 1
      ? canGoNextStep1(form)
      : step === 2
        ? canGoNextStep2(form)
        : canFinishStep3(form);

  const goNext = () => {
    if (!nextEnabled) {
      return;
    }

    if (step < STEPS) {
      setStep((current) => current + 1);
      return;
    }

    setConfirmOpen(true);
  };

  const confirmCreate = async () => {
    await onNext?.(form);
    setConfirmOpen(false);
    onClose();
  };

  const goPrev = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goNext();
  };

  return (
    <>
      <AppDrawer
        open={open}
        onClose={onClose}
        title="Nueva racha"
        description={STEP_DESCRIPTION[step]}
        titleId="crear-racha-title"
        onSubmit={handleSubmit}
        footer={
          <div className={cn('flex gap-3', step > 1 && 'flex-row')}>
            {step > 1 ? (
              <Button
                type="button"
                onClick={goPrev}
                className="h-12! flex-1! justify-center! rounded-xl! border border-slate-200! bg-white! text-sm! font-semibold! text-slate-700! shadow-none! hover:bg-slate-50!"
              >
                Anterior
              </Button>
            ) : null}
            <Button
              type="button"
              disabled={!nextEnabled}
              onClick={goNext}
              className={cn(
                'h-12! justify-center! rounded-xl! border-0! text-sm! font-semibold! shadow-none!',
                step > 1 ? 'flex-1!' : 'w-full!',
                nextEnabled
                  ? 'bg-ink! text-white! hover:bg-slate-800!'
                  : 'bg-[#D7E3F4]! text-slate-500! opacity-100!',
              )}
            >
              {step === STEPS ? 'Crear racha' : 'Siguiente'}
            </Button>
          </div>
        }
      >
        <Stepper current={step} />

        {step === 1 ? (
          <>
            <div className="flex flex-col gap-3">
              <FloatInput
                id={nameId}
                label="Nombre de la racha"
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                autoComplete="off"
              />

              <FloatTextarea
                id={descriptionId}
                label="Descripción"
                value={form.description}
                onChange={(event) =>
                  setField('description', event.target.value)
                }
                rows={3}
              />

              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <FloatSelect
                    id={tipoId}
                    label="Tipo de racha"
                    value={form.tipo}
                    onChange={handleTipoChange}
                    options={RACHA_TIPOS}
                  />
                </div>

                <label
                  htmlFor={repairableId}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    id={repairableId}
                    type="checkbox"
                    checked={form.repairable}
                    onChange={(event) =>
                      setField('repairable', event.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-4.5 items-center justify-center rounded-sm border',
                      'peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400/40',
                      form.repairable
                        ? 'border-ink bg-ink text-white'
                        : 'border-slate-300 bg-white',
                    )}
                  >
                    {form.repairable ? (
                      <i className="pi pi-check text-[10px] leading-none" />
                    ) : null}
                  </span>
                  ¿Podrá ser reparada?
                </label>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5">
              {!form.tipo ? (
                <EmptyCriteriaState message="Selecciona el criterio de medición para poder visualizar el resto de campos." />
              ) : form.tipo === 'apuestas-deportivas' ? (
                <DeportivasFields values={form} onChange={setField} />
              ) : (
                <EmptyCriteriaState message="Los campos para este tipo de racha se definirán en el siguiente diseño." />
              )}
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <PremiosStep
            premios={form.premios}
            onChange={updatePremio}
            onAdd={addPremio}
            onRemove={removePremio}
          />
        ) : null}

        {step === 3 ? (
          <IconosTycStep values={form} onPatch={patchForm} />
        ) : null}
      </AppDrawer>

      <ConfirmarCrearRachaModal
        open={confirmOpen}
        rachaName={form.name}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmCreate}
      />
    </>
  );
}
