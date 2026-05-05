import { useState, useEffect, useRef } from "react";

const cols = [
  { label: "Independência total",         text: "Sem vínculo com bancos ou produtos." },
  { label: "Transparência e alinhamento", text: "Modelo de remuneração claro." },
  { label: "Atuação multidisciplinar",    text: "Profissionais experientes em finanças, direito, sucessão e investimentos de impacto." },
];

function useStagger(count, { threshold = 0.2, delay = 120, duration = 600 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = (i) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: visible ? `${i * delay}ms` : "0ms",
  });

  return { ref, style };
}

export default function QuemSomos() {
  const [hovered, setHovered] = useState(false);
  const { ref, style } = useStagger(cols.length + 1, { delay: 130, duration: 650 });

  return (
    <section
      id="quem-somos"
      className="qs-section scroll-mt-24 py-24 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <style>{`
        .qs-section:hover .qs-line { width: 3rem; }
        .qs-line { transition: width 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
        .qs-label { transition: color 0.25s ease; }
        .qs-text  { transition: color 0.25s ease; }
      `}</style>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div ref={ref} className="grid gap-16 md:grid-cols-[1fr_1fr] md:gap-20 items-start">

          {/* Coluna esquerda — stagger item 0 */}
          <div style={style(0)}>
            <h2 className="text-3xl font-semibold text-[#1c2846] md:text-4xl leading-tight mb-3">
              Quem Somos
            </h2>
            <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
              <div
                style={{
                  height: "2px",
                  width: hovered ? "100%" : "0%",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(28,40,70,0.25)",
                  transition: "width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                  maxWidth: "100%",
                }}
              />
            </div>
            <p className="text-sm leading-relaxed text-justify md:text-base"
              style={{ color: "rgba(51,56,70,0.82)" }}>
              A <strong className="text-[#1c2846]">Stock Capital Multi-Family Office</strong> apoia famílias
              e investidores na proteção e crescimento de seu patrimônio. Com uma equipe multidisciplinar,
              unimos rigor técnico e visão estratégica para oferecer soluções alinhadas aos objetivos de
              cada cliente, gerando segurança e confiança. Nossa abordagem inclui:
            </p>
          </div>

          {/* Coluna direita — cada item com stagger 1, 2, 3 */}
          <div>
            {cols.map((col, i) => (
              <div key={i} style={style(i + 1)}>
                <div className={i === 0 ? "pb-6" : "py-6"}>
                  <p className="mb-1 text-sm font-semibold text-[#1c2846]">{col.label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(51,56,70,0.72)" }}>
                    {col.text}
                  </p>
                </div>
                <div className="h-px w-full" style={{ backgroundColor: "rgba(28,40,70,0.08)" }} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}