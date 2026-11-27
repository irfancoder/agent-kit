import { Toast } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/index.tsx';
import { XIcon } from './icons.tsx';
import { cn, focusRing, surface } from './styles.ts';

const manager = Toast.createToastManager();

const root = cn(surface, 'flex items-start gap-3 p-4 text-sm data-[type=error]:border-error');
const close = cn('cursor-pointer text-muted hover:text-ink', focusRing);

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
          <Toast.Root key={item.id} toast={item} className={root}>
            <Toast.Content className="flex-1">
              <Toast.Title className="font-medium" />
            </Toast.Content>
            <Toast.Close aria-label={t('toast.close')} className={close}>
              <XIcon />
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
