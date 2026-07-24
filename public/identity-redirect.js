// public/identity-redirect.js
//
// Os e-mails de convite/confirmação/recuperação de senha do Netlify Identity
// sempre apontam para a raiz do site. A ideia original era só redirecionar
// para /admin preservando o token na URL — mas o Decap CMS tem seu próprio
// roteador baseado em hash (#/collections/...), e esse roteador reescreve o
// hash para "#/" quase imediatamente ao carregar, ANTES do Netlify Identity
// Widget conseguir ler o invite_token/recovery_token/confirmation_token.
// Resultado: o token é descartado silenciosamente e o usuário nunca vê a
// tela de "criar senha".
//
// A correção: processar o token AQUI, na home (que não tem esse roteador),
// carregando o próprio widget do Netlify Identity e deixando ele abrir o
// modal de definir senha nesta página. Só depois do login concluído é que
// redirecionamos para /admin — nesse ponto a URL já não tem mais token,
// então o roteador do Decap não atrapalha.
(function () {
  var hash = window.location.hash || "";
  var hasIdentityToken = /(invite_token|confirmation_token|recovery_token)=/.test(hash);
  var alreadyOnAdmin = window.location.pathname.indexOf("/admin") === 0;

  if (!hasIdentityToken || alreadyOnAdmin) return;

  var script = document.createElement("script");
  script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
  script.onload = function () {
    if (!window.netlifyIdentity) return;

    // IMPORTANTE: não chamar netlifyIdentity.init() aqui. O próprio script do
    // widget já se auto-inicializa assim que carrega (comportamento interno
    // da lib). Chamar init() de novo cria um SEGUNDO iframe duplicado e o
    // conteúdo do modal acaba sendo renderizado num iframe diferente do que
    // fica visível — resultado: a tela de criar senha nunca aparece, mesmo
    // com o token válido. Aqui só registramos os handlers.
    window.netlifyIdentity.on("login", function () {
      window.netlifyIdentity.close();
      window.location.replace("/admin/");
    });

    window.netlifyIdentity.on("error", function (err) {
      console.error("Erro no Netlify Identity (redirect):", err);
    });
  };
  document.head.appendChild(script);
})();
