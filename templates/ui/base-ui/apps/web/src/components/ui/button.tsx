import { Button as BaseButton } from '@base-ui/react/button';
import { control, cn, type WithClass } from './styles.ts';

type ButtonProps = WithClass<typeof BaseButton> & {
  /** "solid" fills the button with --color-primary, for the screen's main action. */
  variant?: 'solid';
};

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        control,
        variant === 'solid' &&
          'border-primary bg-primary text-primary-ink hover:bg-primary/85 active:bg-primary/85',
        className,
      )}
      {...props}
    />
  );
}
