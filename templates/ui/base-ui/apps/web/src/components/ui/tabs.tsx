import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn, focusRing, ghostControl, type WithClass } from './styles.ts';

/** A tab: muted until it's active. */
const tab = cn(ghostControl, 'text-muted hover:text-ink data-active:text-ink');

/** Tabs and their panels. Set `defaultValue` (or `value`) to the open tab's value. */
export function Tabs({ className, ...props }: WithClass<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      className={cn('flex flex-col gap-4 data-[orientation=vertical]:flex-row', className)}
      {...props}
    />
  );
}

/** The row of tabs, with one tab stop and arrow keys between them. Put a <TabsIndicator /> last. */
export function TabsList({ className, ...props }: WithClass<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      className={cn(
        'relative flex gap-1 border-b border-rule',
        'data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

/** One tab. Give it the value of the panel it opens. */
export function TabsTab({ className, ...props }: WithClass<typeof BaseTabs.Tab>) {
  return <BaseTabs.Tab className={cn(tab, className)} {...props} />;
}

/** The line under the active tab. It slides to the tab that opens. */
export function TabsIndicator({ className, ...props }: WithClass<typeof BaseTabs.Indicator>) {
  return (
    <BaseTabs.Indicator
      className={cn(
        'absolute -bottom-px left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-ink',
        'transition-[translate,width,height] duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
        'data-[orientation=vertical]:top-0 data-[orientation=vertical]:-right-px data-[orientation=vertical]:bottom-auto data-[orientation=vertical]:left-auto',
        'data-[orientation=vertical]:h-(--active-tab-height) data-[orientation=vertical]:w-0.5',
        'data-[orientation=vertical]:translate-x-0 data-[orientation=vertical]:translate-y-(--active-tab-top)',
        className,
      )}
      {...props}
    />
  );
}

/** The content for one tab. Give it the same value as its tab. */
export function TabsPanel({ className, ...props }: WithClass<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel className={cn('text-sm text-ink', focusRing, className)} {...props} />;
}
