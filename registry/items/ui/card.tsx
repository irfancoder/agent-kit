import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { sx, type Style } from '@/lib/cx';
import { colors, fonts, radii, shadows, space, text } from '@/styles/tokens.stylex';

type DivProps = Omit<ComponentProps<'div'>, 'className' | 'style'> & { xstyle?: Style };

export function Card({ xstyle, ...props }: DivProps) {
  return <div data-slot="card" {...sx(styles.card, xstyle)} {...props} />;
}
export function CardHeader({ xstyle, ...props }: DivProps) {
  return <div data-slot="card-header" {...sx(styles.header, xstyle)} {...props} />;
}
export function CardTitle({ xstyle, ...props }: DivProps) {
  return <div data-slot="card-title" {...sx(styles.title, xstyle)} {...props} />;
}
export function CardDescription({ xstyle, ...props }: DivProps) {
  return <div data-slot="card-description" {...sx(styles.description, xstyle)} {...props} />;
}
export function CardAction({ xstyle, ...props }: DivProps) {
  return <div data-slot="card-action" {...sx(styles.action, xstyle)} {...props} />;
}
export function CardContent({ xstyle, ...props }: DivProps) {
  return <div data-slot="card-content" {...sx(styles.content, xstyle)} {...props} />;
}
export function CardFooter({ xstyle, ...props }: DivProps) {
  return <div data-slot="card-footer" {...sx(styles.footer, xstyle)} {...props} />;
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.xl,
    paddingBlock: space.xl,
    fontFamily: fonts.sans,
    color: colors.surfaceForeground,
    backgroundColor: colors.surface,
    borderWidth: space.px,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.lg,
    boxShadow: shadows.sm,
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'start',
    gap: space.xs,
    paddingInline: space.xl,
  },
  title: {
    gridColumn: 1,
    fontSize: text.lg,
    fontWeight: text.weightSemibold,
    lineHeight: text.lineTight,
  },
  description: {
    gridColumn: 1,
    fontSize: text.sm,
    color: colors.mutedForeground,
  },
  action: {
    gridColumn: 2,
    gridRowStart: 1,
    gridRowEnd: 'span 2',
    alignSelf: 'start',
    justifySelf: 'end',
  },
  content: { paddingInline: space.xl },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: space.sm,
    paddingInline: space.xl,
  },
});
