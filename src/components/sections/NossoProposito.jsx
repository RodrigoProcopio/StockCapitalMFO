import { useState, useEffect, useRef } from "react";

function useStagger({ threshold = 0.2, delay = 130, duration = 650 } = {}) {
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
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: visible ? `${i * delay}ms` : "0ms",
  });

  return { ref, style };
}

export default function NossoProposito() {
  const [hovered, setHovered] = useState(false);
  const { ref, style } = useStagger();
  const titleRef = useRef(null);
  const [titleWidth, setTitleWidth] = useState(0);

  useEffect(() => {
    if (!titleRef.current) return;
    const measure = () => setTitleWidth(titleRef.current.offsetWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      id="nosso-proposito"
      className="scroll-mt-24 py-24 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-6">

        {/* Título — stagger 0 */}
        <div className="mb-10" style={style(0)}>
          <h2 ref={titleRef} className="text-3xl font-semibold text-[#1c2846] md:text-4xl inline-block">
            Nosso Propósito
          </h2>
          <div style={{ overflow: "hidden", marginTop: "0.75rem" }}>
            <div
              style={{
                height: "2px",
                width: hovered ? `${titleWidth}px` : "0px",
                borderRadius: "9999px",
                backgroundColor: "rgba(28,40,70,0.25)",
                transition: "width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            />
          </div>
        </div>

        {/* Parágrafo — stagger 1 */}
        <p
          className="text-sm leading-relaxed text-justify md:text-base"
          style={{ ...style(1), color: "rgba(51,56,70,0.82)" }}
        >
          Na <strong className="text-[#1c2846]">Stock Capital Multi-Family Office</strong>, gerimos patrimônios com
          excelência, conectando crescimento, proteção e propósito. Acreditamos que um patrimônio bem administrado vai
          além dos resultados financeiros: ele constrói legados, fortalece vínculos familiares e transforma o ambiente
          em que vivemos. Com independência, técnica e visão de longo prazo, estruturamos soluções patrimoniais que
          unem rentabilidade, segurança e impacto positivo para as próximas gerações.
        </p>

      </div>
    </section>
  );
}