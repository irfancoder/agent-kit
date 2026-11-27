import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { XIcon } from './icons.tsx';
import { closeIcon, cn, control, modalBackdrop, type WithClass } from './styles.ts';

/** The backdrop fades with the swipe. */
const drawerBackdrop = cn(
  modalBackdrop,
  'opacity-[calc(1-var(--drawer-swipe-progress))] data-swiping:duration-0',
);

/**
 * A panel that slides in from an edge and can be swiped away. Holds the open state.
 * swipeDirection picks the edge: "down" (the default) is a bottom sheet, "right" a side panel.
 * Without the swipe, use a Dialog.
 */
export const Drawer = BaseDrawer.Root;

/** Opens the drawer. Styled as a button. */
export function DrawerTrigger({ className, ...props }: WithClass<typeof BaseDrawer.Trigger>) {
  return <BaseDrawer.Trigger className={cn(control, className)} {...props} />;
}

type DrawerContentProps = WithClass<typeof BaseDrawer.Popup> & {
  /** Names the × button in the corner. Without it there's no × button. */
  closeLabel?: string;
};

/** The panel, with its backdrop, rendered in a portal. It sits on the edge swipeDirection names. */
export function DrawerContent({ className, closeLabel, children, ...props }: DrawerContentProps) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className={drawerBackdrop} />
      <BaseDrawer.Viewport className="fixed inset-0 z-(--z-modal)">
        <BaseDrawer.Popup
          className={cn(
            'absolute overflow-y-auto overscroll-contain border-rule bg-paper p-6 text-ink shadow-modal outline-none',
            'translate-x-(--drawer-swipe-movement-x) translate-y-(--drawer-swipe-movement-y)',
            'transition-transform duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
            'data-swiping:select-none data-swiping:duration-0',
            // Each edge: where it sits, its border and where it slides from.
            'data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:max-h-4/5',
            'data-[swipe-direction=down]:rounded-t-card data-[swipe-direction=down]:border-t',
            'data-[swipe-direction=down]:data-starting-style:translate-y-full data-[swipe-direction=down]:data-ending-style:translate-y-full',
            'data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:max-h-4/5',
            'data-[swipe-direction=up]:rounded-b-card data-[swipe-direction=up]:border-b',
            'data-[swipe-direction=up]:data-starting-style:-translate-y-full data-[swipe-direction=up]:data-ending-style:-translate-y-full',
            'data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:w-80 data-[swipe-direction=right]:max-w-full',
            'data-[swipe-direction=right]:border-l',
            'data-[swipe-direction=right]:data-starting-style:translate-x-full data-[swipe-direction=right]:data-ending-style:translate-x-full',
            'data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:w-80 data-[swipe-direction=left]:max-w-full',
            'data-[swipe-direction=left]:border-r',
            'data-[swipe-direction=left]:data-starting-style:-translate-x-full data-[swipe-direction=left]:data-ending-style:-translate-x-full',
            className,
          )}
          {...props}
        >
          <BaseDrawer.Content className="flex flex-col gap-4">{children}</BaseDrawer.Content>
          {closeLabel && (
            <BaseDrawer.Close aria-label={closeLabel} className={closeIcon}>
              <XIcon />
            </BaseDrawer.Close>
          )}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

/** Closes the drawer. Styled as a button. */
export function DrawerClose({ className, ...props }: WithClass<typeof BaseDrawer.Close>) {
  return <BaseDrawer.Close className={cn(control, className)} {...props} />;
}

// Base UI's drawer title and description are the dialog's own parts. Every drawer needs a title.
export { DialogTitle as DrawerTitle, DialogDescription as DrawerDescription } from './dialog.tsx';
