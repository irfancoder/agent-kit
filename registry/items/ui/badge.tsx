import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { sx, type Style } from '@/lib/cx';
import { colors, fonts, radii, space, text } from '@/styles/tokens.stylex';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export type BadgeProps = Omit<ComponentProps<'span'>, 'className' | 'style'> & {
  variant?: BadgeVariant;
  xstyle?: Style;
};

export function Badge({ variant = 'default', xstyle, ...props }: BadgeProps) {
  return <span data-slot="badge" {...sx(styles.base, variants[variant], xstyle)} {...props} />;
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    width: 'fit-content',
    paddingBlock: space.xxs,
    paddingInline: space.sm,
    fontFamily: fonts.sans,
    fontSize: text.xs,
    fontWeight: text.weightMedium,
    lineHeight: text.lineTight,
    whiteSpace: 'nowrap',
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: radii.full,
  },
});

const variants = stylex.create({
  default: { backgroundColor: colors.accent, color: colors.accentForeground },
  secondary: { backgroundColor: colors.secondary, color: colors.secondaryForeground },
  destructive: { backgroundColor: colors.danger, color: colors.dangerForeground },
  outline: { borderColor: colors.border, color: colors.foreground },
});
