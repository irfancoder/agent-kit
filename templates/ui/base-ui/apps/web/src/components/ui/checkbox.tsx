import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckIcon, MinusIcon } from './icons.tsx';
import { box, cn, type WithClass } from './styles.ts';

const checkbox = cn(
  box,
  'rounded-inner data-indeterminate:border-primary data-indeterminate:bg-primary',
);

/**
 * A checkbox with its check mark. Name it with a wrapping <label> or a <FieldLabel>.
 * Set indeterminate for a parent of a CheckboxGroup that is partly checked.
 */
export function Checkbox({ className, ...props }: WithClass<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root className={cn(checkbox, className)} {...props}>
      <BaseCheckbox.Indicator className="group flex data-unchecked:hidden">
        <CheckIcon className="size-3 group-data-indeterminate:hidden" strokeWidth={2} />
        <MinusIcon className="size-3 group-not-data-indeterminate:hidden" strokeWidth={2} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
