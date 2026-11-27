import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { cn, type WithClass } from './styles.ts';

/** Checkboxes that share one value (an array of the checked ones' values). */
export function CheckboxGroup({ className, ...props }: WithClass<typeof BaseCheckboxGroup>) {
  return <BaseCheckboxGroup className={cn('flex flex-col gap-2', className)} {...props} />;
}
