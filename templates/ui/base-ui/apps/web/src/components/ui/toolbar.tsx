import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cn, focusRing, ghostControl, inputBox, type WithClass } from './styles.ts';

/** A row of controls with one tab stop and arrow keys between them. Name it with aria-label. */
export function Toolbar({ className, ...props }: WithClass<typeof BaseToolbar.Root>) {
  return (
    <BaseToolbar.Root
      className={cn(
        'flex items-center gap-1 rounded-control border border-rule bg-paper p-1',
        'data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

/** Groups related buttons. Name it with aria-label. */
export function ToolbarGroup({ className, ...props }: WithClass<typeof BaseToolbar.Group>) {
  return (
    <BaseToolbar.Group
      className={cn('flex gap-1 data-[orientation=vertical]:flex-col', className)}
      {...props}
    />
  );
}

/**
 * A button in the toolbar. An icon-only one needs an aria-label. For a pressed state, pass
 * render={<Toggle />}; for a menu or select, pass its trigger.
 */
export function ToolbarButton({ className, ...props }: WithClass<typeof BaseToolbar.Button>) {
  return (
    <BaseToolbar.Button
      className={cn(
        ghostControl,
        'min-w-8 px-2 data-pressed:bg-paper-3 data-pressed:font-semibold',
        className,
      )}
      {...props}
    />
  );
}

/** A link in the toolbar, such as "Edited 5m ago". */
export function ToolbarLink({ className, ...props }: WithClass<typeof BaseToolbar.Link>) {
  return (
    <BaseToolbar.Link
      className={cn(
        'rounded-inner px-1 text-sm text-muted underline-offset-4 hover:text-ink hover:underline',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

/** A text input in the toolbar. Label it with aria-label. */
export function ToolbarInput({ className, ...props }: WithClass<typeof BaseToolbar.Input>) {
  return <BaseToolbar.Input className={cn(inputBox, focusRing, className)} {...props} />;
}

/** A divider between groups. It runs across the toolbar's direction. */
export function ToolbarSeparator({ className, ...props }: WithClass<typeof BaseToolbar.Separator>) {
  return (
    <BaseToolbar.Separator
      className={cn(
        'shrink-0 bg-rule',
        'data-[orientation=vertical]:mx-1 data-[orientation=vertical]:h-4 data-[orientation=vertical]:w-px',
        'data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-4',
        className,
      )}
      {...props}
    />
  );
}
