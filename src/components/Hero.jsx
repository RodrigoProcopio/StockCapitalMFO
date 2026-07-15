import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import hero480 from "../assets/hero-480.webp";
import hero768 from "../assets/hero-768.webp";
import hero1280 from "../assets/hero-1280.webp";
import hero1920 from "../assets/hero-1920.webp";

const HERO_BTNS = [
  { label: "Nossos Serviços",       type: "scroll", target: "nossos-servicos" },
  { label: "Fundo de Investimento", type: "link",   target: "/fundo-de-investimento" },
  { label: "Fale Conosco",          type: "href",   target: "https://calendar.app.google/MvXcvYdRbtoENSU16" },
];

function HeroButtons({ goTo }) {
  const [activeShimmer, setActiveShimmer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShimmer(prev => (prev + 1) % HERO_BTNS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const baseStyle = { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" };
  const btnClass = "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 transition-all duration-300 border border-white/30 backdrop-blur-sm text-white hover:border-white/60";

  const renderShimmer = (idx) => (
    <motion.span
      key={activeShimmer}
      className="pointer-events-none absolute inset-0 rounded-full"
      initial={{ x: "-100%", opacity: 0 }}
      animate={activeShimmer === idx ? { x: "100%", opacity: [0, 0.55, 0] } : { x: "-100%", opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)" }}
    />
  );

  return (
    <motion.div
      className="mt-10 flex flex-wrap items-center gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      {HERO_BTNS.map((btn, idx) => {
        const isActive = activeShimmer === idx;
        const sharedStyle = {
          ...baseStyle,
          backgroundColor: isActive ? "rgba(28,40,70,0.55)" : "rgba(28,40,70,0.30)",
          boxShadow: isActive ? "0 0 0 1px rgba(255,255,255,0.5)" : "none",
          transition: "background-color 0.4s ease, box-shadow 0.4s ease",
        };
        const inner = <>{renderShimmer(idx)}<span className="relative z-10">{btn.label}</span></>;

        if (btn.type === "scroll") return <button key={idx} onClick={() => goTo(btn.target)} className={btnClass} style={sharedStyle}>{inner}</button>;
        if (btn.type === "link")   return <Link   key={idx} to={btn.target}                  className={btnClass} style={sharedStyle}>{inner}</Link>;
        return <a key={idx} href={btn.target} target="_blank" rel="noopener noreferrer" className={btnClass} style={sharedStyle}>{inner}</a>;
      })}
    </motion.div>
  );
}

function GlowHeadline() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCycle(c => c + 1), 10000);
    return () => clearInterval(t);
  }, []);

  const lines = [
    { text: "Gerenciamos patrimônios",           delay: 0.15 },
    { text: "com excelência para",               delay: 0.35, muted: true },
    { text: "construir o mundo ao nosso redor.", delay: 0.55 },
  ];

  return (
    <h1 key={cycle} className="select-none font-semibold" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", lineHeight: 1.12 }}>
      {lines.map((line, li) => (
        <motion.span
          key={li} className="block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: line.delay, ease: "easeOut" }}
          style={{
            color: line.muted ? "rgba(200,205,220,0.70)" : "#e8e8e8",
            fontWeight: line.muted ? 300 : 600,
            textShadow: line.muted ? "none" : "0 0 48px rgba(255,255,255,0.18), 0 4px 16px rgba(255,255,255,0.12)",
          }}
        >
          {line.text}
        </motion.span>
      ))}
    </h1>
  );
}

export default function Hero({ goTo }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
  src={hero1280}
  srcSet={`${hero480} 480w, ${hero768} 768w, ${hero1280} 1280w, ${hero1920} 1920w`}
  sizes="100vw"
  alt=""
  width={1280}
  height={720}
  className="h-full w-full object-cover object-bottom"
  loading="eager"
  decoding="async"
  fetchpriority="high"
/>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(28,40,70,0.78)" }} />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute -bottom-8 right-0 h-48 w-48 rounded-full bg-white/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 pb-20 pt-36">
        <div className="max-w-4xl">
          <motion.div className="mb-6" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
            <p className="text-white/70 font-semibold" style={{ fontSize: "0.82rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Stock Capital MFO
            </p>
          </motion.div>
          <GlowHeadline />
          <HeroButtons goTo={goTo} />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="label-upper text-white/60" style={{ fontSize: "0.58rem" }}>Scroll</span>
        <div className="h-7 w-px bg-white/50" />
      </div>
    </section>
  );
}