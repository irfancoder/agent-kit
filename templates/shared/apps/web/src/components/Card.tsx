import type { ReactNode } from 'react';

/** A titled panel. The one place its look is set, so pages don't repeat the classes. */
export function Card({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-card border border-rule bg-paper-2 shadow-card">
      <h2 className="border-b border-rule px-6 py-4 text-lg font-semibold">{title}</h2>
      <div className="px-6">{children}</div>
    </section>
  );
}
