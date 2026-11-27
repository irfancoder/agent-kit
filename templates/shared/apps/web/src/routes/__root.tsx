import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { usePreference } from '@ui-sdk/react/preferences';
import { Toggle, ToggleGroup } from '@ui-sdk/react/toggle';
import { locales, localeNames, useI18n, type Locale } from '@/i18n/index.tsx';
import { colorScheme } from '@/lib/color-scheme.ts';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

function RootLayout() {
  const { t, locale, setLocale } = useI18n();
  const { resolved } = usePreference(colorScheme);
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between gap-6 border-b border-rule px-10 py-4">
        <Link to="/" className="text-lg font-bold text-ink no-underline">
          {t('app.title')}
        </Link>
        <div className="flex items-center gap-4">
          <ToggleGroup
            aria-label={t('nav.language')}
            value={[locale]}
            deselectable={false}
            onValueChange={([next]) => next && setLocale(next as Locale)}
          >
            {(Object.keys(locales) as Locale[]).map((l) => (
              <Toggle key={l} value={l} lang={l}>
                {localeNames[l]}
              </Toggle>
            ))}
          </ToggleGroup>
          <Toggle
            pressed={resolved === 'dark'}
            onPressedChange={(dark) => colorScheme.set(dark ? 'dark' : 'light')}
          >
            {t('theme.dark')}
          </Toggle>
        </div>
      </header>
      <main className="mx-auto max-w-176 px-10 py-16">
        <Outlet />
      </main>
    </div>
  );
}
