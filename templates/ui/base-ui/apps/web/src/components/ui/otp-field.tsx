import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { cn, focusRing, inputBox, type WithClass } from './styles.ts';

/**
 * A one-time code, one character per OTPFieldInput. Set length and render that many
 * inputs; the first takes the field's label, give the others an aria-label each.
 */
export function OTPField({ className, ...props }: WithClass<typeof BaseOTPField.Root>) {
  return <BaseOTPField.Root className={cn('flex items-center gap-2', className)} {...props} />;
}

/** One character slot. */
export function OTPFieldInput({ className, ...props }: WithClass<typeof BaseOTPField.Input>) {
  return (
    <BaseOTPField.Input
      className={cn(inputBox, 'size-8 shrink-0 px-0 text-center', focusRing, className)}
      {...props}
    />
  );
}

/** A dash between groups of slots, such as 3 + 3. */
export function OTPFieldSeparator({
  className,
  ...props
}: WithClass<typeof BaseOTPField.Separator>) {
  return (
    <BaseOTPField.Separator className={cn('h-px w-2 bg-control-edge', className)} {...props} />
  );
}
