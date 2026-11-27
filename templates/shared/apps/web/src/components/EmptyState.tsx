/** What a list shows before it has anything in it. */
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="flex flex-col items-center gap-2 rounded-card border border-dashed border-rule-2 px-6 py-10 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted">{description}</p>
    </section>
  );
}
