import { useId, type ComponentProps } from 'react';
import { cn } from '@gamification/shared-utils/utils/cn';

const SELECT_CHEVRON_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%2364748b' d='M1 1.2 5 5.2 9 1.2'/%3E%3C/svg%3E")`,
};

export type FloatSelectOption = {
  value: string;
  label: string;
};

export type FloatSelectProps = Omit<
  ComponentProps<'select'>,
  'onChange' | 'size' | 'children'
> & {
  label: string;
  options: readonly FloatSelectOption[];
  onChange?: (value: string) => void;
  invalid?: boolean;
  error?: string;
  hint?: string;
};

/**
 * Select con label flotante interno, alineado al estilo de FloatInput.
 */
export function FloatSelect({
  id,
  label,
  value = '',
  options,
  onChange,
  invalid = false,
  error,
  hint,
  disabled,
  className,
  ...selectProps
}: FloatSelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;
  const filled = String(value).length > 0;

  return (
    <div className={cn('w-full', className)}>
      <div
        data-filled={filled ? 'true' : 'false'}
        className={cn(
          'group flex items-stretch gap-3 rounded-xl border bg-white px-3 py-2.5',
          'transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none',
          invalid
            ? 'border-red-400'
            : filled
              ? 'border-success'
              : 'border-slate-300 focus-within:border-slate-400',
          disabled && 'cursor-not-allowed bg-slate-50',
        )}
      >
        <label
          htmlFor={selectId}
          className={cn(
            'relative flex h-full min-w-0 flex-1 items-center',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          <span className="relative min-h-10 min-w-0 flex-1 overflow-hidden">
            <select
              {...selectProps}
              id={selectId}
              value={value}
              disabled={disabled}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              onChange={(event) => onChange?.(event.target.value)}
              className={cn(
                'h-10 w-full appearance-none border-0 bg-transparent bg-size-[12px] bg-position-[right_0.25rem_center] bg-no-repeat pr-6',
                'pt-3.5 font-medium text-ink outline-none',
                disabled && 'cursor-not-allowed text-slate-400',
              )}
              style={SELECT_CHEVRON_STYLE}
            >
              <option value="" disabled>
                {' '}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span
              className={cn(
                'pointer-events-none absolute left-0 origin-left whitespace-nowrap text-sm text-slate-500',
                'transition-[translate,scale,color,top,font-size] duration-200',
                'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                'top-1/2 -translate-y-1/2 scale-100',
                'group-focus-within:top-0 group-focus-within:translate-y-0 group-focus-within:scale-[0.78]',
                'group-data-[filled=true]:top-0 group-data-[filled=true]:translate-y-0 group-data-[filled=true]:scale-[0.78]',
                invalid && 'text-red-500',
              )}
            >
              {label}
            </span>
          </span>
        </label>
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
