import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { cn, control, modalBackdrop, modalPopup, modalViewport, type WithClass } from './styles.ts';

/**
 * A dialog that asks the user to confirm or cancel. It doesn't close on an outside click,
 * so give it an AlertDialogClose for each choice.
 */
export const AlertDialog = BaseAlertDialog.Root;

export function AlertDialogTrigger({
  className,
  ...props
}: WithClass<typeof BaseAlertDialog.Trigger>) {
  return <BaseAlertDialog.Trigger className={cn(control, className)} {...props} />;
}

/** The modal panel, with its backdrop, rendered in a portal. */
export function AlertDialogContent({
  className,
  ...props
}: WithClass<typeof BaseAlertDialog.Popup>) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className={modalBackdrop} />
      <BaseAlertDialog.Viewport className={modalViewport}>
        <BaseAlertDialog.Popup className={cn(modalPopup, className)} {...props} />
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  );
}

// Title, description and close are the dialog's own parts.
export {
  DialogTitle as AlertDialogTitle,
  DialogDescription as AlertDialogDescription,
  DialogClose as AlertDialogClose,
} from './dialog.tsx';
