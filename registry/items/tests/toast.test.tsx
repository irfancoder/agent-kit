import { afterEach, describe, expect, test } from '@rstest/core';
import { act, cleanup, screen } from '@testing-library/react';
import { useEffect, useRef } from 'react';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

function ShowToast() {
  const toast = useToast();
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.add({ title: 'Saved', description: 'Your item was added.' });
  }, [toast]);
  return null;
}

describe('Toast', () => {
  test('renders a toast in both themes', async () => {
    await forEachTheme(
      () => (
        <ToastProvider>
          <ShowToast />
        </ToastProvider>
      ),
      async () => {
        await act(async () => {});
        expect(screen.getByText('Saved')).toBeDefined();
      },
    );
  });
});
