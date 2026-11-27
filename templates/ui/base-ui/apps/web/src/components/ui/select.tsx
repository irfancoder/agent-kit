import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon, ChevronIcon } from './icons.tsx';
import {
  cn,
  focusRing,
  groupLabel,
  inputBox,
  label,
  list,
  listItem,
  popup,
  separator,
  type Placement,
  type WithClass,
} from './styles.ts';

const selectList = cn(list, 'max-h-(--available-height)');

/** Holds the value and wires the parts together. Pass `items` so the trigger can show labels. */
export const Select = BaseSelect.Root;

export function SelectLabel({ className, ...props }: WithClass<typeof BaseSelect.Label>) {
  return <BaseSelect.Label className={cn(label, className)} {...props} />;
}

/** The button that opens the list, with a chevron after its children. Put <SelectValue /> inside. */
export function SelectTrigger({
  className,
  children,
  ...props
}: WithClass<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      className={cn(
        inputBox,
        'flex min-w-40 cursor-pointer select-none items-center justify-between gap-2',
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon className="text-muted">
        <ChevronIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

/** The chosen option's label, or the placeholder in muted ink. */
export function SelectValue({ className, ...props }: WithClass<typeof BaseSelect.Value>) {
  return (
    <BaseSelect.Value
      className={cn('truncate data-placeholder:text-muted', className)}
      {...props}
    />
  );
}

/**
 * The popup with its list, portalled above the page. By default it lines the chosen option
 * up with the trigger; set alignItemWithTrigger={false} to drop it below instead.
 */
export function SelectContent({
  className,
  children,
  side,
  sideOffset = 4,
  align,
  alignOffset,
  alignItemWithTrigger,
  collisionPadding,
  ...props
}: WithClass<typeof BaseSelect.Popup> &
  Placement &
  Pick<BaseSelect.Positioner.Props, 'alignItemWithTrigger'>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        className="z-(--z-dropdown) outline-none select-none"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        collisionPadding={collisionPadding}
      >
        <BaseSelect.Popup
          className={cn(
            popup,
            'min-w-(--anchor-width)',
            'data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-ending-style:scale-100',
            className,
          )}
          {...props}
        >
          <BaseSelect.List className={selectList}>{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

/** One option. Its children are the label; a check marks the chosen one. */
export function SelectItem({ className, children, ...props }: WithClass<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item className={cn(listItem, className)} {...props}>
      <BaseSelect.ItemText className="flex-1 truncate">{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="ml-auto">
        <CheckIcon />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export const SelectGroup = BaseSelect.Group;

export function SelectGroupLabel({ className, ...props }: WithClass<typeof BaseSelect.GroupLabel>) {
  return <BaseSelect.GroupLabel className={cn(groupLabel, className)} {...props} />;
}

export function SelectSeparator({ className, ...props }: WithClass<typeof BaseSelect.Separator>) {
  return <BaseSelect.Separator className={cn(separator, className)} {...props} />;
}
