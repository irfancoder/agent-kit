import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Tooltip', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger>Help</TooltipTrigger>
            <TooltipContent>More info</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      async () => {
        expect(screen.getByText('More info')).toBeDefined();
      },
    );
  });
});
