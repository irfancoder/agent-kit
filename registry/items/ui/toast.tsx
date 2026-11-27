import { Toast } from '@base-ui/react/toast';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { XIcon } from '@/components/ui/icons';
import { cls, cx, isTransitioning, type Transition } from '@/lib/cx';
import { colors, fonts, layers, motion, radii, shadows, space, text } from '@/styles/tokens.stylex';

/** Wrap the app once. Toasts render in a viewport at the bottom right. */
export function ToastProvider({
  children,
  timeout = 5000,
}: {
  children: ReactNode;
  timeout?: number;
}) {
  return (
    <Toast.Provider timeout={timeout}>
      {children}
      <Toast.Portal>
        <Toast.Viewport data-slot="toast-viewport" className={cls(styles.viewport)}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

/** Shows a toast: useToast().add({ title, description, type: 'success' | 'error' }). */
export const useToast = Toast.useToastManager;

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      data-slot="toast"
      className={cx((s: Transition & { type?: string | undefined }) => [
        styles.toast,
        s.type === 'error' && styles.error,
        s.type === 'success' && styles.success,
        isTransitioning(s) && styles.hidden,
      ])}
    >
      <Toast.Content className={cls(styles.content)}>
        <div className={cls(styles.text)}>
          <Toast.Title className={cls(styles.title)} />
          <Toast.Description className={cls(styles.description)} />
        </div>
        <Toast.Close aria-label="Dismiss" className={cls(styles.close)}>
          <XIcon />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

const styles = stylex.create({
  viewport: {
    position: 'fixed',
    right: space.lg,
    bottom: space.lg,
    zIndex: layers.toast,
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
    width: 'min(22rem, calc(100vw - 2rem))',
    outline: 'none',
  },
  toast: {
    fontFamily: fonts.sans,
    color: colors.surfaceForeground,
    backgroundColor: colors.surface,
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderLeftWidth: '3px',
    borderRadius: radii.md,
    boxShadow: shadows.md,
    transitionProperty: 'opacity, transform',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
  },
  error: { borderLeftColor: colors.danger },
  success: { borderLeftColor: colors.success },
  hidden: { opacity: 0, transform: 'translateY(0.5rem)' },
  content: { display: 'flex', alignItems: 'flex-start', gap: space.md, padding: space.md },
  text: { display: 'flex', flexDirection: 'column', gap: space.xxs, flexGrow: 1, minWidth: 0 },
  title: { margin: 0, fontSize: text.sm, fontWeight: text.weightSemibold },
  description: { margin: 0, fontSize: text.sm, color: colors.mutedForeground },
  close: {
    display: 'flex',
    padding: space.xxs,
    color: colors.mutedForeground,
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
    borderWidth: 0,
    borderRadius: radii.sm,
    cursor: 'pointer',
  },
});
