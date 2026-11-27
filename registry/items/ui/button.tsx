import { Button as BaseButton } from '@base-ui/react/button';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { cx, type Style } from '@/lib/cx';
import { colors, fonts, motion, radii, space, text } from '@/styles/tokens.stylex';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export type ButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** StyleX override, applied last. */
  xstyle?: Style;
};

export function Button({ variant = 'default', size = 'default', xstyle, ...props }: ButtonProps) {
  return (
    <BaseButton
      data-slot="button"
      className={cx(
        (state: { disabled: boolean }) => [
          styles.base,
          variants[variant],
          sizes[size],
          state.disabled && styles.disabled,
        ],
        xstyle,
      )}
      {...props}
    />
  );
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    fontFamily: fonts.sans,
    fontSize: text.sm,
    fontWeight: text.weightMedium,
    lineHeight: text.lineTight,
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: radii.md,
    cursor: 'pointer',
    userSelect: 'none',
    transitionProperty: 'background-color, color, border-color, box-shadow',
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.ease,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': '2px' },
    outlineColor: colors.ring,
    outlineOffset: '2px',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
});

const variants = stylex.create({
  default: {
    backgroundColor: { default: colors.accent, ':hover': colors.accentHover },
    color: colors.accentForeground,
  },
  secondary: {
    backgroundColor: { default: colors.secondary, ':hover': colors.secondaryHover },
    color: colors.secondaryForeground,
  },
  outline: {
    backgroundColor: { default: colors.background, ':hover': colors.muted },
    borderColor: colors.input,
    color: colors.foreground,
  },
  ghost: {
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
    color: colors.foreground,
  },
  destructive: {
    backgroundColor: { default: colors.danger, ':hover': colors.dangerHover },
    color: colors.dangerForeground,
  },
  link: {
    backgroundColor: 'transparent',
    color: colors.accent,
    textDecoration: { default: 'none', ':hover': 'underline' },
    textUnderlineOffset: '4px',
  },
});

const sizes = stylex.create({
  default: { height: space.control, paddingInline: space.lg },
  sm: { height: space.controlSm, paddingInline: space.md, fontSize: text.xs },
  lg: { height: space.controlLg, paddingInline: space.xl, fontSize: text.base },
  icon: { height: space.control, width: space.control, paddingInline: 0 },
});
