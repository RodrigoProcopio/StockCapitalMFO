import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import logoSmall from "../assets/logo-small.png";

const NAV_LINKS = [
  { id: "home",              label: "Home" },
  { id: "quem-somos",        label: "Quem Somos" },
  { id: "nosso-proposito",   label: "Nosso Propósito" },
  { id: "para-quem-atuamos", label: "Quem Beneficiamos" },
  { id: "nossa-filosofia",   label: "Nossa Filosofia" },
  { id: "nossa-equipe",      label: "Nossa Equipe" },
  { id: "nossos-servicos",   label: "Nossos Serviços" },
  { to: "/fundo-de-investimento", label: "Fundo de Investimento" },
  { id: "governanca",        label: "Governança" },
  { id: "publicacoes",       label: "Publicações" },
  { id: "desempenho",        label: "Performance" },
  { id: "formulario-api",    label: "Perfil do Investidor" },
  { id: "contato",           label: "Contato" },
];

const NAV_HIGHLIGHTS = [
  { label: "Fundo de Investimento", desc: "Conheça nosso FIF Multimercado CP RL.", to: "/fundo-de-investimento" },
  { label: "Perfil do Investidor",     desc: "Descubra seu perfil de investidor preenchendo nosso questionário de suitability.", id: "formulario-api" },
  { label: "Contato",               desc: "Fale diretamente com nossa equipe.", id: "contato" },
];

export default function Navbar({ onGoTo }) {
  const [open, setOpen] = useState(false);
  const logoTopControls = useAnimation();
  const logoBottomControls = useAnimation();

  const handleNav = (id) => { setOpen(false); onGoTo(id); };

  const handleLogoSpin = async () => {
    await Promise.all([
      logoTopControls.start({ y: ["0%", "100%"], transition: { duration: 0.42, ease: "easeInOut" } }),
      logoBottomControls.start({ y: ["-100%", "0%"], transition: { duration: 0.42, ease: "easeInOut" } }),
    ]);
    logoTopControls.set({ y: "0%" });
    logoBottomControls.set({ y: "-100%" });
  };

  return (
    <>
      {!open && (
        <div className="fixed right-4 top-5 z-40 md:right-8 md:top-7">
          <motion.button
            onClick={() => setOpen(true)}
            onMouseEnter={handleLogoSpin}
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            aria-label="Abrir menu"
            className="group flex h-14 items-center rounded-2xl border border-[#d6d6d6] bg-white/95 px-4 shadow-pill backdrop-blur-xl"
          >
            <div className="relative flex h-10 w-44 items-center overflow-hidden">
              <motion.img src={logoSmall} alt="Stock Capital MFO" className="absolute left-0 h-16 w-auto" initial={{ y: "0%" }} animate={logoTopControls} />
              <motion.img src={logoSmall} alt="Stock Capital MFO" className="absolute left-0 h-16 w-auto" initial={{ y: "-100%" }} animate={logoBottomControls} />
            </div>
            <div className="mx-3 h-8 w-px bg-[#333846]/20 transition-colors group-hover:bg-[#333846]/40" />
            <div className="flex flex-col gap-[5px]">
              {[0, 1, 2].map(i => (
                <span key={i} className="block h-[2px] w-5 rounded-full bg-[#333846] transition-all group-hover:w-6 group-hover:bg-[#1c2846]" />
              ))}
            </div>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#1c2846] text-white overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/5 hover:bg-white/12 md:right-8 md:top-7 transition-colors"
            >
              <span className="relative block h-4 w-4">
                <span className="absolute inset-0 m-auto h-[2px] w-full rotate-45 bg-white rounded-full" />
                <span className="absolute inset-0 m-auto h-[2px] w-full -rotate-45 bg-white rounded-full" />
              </span>
            </button>

            <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-12 pt-20 md:flex-row md:gap-16 md:pt-28">
              {/* Coluna esquerda — navegação */}
              <div className="flex-1 border-b border-white/15 pb-8 md:border-b-0 md:border-r md:border-white/15 md:pr-12">
                <p className="label-upper text-white/50">Navegação</p>
                <nav className="mt-6 space-y-4">
                  {NAV_LINKS.map((item) => {
                    const cls = "group relative block w-fit text-left text-2xl font-medium text-white/80 transition-all hover:text-white md:text-3xl";
                    const inner = (
                      <>
                        <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.55)]">{item.label}</span>
                        <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 rounded-full bg-white transition-all group-hover:w-full" />
                      </>
                    );
                    return item.to
                      ? (
                        <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className={cls}>
                          {inner}
                        </Link>
                      )
                      : (
                        <button key={item.id} onClick={() => handleNav(item.id)} className={cls}>
                          {inner}
                        </button>
                      );
                  })}
                </nav>
                <div className="mt-10 space-y-2 text-sm">
                  {[
                    { label: "Canal de Denúncias", href: "https://app.pipefy.com/public/form/dirpZ0Km", ext: true },
                    { label: "Política de Privacidade", href: "/privacidade" },
                    { label: "Termos de Uso", href: "/termos" },
                  ].map(item => (
                    item.ext
                      ? <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="block text-white/50 transition-all hover:translate-x-1 hover:text-white">{item.label}</a>
                      : <Link key={item.label} to={item.href} onClick={() => setOpen(false)} className="block text-white/50 transition-all hover:translate-x-1 hover:text-white">{item.label}</Link>
                  ))}
                </div>
              </div>

              {/* Coluna direita — destaques */}
              <div className="flex-1">
                <p className="label-upper text-white/50">Destaques</p>
                <div className="mt-6 space-y-8">
                  {NAV_HIGHLIGHTS.map((item, i) => {
                    const inner = (
                      <motion.div
                        className="group flex w-full flex-col items-start text-left"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.08 * i }}
                      >
                        <div className="flex w-full items-center justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-white">{item.label}</p>
                            <p className="mt-1 max-w-xs text-sm text-white/60">{item.desc}</p>
                          </div>
                          <span className="flex-none text-lg text-white/50 transition-all group-hover:translate-x-1 group-hover:text-white">→</span>
                        </div>
                        <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/15">
                          <div className="h-full w-[22%] rounded-full bg-white transition-all group-hover:w-full" />
                        </div>
                      </motion.div>
                    );
                    return item.to
                      ? <Link key={i} to={item.to} onClick={() => setOpen(false)}>{inner}</Link>
                      : <button key={i} onClick={() => handleNav(item.id)} className="w-full">{inner}</button>;
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}