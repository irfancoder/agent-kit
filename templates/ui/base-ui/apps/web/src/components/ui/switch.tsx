import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cn, disabled, focusRing, type WithClass } from './styles.ts';

const thumb = cn(
  'size-3.5 rounded-pill bg-muted',
  'transition-[translate,background-color] duration-(--dur-micro) ease-(--ease-out) motion-reduce:transition-none',
  'data-checked:translate-x-4 data-checked:bg-primary-ink',
);

/** An on/off setting that applies at once. Wrap it in a <label> with its name, or give it aria-label. */
export function Switch({ className, ...props }: WithClass<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      className={cn(
        'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-pill border border-control-edge bg-paper p-0.5',
        'transition-colors duration-(--dur-micro) ease-(--ease-out) motion-reduce:transition-none',
        'data-checked:border-primary data-checked:bg-primary',
        disabled,
        focusRing,
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb className={thumb} />
    </BaseSwitch.Root>
  );
}
