import * as stylex from '@stylexjs/stylex';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { locales, localeNames, useI18n, type Locale } from '@/i18n/index.tsx';
import { toggleTheme } from '@/lib/theme.ts';
import { colors, fonts, space, text } from '@/styles/tokens.stylex';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

function RootLayout() {
  const { t, locale, setLocale } = useI18n();
  return (
    <div {...stylex.props(styles.shell)}>
      <header {...stylex.props(styles.header)}>
        <Link to="/" {...stylex.props(styles.brand)}>
          {t('app.title')}
        </Link>
        <nav aria-label={t('nav.language')} {...stylex.props(styles.actions)}>
          {(Object.keys(locales) as Locale[]).map((l) => (
            <Button
              key={l}
              size="sm"
              variant={l === locale ? 'secondary' : 'ghost'}
              aria-pressed={l === locale}
              lang={l}
              onClick={() => setLocale(l)}
            >
              {localeNames[l]}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={toggleTheme}>
            {t('theme.toggle')}
          </Button>
        </nav>
      </header>
      <main {...stylex.props(styles.main)}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = stylex.create({
  shell: {
    minHeight: '100vh',
    fontFamily: fonts.sans,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.lg,
    paddingBlock: space.md,
    paddingInline: space.xl,
    borderBottomWidth: space.px,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  brand: {
    fontSize: text.lg,
    fontWeight: text.weightBold,
    color: colors.foreground,
    textDecoration: 'none',
  },
  actions: { display: 'flex', alignItems: 'center', gap: space.xs },
  main: {
    maxWidth: '44rem',
    marginInline: 'auto',
    paddingBlock: space.xxl,
    paddingInline: space.xl,
  },
});
