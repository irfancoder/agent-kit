import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import {
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
} from './menu.tsx';
import { cn, menuPopup, type WithClass } from './styles.ts';

/** A menu that opens at the pointer on right-click or long press. Holds the open state. */
export const ContextMenu = BaseContextMenu.Root;

/** The area that opens the menu. Unstyled: give it the layout of what it wraps. */
export const ContextMenuTrigger = BaseContextMenu.Trigger;

/** The panel, placed at the pointer and rendered in a portal. */
export function ContextMenuContent({
  className,
  ...props
}: WithClass<typeof BaseContextMenu.Popup>) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className="z-(--z-dropdown)">
        <BaseContextMenu.Popup className={cn(menuPopup, className)} {...props} />
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

// The rows are the menu's own parts, so they share its styling. A submenu's panel is a MenuContent.
export {
  MenuItem as ContextMenuItem,
  MenuLinkItem as ContextMenuLinkItem,
  MenuCheckboxItem as ContextMenuCheckboxItem,
  MenuRadioGroup as ContextMenuRadioGroup,
  MenuRadioItem as ContextMenuRadioItem,
  MenuGroup as ContextMenuGroup,
  MenuGroupLabel as ContextMenuGroupLabel,
  MenuSeparator as ContextMenuSeparator,
  MenuSubmenu as ContextMenuSubmenu,
  MenuSubmenuTrigger as ContextMenuSubmenuTrigger,
  MenuContent as ContextMenuSubmenuContent,
};
