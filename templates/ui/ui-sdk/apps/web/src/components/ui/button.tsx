import { Button as UiButton } from '@ui-sdk/react/button';
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<typeof UiButton> & {
  /** "solid" fills the button with --color-primary, for the screen's main action. */
  variant?: 'solid';
};

/** ui-sdk's Button, styled by web.css. */
export function Button({ variant, ...props }: ButtonProps) {
  return <UiButton data-variant={variant} {...props} />;
}
