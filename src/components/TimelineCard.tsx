export function TimelineCard({ label, title, items }: { label: string; title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">{label}</p>
      <h3 className="mt-3 text-xl font-semibold text-[#172326]">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#123638]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
