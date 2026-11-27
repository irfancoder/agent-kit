import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { cls, cx, type Override } from '@/lib/cx';
import { colors, fonts, motion, radii, shadows, space, text } from '@/styles/tokens.stylex';

export function Tabs({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseTabs.Root>, 'className'> & Override) {
  return <BaseTabs.Root data-slot="tabs" className={cls(styles.root, xstyle)} {...props} />;
}

export function TabsList({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseTabs.List>, 'className'> & Override) {
  return <BaseTabs.List data-slot="tabs-list" className={cls(styles.list, xstyle)} {...props} />;
}

export function TabsTrigger({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseTabs.Tab>, 'className'> & Override) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      className={cx(
        (s: { active: boolean; disabled: boolean }) => [
          styles.trigger,
          s.active && styles.active,
          s.disabled && styles.disabled,
        ],
        xstyle,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseTabs.Panel>, 'className'> & Override) {
  return (
    <BaseTabs.Panel data-slot="tabs-content" className={cls(styles.panel, xstyle)} {...props} />
  );
}

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: space.sm, fontFamily: fonts.sans },
  list: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    padding: '3px',
    gap: space.xxs,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: space.controlSm,
    paddingInline: space.md,
    fontFamily: fonts.sans,
    fontSize: text.sm,
    fontWeight: text.weightMedium,
    color: colors.mutedForeground,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: radii.sm,
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: motion.fast,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': '2px' },
    outlineColor: colors.ring,
  },
  active: { color: colors.foreground, backgroundColor: colors.background, boxShadow: shadows.sm },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
  panel: { outline: 'none' },
});
