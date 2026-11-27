import { Input as BaseInput } from '@base-ui/react/input';
import { cn, focusRing, inputBox, type WithClass } from './styles.ts';

type InputProps = WithClass<typeof BaseInput>;

export function Input({ className, ...props }: InputProps) {
  return <BaseInput className={cn(inputBox, 'w-full', focusRing, className)} {...props} />;
}
