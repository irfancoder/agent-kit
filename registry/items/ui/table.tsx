import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { sx, type Style } from '@/lib/cx';
import { colors, fonts, space, text } from '@/styles/tokens.stylex';

type P<T extends keyof React.JSX.IntrinsicElements> = Omit<
  ComponentProps<T>,
  'className' | 'style'
> & {
  xstyle?: Style;
};

export function Table({ xstyle, ...props }: P<'table'>) {
  return (
    <div data-slot="table-container" {...sx(styles.container)}>
      <table data-slot="table" {...sx(styles.table, xstyle)} {...props} />
    </div>
  );
}
export function TableHeader({ xstyle, ...props }: P<'thead'>) {
  return <thead data-slot="table-header" {...sx(xstyle)} {...props} />;
}
export function TableBody({ xstyle, ...props }: P<'tbody'>) {
  return <tbody data-slot="table-body" {...sx(xstyle)} {...props} />;
}
export function TableFooter({ xstyle, ...props }: P<'tfoot'>) {
  return <tfoot data-slot="table-footer" {...sx(styles.footer, xstyle)} {...props} />;
}
export function TableRow({ xstyle, ...props }: P<'tr'>) {
  return <tr data-slot="table-row" {...sx(styles.row, xstyle)} {...props} />;
}
export function TableHead({ xstyle, ...props }: P<'th'>) {
  return <th data-slot="table-head" {...sx(styles.cell, styles.head, xstyle)} {...props} />;
}
export function TableCell({ xstyle, ...props }: P<'td'>) {
  return <td data-slot="table-cell" {...sx(styles.cell, xstyle)} {...props} />;
}
export function TableCaption({ xstyle, ...props }: P<'caption'>) {
  return <caption data-slot="table-caption" {...sx(styles.caption, xstyle)} {...props} />;
}

const styles = stylex.create({
  container: { position: 'relative', width: '100%', overflowX: 'auto' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: fonts.sans,
    fontSize: text.sm,
    color: colors.foreground,
    captionSide: 'bottom',
  },
  row: {
    borderBottomWidth: space.px,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
  },
  cell: {
    paddingBlock: space.sm,
    paddingInline: space.sm,
    textAlign: 'start',
    verticalAlign: 'middle',
  },
  head: {
    height: space.controlLg,
    fontWeight: text.weightMedium,
    color: colors.mutedForeground,
    whiteSpace: 'nowrap',
  },
  footer: { fontWeight: text.weightMedium, backgroundColor: colors.muted },
  caption: { marginTop: space.lg, fontSize: text.sm, color: colors.mutedForeground },
});
