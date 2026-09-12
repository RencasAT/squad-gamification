import {
  useId,
  useState,
  type AnimationEvent,
  type ChangeEvent,
  type ComponentProps,
} from 'react';
import { cn } from '@gamification/shared-utils/utils/cn';

export type FloatInputProps = Omit<
  ComponentProps<'input'>,
  'placeholder' | 'size'
> & {
  label: string;
  invalid?: boolean;
  error?: string;
  hint?: string;
  /** Clase PrimeIcons, p. ej. `pi-user`. */
  icon?: string;
  /** Si no se pasa, el toggle aparece cuando `type="password"`. */
  togglePassword?: boolean;
  /** `lg`: 53px, label 16/12px, valor 16px (búsqueda de clientes). */
  size?: 'default' | 'lg';
};

/**
 * Input stacked con label flotante interno (Figma).
 * Completo: borde e icono verdes. El label sube con valor, foco o autofill.
 */
export function FloatInput({
  ref,
  id,
  label,
  invalid = false,
  error,
  hint,
  icon,
  togglePassword,
  size = 'default',
  type = 'text',
  disabled,
  className,
  autoComplete,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...inputProps
}: FloatInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const showToggle = togglePassword ?? type === 'password';
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [autofilled, setAutofilled] = useState(false);
  const isControlled = value !== undefined;
  const [uncontrolledFilled, setUncontrolledFilled] = useState(
    String(defaultValue ?? '').length > 0,
  );
  const inputType = showToggle ? (passwordVisible ? 'text' : 'password') : type;

  const hasValue = isControlled ? String(value).length > 0 : uncontrolledFilled;
  const filled = hasValue || autofilled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFilled = event.currentTarget.value.length > 0;
    if (!nextFilled) {
      setAutofilled(false);
    }
    if (!isControlled) {
      setUncontrolledFilled(nextFilled);
    }
    onChange?.(event);
  };

  const handleAnimationStart = (event: AnimationEvent<HTMLInputElement>) => {
    if (event.animationName !== 'gm-autofill') {
      return;
    }
    setAutofilled(true);
    onChange?.({
      target: event.currentTarget,
      currentTarget: event.currentTarget,
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        data-filled={filled ? 'true' : 'false'}
        className={cn(
          'group flex items-stretch gap-3 rounded-xl border bg-white',
          'transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none',
          size === 'lg' ? 'h-13.25 max-h-13.25 px-4' : 'px-3 py-2.5',
          invalid
            ? 'border-red-400'
            : filled
              ? 'border-success'
              : 'border-slate-300 focus-within:border-slate-400',
          disabled && 'cursor-not-allowed bg-slate-50',
        )}
      >
        <label
          htmlFor={inputId}
          className="flex h-full min-w-0 flex-1 cursor-text items-center gap-3"
        >
          {icon ? (
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                'transition-colors duration-200 motion-reduce:transition-none',
                invalid
                  ? 'bg-red-50 text-red-500'
                  : filled
                    ? 'bg-success-soft text-success'
                    : 'bg-field-muted text-slate-500',
              )}
              aria-hidden
            >
              <i className={cn('pi text-base', icon)} />
            </span>
          ) : null}

          <span
            className={cn(
              'relative min-w-0 flex-1 overflow-hidden',
              size === 'lg' ? 'h-full' : 'min-h-10',
            )}
          >
            <input
              {...inputProps}
              ref={ref}
              id={inputId}
              type={inputType}
              disabled={disabled}
              {...(isControlled ? { value } : { defaultValue })}
              placeholder=" "
              autoComplete={autoComplete}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onAnimationStart={handleAnimationStart}
              className={cn(
                'gm-float-autofill w-full border-0 bg-transparent font-medium text-ink outline-none',
                'placeholder:text-transparent',
                'autofill:shadow-[inset_0_0_0_1000px_#fff]',
                size === 'lg'
                  ? 'h-full pt-5.5 pb-2 text-base leading-tight'
                  : 'h-10 pt-3.5 text-sm',
                disabled && 'cursor-not-allowed text-slate-400',
              )}
            />
            <span
              className={cn(
                'pointer-events-none absolute left-0 origin-left whitespace-nowrap text-slate-500',
                'transition-[translate,scale,color,top,font-size] duration-200',
                'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                size === 'lg'
                  ? cn(
                      'top-1/2 -translate-y-1/2 scale-100 text-base',
                      'group-focus-within:top-2 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:text-xs',
                      'group-data-[filled=true]:top-2 group-data-[filled=true]:translate-y-0 group-data-[filled=true]:scale-100 group-data-[filled=true]:text-xs',
                    )
                  : cn(
                      'top-1/2 -translate-y-1/2 scale-100 text-sm',
                      'group-focus-within:top-0 group-focus-within:translate-y-0 group-focus-within:scale-[0.78]',
                      'group-data-[filled=true]:top-0 group-data-[filled=true]:translate-y-0 group-data-[filled=true]:scale-[0.78]',
                    ),
                invalid && 'text-red-500',
              )}
            >
              {label}
            </span>
          </span>
        </label>

        {showToggle ? (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setPasswordVisible((visible) => !visible)}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-40"
            aria-label={
              passwordVisible ? 'Ocultar caracteres' : 'Mostrar caracteres'
            }
          >
            <i
              className={cn(
                'pi text-base',
                passwordVisible ? 'pi-eye' : 'pi-eye-slash',
              )}
            />
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1 text-xs text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
