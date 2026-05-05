import { Link } from "react-router-dom";
import logoSmall from "../assets/logo-small.png";

export default function PageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white" style={{ color: "var(--text-main)" }}>
      {/* Header — pill-style igual à navbar principal */}
      <header className="sticky top-0 z-40 border-b border-[#d6d6d6] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center" aria-label="Voltar para Home">
            <img
              src={logoSmall}
              alt="Logo Stock Capital"
              className="h-16 w-auto"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </Link>

          <Link
            to="/"
            className="btn-pill border-[#d6d6d6] text-[#1c2846] hover:bg-[#1c2846] hover:text-white hover:border-[#1c2846] shadow-pill"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      {/* Faixa de título */}
      <div className="border-b border-[#d6d6d6] bg-[#f5f5f7] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-upper" style={{ color: "rgba(28,40,70,0.5)" }}>Stock Capital MFO</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1c2846] md:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm" style={{ color: "rgba(51,56,70,0.6)" }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
    </div>
  );
}
