import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { ChevronIcon } from './icons.tsx';
import { cn, focusRing, ghostControl, type Placement, type WithClass } from './styles.ts';

/** Sizes itself to the open panel and slides between triggers. */
const positioner = cn(
  'z-(--z-dropdown) h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)',
  'transition-[top,left,right,bottom] duration-(--dur-short) ease-(--ease-out)',
  'data-instant:transition-none motion-reduce:transition-none',
  // Bridges the gap to the trigger, so moving the pointer across doesn't close it.
  'before:absolute data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:-top-2 data-[side=bottom]:before:h-2',
  'data-[side=top]:before:inset-x-0 data-[side=top]:before:-bottom-2 data-[side=top]:before:h-2',
);

/**
 * Site navigation whose items open panels of links. Put a <NavigationMenuList> and one
 * <NavigationMenuViewport> inside; each item's content shows in the viewport.
 */
export function NavigationMenu({ className, ...props }: WithClass<typeof BaseNavigationMenu.Root>) {
  return <BaseNavigationMenu.Root className={cn('relative text-ink', className)} {...props} />;
}

export function NavigationMenuList({
  className,
  ...props
}: WithClass<typeof BaseNavigationMenu.List>) {
  return (
    <BaseNavigationMenu.List
      className={cn('relative flex items-center gap-1', className)}
      {...props}
    />
  );
}

export const NavigationMenuItem = BaseNavigationMenu.Item;

/** Opens its item's panel, with a chevron that turns while open. */
export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: WithClass<typeof BaseNavigationMenu.Trigger>) {
  return (
    <BaseNavigationMenu.Trigger className={cn(ghostControl, className)} {...props}>
      {children}
      <BaseNavigationMenu.Icon className="text-muted transition-transform duration-(--dur-micro) ease-(--ease-out) data-popup-open:rotate-180 motion-reduce:transition-none">
        <ChevronIcon />
      </BaseNavigationMenu.Icon>
    </BaseNavigationMenu.Trigger>
  );
}

/** An item's panel. It slides in from the side of the trigger you came from. */
export function NavigationMenuContent({
  className,
  ...props
}: WithClass<typeof BaseNavigationMenu.Content>) {
  return (
    <BaseNavigationMenu.Content
      className={cn(
        'h-full w-max p-2',
        'transition-[opacity,translate] duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
        'data-starting-style:opacity-0 data-ending-style:opacity-0',
        'data-starting-style:data-[activation-direction=left]:-translate-x-4',
        'data-starting-style:data-[activation-direction=right]:translate-x-4',
        'data-ending-style:data-[activation-direction=left]:translate-x-4',
        'data-ending-style:data-[activation-direction=right]:-translate-x-4',
        className,
      )}
      {...props}
    />
  );
}

/**
 * A link, in a panel or at the top level. Use render={<Link to="…" />} for router links;
 * data-active marks the current page.
 */
export function NavigationMenuLink({
  className,
  ...props
}: WithClass<typeof BaseNavigationMenu.Link>) {
  return (
    <BaseNavigationMenu.Link
      className={cn(
        'block rounded-inner p-2 text-sm text-ink no-underline hover:bg-paper-3 data-active:font-medium',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

/**
 * The card the open panel shows in, portalled above the page. It resizes and moves between
 * triggers. Render it once inside <NavigationMenu>, after the list.
 */
export function NavigationMenuViewport({
  className,
  side,
  sideOffset = 8,
  align,
  alignOffset,
  collisionPadding,
  ...props
}: WithClass<typeof BaseNavigationMenu.Popup> & Placement) {
  return (
    <BaseNavigationMenu.Portal>
      <BaseNavigationMenu.Positioner
        className={positioner}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
      >
        <BaseNavigationMenu.Popup
          className={cn(
            'relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin)',
            'rounded-card border border-rule bg-paper text-ink shadow-pop outline-none',
            'transition-[opacity,scale,width,height] duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
            'data-starting-style:scale-98 data-starting-style:opacity-0',
            'data-ending-style:scale-98 data-ending-style:opacity-0',
            className,
          )}
          {...props}
        >
          <BaseNavigationMenu.Viewport className="relative size-full overflow-hidden" />
        </BaseNavigationMenu.Popup>
      </BaseNavigationMenu.Positioner>
    </BaseNavigationMenu.Portal>
  );
}
