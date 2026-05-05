import { useEffect, useRef, useState, useCallback } from "react";

const items = [
  { title: "Consultoria financeira especializada", desc: "Assessoria estratégica e independente para estruturar, proteger e expandir o patrimônio familiar, com soluções personalizadas alinhadas aos objetivos de cada cliente." },
  { title: "Administração de Patrimônio", desc: "Gestão integrada de bens, ativos e investimentos, garantindo eficiência, preservação e crescimento sustentável do patrimônio no longo prazo." },
  { title: "Administração de Portfólio", desc: "Elaboração e acompanhamento de carteiras de investimento diversificadas, com foco em performance, liquidez e alinhamento ao perfil de risco da família." },
  { title: "Mapeamento e consolidação de ativos", desc: "Organização e centralização das informações patrimoniais, permitindo uma visão clara e estratégica do conjunto de ativos." },
  { title: "Planejamento jurídico, fiscal e sucessório", desc: "Estruturação de estratégias legais e tributárias que asseguram eficiência fiscal, proteção patrimonial e continuidade do legado familiar." },
  { title: "Constituição de holdings, trusts e estruturas fiduciárias", desc: "Implementação de veículos societários e fiduciários para organização patrimonial, proteção de ativos e planejamento sucessório internacional." },
  { title: "Governança familiar com foco em continuidade", desc: "Desenvolvimento de práticas e estruturas de governança que fortalecem a união familiar e garantem a perenidade do patrimônio ao longo das gerações." },
  { title: "BPO Financeiro", desc: "Terceirização completa da gestão financeira pessoal e empresarial, com controle, eficiência e confidencialidade em cada processo." },
  { title: "Relatórios periódicos e suporte operacional", desc: "Produção de relatórios claros e objetivos, aliados a suporte contínuo, para tomada de decisão ágil e fundamentada." },
];

/* Modal — título surge, depois descrição surge. Sem typewriter. */
function CardModal({ item, onClose }) {
  const [titleIn, setTitleIn] = useState(false);
  const [descIn, setDescIn] = useState(false);

  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    setTitleIn(false);
    setDescIn(false);
    // Título surge logo após o modal abrir
    const t1 = setTimeout(() => setTitleIn(true), 80);
    // Descrição surge depois do título
    const t2 = setTimeout(() => setDescIn(true), 280);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.93) translateY(14px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes contentRise {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"
        aria-label="Fechar"
      />

      <div
        className="relative z-10 w-full max-w-xl rounded-3xl border border-[#d6d6d6] bg-white p-8 shadow-[0_40px_100px_rgba(0,0,0,0.18)]"
        role="dialog"
        aria-modal="true"
        style={{ animation: "modalIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Título — surge */}
        <h3
          className="text-lg font-semibold text-[#1c2846]"
          style={{
            opacity: titleIn ? 1 : 0,
            transform: titleIn ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}
        >
          {item.title}
        </h3>

        <div
          className="mt-3 h-[2px] w-12 rounded-full bg-[#1c2846]/20"
          style={{
            opacity: titleIn ? 1 : 0,
            transition: "opacity 0.4s ease 0.1s",
          }}
        />

        {/* Descrição — surge depois */}
        <p
          className="mt-5 text-sm leading-relaxed"
          style={{
            color: "rgba(51,56,70,0.75)",
            opacity: descIn ? 1 : 0,
            transform: descIn ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {item.desc}
        </p>

        <button
          onClick={onClose}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-[#1c2846]/20 px-6 py-2 text-sm text-[#1c2846] transition-all hover:bg-[#1c2846] hover:text-white"
          style={{
            opacity: descIn ? 1 : 0,
            transition: "opacity 0.4s ease 0.15s",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function NossosServicos() {
  const [openIdx, setOpenIdx] = useState(null);
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const [titleWidth, setTitleWidth] = useState(0);

  // Linha: controlada pelo mouse na seção
  const [hovered, setHovered] = useState(false);

  // Entrada da seção ao scroll
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

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
          setTimeout(() => setCardsVisible(true), 380);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClose = useCallback(() => setOpenIdx(null), []);

  return (
    <section
      id="nossos-servicos"
      ref={sectionRef}
      className="scroll-mt-24 relative py-28 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        /* Underline nos cards: cresce ao hover */
        .svc-card-underline {
          height: 1.5px;
          background: rgba(28,40,70,0.55);
          border-radius: 9999px;
          width: 0;
          transition: width 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .svc-card:hover .svc-card-underline {
          width: 100%;
        }
      `}</style>


      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2">
            {/* Título */}
            <h2
              ref={titleRef}
              className="text-3xl font-semibold text-[#1c2846] md:text-4xl leading-tight inline-block"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              Nossos Serviços
            </h2>

            {/* Linha — anima ao passar o mouse NA SEÇÃO, vai até o fim do título */}
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

            {/* Subtítulo */}
            <p
              className="mt-6 text-sm md:text-base leading-relaxed"
              style={{
                color: "rgba(51,56,70,0.75)",
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
              }}
            >
              Soluções estruturadas para gestão, proteção e crescimento patrimonial,
              com abordagem estratégica e visão de longo prazo.
            </p>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setOpenIdx(i)}
              aria-haspopup="dialog"
              className="svc-card group relative overflow-hidden rounded-2xl border border-[#1c2846]/10 bg-white/60 backdrop-blur-md p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              style={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0)" : "translateY(28px)",
                transition: "opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease",
                transitionDelay: cardsVisible ? `${i * 70}ms` : "0ms",
              }}
            >
              <div className="absolute left-0 top-0 h-full w-[3px] bg-[#1c2846]/10 transition-all duration-300 group-hover:bg-[#1c2846]/40" />
              <div className="flex h-full flex-col">
                <h3 className="text-sm font-semibold text-[#1c2846] leading-snug">
                  {item.title}
                </h3>
                <div className="mt-3 svc-card-underline" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <CardModal item={items[openIdx]} onClose={handleClose} />
      )}
    </section>
  );
}