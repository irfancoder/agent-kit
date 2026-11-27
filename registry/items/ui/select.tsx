import { Select as BaseSelect } from '@base-ui/react/select';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { controlStyles } from '@/components/ui/control-styles';
import { CheckIcon, ChevronDownIcon } from '@/components/ui/icons';
import { popupStyles } from '@/components/ui/popup-styles';
import { cls, cx, type Override } from '@/lib/cx';
import { colors, space } from '@/styles/tokens.stylex';

export const Select = BaseSelect.Root;
export const SelectGroup = BaseSelect.Group;

export function SelectValue(props: ComponentProps<typeof BaseSelect.Value>) {
  return <BaseSelect.Value data-slot="select-value" {...props} />;
}

export function SelectTrigger({
  xstyle,
  children,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.Trigger>, 'className'> & Override) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cx(
        (s: { disabled: boolean; valid?: boolean | null }) => [
          controlStyles.base,
          styles.trigger,
          s.valid === false && controlStyles.invalid,
          s.disabled && controlStyles.disabled,
        ],
        xstyle,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon className={cls(styles.icon)}>
        <ChevronDownIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export function SelectContent({
  xstyle,
  children,
  sideOffset = 4,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.Popup>, 'className'> &
  Override & { sideOffset?: number }) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={sideOffset}
        alignItemWithTrigger={false}
        className={cls(popupStyles.positioner)}
      >
        <BaseSelect.Popup
          data-slot="select-content"
          className={cls(popupStyles.popup, styles.popup, xstyle)}
          {...props}
        >
          <BaseSelect.List>{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  xstyle,
  children,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.Item>, 'className'> & Override) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cx(
        (s: { highlighted: boolean; disabled: boolean }) => [
          popupStyles.item,
          styles.item,
          s.highlighted && popupStyles.highlighted,
          s.disabled && popupStyles.disabled,
        ],
        xstyle,
      )}
      {...props}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className={cls(styles.indicator)}>
        <CheckIcon />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export function SelectLabel({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.GroupLabel>, 'className'> & Override) {
  return <BaseSelect.GroupLabel className={cls(popupStyles.groupLabel, xstyle)} {...props} />;
}

export function SelectSeparator({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.Separator>, 'className'> & Override) {
  return <BaseSelect.Separator className={cls(popupStyles.separator, xstyle)} {...props} />;
}

const styles = stylex.create({
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    height: space.control,
    cursor: 'pointer',
    textAlign: 'start',
  },
  icon: { display: 'flex', color: colors.mutedForeground },
  popup: {
    minWidth: 'var(--anchor-width)',
    maxHeight: 'var(--available-height)',
    overflowY: 'auto',
  },
  item: { justifyContent: 'space-between', paddingInlineEnd: space.xs },
  indicator: { display: 'flex', color: colors.accent },
});
