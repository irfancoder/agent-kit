import { ToastRegion } from '@ui-sdk/react/toast';
import type { ReactNode } from 'react';

/** Call from anywhere: toast.error('…'), toast.success('…'). */
export { toast } from '@ui-sdk/react/toast';

/** Renders the toasts. Wraps the app once, in main.tsx. */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastRegion />
    </>
  );
}
