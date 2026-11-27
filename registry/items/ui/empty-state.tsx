import * as stylex from '@stylexjs/stylex';
import type { ComponentProps, ReactNode } from 'react';
import { sx, type Style } from '@/lib/cx';
import { colors, fonts, radii, space, text } from '@/styles/tokens.stylex';

export type EmptyStateProps = Omit<ComponentProps<'section'>, 'className' | 'style' | 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Usually a Button that starts the first action. */
  action?: ReactNode;
  xstyle?: Style;
};

/** What a list or page shows when it has nothing in it yet. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  xstyle,
  ...props
}: EmptyStateProps) {
  return (
    <section data-slot="empty-state" {...sx(styles.root, xstyle)} {...props}>
      {icon ? (
        <div aria-hidden="true" {...sx(styles.icon)}>
          {icon}
        </div>
      ) : null}
      <h2 {...sx(styles.title)}>{title}</h2>
      {description ? <p {...sx(styles.description)}>{description}</p> : null}
      {action ? <div {...sx(styles.action)}>{action}</div> : null}
    </section>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: space.sm,
    paddingBlock: space.xxxl,
    paddingInline: space.xl,
    fontFamily: fonts.sans,
    borderWidth: space.px,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radii.lg,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: space.controlLg,
    height: space.controlLg,
    marginBottom: space.sm,
    color: colors.mutedForeground,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
  },
  title: {
    margin: 0,
    fontSize: text.lg,
    fontWeight: text.weightSemibold,
    color: colors.foreground,
  },
  description: {
    margin: 0,
    maxWidth: '24rem',
    fontSize: text.sm,
    color: colors.mutedForeground,
  },
  action: { marginTop: space.md },
});
