import { Switch as BaseSwitch } from '@base-ui/react/switch';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { cx, type Style } from '@/lib/cx';
import { colors, motion, radii, shadows } from '@/styles/tokens.stylex';

export type SwitchProps = Omit<ComponentProps<typeof BaseSwitch.Root>, 'className'> & {
  xstyle?: Style;
};

export function Switch({ xstyle, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cx(
        (s: { checked: boolean; disabled: boolean }) => [
          styles.root,
          s.checked && styles.rootChecked,
          s.disabled && styles.disabled,
        ],
        xstyle,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cx((s: { checked: boolean }) => [
          styles.thumb,
          s.checked && styles.thumbChecked,
        ])}
      />
    </BaseSwitch.Root>
  );
}

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    width: '2rem',
    height: '1.15rem',
    padding: '1px',
    backgroundColor: colors.input,
    borderWidth: 0,
    borderRadius: radii.full,
    cursor: 'pointer',
    transitionProperty: 'background-color',
    transitionDuration: motion.fast,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': '2px' },
    outlineColor: colors.ring,
    outlineOffset: '2px',
  },
  rootChecked: { backgroundColor: colors.accent },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
  thumb: {
    display: 'block',
    width: '0.95rem',
    height: '0.95rem',
    backgroundColor: colors.background,
    borderRadius: radii.full,
    boxShadow: shadows.sm,
    transitionProperty: 'transform',
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.ease,
  },
  thumbChecked: { transform: 'translateX(0.85rem)' },
});
