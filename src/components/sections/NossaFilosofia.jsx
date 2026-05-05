import { useState, useRef, useEffect } from "react";

const items = [
  { title: "Alocação estratégica e tática", desc: "Equilibrando segurança e crescimento ao longo dos ciclos econômicos." },
  { title: "Integração de critérios ESG", desc: "Sustentabilidade como componente estrutural da estratégia de investimento." },
  { title: "Ativos alternativos globais", desc: "Acesso a fundos globais, Private Equity, Real Estate, Venture Capital e Crédito Estruturado." },
  { title: "Monitoramento contínuo", desc: "Acompanhamento constante de riscos e resultados com reportes periódicos." },
];


export default function NossaFilosofia() {
  const [hovered, setHovered] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const titles = list.querySelectorAll(".nf-title");
    const descs  = list.querySelectorAll(".nf-desc");

    const reset = () => {
      titles.forEach(el => { el.style.opacity = "0"; el.style.transform = "translateY(12px)"; });
      descs.forEach(el  => { el.style.opacity = "0"; el.style.transform = "translateY(8px)"; });
    };

    const animate = () => {
      // Títulos entram primeiro, em sequência
      titles.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, i * 180);
      });
      // Descrições entram depois de todos os títulos
      const titlesDone = titles.length * 180 + 200;
      descs.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, titlesDone + i * 150);
      });
    };

    reset();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reset();
            requestAnimationFrame(() => requestAnimationFrame(animate));
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="nossa-filosofia"
      className="scroll-mt-24 py-24 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <style>{`
        .nf-title, .nf-desc {
          transition: opacity 0.6s ease, transform 0.6s ease, color 0.25s ease;
        }
        .nf-item .nf-bar { transform: scaleX(0); transform-origin: left; transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94); }
        .nf-item:hover .nf-bar  { transform: scaleX(1); }
        .nf-item:hover .nf-title { color: rgba(28,40,70,1); }
        .nf-item:hover .nf-desc  { color: rgba(51,56,70,0.90); }
      `}</style>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-[1fr_1.2fr] md:gap-24 items-start">

          {/* Coluna esquerda */}
          <div>
            <h2 className="text-3xl font-semibold text-[#1c2846] md:text-4xl leading-tight mb-3">
              Nossa Filosofia
            </h2>
            <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
              <div style={{
                height: "2px",
                width: hovered ? "100%" : "0%",
                borderRadius: "9999px",
                backgroundColor: "rgba(28,40,70,0.25)",
                transition: "width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                maxWidth: "100%",
              }} />
            </div>
            <p className="text-sm leading-relaxed text-justify md:text-base mb-6" style={{ color: "rgba(51,56,70,0.82)" }}>
              Nossa gestão une resiliência, inovação e responsabilidade, reconhecendo que investir é,
              ao mesmo tempo, proteger o presente e preparar o futuro. Estruturamos portfólios sólidos
              e sustentáveis, capazes de atravessar ciclos econômicos.
            </p>
            <p className="text-sm leading-relaxed text-justify md:text-base" style={{ color: "rgba(51,56,70,0.82)" }}>
              Buscamos garantir solidez patrimonial sem perder de vista a evolução constante.
              Nosso modelo de investimento abrange:
            </p>
          </div>

          {/* Coluna direita — com animação sequencial */}
          <div ref={listRef}>
            {items.map((item, i) => (
              <div key={i} className="nf-item cursor-default">
                <div className={i === 0 ? "pb-7" : "py-7"}>
                  <h3
                    className="nf-title mb-1.5 text-sm font-semibold text-[#1c2846]"
                    style={{ opacity: 0, transform: "translateY(12px)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="nf-desc text-sm leading-relaxed"
                    style={{ color: "rgba(51,56,70,0.68)", opacity: 0, transform: "translateY(8px)" }}
                  >
                    {item.desc}
                  </p>
                </div>
                <div className="relative h-px w-full" style={{ backgroundColor: "rgba(28,40,70,0.08)" }}>
                  <div className="nf-bar absolute inset-0" style={{ backgroundColor: "rgba(74,122,181,0.50)" }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}