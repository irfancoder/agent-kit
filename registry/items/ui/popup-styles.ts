import * as stylex from '@stylexjs/stylex';
import { colors, fonts, layers, motion, radii, shadows, space, text } from '@/styles/tokens.stylex';

/** Shared look for floating surfaces (menus, popovers, select lists) and their items. */
export const popupStyles = stylex.create({
  positioner: { zIndex: layers.popover, outline: 'none' },
  popup: {
    minWidth: '8rem',
    padding: space.xs,
    fontFamily: fonts.sans,
    fontSize: text.sm,
    color: colors.surfaceForeground,
    backgroundColor: colors.surface,
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.md,
    boxShadow: shadows.md,
    outline: 'none',
    transformOrigin: 'var(--transform-origin)',
    transitionProperty: 'opacity, transform',
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.ease,
  },
  hidden: { opacity: 0, transform: 'scale(0.96)' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: space.sm,
    paddingBlock: space.xs,
    paddingInline: space.sm,
    borderRadius: radii.sm,
    cursor: 'default',
    userSelect: 'none',
    outline: 'none',
  },
  highlighted: { backgroundColor: colors.muted },
  disabled: { opacity: 0.5, pointerEvents: 'none' },
  separator: {
    height: space.px,
    marginBlock: space.xs,
    marginInline: `calc(-1 * ${space.xs})`,
    backgroundColor: colors.border,
    borderWidth: 0,
  },
  groupLabel: {
    paddingBlock: space.xs,
    paddingInline: space.sm,
    fontSize: text.xs,
    fontWeight: text.weightMedium,
    color: colors.mutedForeground,
  },
});
