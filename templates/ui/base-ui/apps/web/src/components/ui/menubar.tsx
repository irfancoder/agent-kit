import { Menu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { cn, ghostControl, type WithClass } from './styles.ts';

/**
 * A row of menus, like an app's File / Edit / View, with arrow keys between them.
 * Each menu is a <MenubarMenu> holding a <MenubarTrigger> and a <MenuContent> of items
 * (from ./menu.tsx).
 */
export function Menubar({ className, ...props }: WithClass<typeof BaseMenubar>) {
  return (
    <BaseMenubar
      className={cn('flex items-center gap-0.5 data-[orientation=vertical]:flex-col', className)}
      {...props}
    />
  );
}

/** One menu in the bar. */
export const MenubarMenu = Menu.Root;

/** The menu's name in the bar. Opens its menu on click, and on hover once one is open. */
export function MenubarTrigger({ className, ...props }: WithClass<typeof Menu.Trigger>) {
  return <Menu.Trigger className={cn(ghostControl, className)} {...props} />;
}
