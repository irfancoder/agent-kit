import { Field as BaseField } from '@base-ui/react/field';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { cls, cx, type Override } from '@/lib/cx';
import { labelStyles } from '@/components/ui/label';
import { colors, fonts, space, text } from '@/styles/tokens.stylex';

/** Groups a label, a control, a description and an error, and links them for assistive tech. */
export function Field({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseField.Root>, 'className'> & Override) {
  return <BaseField.Root data-slot="field" className={cls(styles.root, xstyle)} {...props} />;
}

export function FieldLabel({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseField.Label>, 'className'> & Override) {
  return (
    <BaseField.Label
      data-slot="field-label"
      className={cx(
        (s: { disabled?: boolean }) => [labelStyles.label, s.disabled && styles.disabled],
        xstyle,
      )}
      {...props}
    />
  );
}

export function FieldDescription({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseField.Description>, 'className'> & Override) {
  return (
    <BaseField.Description
      data-slot="field-description"
      className={cls(styles.description, xstyle)}
      {...props}
    />
  );
}

export function FieldError({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseField.Error>, 'className'> & Override) {
  return (
    <BaseField.Error data-slot="field-error" className={cls(styles.error, xstyle)} {...props} />
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
    minWidth: 0,
  },
  disabled: { opacity: 0.5 },
  description: {
    margin: 0,
    fontFamily: fonts.sans,
    fontSize: text.sm,
    color: colors.mutedForeground,
  },
  error: {
    margin: 0,
    fontFamily: fonts.sans,
    fontSize: text.sm,
    color: colors.danger,
  },
});
