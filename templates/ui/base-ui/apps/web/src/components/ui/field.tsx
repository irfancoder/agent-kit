import { Field as BaseField } from '@base-ui/react/field';
import { cn, label, type WithClass } from './styles.ts';

/** Groups a label, a control and its error. Wire the control with <Input /> inside it. */
export function Field({ className, ...props }: WithClass<typeof BaseField.Root>) {
  return <BaseField.Root className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

export function FieldLabel({ className, ...props }: WithClass<typeof BaseField.Label>) {
  return <BaseField.Label className={cn(label, className)} {...props} />;
}

export function FieldDescription({ className, ...props }: WithClass<typeof BaseField.Description>) {
  return <BaseField.Description className={cn('text-sm text-muted', className)} {...props} />;
}

/** Shows the control's validation message once the field is invalid. */
export function FieldError({ className, ...props }: WithClass<typeof BaseField.Error>) {
  return <BaseField.Error className={cn('text-sm text-error', className)} {...props} />;
}
