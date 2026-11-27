import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { XIcon } from '@/components/ui/icons';
import { cls, cx, isTransitioning, sx, type Override, type Transition } from '@/lib/cx';
import { colors, fonts, layers, motion, radii, shadows, space, text } from '@/styles/tokens.stylex';

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export function DialogContent({
  xstyle,
  children,
  showCloseButton = true,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Popup>, 'className'> &
  Override & { showCloseButton?: boolean }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-overlay"
        className={cx((s: Transition) => [styles.backdrop, isTransitioning(s) && styles.hidden])}
      />
      <BaseDialog.Popup
        data-slot="dialog-content"
        className={cx(
          (s: Transition) => [styles.popup, isTransitioning(s) && styles.popupHidden],
          xstyle,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <BaseDialog.Close aria-label="Close" className={cls(styles.close)}>
            <XIcon />
          </BaseDialog.Close>
        ) : null}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

type DivProps = Omit<ComponentProps<'div'>, 'className' | 'style'> & Override;

export function DialogHeader({ xstyle, ...props }: DivProps) {
  return <div data-slot="dialog-header" {...sx(styles.header, xstyle)} {...props} />;
}

export function DialogFooter({ xstyle, ...props }: DivProps) {
  return <div data-slot="dialog-footer" {...sx(styles.footer, xstyle)} {...props} />;
}

export function DialogTitle({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Title>, 'className'> & Override) {
  return (
    <BaseDialog.Title data-slot="dialog-title" className={cls(styles.title, xstyle)} {...props} />
  );
}

export function DialogDescription({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Description>, 'className'> & Override) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cls(styles.description, xstyle)}
      {...props}
    />
  );
}

const styles = stylex.create({
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: layers.dialog,
    backgroundColor: colors.overlay,
    transitionProperty: 'opacity',
    transitionDuration: motion.normal,
  },
  hidden: { opacity: 0 },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: layers.dialog,
    display: 'flex',
    flexDirection: 'column',
    gap: space.lg,
    width: 'calc(100% - 2rem)',
    maxWidth: '32rem',
    padding: space.xl,
    fontFamily: fonts.sans,
    color: colors.surfaceForeground,
    backgroundColor: colors.surface,
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.lg,
    boxShadow: shadows.lg,
    transform: 'translate(-50%, -50%)',
    transitionProperty: 'opacity, transform',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
  },
  popupHidden: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.96)' },
  close: {
    position: 'absolute',
    top: space.lg,
    right: space.lg,
    display: 'flex',
    padding: space.xs,
    color: colors.mutedForeground,
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
    borderWidth: 0,
    borderRadius: radii.sm,
    cursor: 'pointer',
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': '2px' },
    outlineColor: colors.ring,
  },
  header: { display: 'flex', flexDirection: 'column', gap: space.sm },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: space.sm },
  title: {
    margin: 0,
    fontSize: text.lg,
    fontWeight: text.weightSemibold,
    lineHeight: text.lineTight,
  },
  description: { margin: 0, fontSize: text.sm, color: colors.mutedForeground },
});
