import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn, popup, type Placement, type WithClass } from './styles.ts';

const tip = cn(popup, 'max-w-64 rounded-control px-2 py-1 text-xs');

/** Shares the open delay between tooltips, so moving from one to the next is instant. */
export const TooltipProvider = BaseTooltip.Provider;

/**
 * A short hint on hover or focus, for sighted mouse and keyboard users only. Anything the
 * user must know goes in the page or a Popover, not a tooltip.
 */
export const Tooltip = BaseTooltip.Root;

/** The element the tip describes. Wrap a control with render={<Button />}. */
export const TooltipTrigger = BaseTooltip.Trigger;

/** The tip, positioned against the trigger and rendered in a portal. */
export function TooltipContent({
  className,
  side,
  align,
  sideOffset = 6,
  alignOffset,
  collisionPadding,
  ...props
}: WithClass<typeof BaseTooltip.Popup> & Placement) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        className="z-(--z-tooltip)"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
      >
        <BaseTooltip.Popup className={cn(tip, className)} {...props} />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
