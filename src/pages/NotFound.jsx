import { useSEO } from "../lib/useSEO.js";

export default function NotFound() {
  useSEO({
  title: "Página não encontrada",
  description: "A página que você está procurando não existe ou foi movida.",
});

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p
        className="label-upper mb-4"
        style={{ color: "var(--brand-navy)", letterSpacing: "0.3em" }}
      >
        Stock Capital MFO
      </p>
      <h1
        className="mb-4 font-semibold"
        style={{
          fontSize: "clamp(3rem, 10vw, 7rem)",
          color: "var(--text-heading)",
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p
        className="mb-2 font-semibold"
        style={{ fontSize: "1.25rem", color: "var(--text-heading)" }}
      >
        Página não encontrada
      </p>
      <p className="mb-8 max-w-sm text-slate-500" style={{ fontSize: "0.95rem" }}>
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="btn-pill"
        style={{
          backgroundColor: "var(--brand-navy)",
          color: "#fff",
          borderColor: "var(--brand-navy)",
        }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}