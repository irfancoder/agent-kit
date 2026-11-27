import { Progress as BaseProgress } from '@base-ui/react/progress';
import { barGrid, barValue, cn, label, type WithClass } from './styles.ts';

const indicator = cn(
  'h-full rounded-pill bg-primary',
  'transition-[width] duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
  'data-indeterminate:w-1/3 data-indeterminate:animate-pulse motion-reduce:animate-none',
);

/**
 * How far a task has got. Set `value` (0–100), or null when it can't be known.
 * Lays out a label and value on one line, with <ProgressTrack /> below.
 */
export function Progress({ className, ...props }: WithClass<typeof BaseProgress.Root>) {
  return <BaseProgress.Root className={cn(barGrid, className)} {...props} />;
}

export function ProgressLabel({ className, ...props }: WithClass<typeof BaseProgress.Label>) {
  return <BaseProgress.Label className={cn(label, className)} {...props} />;
}

/** The value, formatted as a percentage unless you pass `format`. */
export function ProgressValue({ className, ...props }: WithClass<typeof BaseProgress.Value>) {
  return <BaseProgress.Value className={cn(barValue, className)} {...props} />;
}

/** The bar, filled up to the value. Pulses while the value is unknown. */
export function ProgressTrack({ className, ...props }: WithClass<typeof BaseProgress.Track>) {
  return (
    <BaseProgress.Track
      className={cn('col-span-2 h-1.5 overflow-hidden rounded-pill bg-rule-2', className)}
      {...props}
    >
      <BaseProgress.Indicator className={indicator} />
    </BaseProgress.Track>
  );
}
