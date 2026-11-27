import { Popover as BasePopover } from '@base-ui/react/popover';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { popupStyles } from '@/components/ui/popup-styles';
import { cls, cx, isTransitioning, type Override, type Transition } from '@/lib/cx';
import { colors, space, text } from '@/styles/tokens.stylex';

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

export function PopoverContent({
  xstyle,
  sideOffset = 4,
  align = 'center',
  ...props
}: Omit<ComponentProps<typeof BasePopover.Popup>, 'className'> &
  Override & { sideOffset?: number; align?: 'start' | 'center' | 'end' }) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        sideOffset={sideOffset}
        align={align}
        className={cls(popupStyles.positioner)}
      >
        <BasePopover.Popup
          data-slot="popover-content"
          className={cx(
            (s: Transition) => [
              popupStyles.popup,
              styles.popup,
              isTransitioning(s) && popupStyles.hidden,
            ],
            xstyle,
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverTitle({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BasePopover.Title>, 'className'> & Override) {
  return <BasePopover.Title className={cls(styles.title, xstyle)} {...props} />;
}

export function PopoverDescription({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BasePopover.Description>, 'className'> & Override) {
  return <BasePopover.Description className={cls(styles.description, xstyle)} {...props} />;
}

const styles = stylex.create({
  popup: { width: '18rem', padding: space.lg },
  title: { margin: 0, fontSize: text.base, fontWeight: text.weightSemibold },
  description: { margin: 0, marginTop: space.xs, color: colors.mutedForeground },
});
