import * as stylex from '@stylexjs/stylex';
import type { CompiledStyles, InlineStyles, StyleXArray } from '@stylexjs/stylex';

/** Anything stylex.props accepts: compiled styles (or arrays of them), false, null or undefined. */
export type Style = StyleXArray<
  CompiledStyles | boolean | null | undefined | Readonly<[CompiledStyles, InlineStyles]>
>;

/**
 * Turns StyleX styles into a Base UI className. Base UI passes the
 * component's state (open, checked, disabled…) so styles can depend on it:
 *   className={cx((s) => [styles.root, s.checked && styles.checked], props.style)}
 * `extra` is the caller's own StyleX override, applied last.
 */
export function cx<State>(fn: (state: State) => Style[], extra?: Style): (state: State) => string {
  return (state) => stylex.props(...fn(state), extra).className ?? '';
}

/** Spreads StyleX styles plus an optional caller override onto a plain element. */
export function sx(...styles: Style[]): {
  className?: string;
  style?: Record<string, string | number>;
} {
  const { className, style } = stylex.props(...styles);
  return { ...(className ? { className } : {}), ...(style ? { style } : {}) };
}

/** Static StyleX styles as a className string, for parts whose look never depends on state. */
export function cls(...styles: Style[]): string {
  return stylex.props(...styles).className ?? '';
}

/** The `xstyle` prop every component takes: a StyleX override, applied last. */
export type Override = { xstyle?: Style };

/** Base UI's state for parts that animate in and out. */
export type Transition = { transitionStatus?: 'starting' | 'ending' | 'idle' | undefined };

/** True while a popup is animating in or out. */
export const isTransitioning = (s: Transition): boolean =>
  s.transitionStatus !== undefined && s.transitionStatus !== 'idle';
