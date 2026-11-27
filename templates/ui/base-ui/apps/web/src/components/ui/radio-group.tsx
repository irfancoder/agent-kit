import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { box, cn, type WithClass } from './styles.ts';

/** Radios that share one value, with one tab stop and arrow keys between them. */
export function RadioGroup({ className, ...props }: WithClass<typeof BaseRadioGroup>) {
  return <BaseRadioGroup className={cn('flex flex-col gap-2', className)} {...props} />;
}

/** One option in a RadioGroup, with its dot. Give it a value and a wrapping <label>. */
export function Radio({ className, ...props }: WithClass<typeof BaseRadio.Root>) {
  return (
    <BaseRadio.Root className={cn(box, 'rounded-pill', className)} {...props}>
      <BaseRadio.Indicator className="size-1.5 rounded-pill bg-primary-ink data-unchecked:hidden" />
    </BaseRadio.Root>
  );
}
