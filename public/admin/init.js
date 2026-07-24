// public/admin/init.js

// título
document.title = "Stock Capital — CMS";

// registra CSS de preview (o link já está no <head>, mas o Decap também aceita registrar)
if (window.CMS?.registerPreviewStyle) {
  window.CMS.registerPreviewStyle("/admin/preview.css", { raw: false });
}

if (window.DECAP_CMS_LOCALE_PT) {
  window.CMS.registerLocale("pt", window.DECAP_CMS_LOCALE_PT);
}
// o idioma é definido pelo config.yml -> locale: "pt"
// (se existir CMS.setLocale, usamos, mas sem quebrar)
if (window.CMS.setLocale) window.CMS.setLocale("pt");


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
