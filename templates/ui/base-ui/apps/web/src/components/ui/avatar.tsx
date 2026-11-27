import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cn, type WithClass } from './styles.ts';

/** A round picture of a person: an <AvatarImage /> with an <AvatarFallback /> (initials) behind it. */
export function Avatar({ className, ...props }: WithClass<typeof BaseAvatar.Root>) {
  return (
    <BaseAvatar.Root
      className={cn(
        'inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-pill',
        'bg-paper-3 align-middle text-xs font-medium text-ink-2',
        className,
      )}
      {...props}
    />
  );
}

/** The picture. It shows once it has loaded; give it an alt from the caller. */
export function AvatarImage({ className, ...props }: WithClass<typeof BaseAvatar.Image>) {
  return <BaseAvatar.Image className={cn('size-full object-cover', className)} {...props} />;
}

/** Shows while the image loads or when it fails, usually the person's initials. */
export function AvatarFallback({ className, ...props }: WithClass<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      className={cn('flex size-full items-center justify-center', className)}
      {...props}
    />
  );
}
