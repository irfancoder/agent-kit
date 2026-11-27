import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn, control, popup, type Placement, type WithClass } from './styles.ts';

/** Holds the open state. Put a PopoverTrigger and a PopoverContent inside it. */
export const Popover = BasePopover.Root;

/** Opens the popover. Styled as a button. */
export function PopoverTrigger({ className, ...props }: WithClass<typeof BasePopover.Trigger>) {
  return <BasePopover.Trigger className={cn(control, className)} {...props} />;
}

/** The panel, positioned against the trigger and rendered in a portal. */
export function PopoverContent({
  className,
  side,
  align,
  sideOffset = 6,
  alignOffset,
  collisionPadding,
  ...props
}: WithClass<typeof BasePopover.Popup> & Placement) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        className="z-(--z-dropdown)"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
      >
        <BasePopover.Popup
          className={cn(popup, 'flex w-72 flex-col gap-2 p-4', className)}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverTitle({ className, ...props }: WithClass<typeof BasePopover.Title>) {
  return <BasePopover.Title className={cn('font-semibold text-ink', className)} {...props} />;
}

export function PopoverDescription({
  className,
  ...props
}: WithClass<typeof BasePopover.Description>) {
  return <BasePopover.Description className={cn('text-muted', className)} {...props} />;
}

/** Closes the popover. Styled as a button. */
export function PopoverClose({ className, ...props }: WithClass<typeof BasePopover.Close>) {
  return <BasePopover.Close className={cn(control, className)} {...props} />;
}
