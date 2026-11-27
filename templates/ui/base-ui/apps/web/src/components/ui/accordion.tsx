import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronIcon } from './icons.tsx';
import { cn, disabled, disclosureChevron, focusRing, type WithClass } from './styles.ts';

/** A stack of sections that open one at a time. Pass `multiple` to let several stay open. */
export function Accordion({ className, ...props }: WithClass<typeof BaseAccordion.Root>) {
  return <BaseAccordion.Root className={cn('flex w-full flex-col', className)} {...props} />;
}

/** One section: an <AccordionTrigger /> and its <AccordionPanel />. */
export function AccordionItem({ className, ...props }: WithClass<typeof BaseAccordion.Item>) {
  return <BaseAccordion.Item className={cn('border-b border-rule', className)} {...props} />;
}

/** The section's heading button, with a chevron that turns when it opens. */
export function AccordionTrigger({
  className,
  children,
  ...props
}: WithClass<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header className="m-0">
      <BaseAccordion.Trigger
        className={cn(
          'group flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left text-sm font-medium text-ink',
          'hover:underline hover:underline-offset-4',
          disabled,
          focusRing,
          className,
        )}
        {...props}
      >
        {children}
        <ChevronIcon className={disclosureChevron} />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

/** The section's content. It animates its height as it opens and closes. */
export function AccordionPanel({
  className,
  children,
  ...props
}: WithClass<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      className={cn(
        'h-(--accordion-panel-height) overflow-hidden text-sm text-ink-2',
        'transition-[height] duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
        'data-starting-style:h-0 data-ending-style:h-0',
        className,
      )}
      {...props}
    >
      <div className="pb-3">{children}</div>
    </BaseAccordion.Panel>
  );
}
