import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const STATS = [
  { label: "Benchmark", value: "CDI" },
  { label: "Símbolo", value: "STOCK" },
  { label: "Classe", value: "Multimercado" },
  { label: "Desde", value: "2021" },
];

// Helper: retorna estilo de fade+slide com delay
function fadeUp(visible, delay = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  };
}

export default function NossoFundo() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const [titleWidth, setTitleWidth] = useState(0);
  const [hovered,  setHovered]  = useState(false);

  // Estados de visibilidade sequenciados
  const [s0,  setS0]  = useState(false); // título seção + subtítulo
  const [s1,  setS1]  = useState(false); // eyebrow do card
  const [s2,  setS2]  = useState(false); // "Sobre o Fundo" + linha
  const [s3,  setS3]  = useState(false); // parágrafo 1
  const [s4,  setS4]  = useState(false); // parágrafo 2
  const [s5,  setS5]  = useState(false); // CTA
  const [s6,  setS6]  = useState(false); // stats coluna direita

  useEffect(() => {
    if (!titleRef.current) return;
    const measure = () => setTitleWidth(titleRef.current.offsetWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setS0(true),  80);   // título seção
          setTimeout(() => setS1(true),  300);  // eyebrow card
          setTimeout(() => setS2(true),  440);  // subtítulo card
          setTimeout(() => setS3(true),  580);  // parágrafo 1
          setTimeout(() => setS4(true),  700);  // parágrafo 2
          setTimeout(() => setS5(true),  820);  // CTA
          setTimeout(() => setS6(true),  500);  // stats (entra junto com conteúdo)
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="nosso-fundo"
      ref={sectionRef}
      className="scroll-mt-24 relative py-28 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <div className="pointer-events-none absolute z-0 -top-40 -right-40 h-[520px] w-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(74,122,181,0.09) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute z-0 -bottom-32 -left-32 h-[340px] w-[340px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(28,40,70,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        {/* ── Header da seção ── */}
        <div className="mb-16 md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2">

            <h2
              ref={titleRef}
              className="text-3xl font-semibold text-[#1c2846] md:text-4xl leading-tight inline-block"
              style={fadeUp(s0, 0)}
            >
              Nosso Fundo
            </h2>

            {/* Linha — anima ao hover na seção */}
            <div style={{ overflow: "hidden", marginTop: "0.75rem" }}>
              <div style={{
                height: "2px",
                width: hovered ? `${titleWidth}px` : "0px",
                borderRadius: "9999px",
                backgroundColor: "rgba(28,40,70,0.25)",
                transition: "width 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
              }} />
            </div>

            <p
              className="mt-6 text-sm md:text-base leading-relaxed"
              style={{ color: "rgba(51,56,70,0.75)", ...fadeUp(s0, 120) }}
            >
              Estratégia multimercado dinâmica e diversificada, com foco em retornos
              consistentes ajustados ao risco no médio e longo prazo.
            </p>
          </div>
        </div>

        {/* ── Card principal ── */}
        <div
          className="rounded-2xl border border-[#1c2846]/10 bg-white/70 backdrop-blur-md overflow-hidden"
          style={{
            boxShadow: "0 8px 48px rgba(28,40,70,0.08)",
            opacity: s1 ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Eyebrow */}
          <div
            className="border-b border-[#1c2846]/08 px-8 py-4 flex items-center gap-3"
            style={fadeUp(s1, 0)}
          >
            <span
              className="inline-flex items-center rounded-full px-3 py-0.5 text-[0.65rem] font-semibold tracking-widest uppercase"
              style={{ background: "rgba(28,40,70,0.07)", color: "rgba(28,40,70,0.55)" }}
            >
              RENDA VARIÁVEL
            </span>
            <span className="text-[0.72rem] tracking-widest uppercase" style={{ color: "rgba(28,40,70,0.30)" }}>
              STOCK Capital FIF Multimercado CP RL
            </span>
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-0">
            {/* ── Conteúdo esquerdo ── */}
            <div className="px-8 py-8">

              {/* Título interno */}
              <div style={fadeUp(s2, 0)}>
                <h3 className="text-xl font-semibold text-[#1c2846] md:text-2xl leading-snug">
                  Sobre o Fundo
                </h3>
                <div className="mt-3 h-[1.5px] w-10 rounded-full" style={{ backgroundColor: "rgba(28,40,70,0.18)" }} />
              </div>

              {/* Parágrafo 1 */}
              <p
                className="mt-5 text-sm leading-relaxed md:text-base"
                style={{ color: "rgba(51,56,70,0.80)", ...fadeUp(s3, 0) }}
              >
                O STOCK Capital FIF Multimercado CP RL busca proporcionar retornos consistentes
                ajustados ao risco no médio e longo prazo, por meio de uma estratégia multimercado
                dinâmica e altamente diversificada, com baixa correlação estrutural em relação às
                estratégias tradicionais.
              </p>

              {/* Parágrafo 2 */}
              <p
                className="mt-4 text-sm leading-relaxed md:text-base"
                style={{ color: "rgba(51,56,70,0.68)", ...fadeUp(s4, 0) }}
              >
                Voltado a investidores que buscam rentabilidade superior ao CDI, com tolerância a
                volatilidade moderada e interesse em exposição diversificada a setores disruptivos
                e tradicionais.
              </p>

              {/* CTA */}
              <div className="group mt-8 flex flex-col items-start gap-3 w-fit" style={fadeUp(s5, 0)}>
                <p
                  className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase"
                  style={{ color: "rgba(28,40,70,0.35)" }}
                >
                  Saiba Mais
                </p>

                <Link
                  to="/fundo-de-investimento"
                  className="inline-flex items-center gap-3 text-base font-semibold text-[#1c2846] transition-all duration-200 group-hover:gap-4"
                >
                  <span>Conheça o Fundo</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                {/* Linha animada — reage ao hover do wrapper group */}
                <div className="w-48 h-[1.5px] overflow-hidden rounded-full" style={{ backgroundColor: "rgba(28,40,70,0.10)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500 w-[30%] group-hover:w-full"
                    style={{ backgroundColor: "#1c2846" }}
                  />
                </div>
              </div>
            </div>

            {/* ── Stats coluna direita ── */}
            <div className="border-t md:border-t-0 md:border-l border-[#1c2846]/08 px-8 py-8 flex flex-col justify-center gap-6 min-w-[200px]">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    opacity: s6 ? 1 : 0,
                    transform: s6 ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease ${i * 90}ms, transform 0.5s ease ${i * 90}ms`,
                  }}
                >
                  <p className="text-[0.65rem] font-semibold tracking-widest uppercase"
                    style={{ color: "rgba(28,40,70,0.38)" }}>
                    {s.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#1c2846]">{s.value}</p>
                  {i < STATS.length - 1 && (
                    <div className="mt-4 h-px w-full" style={{ backgroundColor: "rgba(28,40,70,0.08)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}