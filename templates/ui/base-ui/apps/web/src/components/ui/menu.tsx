import { Menu as BaseMenu } from '@base-ui/react/menu';
import { CheckIcon, SubmenuIcon } from './icons.tsx';
import {
  cn,
  control,
  groupLabel,
  listItem,
  menuPopup,
  separator,
  type Placement,
  type WithClass,
} from './styles.ts';

/** Holds the open state. Put a MenuTrigger and a MenuContent inside it. */
export const Menu = BaseMenu.Root;

/** Opens the menu. Styled as a button. */
export function MenuTrigger({ className, ...props }: WithClass<typeof BaseMenu.Trigger>) {
  return <BaseMenu.Trigger className={cn(control, className)} {...props} />;
}

/** The panel, positioned against the trigger and rendered in a portal. A submenu uses it too. */
export function MenuContent({
  className,
  side,
  align = 'start',
  sideOffset = 4,
  alignOffset,
  collisionPadding,
  ...props
}: WithClass<typeof BaseMenu.Popup> & Placement) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        className="z-(--z-dropdown)"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
      >
        <BaseMenu.Popup className={cn(menuPopup, className)} {...props} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenuItem({ className, ...props }: WithClass<typeof BaseMenu.Item>) {
  return <BaseMenu.Item className={cn(listItem, className)} {...props} />;
}

/** A row that navigates. Renders an <a>; give it an href. */
export function MenuLinkItem({ className, ...props }: WithClass<typeof BaseMenu.LinkItem>) {
  return <BaseMenu.LinkItem className={cn(listItem, className)} {...props} />;
}

/** A row that turns a setting on and off, with a tick when it's on. */
export function MenuCheckboxItem({
  className,
  children,
  ...props
}: WithClass<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem className={cn(listItem, className)} {...props}>
      <span className="flex size-4 items-center justify-center">
        <BaseMenu.CheckboxItemIndicator>
          <CheckIcon strokeWidth={2} />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

/** Groups MenuRadioItems that share one value. */
export const MenuRadioGroup = BaseMenu.RadioGroup;

/** One choice in a MenuRadioGroup, with a dot when it's chosen. */
export function MenuRadioItem({
  className,
  children,
  ...props
}: WithClass<typeof BaseMenu.RadioItem>) {
  return (
    <BaseMenu.RadioItem className={cn(listItem, className)} {...props}>
      <span className="flex size-4 items-center justify-center">
        <BaseMenu.RadioItemIndicator className="size-2 rounded-pill bg-ink" />
      </span>
      {children}
    </BaseMenu.RadioItem>
  );
}

/** Groups related rows. Name it with a MenuGroupLabel. */
export const MenuGroup = BaseMenu.Group;

export function MenuGroupLabel({ className, ...props }: WithClass<typeof BaseMenu.GroupLabel>) {
  return <BaseMenu.GroupLabel className={cn(groupLabel, className)} {...props} />;
}

export function MenuSeparator({ className, ...props }: WithClass<typeof BaseMenu.Separator>) {
  return <BaseMenu.Separator className={cn(separator, className)} {...props} />;
}

/** A nested menu. Put a MenuSubmenuTrigger and a MenuContent inside it. */
export const MenuSubmenu = BaseMenu.SubmenuRoot;

/** The row that opens a submenu, with an arrow pointing to it. */
export function MenuSubmenuTrigger({
  className,
  children,
  ...props
}: WithClass<typeof BaseMenu.SubmenuTrigger>) {
  return (
    <BaseMenu.SubmenuTrigger className={cn(listItem, className)} {...props}>
      {children}
      <SubmenuIcon className="ms-auto" />
    </BaseMenu.SubmenuTrigger>
  );
}
