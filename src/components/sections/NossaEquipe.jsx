import { useState, useEffect, useRef } from "react";
import augustoImg from "../../assets/augusto.webp";
import igorImg from "../../assets/igor.webp";

const team = [
  {
    name: "Augusto Lubian",
    cert: "CDAA, PQO",
    role: "Chief Executive Officer",
    img: augustoImg,
    alt: "Augusto Lubian",
    linkedin: "https://www.linkedin.com/in/augustolubian/",
  },
  {
    name: "Igor Dudeque",
    cert: "CEA®, Behavioural Finance",
    role: "Chief Investment Officer",
    img: igorImg,
    alt: "Igor Dudeque",
    linkedin: "https://www.linkedin.com/in/igor-dudeque-luiz-da-costa/",
  },
];

export default function NossaEquipe() {
  const [hovered, setHovered] = useState(false);
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
      id="nossa-equipe"
      className="scroll-mt-24 relative py-24 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <h2 ref={titleRef} className="text-3xl font-semibold text-[#1c2846] md:text-4xl inline-block">
            Nossa Equipe
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

        <div className="grid gap-8 sm:grid-cols-2">
          {team.map((p) => (
            <a
              key={p.name}
              href={p.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl block"
              title={`Ver perfil de ${p.name} no LinkedIn`}
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={p.img}
                  alt={p.alt}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1829]/90 via-[#0d1829]/20 to-transparent" />

              <div className="absolute inset-0 rounded-2xl border border-transparent transition-all duration-500 group-hover:border-[rgba(28,40,70,0.40)]" />

              <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-white/20">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p
                  className="mb-1 text-[0.62rem] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: "rgba(255,255,255,0.50)" }}
                >
                  {p.cert}
                </p>
                <h3 className="text-lg font-semibold text-white leading-tight">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {p.role}
                </p>
                <div className="mt-4 h-px w-8 rounded-full bg-white/40 transition-all duration-500 group-hover:w-16 group-hover:bg-white/70" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}