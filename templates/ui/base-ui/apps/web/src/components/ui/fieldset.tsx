import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cn, type WithClass } from './styles.ts';

/** Groups related fields under one legend. Disabling it disables every field inside. */
export function Fieldset({ className, ...props }: WithClass<typeof BaseFieldset.Root>) {
  return <BaseFieldset.Root className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function FieldsetLegend({ className, ...props }: WithClass<typeof BaseFieldset.Legend>) {
  return (
    <BaseFieldset.Legend
      className={cn('text-md font-semibold text-ink data-disabled:opacity-50', className)}
      {...props}
    />
  );
}
