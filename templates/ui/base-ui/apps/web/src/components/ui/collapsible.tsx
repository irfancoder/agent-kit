import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { ChevronIcon } from './icons.tsx';
import { cn, control, disclosureChevron, type WithClass } from './styles.ts';

/** One panel that a trigger shows and hides. */
export function Collapsible({ className, ...props }: WithClass<typeof BaseCollapsible.Root>) {
  return <BaseCollapsible.Root className={cn('flex flex-col gap-2', className)} {...props} />;
}

/** The button that opens and closes the panel, with a chevron that turns when it opens. */
export function CollapsibleTrigger({
  className,
  children,
  ...props
}: WithClass<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      className={cn(control, 'group justify-between self-start', className)}
      {...props}
    >
      {children}
      <ChevronIcon className={disclosureChevron} />
    </BaseCollapsible.Trigger>
  );
}

/** The content. It animates its height as it opens and closes. */
export function CollapsiblePanel({ className, ...props }: WithClass<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        'h-(--collapsible-panel-height) overflow-hidden text-sm text-ink-2',
        'transition-[height] duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
        'data-starting-style:h-0 data-ending-style:h-0',
        className,
      )}
      {...props}
    />
  );
}
