import { Toast } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/index.tsx';
import { cx, focusRing } from './styles.ts';

const manager = Toast.createToastManager();

/** Call from anywhere: toast.error('…'), toast.success('…'). */
export const toast = {
  success: (title: string) => manager.add({ title, type: 'success' }),
  error: (title: string) => manager.add({ title, type: 'error', priority: 'high' }),
};

function Toasts() {
  const { t } = useI18n();
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-(--z-toast) flex w-80 flex-col gap-2">
        {toasts.map((item) => (
          <Toast.Root
            key={item.id}
            toast={item}
            className={cx(
              'flex items-start gap-3 rounded-card border border-rule bg-paper-2 p-4 text-sm text-ink shadow-pop',
              'data-[type=error]:border-error',
            )}
          >
            <Toast.Content className="flex-1">
              <Toast.Title className="font-medium" />
            </Toast.Content>
            <Toast.Close
              aria-label={t('toast.close')}
              className={cx('cursor-pointer text-muted hover:text-ink', focusRing)}
            >
              ×
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

/** Renders the toasts. Wraps the app once, in main.tsx. */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider toastManager={manager}>
      {children}
      <Toasts />
    </Toast.Provider>
  );
}
