import * as stylex from '@stylexjs/stylex';
import { colors, fonts, motion, radii, space, text } from '@/styles/tokens.stylex';

/** Shared look for text-entry controls (input, textarea, select trigger). */
export const controlStyles = stylex.create({
  base: {
    width: '100%',
    minWidth: 0,
    paddingBlock: space.xs,
    paddingInline: space.md,
    fontFamily: fonts.sans,
    fontSize: text.sm,
    lineHeight: text.lineNormal,
    color: colors.foreground,
    backgroundColor: colors.background,
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: { default: colors.input, ':focus-visible': colors.ring },
    borderRadius: radii.md,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': '2px' },
    outlineColor: colors.ring,
    outlineOffset: '1px',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: motion.fast,
    '::placeholder': { color: colors.mutedForeground },
  },
  invalid: {
    borderColor: colors.danger,
    outlineColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
