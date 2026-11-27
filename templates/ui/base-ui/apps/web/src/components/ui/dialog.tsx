import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { XIcon } from './icons.tsx';
import {
  closeIcon,
  cn,
  control,
  modalBackdrop,
  modalPopup,
  modalViewport,
  type WithClass,
} from './styles.ts';

/** Holds the open state. Put a DialogTrigger and a DialogContent inside it. */
export const Dialog = BaseDialog.Root;

/** Opens the dialog. Styled as a button; pass render={<Button variant="solid" />} for another look. */
export function DialogTrigger({ className, ...props }: WithClass<typeof BaseDialog.Trigger>) {
  return <BaseDialog.Trigger className={cn(control, className)} {...props} />;
}

type DialogContentProps = WithClass<typeof BaseDialog.Popup> & {
  /** Names the × button in the corner. Without it there's no × button. */
  closeLabel?: string;
};

/** The modal panel, with its backdrop, rendered in a portal. */
export function DialogContent({ className, closeLabel, children, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={modalBackdrop} />
      <BaseDialog.Viewport className={modalViewport}>
        <BaseDialog.Popup className={cn(modalPopup, className)} {...props}>
          {children}
          {closeLabel && (
            <BaseDialog.Close aria-label={closeLabel} className={closeIcon}>
              <XIcon />
            </BaseDialog.Close>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

/** Names the dialog for screen readers. Every dialog needs one. */
export function DialogTitle({ className, ...props }: WithClass<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title className={cn('text-lg font-semibold text-ink', className)} {...props} />
  );
}

export function DialogDescription({
  className,
  ...props
}: WithClass<typeof BaseDialog.Description>) {
  return <BaseDialog.Description className={cn('text-sm text-muted', className)} {...props} />;
}

/** Closes the dialog. Styled as a button, for a "Cancel" or "Done" action. */
export function DialogClose({ className, ...props }: WithClass<typeof BaseDialog.Close>) {
  return <BaseDialog.Close className={cn(control, className)} {...props} />;
}
