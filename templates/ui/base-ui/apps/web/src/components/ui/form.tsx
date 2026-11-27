import { Form as BaseForm } from '@base-ui/react/form';
import { cn, type WithClass } from './styles.ts';

/**
 * A <form> that validates its Fields on submit and shows server errors on them: pass
 * errors as { fieldName: message }. Stacks its fields.
 */
export function Form({ className, ...props }: WithClass<typeof BaseForm>) {
  return <BaseForm className={cn('flex flex-col gap-4', className)} {...props} />;
}
