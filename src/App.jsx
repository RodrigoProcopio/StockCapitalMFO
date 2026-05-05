import { useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import SectionVideoBg from "./components/ui/SectionVideoBg.jsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";
import Toast from "./components/ui/Toast.jsx";

import QuemSomos from "./components/sections/QuemSomos.jsx";
import NossoProposito from "./components/sections/NossoProposito.jsx";
import QuemBeneficiamos from "./components/sections/QuemBeneficiamos.jsx";
import NossaFilosofia from "./components/sections/NossaFilosofia.jsx";
import NossaEquipe from "./components/sections/NossaEquipe.jsx";
import NossosServicos from "./components/sections/NossosServicos.jsx";
import NossoFundo from "./components/sections/NossoFundo.jsx";
import Governanca from "./components/sections/Governanca.jsx";
import Publicacoes from "./components/sections/Publicacoes.jsx";
import Desempenho from "./components/sections/Desempenho.jsx";
import FormularioApi from "./components/sections/FormularioApi.jsx";
import Contato from "./components/sections/Contato.jsx";

export default function App() {
  const [toast, setToast] = useState({ open: false, message: "", variant: "error" });
  const [sending, setSending] = useState(false);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="min-h-screen bg-white" style={{ color: "var(--text-main)" }}>
      <Toast open={toast.open} message={toast.message} variant={toast.variant} onClose={() => setToast(t => ({ ...t, open: false }))} />
      <Navbar onGoTo={goTo} />

      <Hero goTo={goTo} />

      <SectionVideoBg>
        <QuemSomos />
        <NossoProposito />
        <QuemBeneficiamos />
        <NossaFilosofia />
        <NossaEquipe />
        <NossosServicos />
        <NossoFundo />
        <Governanca />
        <Publicacoes />
        <Desempenho />
      </SectionVideoBg>

      <FormularioApi />
      <Contato setToast={setToast} sending={sending} setSending={setSending} />

      <footer className="border-t bg-[#1c2846] py-10" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-white/90">
          © {new Date().getFullYear()} Stock Capital MFO — Todos os direitos reservados.
        </div>
      </footer>

      <FloatingWhatsApp />
      <ScrollToTopButton />
    </div>
  );
}