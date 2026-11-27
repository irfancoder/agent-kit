import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { CheckIcon } from '@/components/ui/icons';
import { cls, cx, type Style } from '@/lib/cx';
import { colors, motion, radii, space } from '@/styles/tokens.stylex';

export type CheckboxProps = Omit<ComponentProps<typeof BaseCheckbox.Root>, 'className'> & {
  xstyle?: Style;
};

export function Checkbox({ xstyle, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={cx(
        (s: { checked: boolean; disabled: boolean; valid?: boolean | null }) => [
          styles.root,
          s.checked && styles.checked,
          s.valid === false && styles.invalid,
          s.disabled && styles.disabled,
        ],
        xstyle,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator data-slot="checkbox-indicator" className={cls(styles.indicator)}>
        <CheckIcon width={14} height={14} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '1rem',
    height: '1rem',
    padding: 0,
    color: colors.accentForeground,
    backgroundColor: colors.background,
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: colors.input,
    borderRadius: radii.sm,
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color',
    transitionDuration: motion.fast,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': '2px' },
    outlineColor: colors.ring,
    outlineOffset: '2px',
  },
  checked: { backgroundColor: colors.accent, borderColor: colors.accent },
  invalid: { borderColor: colors.danger },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
  indicator: { display: 'flex' },
});
