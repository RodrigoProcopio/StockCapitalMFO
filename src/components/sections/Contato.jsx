
import { Link } from "react-router-dom";

const POLICY_VERSION = "v1";

const inp = "w-full rounded-xl border border-white/18 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/55 outline-none focus:border-white/45 focus:ring-1 focus:ring-white/28 transition-all backdrop-blur-sm";
const lbl = "block mb-1.5 text-xs font-semibold uppercase tracking-widest text-white/70";

function ContatoForm({ setToast, sending, setSending }) {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const nome     = formEl.querySelector('input[name="nome"]').value;
    const telefone = formEl.querySelector('input[name="telefone"]').value;
    const email    = formEl.querySelector('input[name="email"]').value;
    const mensagem = formEl.querySelector('textarea[name="mensagem"]').value;
    const hp       = formEl.querySelector('input[name="hp"]').value || "";
    const lgpdChecked = formEl.querySelector('input[name="lgpd"]').checked;

    if (!lgpdChecked) {
      setToast({ open: true, variant: "warning", message: "Para enviar, é necessário aceitar a LGPD e o compartilhamento dos dados pessoais." });
      return;
    }

    const payload = { nome, telefone, email, mensagem, hp, form_id: "Contato",
      lgpd: { accepted: true, policyVersion: POLICY_VERSION, consentAtClient: new Date().toISOString() } };

    setSending(true);
    try {
      const res = await fetch("/api/send-contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      let json = {};
      try { json = await res.json(); } catch { const txt = await res.text().catch(() => ""); json = { raw: txt }; }
      if (res.ok && json.ok) { setToast({ open: true, variant: "success", message: "Mensagem enviada com sucesso!" }); formEl.reset(); return; }
      if (res.status === 422 || (res.status === 400 && json?.error === "Campos obrigatórios ausentes.")) { setToast({ open: true, variant: "warning", message: `Preencha os campos obrigatórios corretamente.${json.missing?.length ? " Campos: " + json.missing.join(", ") : ""}` }); return; }
      if (res.status === 400 && json?.error === "Alguns valores não correspondem às opções do Pipefy.") { setToast({ open: true, variant: "warning", message: "Alguns valores não correspondem às opções do Pipefy." }); return; }
      if (res.status === 403) { setToast({ open: true, variant: "error", message: "Acesso não autorizado. Verifique os dados e tente novamente." }); return; }
      if (res.status === 413) { setToast({ open: true, variant: "warning", message: "Mensagem muito longa. Reduza o texto e tente novamente." }); return; }
      if (res.status === 429) { setToast({ open: true, variant: "warning", message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }); return; }
      if (res.status === 502 && json?.error === "Falha ao criar card no Pipefy") { setToast({ open: true, variant: "error", message: "Falha ao processar o envio. Tente novamente em instantes." }); return; }
      if (res.status === 500 && json?.error === "Erro interno") { setToast({ open: true, variant: "error", message: "Erro interno. Tente novamente." }); return; }
      setToast({ open: true, variant: "error", message: "Não foi possível enviar. Tente novamente." });
    } catch { setToast({ open: true, variant: "error", message: "Erro de rede. Verifique sua conexão." }); }
    finally { setSending(false); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="hp" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div>
        <label htmlFor="contato-nome" className={lbl}>Nome</label>
        <input id="contato-nome" type="text" name="nome" autoComplete="name" required placeholder="Seu nome completo" className={inp} />
      </div>
      <div>
        <label htmlFor="contato-telefone" className={lbl}>Telefone (Whatsapp)</label>
        <input id="contato-telefone" type="tel" name="telefone" inputMode="tel" autoComplete="tel"
          onInput={(e) => { let v = e.currentTarget.value.replace(/[^\d+]/g, ""); if (v.includes("+")) v = "+" + v.replace(/\+/g, "").replace(/^0+/, ""); e.currentTarget.value = v; }}
          pattern="^\+?[1-9]\d{8,14}$" placeholder="+5541999999999" className={inp} />
        <p className="mt-1 text-xs text-white/60">Formato internacional. Ex.: <code>+5541999999999</code>.</p>
      </div>
      <div>
        <label htmlFor="contato-email" className={lbl}>E-mail</label>
        <input id="contato-email" type="email" name="email" autoComplete="email" required placeholder="seuemail@dominio.com" className={inp} />
      </div>
      <div>
        <label htmlFor="contato-mensagem" className={lbl}>Mensagem</label>
        <textarea id="contato-mensagem" name="mensagem" rows={5} required placeholder="Como podemos ajudar?" className={inp} />
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/5 px-4 py-3">
        <input id="contato-lgpd" type="checkbox" name="lgpd" required className="mt-1 h-4 w-4 rounded border-white/35 text-white focus:ring-white/28" />
        <label htmlFor="contato-lgpd" className="text-xs text-white/55">
          Autorizo o tratamento e o compartilhamento dos meus dados pessoais para fins de contato e atendimento, conforme a LGPD.{" "}
          <Link to="/privacidade" className="underline hover:text-white">Saiba mais</Link>.
        </label>
      </div>
      <button type="submit" disabled={sending} className="btn-pill w-full border-white/25 bg-white text-[#1c2846] font-semibold hover:bg-white/90 disabled:opacity-50 mt-1">
        {sending ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}

export default function Contato({ setToast, sending, setSending }) {
  return (
    <section id="contato" className="scroll-mt-24 border-t border-[#d6d6d6] bg-[#1c2846] py-24">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Contato</h2>
          <p className="mt-2 text-sm text-white/60">Fale com nossa equipe.</p>
        </div>

        <div className="grid gap-16 md:grid-cols-2 items-start">

          {/* Coluna esquerda — informações alinhadas ao topo do form */}
          <div className="space-y-6 text-white">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 flex-none text-white/50" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s7-5.33 7-11a7 7 0 10-14 0c0 5.67 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="10" r="2.8" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Endereço</p>
                <p className="mt-1 text-sm text-white/75">Alameda Dom Pedro II, 155 — Curitiba/PR - Brasil<br />CEP 80420-160</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 flex-none text-white/50" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">E-mail</p>
                <p className="mt-1 text-sm text-white/75">contato@stockcapital.com.br</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 flex-none text-white/50" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v2a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.92 4.2A2 2 0 014.86 2h2a2 2 0 012 1.72c.1.76.27 1.5.5 2.21a2 2 0 01-.45 2.11L8 9a16 16 0 006 6l.95-.91a2 2 0 012.11-.45c.71.23 1.45.4 2.21.5A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Telefone</p>
                <p className="mt-1 text-sm text-white/75">(41) 99766-4434</p>
              </div>
            </div>

            <div className="pt-2">
              <a href="https://app.pipefy.com/public/form/dirpZ0Km" target="_blank" rel="noopener noreferrer"
                className="btn-pill inline-flex items-center gap-2 border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#1c2846] hover:border-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l7 3v6a9 9 0 01-7 8 9 9 0 01-7-8V6l7-3z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Canal de Denúncias
              </a>
              <p className="mt-2 text-xs text-white/65">Canal seguro de denúncias, conforme rito da CVM.</p>
            </div>

            <div className="pt-2">
              <img src="/cvm-logo.png" alt="CVM – Comissão de Valores Mobiliários" className="h-auto w-[240px] opacity-75" loading="lazy" decoding="async" />
            </div>
          </div>

          {/* Coluna direita — formulário */}
          <ContatoForm setToast={setToast} sending={sending} setSending={setSending} />

        </div>
      </div>
    </section>
  );
}