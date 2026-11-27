import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { control, cx, type WithClass } from './styles.ts';

/** A button that stays pressed. Inside a ToggleGroup, give it a value. */
export function Toggle({ className, ...props }: WithClass<typeof BaseToggle>) {
  return (
    <BaseToggle
      className={cx(
        control,
        'data-pressed:border-ink data-pressed:bg-paper-3 data-pressed:font-semibold',
        className,
      )}
      {...props}
    />
  );
}

/** Toggles that share one value (an array), with one tab stop and arrow keys between them. */
export function ToggleGroup({ className, ...props }: WithClass<typeof BaseToggleGroup>) {
  return <BaseToggleGroup className={cx('inline-flex gap-1', className)} {...props} />;
}
