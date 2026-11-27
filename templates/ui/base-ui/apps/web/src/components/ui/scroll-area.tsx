import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn, focusRing, type WithClass } from './styles.ts';

const viewport = cn('size-full overscroll-contain', focusRing);

/**
 * A scrolling box with thin scrollbars that show on hover and while scrolling. Give it a
 * height (or width) through className; each scrollbar appears only when its content overflows.
 */
export function ScrollArea({
  className,
  children,
  ...props
}: WithClass<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root className={cn('relative', className)} {...props}>
      <BaseScrollArea.Viewport className={viewport}>
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <ScrollAreaScrollbar orientation="vertical" />
      <ScrollAreaScrollbar orientation="horizontal" />
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  );
}

/** One scrollbar and its thumb. <ScrollArea /> renders both; use this to restyle them. */
export function ScrollAreaScrollbar({
  className,
  ...props
}: WithClass<typeof BaseScrollArea.Scrollbar>) {
  return (
    <BaseScrollArea.Scrollbar
      className={cn(
        'flex touch-none select-none p-0.5 opacity-0 pointer-events-none',
        'transition-opacity duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
        'data-hovering:pointer-events-auto data-hovering:opacity-100',
        'data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0',
        'data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col',
        className,
      )}
      {...props}
    >
      <BaseScrollArea.Thumb className="rounded-pill bg-control-edge data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
    </BaseScrollArea.Scrollbar>
  );
}
