import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function GenerativeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    let t = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#1c2846");
      bg.addColorStop(0.5, "#1c2846");
      bg.addColorStop(1, "#1c2846");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const spacing = 36;
      const cols = Math.ceil(W / spacing) + 1;
      const rows = Math.ceil(H / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const dx = x - W / 2;
          const dy = y - H / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const wave = Math.sin(dist * 0.018 - t * 1.8) * 0.5 + 0.5;
          const radius = 1.2 + wave * 1.8;
          const opacity = 0.08 + wave * 0.22;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120,165,230,${opacity})`;
          ctx.fill();
        }
      }

      const grd = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.45);
      grd.addColorStop(0, "rgba(74,122,181,0.20)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      const grd2 = ctx.createRadialGradient(W * 0.88, H * 0.08, 0, W * 0.88, H * 0.08, W * 0.3);
      grd2.addColorStop(0, "rgba(100,150,220,0.15)");
      grd2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, W, H);

      t += 0.012;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ display: "block" }}
    />
  );
}

export default function FormularioApi() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle | reveal | done

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setPhase("reveal"), 200);
          setTimeout(() => setPhase("done"), 1400);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isReveal = phase === "reveal" || phase === "done";

  return (
    <section
      id="formulario-api"
      ref={sectionRef}
      className="scroll-mt-24 border-t border-[#d6d6d6] relative py-28 overflow-hidden"
    >
      <style>{`
        @keyframes fapi-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fapi-rise {
          from { opacity:0; transform: translateY(32px) scale(0.97); filter: blur(6px); }
          to   { opacity:1; transform: translateY(0) scale(1);       filter: blur(0); }
        }
        @keyframes fapi-sub {
          from { opacity:0; transform: translateY(18px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes fapi-btn {
          from { opacity:0; transform: translateY(12px) scale(0.95); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        .fapi-title {
          animation: none;
        }
        .fapi-title.active {
          animation: fapi-rise 0.75s cubic-bezier(0.22,1,0.36,1) both;
        }
        .fapi-sub.active {
          animation: fapi-sub 0.65s cubic-bezier(0.22,1,0.36,1) 0.4s both;
        }
        .fapi-btn.active {
          animation: fapi-btn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.7s both;
        }
        /* Shimmer line */
        .fapi-line {
          height: 1px;
          width: 0;
          margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          background-size: 200% auto;
          transition: width 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s;
        }
        .fapi-line.active {
          width: 120px;
          animation: fapi-shimmer 2s linear 0.9s infinite;
        }
      `}</style>

      <GenerativeBackground />
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(28,40,70,0.20)" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center">

          {/* Eyebrow */}
          <p
            className={`fapi-sub text-[0.68rem] font-semibold tracking-[0.22em] uppercase mb-5${isReveal ? " active" : ""}`}
            style={{
              color: "rgba(255,255,255,0.38)",
              animationDelay: "0.15s",
            }}
          >
            Perfil de Investidor
          </p>

          <h2 className={`fapi-title text-3xl font-semibold text-white md:text-4xl mb-4${isReveal ? " active" : ""}`}>
            Avaliação de Perfil do Investidor
          </h2>

          {/* Shimmer separator */}
          <div className={`fapi-line${isReveal ? " active" : ""}`} />

          <p
            className={`fapi-sub text-sm leading-relaxed md:text-base mt-8 mb-12${isReveal ? " active" : ""}`}
            style={{
              color: "rgba(255,255,255,0.58)",
              animationDelay: "0.45s",
            }}
          >
            Descubra seu perfil de investidor preenchendo nosso questionário de suitability.
          </p>

          <div className={`fapi-btn${isReveal ? " active" : ""}`}>
            <Link
              to="/formulario-api"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[#1c2846] font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                fontSize: "0.82rem",
                letterSpacing: "0.08em",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(255,255,255,0.20), 0 0 60px rgba(255,255,255,0.08)",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,1), 0 12px 40px rgba(255,255,255,0.35), 0 0 80px rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(255,255,255,0.20), 0 0 60px rgba(255,255,255,0.08)"}
            >
              Preencher Formulário
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}