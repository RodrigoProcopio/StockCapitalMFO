import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const pubs = [
  {
    to: "/publicacoes/cartas",
    title: "Cartas",
    desc: "Cartas periódicas com visão de mercado e posicionamento.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="#1c2846" strokeWidth="2"/>
        <path d="M6 16l18 12 18-12" stroke="#1c2846" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/publicacoes/relatorios",
    title: "Relatórios",
    desc: "Materiais aprofundados sobre macro, setores e classes de ativos.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="10" y="4" width="28" height="40" rx="3" stroke="#1c2846" strokeWidth="2"/>
        <path d="M16 14h16M16 20h16M16 26h10" stroke="#1c2846" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 34l4 6 4-10" stroke="#4a7ab5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: "/publicacoes/insights",
    title: "Insights",
    desc: "Notas rápidas e estudos sobre temas relevantes do mercado.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="24" cy="20" r="10" stroke="#1c2846" strokeWidth="2"/>
        <path d="M20 20a4 4 0 018 0c0 2.5-2 4-2 6h-4c0-2-2-3.5-2-6z" stroke="#1c2846" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 30h8M21 33h6" stroke="#4a7ab5" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/publicacoes/compliance",
    title: "Compliance",
    desc: "Documentos e políticas de conformidade e ética.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M24 4l14 5v10c0 10-6 18-14 21C16 37 10 29 10 19V9l14-5z" stroke="#1c2846" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M17 24l5 5 9-10" stroke="#4a7ab5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Publicacoes() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [titleWidth, setTitleWidth] = useState(0);

  // Linha: controlada pelo mouse na seção
  const [hovered, setHovered] = useState(false);

  // Entrada ao scroll
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState([false, false, false, false]);

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
          setTimeout(() => setHeaderVisible(true), 100);
          pubs.forEach((_, i) => {
            setTimeout(() => {
              setCardsVisible(prev => {
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
      id="publicacoes"
      ref={sectionRef}
      className="scroll-mt-24 py-24 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-14">

          {/* Título — surge ao rolar */}
          <h2
            ref={titleRef}
            className="text-3xl font-semibold text-[#1c2846] md:text-4xl inline-block"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            Publicações
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

          {/* Subtítulo — surge depois do título */}
          <p
            className="mt-3 text-sm md:text-base"
            style={{
              color: "rgba(51,56,70,0.60)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s",
            }}
          >
            Análises e materiais proprietários da Stock Capital MFO.
          </p>
        </div>

        {/* Cards — entram um a um */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pubs.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative flex flex-col rounded-2xl bg-white/80 backdrop-blur-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(28,40,70,0.14)]"
              style={{
                border: "1.5px solid rgba(28,40,70,0.10)",
                opacity: cardsVisible[i] ? 1 : 0,
                transform: cardsVisible[i] ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.border = "1.5px solid rgba(28,40,70,0.30)"}
              onMouseLeave={e => e.currentTarget.style.border = "1.5px solid rgba(28,40,70,0.10)"}
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f0f4fb] transition-colors duration-300 group-hover:bg-[#e4ecf7]">
                {item.icon}
              </div>

              <h3 className="mb-2 text-base font-semibold text-[#1c2846]">{item.title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(51,56,70,0.65)" }}>
                {item.desc}
              </p>

              <div className="mt-6 text-[0.72rem] font-semibold tracking-wider uppercase"
                style={{ color: "rgba(28,40,70,0.35)" }}>
                <span className="group-hover:text-[#1c2846] transition-colors duration-200">Ver mais</span>
              </div>

              <div className="mt-3 h-[2px] overflow-hidden rounded-full">
                <div
                  className="h-full w-0 transition-all duration-500 group-hover:w-full rounded-full"
                  style={{ backgroundColor: "#1c2846" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}