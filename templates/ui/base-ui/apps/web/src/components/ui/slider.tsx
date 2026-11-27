import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cn, disabled, focusWithinRing, label, valueText, type WithClass } from './styles.ts';

/** Picks a number, or a range when `value` is an array. Put <SliderControl> inside. */
export function Slider({ className, ...props }: WithClass<typeof BaseSlider.Root>) {
  return (
    <BaseSlider.Root
      className={cn(
        'flex w-full flex-col gap-1.5 data-[orientation=vertical]:w-auto',
        disabled,
        className,
      )}
      {...props}
    />
  );
}

export function SliderLabel({ className, ...props }: WithClass<typeof BaseSlider.Label>) {
  return <BaseSlider.Label className={cn(label, className)} {...props} />;
}

export function SliderValue({ className, ...props }: WithClass<typeof BaseSlider.Value>) {
  return <BaseSlider.Value className={cn(valueText, className)} {...props} />;
}

/**
 * The track and its filled part. Put one <SliderThumb /> inside per value
 * (with `index` on each, for a range).
 */
export function SliderControl({
  className,
  children,
  ...props
}: WithClass<typeof BaseSlider.Control>) {
  return (
    <BaseSlider.Control
      className={cn(
        'flex h-8 w-full touch-none select-none items-center',
        'data-[orientation=vertical]:h-32 data-[orientation=vertical]:w-8 data-[orientation=vertical]:justify-center',
        className,
      )}
      {...props}
    >
      <BaseSlider.Track className="h-1.5 w-full rounded-pill bg-rule-2 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
        <BaseSlider.Indicator className="rounded-pill bg-primary" />
        {children}
      </BaseSlider.Track>
    </BaseSlider.Control>
  );
}

/**
 * The handle you drag. Focus lands on the range input inside it, so the ring shows on
 * has-focus-visible. Name it with aria-label (or getAriaLabel for a range).
 */
export function SliderThumb({ className, ...props }: WithClass<typeof BaseSlider.Thumb>) {
  return (
    <BaseSlider.Thumb
      className={cn(
        'size-4 cursor-grab rounded-pill border border-control-edge bg-paper shadow-card select-none',
        'data-dragging:cursor-grabbing data-disabled:cursor-not-allowed',
        focusWithinRing,
        className,
      )}
      {...props}
    />
  );
}
