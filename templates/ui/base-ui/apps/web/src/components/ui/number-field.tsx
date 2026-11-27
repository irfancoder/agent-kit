import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from './icons.tsx';
import {
  cn,
  control,
  disabled,
  focusRing,
  inputBox,
  type IconOnly,
  type WithClass,
} from './styles.ts';

/** A number input with − and + buttons. Put a NumberFieldGroup inside it. */
export function NumberField({ className, ...props }: WithClass<typeof BaseNumberField.Root>) {
  return <BaseNumberField.Root className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

/** Lines up the decrement button, the input and the increment button. */
export function NumberFieldGroup({ className, ...props }: WithClass<typeof BaseNumberField.Group>) {
  return <BaseNumberField.Group className={cn('flex h-8', className)} {...props} />;
}

export function NumberFieldInput({ className, ...props }: WithClass<typeof BaseNumberField.Input>) {
  return (
    <BaseNumberField.Input
      className={cn(
        inputBox,
        'w-full min-w-0 rounded-none tabular-nums focus-visible:z-1',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

// The stepper buttons. Each is icon-only, so pass an aria-label.
const stepper = cn(control, 'w-8 shrink-0 px-0 data-invalid:border-error');
const decrement = cn(stepper, 'rounded-r-none border-r-0');
const increment = cn(stepper, 'rounded-l-none border-l-0');

/** The − button, left of the input. Shows a minus sign unless given children. */
export function NumberFieldDecrement({
  className,
  children,
  ...props
}: IconOnly<typeof BaseNumberField.Decrement>) {
  return (
    <BaseNumberField.Decrement className={cn(decrement, className)} {...props}>
      {children ?? <MinusIcon className="size-3.5" />}
    </BaseNumberField.Decrement>
  );
}

/** The + button, right of the input. Shows a plus sign unless given children. */
export function NumberFieldIncrement({
  className,
  children,
  ...props
}: IconOnly<typeof BaseNumberField.Increment>) {
  return (
    <BaseNumberField.Increment className={cn(increment, className)} {...props}>
      {children ?? <PlusIcon className="size-3.5" />}
    </BaseNumberField.Increment>
  );
}

/** Drag across it (usually the label) to change the value. */
export function NumberFieldScrubArea({
  className,
  ...props
}: WithClass<typeof BaseNumberField.ScrubArea>) {
  return (
    <BaseNumberField.ScrubArea
      className={cn('cursor-ew-resize select-none', disabled, className)}
      {...props}
    />
  );
}

export const NumberFieldScrubAreaCursor = BaseNumberField.ScrubAreaCursor;
