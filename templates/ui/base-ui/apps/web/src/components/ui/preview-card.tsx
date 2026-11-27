import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { cn, focusRing, popup, type Placement, type WithClass } from './styles.ts';

/** A preview of a link's target, shown on hover or focus. Holds the open state. */
export const PreviewCard = BasePreviewCard.Root;

/** The link that shows the preview. Renders an <a>; give it an href. */
export function PreviewCardTrigger({
  className,
  ...props
}: WithClass<typeof BasePreviewCard.Trigger>) {
  return (
    <BasePreviewCard.Trigger
      className={cn(
        'rounded-inner text-ink underline decoration-control-edge underline-offset-4 hover:decoration-ink',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

/** The preview, positioned against the link and rendered in a portal. */
export function PreviewCardContent({
  className,
  side,
  align,
  sideOffset = 8,
  alignOffset,
  collisionPadding,
  ...props
}: WithClass<typeof BasePreviewCard.Popup> & Placement) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner
        className="z-(--z-dropdown)"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
      >
        <BasePreviewCard.Popup
          className={cn(popup, 'flex w-80 flex-col gap-2 p-4', className)}
          {...props}
        />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}
