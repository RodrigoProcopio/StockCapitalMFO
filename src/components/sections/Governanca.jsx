import { useEffect, useRef, useState } from "react";

const items = [
  "Estrutura fiduciária sólida, com comitês internos e processos auditáveis;",
  "Política de prevenção a conflitos de interesse;",
  "Compliance constante, com acompanhamento regulatório contínuo;",
  "Relatórios gerenciais e reuniões periódicas para alinhamento e tomada de decisão.",
];

export default function Governanca() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [titleWidth, setTitleWidth] = useState(0);

  // Linha: controlada pelo mouse na seção
  const [hovered, setHovered] = useState(false);

  // Entrada ao scroll
  const [leftVisible, setLeftVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState([false, false, false, false]);

  // Mede largura do título para a linha
  useEffect(() => {
    if (!titleRef.current) return;
    const measure = () => setTitleWidth(titleRef.current.offsetWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // IntersectionObserver — dispara entrada dos textos/itens
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // coluna esquerda: título + parágrafo surgem
          setTimeout(() => setLeftVisible(true), 100);
          // itens da direita entram um a um
          items.forEach((_, i) => {
            setTimeout(() => {
              setItemsVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, 350 + i * 130);
          });
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
      id="governanca"
      ref={sectionRef}
      className="scroll-mt-24 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <div className="pointer-events-none absolute z-0 -top-40 -right-40 h-[480px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(74,122,181,0.10) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute z-0 -bottom-32 -left-32 h-[320px] w-[320px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(74,122,181,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-[1fr_1.2fr] md:gap-24 items-start">

          {/* Coluna esquerda */}
          <div className="md:sticky md:top-32">

            {/* Título — surge ao rolar */}
            <h2
              ref={titleRef}
              className="text-3xl font-semibold text-[#1c2846] md:text-4xl leading-tight inline-block"
              style={{
                opacity: leftVisible ? 1 : 0,
                transform: leftVisible ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              Governança<br />e Confiança
            </h2>

            {/* Linha — anima ao passar o mouse na seção */}
            <div style={{ overflow: "hidden", marginTop: "0.75rem" }}>
              <div
                style={{
                  height: "2px",
                  width: hovered ? `${titleWidth}px` : "0px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(28,40,70,0.25)",
                  transition: "width 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}
              />
            </div>

            {/* Divisor */}
            <div
              className="my-8 h-px w-full"
              style={{
                backgroundColor: "rgba(28,40,70,0.10)",
                opacity: leftVisible ? 1 : 0,
                transition: "opacity 0.6s ease 0.2s",
              }}
            />

            {/* Parágrafo — surge depois do título */}
            <p
              className="text-sm leading-relaxed text-justify md:text-base"
              style={{
                color: "rgba(51,56,70,0.82)",
                opacity: leftVisible ? 1 : 0,
                transform: leftVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s ease 0.28s, transform 0.6s ease 0.28s",
              }}
            >
              A governança é o pilar da nossa atuação. Gerimos patrimônio com rigor, sigilo e processos
              estruturados, garantindo que cada decisão seja fundamentada, ética e auditável. Nossa atuação
              combina disciplina técnica e transparência, reforçando o compromisso com a confiança que
              nossos clientes depositam em nós.
            </p>
          </div>

          {/* Coluna direita — itens entram um a um */}
          <div>
            <style>{`
              .gov-item .gov-bar {
                transform: scaleX(0);
                transform-origin: left;
                transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
              }
              .gov-item:hover .gov-bar  { transform: scaleX(1); }
              .gov-item:hover .gov-num  { color: rgba(28,40,70,0.70); }
              .gov-item:hover .gov-text { color: rgba(28,40,70,0.95); }
              .gov-num  { transition: color 0.25s ease; }
              .gov-text { transition: color 0.25s ease; }
            `}</style>

            {items.map((item, i) => (
              <div
                key={i}
                className="gov-item group cursor-default"
                style={{
                  opacity: itemsVisible[i] ? 1 : 0,
                  transform: itemsVisible[i] ? "translateX(0)" : "translateX(24px)",
                  transition: "opacity 0.55s ease, transform 0.55s ease",
                }}
              >
                <div className="relative h-px w-full" style={{ backgroundColor: "rgba(28,40,70,0.10)" }}>
                  <div className="gov-bar absolute inset-0" style={{ backgroundColor: "rgba(74,122,181,0.60)" }} />
                </div>
                <div className="flex items-start gap-5 py-6">
                  <span className="gov-num mt-0.5 flex-none text-[0.62rem] font-semibold tracking-widest"
                    style={{ color: "rgba(28,40,70,0.28)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="gov-text text-sm leading-relaxed md:text-base"
                    style={{ color: "rgba(51,56,70,0.82)" }}>
                    {item}
                  </p>
                </div>
              </div>
            ))}

            <div
              className="h-px w-full"
              style={{
                backgroundColor: "rgba(28,40,70,0.10)",
                opacity: itemsVisible[3] ? 1 : 0,
                transition: "opacity 0.5s ease 0.1s",
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}