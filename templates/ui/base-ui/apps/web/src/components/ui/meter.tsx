import { Meter as BaseMeter } from '@base-ui/react/meter';
import { barGrid, barValue, cn, label, type WithClass } from './styles.ts';

const indicator =
  'h-full bg-primary transition-[width] duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none';

/**
 * A value within a known range, such as storage used.
 * Lays out a label and value on one line, with <MeterTrack /> below.
 */
export function Meter({ className, ...props }: WithClass<typeof BaseMeter.Root>) {
  return <BaseMeter.Root className={cn(barGrid, className)} {...props} />;
}

export function MeterLabel({ className, ...props }: WithClass<typeof BaseMeter.Label>) {
  return <BaseMeter.Label className={cn(label, className)} {...props} />;
}

/** The formatted value. Pass `format` on <Meter /> to change how it reads. */
export function MeterValue({ className, ...props }: WithClass<typeof BaseMeter.Value>) {
  return <BaseMeter.Value className={cn(barValue, className)} {...props} />;
}

/** The bar, filled up to the value. */
export function MeterTrack({ className, ...props }: WithClass<typeof BaseMeter.Track>) {
  return (
    <BaseMeter.Track
      className={cn('col-span-2 h-2 overflow-hidden rounded-pill bg-paper-3', className)}
      {...props}
    >
      <BaseMeter.Indicator className={indicator} />
    </BaseMeter.Track>
  );
}
