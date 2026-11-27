import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { sx, type Style } from '@/lib/cx';
import { colors, fonts, text } from '@/styles/tokens.stylex';

export type LabelProps = Omit<ComponentProps<'label'>, 'className' | 'style'> & {
  xstyle?: Style;
};

/** A plain form label. Inside a <Field>, use FieldLabel, which links itself to the control. */
export function Label({ xstyle, ...props }: LabelProps) {
  // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- callers pass htmlFor or wrap the control
  return <label data-slot="label" {...sx(labelStyles.label, xstyle)} {...props} />;
}

export const labelStyles = stylex.create({
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: fonts.sans,
    fontSize: text.sm,
    fontWeight: text.weightMedium,
    lineHeight: text.lineTight,
    color: colors.foreground,
    userSelect: 'none',
  },
});
