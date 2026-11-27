import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn, type WithClass } from './styles.ts';

/** A hairline between content. Pass orientation="vertical" for one between items in a row. */
export function Separator({ className, ...props }: WithClass<typeof BaseSeparator>) {
  return (
    <BaseSeparator
      className={cn(
        'shrink-0 bg-rule',
        'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
        'data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
        className,
      )}
      {...props}
    />
  );
}
