import { Input as BaseInput } from '@base-ui/react/input';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { cx, type Style } from '@/lib/cx';
import { controlStyles } from '@/components/ui/control-styles';

export type InputProps = Omit<ComponentProps<typeof BaseInput>, 'className'> & {
  xstyle?: Style;
};

export function Input({ xstyle, ...props }: InputProps) {
  return (
    <BaseInput
      data-slot="input"
      className={cx(
        (state: { disabled?: boolean; valid?: boolean | null }) => [
          controlStyles.base,
          styles.input,
          state.valid === false && controlStyles.invalid,
          state.disabled && controlStyles.disabled,
        ],
        xstyle,
      )}
      {...props}
    />
  );
}

const styles = stylex.create({
  input: { height: '2.25rem' },
});
