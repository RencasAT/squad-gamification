import { useId, useState, type ChangeEvent, type ComponentProps } from 'react';
import { cn } from '@gamification/shared-utils/utils/cn';

export type FloatTextareaProps = Omit<
  ComponentProps<'textarea'>,
  'placeholder'
> & {
  label: string;
  invalid?: boolean;
  error?: string;
  hint?: string;
};

/**
 * Textarea con label flotante en flujo, alineado al estilo de FloatInput.
 */
export function FloatTextarea({
  id,
  label,
  value,
  defaultValue,
  onChange,
  invalid = false,
  error,
  hint,
  disabled,
  className,
  rows = 3,
  ...textareaProps
}: FloatTextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const isControlled = value !== undefined;
  const [uncontrolledFilled, setUncontrolledFilled] = useState(
    String(defaultValue ?? '').trim().length > 0,
  );
  const filled = isControlled
    ? String(value).trim().length > 0
    : uncontrolledFilled;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setUncontrolledFilled(event.currentTarget.value.trim().length > 0);
    }
    onChange?.(event);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        data-filled={filled ? 'true' : 'false'}
        className={cn(
          'group rounded-xl border bg-white px-3 py-2',
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
          htmlFor={textareaId}
          className={cn(
            'flex flex-col gap-1',
            disabled ? 'cursor-not-allowed' : 'cursor-text',
          )}
        >
          <span
            className={cn(
              'origin-left text-slate-500 transition-[font-size,line-height] duration-200',
              'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              'group-focus-within:text-[11px] group-focus-within:leading-none',
              filled ? 'text-[11px] leading-none' : 'text-sm leading-5',
              invalid && 'text-red-500',
            )}
          >
            {label}
          </span>
          <textarea
            {...textareaProps}
            id={textareaId}
            rows={rows}
            disabled={disabled}
            {...(isControlled ? { value } : { defaultValue })}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            className={cn(
              'w-full resize-y border-0 bg-transparent p-0 text-sm leading-snug font-medium text-ink outline-none',
              disabled && 'cursor-not-allowed text-slate-400',
            )}
          />
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
