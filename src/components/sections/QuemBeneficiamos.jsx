import { useState, useEffect, useRef } from "react";

const items = [
  {
    num: "01",
    label: "Trajetória inicial",
    text: "Pessoas iniciando sua trajetória financeira e que buscam orientação especializada",
  },
  {
    num: "02",
    label: "Estruturas familiares",
    text: "Famílias que necessitam de planejamento jurídico, fiscal e sucessório sólido",
  },
  {
    num: "03",
    label: "Patrimônio consolidado",
    text: "Famílias com patrimônio consolidado em busca de gestão integrada e eficiente",
  },
  {
    num: "04",
    label: "Diversificação global",
    text: "Investidores que desejam diversificação internacional e acesso a ativos sofisticados",
  },
  {
    num: "05",
    label: "Estruturas complexas",
    text: "Estruturas societárias complexas que demandam gestão estratégica especializada",
  },
];

export default function QuemBeneficiamos() {
  const [hovered, setHovered] = useState(false);
  const titleRef = useRef(null);
  const listRef = useRef(null);
  const [titleWidth, setTitleWidth] = useState(0);

  useEffect(() => {
    if (!titleRef.current) return;
    const measure = () => setTitleWidth(titleRef.current.offsetWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const els = list.querySelectorAll(".qb-item");

    const reset = () => {
      els.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(16px)";
      });
    };

    const animate = () => {
      els.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, i * 280);
      });
    };

    reset();

    const observer = new IntersectionObserver(
      (entries) => {
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
      id="para-quem-atuamos"
      className="scroll-mt-24 relative py-24 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        <div className="mb-16">
          <h2 ref={titleRef} className="text-3xl font-semibold text-[#1c2846] md:text-4xl leading-tight mb-3 inline-block">
            Quem Beneficiamos
          </h2>
          <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
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
          <p className="text-sm leading-relaxed md:text-base" style={{ color: "rgba(51,56,70,0.82)" }}>
            Nossas soluções atendem famílias e indivíduos que compartilham a visão de construir e preservar legados duradouros.
          </p>
        </div>

        <style>{`
          .qb-item { position: relative; overflow: hidden; }
          .qb-item .qb-bg {
            position: absolute; inset: 0;
            background: linear-gradient(90deg, rgba(28,40,70,0.06) 0%, rgba(28,40,70,0.02) 100%);
            transform: translateX(-101%);
            transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
          }
          .qb-item:hover .qb-bg { transform: translateX(0); }
        `}</style>

        <div ref={listRef}>
          {items.map((item, i) => (
            <div
              key={i}
              className="qb-item cursor-default"
              style={{
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <div className="qb-bg" />
              <div className="h-px w-full" style={{ backgroundColor: "rgba(28,40,70,0.10)" }} />
              <div className="relative flex items-center gap-8 py-6 md:gap-16">
                <span
                  className="flex-none font-bold select-none"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    lineHeight: 1,
                    color: "rgba(28,40,70,0.12)",
                    letterSpacing: "-0.02em",
                    minWidth: "4rem",
                  }}
                >
                  {item.num}
                </span>

                <div className="flex-1 grid md:grid-cols-[200px_1fr] md:gap-10 items-center">
                  <p className="text-sm font-semibold mb-1 md:mb-0 text-[#1c2846]">
                    {item.label}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(51,56,70,0.82)" }}>
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="h-px w-full" style={{ backgroundColor: "rgba(28,40,70,0.10)" }} />
        </div>

      </div>
    </section>
  );
}