import { Field } from '@base-ui/react/field';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { cx, type Style } from '@/lib/cx';
import { controlStyles } from '@/components/ui/control-styles';
import { space } from '@/styles/tokens.stylex';

export type TextareaProps = Omit<ComponentProps<'textarea'>, 'className'> & {
  xstyle?: Style;
};

/** A multi-line text control. Inside a <Field> it picks up the field's label and validation. */
export function Textarea({ xstyle, ...props }: TextareaProps) {
  return (
    <Field.Control
      data-slot="textarea"
      render={<textarea {...props} />}
      className={cx(
        (state: { disabled?: boolean; valid?: boolean | null }) => [
          controlStyles.base,
          styles.textarea,
          state.valid === false && controlStyles.invalid,
          state.disabled && controlStyles.disabled,
        ],
        xstyle,
      )}
    />
  );
}

const styles = stylex.create({
  textarea: {
    minHeight: '4rem',
    paddingBlock: space.sm,
    resize: 'vertical',
  },
});
