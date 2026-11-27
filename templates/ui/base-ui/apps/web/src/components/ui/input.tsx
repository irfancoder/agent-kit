import { Input as BaseInput } from '@base-ui/react/input';
import { cx, focusRing, type WithClass } from './styles.ts';

type InputProps = WithClass<typeof BaseInput>;

export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput
      className={cx(
        'h-8 w-full rounded-control border border-control-edge bg-paper px-2.5 text-sm text-ink',
        'placeholder:text-muted data-invalid:border-error data-disabled:opacity-50',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
