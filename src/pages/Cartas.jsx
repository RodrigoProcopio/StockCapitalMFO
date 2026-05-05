import { useSEO } from "../lib/useSEO.js";

const cartasModules = import.meta.glob("../content/cartas/*.json", { eager: true });

const cartas = Object.values(cartasModules)
  .map((m) => m.default || m)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Cartas() {
  useSEO({
  title: "Cartas de Gestão",
  description: "Leia as cartas periódicas da Stock Capital MFO com análises de mercado e posicionamento estratégico.",
  canonical: "/publicacoes/cartas",
});

  return (
    <PageLayout
      title="Cartas de Gestão"
      subtitle="Análises periódicas com visão de mercado e posicionamento estratégico."
    >
      {cartas.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cartas.map((d, i) => (
            <DocCard key={i} title={d.title} date={formatDate(d.date)} summary={d.summary} href={d.pdf} />
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
          <path d="M9 12h6m-6 4h6M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 4a2 2 0 002 2h2a2 2 0 002-2M9 4a2 2 0 012-2h2a2 2 0 012 2" stroke="#0f2a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-base font-semibold text-brand-navy">Nenhuma carta publicada ainda</p>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        As cartas de gestão serão publicadas periodicamente com análises e posicionamento estratégico.
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

function DocCard({ title, date, summary, href }) {
  return (
    <article className="rounded-xl border border-brand-navy/15 bg-white p-5 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-brand-navy">{title}</h3>
      {date && <p className="mt-1 text-xs text-slate-500">{date}</p>}
      {summary && <p className="mt-3 text-sm text-slate-700">{summary}</p>}
      {href && (
        <a
          href={href}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-navy/20 px-3 py-2 text-sm font-medium hover:bg-brand-100"
          download
        >
          Baixar PDF
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )}
    </article>
  );
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(iso));
  } catch { return ""; }
}
