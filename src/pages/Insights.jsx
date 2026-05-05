import { useSEO } from "../lib/useSEO.js";

function loadDocs() {
  const files = import.meta.glob("/src/content/insights/*.json", { eager: true });
  return Object.values(files)
    .map((m) => m.default || m)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function Insights() {
  useSEO({
  title: "Insights",
  description: "Notas rápidas e estudos sobre temas relevantes do mercado financeiro pela Stock Capital MFO.",
  canonical: "/publicacoes/insights",
});

  const docs = loadDocs();
  return (
    <PageLayout
      title="Insights"
      subtitle="Notas rápidas e estudos sobre temas relevantes."
    >
      {docs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((d, i) => (
            <DocCard key={i} {...d} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-navy/10 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brand-navy/10 bg-brand-100/40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#0f2a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-base font-semibold text-brand-navy">Nenhum insight publicado ainda</p>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        Em breve publicaremos notas e estudos sobre temas relevantes do mercado financeiro.
      </p>
      <a
        href="/#contato"
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-brand-navy/20 px-4 py-2 text-sm font-medium text-brand-navy hover:bg-brand-100/40 transition"
      >
        Fale com a equipe
      </a>
    </div>
  );
}

function DocCard({ title, date, summary, pdf }) {
  return (
    <article className="rounded-xl border border-brand-navy/15 bg-white p-5 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-brand-navy">{title}</h3>
      {date && <p className="mt-1 text-xs text-slate-500">{date}</p>}
      {summary && <p className="mt-3 text-sm text-slate-700">{summary}</p>}
      {pdf && (
        <a
          href={pdf}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-navy/20 px-3 py-2 text-sm font-medium hover:bg-brand-100"
          download
        >
          Baixar PDF
        </a>
      )}
    </article>
  );
}
