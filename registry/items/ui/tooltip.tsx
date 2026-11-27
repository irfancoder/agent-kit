import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { cls, cx, isTransitioning, type Override, type Transition } from '@/lib/cx';
import { colors, fonts, layers, motion, radii, space, text } from '@/styles/tokens.stylex';

export const TooltipProvider = BaseTooltip.Provider;
export const Tooltip = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;

export function TooltipContent({
  xstyle,
  sideOffset = 6,
  side = 'top',
  ...props
}: Omit<ComponentProps<typeof BaseTooltip.Popup>, 'className'> &
  Override & { sideOffset?: number; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        sideOffset={sideOffset}
        side={side}
        className={cls(styles.positioner)}
      >
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cx(
            (s: Transition) => [styles.popup, isTransitioning(s) && styles.hidden],
            xstyle,
          )}
          {...props}
        />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

const styles = stylex.create({
  positioner: { zIndex: layers.tooltip },
  popup: {
    maxWidth: '20rem',
    paddingBlock: space.xs,
    paddingInline: space.sm,
    fontFamily: fonts.sans,
    fontSize: text.xs,
    lineHeight: text.lineNormal,
    color: colors.background,
    backgroundColor: colors.foreground,
    borderRadius: radii.sm,
    transitionProperty: 'opacity',
    transitionDuration: motion.fast,
  },
  hidden: { opacity: 0 },
});
