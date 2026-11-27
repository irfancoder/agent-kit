import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CheckIcon, ChevronIcon, XIcon } from './icons.tsx';
import {
  cn,
  focusRing,
  focusWithinRing,
  groupLabel,
  inputBox,
  label,
  list,
  listItem,
  popup,
  separator,
  type IconOnly,
  type Placement,
  type WithClass,
} from './styles.ts';

/** An icon button inside the input box. */
const iconButton = cn(
  'flex size-6 cursor-pointer items-center justify-center rounded-inner text-muted hover:text-ink',
  'data-disabled:cursor-not-allowed',
  focusRing,
);

/** The options list, capped at 20rem or the room left in the window. */
const filterList = cn(list, 'max-h-[min(var(--available-height),--spacing(80))] data-empty:p-0');

/** The message shown when nothing matches. */
const emptyMessage = 'px-3 py-2 text-sm text-muted empty:p-0';

/** Holds the value and the filter. Pass `items`; the list renders them through a function child. */
export const Combobox = BaseCombobox.Root;

/** The chosen value (or chips) to render inside the input box. */
export const ComboboxValue = BaseCombobox.Value;

export function ComboboxLabel({ className, ...props }: WithClass<typeof BaseCombobox.Label>) {
  return <BaseCombobox.Label className={cn(label, className)} {...props} />;
}

/** The box shaped like <Input />, around the input, its buttons and any chips. */
export function ComboboxInputGroup({
  className,
  ...props
}: WithClass<typeof BaseCombobox.InputGroup>) {
  return (
    <BaseCombobox.InputGroup
      className={cn(
        inputBox,
        'flex h-auto min-h-8 w-full flex-wrap items-center gap-1 px-1',
        focusWithinRing,
        className,
      )}
      {...props}
    />
  );
}

/** The text box. Goes inside <ComboboxInputGroup />, which draws its border and focus ring. */
export function ComboboxInput({ className, ...props }: WithClass<typeof BaseCombobox.Input>) {
  return (
    <BaseCombobox.Input
      className={cn(
        'h-7 min-w-12 flex-1 bg-transparent px-1.5 text-sm text-ink outline-none placeholder:text-muted',
        'data-disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}

/** Opens the list. Icon-only: give it an aria-label. */
export function ComboboxTrigger({ className, ...props }: IconOnly<typeof BaseCombobox.Trigger>) {
  return (
    <BaseCombobox.Trigger className={cn(iconButton, className)} {...props}>
      <ChevronIcon />
    </BaseCombobox.Trigger>
  );
}

/** Clears the value; shows only when there is one. Icon-only: give it an aria-label. */
export function ComboboxClear({ className, ...props }: IconOnly<typeof BaseCombobox.Clear>) {
  return (
    <BaseCombobox.Clear className={cn(iconButton, className)} {...props}>
      <XIcon className="size-3.5" />
    </BaseCombobox.Clear>
  );
}

/** Wraps the chips and the input when `multiple` is set. */
export function ComboboxChips({ className, ...props }: WithClass<typeof BaseCombobox.Chips>) {
  return (
    <BaseCombobox.Chips
      className={cn('flex flex-1 flex-wrap items-center gap-1', className)}
      {...props}
    />
  );
}

/** One chosen value, as a removable chip. */
export function ComboboxChip({ className, ...props }: WithClass<typeof BaseCombobox.Chip>) {
  return (
    <BaseCombobox.Chip
      className={cn(
        'flex h-6 cursor-default items-center gap-1 rounded-inner bg-paper-3 pr-0.5 pl-2 text-sm text-ink outline-none',
        'focus-within:bg-ink focus-within:text-paper data-highlighted:bg-ink data-highlighted:text-paper',
        className,
      )}
      {...props}
    />
  );
}

/** Removes its chip. Icon-only: give it an aria-label. */
export function ComboboxChipRemove({
  className,
  ...props
}: IconOnly<typeof BaseCombobox.ChipRemove>) {
  return (
    <BaseCombobox.ChipRemove
      className={cn(
        'flex size-5 cursor-pointer items-center justify-center rounded-inner text-inherit',
        className,
      )}
      {...props}
    >
      <XIcon className="size-3.5" />
    </BaseCombobox.ChipRemove>
  );
}

/** The popup, portalled above the page and as wide as the input. Put <ComboboxList /> inside. */
export function ComboboxContent({
  className,
  side,
  sideOffset = 4,
  align,
  alignOffset,
  collisionPadding,
  anchor,
  ...props
}: WithClass<typeof BaseCombobox.Popup> &
  Placement &
  Pick<BaseCombobox.Positioner.Props, 'anchor'>) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        className="z-(--z-dropdown) outline-none"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
      >
        <BaseCombobox.Popup
          className={cn(popup, 'w-(--anchor-width) max-w-(--available-width)', className)}
          {...props}
        />
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

/** The options. Pass a function child to render each filtered item. */
export function ComboboxList({ className, ...props }: WithClass<typeof BaseCombobox.List>) {
  return <BaseCombobox.List className={cn(filterList, className)} {...props} />;
}

/** One option. A check marks the chosen one. */
export function ComboboxItem({
  className,
  children,
  ...props
}: WithClass<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item className={cn(listItem, className)} {...props}>
      <span className="flex-1 truncate">{children}</span>
      <BaseCombobox.ItemIndicator className="ml-auto">
        <CheckIcon />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

/** Shown when nothing matches. Its children are the message (from t()). */
export function ComboboxEmpty({ className, ...props }: WithClass<typeof BaseCombobox.Empty>) {
  return <BaseCombobox.Empty className={cn(emptyMessage, className)} {...props} />;
}

export const ComboboxGroup = BaseCombobox.Group;

export function ComboboxGroupLabel({
  className,
  ...props
}: WithClass<typeof BaseCombobox.GroupLabel>) {
  return <BaseCombobox.GroupLabel className={cn(groupLabel, className)} {...props} />;
}

export function ComboboxSeparator({
  className,
  ...props
}: WithClass<typeof BaseCombobox.Separator>) {
  return <BaseCombobox.Separator className={cn(separator, className)} {...props} />;
}
