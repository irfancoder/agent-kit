import { Menu } from '@base-ui/react/menu';
import { Separator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';
import { popupStyles } from '@/components/ui/popup-styles';
import { cls, cx, isTransitioning, type Override, type Transition } from '@/lib/cx';

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuGroup = Menu.Group;

export function DropdownMenuContent({
  xstyle,
  sideOffset = 4,
  align = 'start',
  ...props
}: Omit<ComponentProps<typeof Menu.Popup>, 'className'> &
  Override & { sideOffset?: number; align?: 'start' | 'center' | 'end' }) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        sideOffset={sideOffset}
        align={align}
        className={cls(popupStyles.positioner)}
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cx(
            (s: Transition) => [popupStyles.popup, isTransitioning(s) && popupStyles.hidden],
            xstyle,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function DropdownMenuItem({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof Menu.Item>, 'className'> & Override) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cx(
        (s: { highlighted: boolean; disabled: boolean }) => [
          popupStyles.item,
          s.highlighted && popupStyles.highlighted,
          s.disabled && popupStyles.disabled,
        ],
        xstyle,
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof Menu.GroupLabel>, 'className'> & Override) {
  return <Menu.GroupLabel className={cls(popupStyles.groupLabel, xstyle)} {...props} />;
}

export function DropdownMenuSeparator({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof Separator>, 'className'> & Override) {
  return (
    <Separator
      data-slot="dropdown-menu-separator"
      className={cls(popupStyles.separator, xstyle)}
      {...props}
    />
  );
}
