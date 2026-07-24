// public/admin/init.js

// título
document.title = "Stock Capital — CMS";

// registra CSS de preview (o link já está no <head>, mas o Decap também aceita registrar)
if (window.CMS?.registerPreviewStyle) {
  window.CMS.registerPreviewStyle("/admin/preview.css", { raw: false });
}

// OBS: o Decap se auto-inicializa (auto-mount) assim que o bundle carrega,
// antes deste script (deferred) rodar — então este registerLocale chega
// tarde demais pra "vencer" o locale "pt" que já vem embutido no bundle e
// que o app já usou pra montar. Testamos ligar o CMS_MANUAL_INIT pra
// resolver esse timing, mas é um bug conhecido do Decap CMS 3.8.3 (quebra
// o app com "Failed to execute 'removeChild' on 'Node'" — várias issues
// abertas no GitHub deles, sem correção oficial ainda). Preferimos manter
// o app estável: o locale "pt" embutido do Decap já cobre bem a tradução.
// Deixamos a chamada abaixo por segurança (não tem custo, é uma correção
// grátis nas raras vezes em que ela chegar a tempo, ex. após um F5 com
// cache quente), mas não dependa dela.
if (window.DECAP_CMS_LOCALE_PT && window.CMS?.registerLocale) {
  window.CMS.registerLocale("pt", window.DECAP_CMS_LOCALE_PT);
}

/* Logo da Stock Capital na barra "Conteúdos / Mídia" do Decap: ver
   public/admin/brand.css ([class*="AppHeaderContent"]::before). Não
   injetamos mais isso via JS/DOM — inserir um <img> dentro de um nó
   controlado pelo React do Decap (insertBefore) fazia o React quebrar
   ao tentar reconciliar essa árvore de novo (erro "Failed to execute
   'removeChild' on 'Node'", tela de erro vermelha no topo do admin). Um
   ::before em CSS resolve visualmente o mesmo jeito sem tocar no DOM
   que o React gerencia. */

/* Netlify Identity */
if (window.netlifyIdentity) {
  // IMPORTANTE: não chamar netlifyIdentity.init() aqui. O script do widget
  // (carregado via <script> no index.html) já se auto-inicializa sozinho
  // assim que termina de carregar. Chamar init() de novo cria um SEGUNDO
  // iframe interno duplicado — o conteúdo do modal (login/senha) acaba
  // renderizado num iframe diferente do que realmente fica visível na tela,
  // então nada aparece (mesmo com um token de convite/recuperação válido).
  // Aqui só registramos os handlers; a inicialização real já aconteceu.

  const hasToken = /(?:invite_token|confirmation_token|recovery_token)=/.test(
    window.location.hash
  );
  if (hasToken) {
    console.log("Token detectado:", window.location.hash);
  }

  window.netlifyIdentity.on("login", (user) => {
    const displayName =
      user?.user_metadata?.full_name ||
      user?.full_name ||
      user?.email ||
      "Usuário";
    console.log("Usuário logado no CMS:", displayName);

    // Fecha o modal/iframe do widget explicitamente. Sem isso, em alguns
    // fluxos (ex.: definir senha via link de recuperação/convite) o overlay
    // do widget pode ficar "preso" invisível sobre a tela, bloqueando cliques
    // no restante do admin (sidebar, botões "New X", etc.).
    window.netlifyIdentity.close();

    if (hasToken) window.location.replace("/admin/");
  });

  window.netlifyIdentity.on("logout", () => {
    console.log("Usuário saiu");
  });

  window.netlifyIdentity.on("error", (err) => {
    console.error("Erro no Netlify Identity (admin):", err);
  });
} else {
  console.error("Identity widget não carregou.");
}

/* Não chamamos window.CMS.init() aqui — o Decap já se auto-inicializa
   sozinho assim que o bundle carrega (comportamento padrão). Ver o
   comentário no início deste arquivo e em admin/index.html sobre por que
   NÃO usamos CMS_MANUAL_INIT + init() manual (bug conhecido do Decap
   3.8.3 que quebra o app). */
