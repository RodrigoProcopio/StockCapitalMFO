// public/identity-redirect.js
// Os e-mails de convite/confirmação/recuperação de senha do Netlify Identity
// sempre apontam para a raiz do site (o /admin tem essa lógica, mas a home não).
// Este script detecta o token na URL e redireciona para /admin, onde o
// Decap CMS + Netlify Identity Widget conseguem processar o convite.
(function () {
  var hash = window.location.hash || "";
  var hasIdentityToken = /(invite_token|confirmation_token|recovery_token)=/.test(hash);
  var alreadyOnAdmin = window.location.pathname.indexOf("/admin") === 0;

  if (hasIdentityToken && !alreadyOnAdmin) {
    window.location.replace("/admin/" + hash);
  }
})();
