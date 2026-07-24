// public/identity-widget-logo.js
//
// O popup do Netlify Identity (tela de "Log in" / "Sign up" / "Complete your
// signup") é renderizado pela lib netlify-identity-widget dentro de um
// iframe próprio, e essa lib NÃO tem suporte a logo customizada (a opção
// "logo" dela só liga/desliga o selo "Coded by Netlify", não troca a
// imagem). Este script injeta a logo da Stock Capital por cima desse
// popup, sem mexer no conteúdo gerenciado pela lib (evita conflito com o
// re-render interno dela).
//
// Precisa ser chamado depois que window.netlifyIdentity já existe.
(function () {
  function setup(netlifyIdentity) {
    if (!netlifyIdentity || netlifyIdentity.__scLogoHooked) return;
    netlifyIdentity.__scLogoHooked = true;

    var LOGO_SRC = "/admin/logo.png";
    var timer = null;

    function position() {
      var iframe = document.getElementById("netlify-identity-widget");
      if (!iframe) return;
      var doc;
      try {
        doc = iframe.contentDocument;
      } catch (e) {
        return;
      }
      if (!doc || !doc.body) return;

      var dialog = doc.querySelector(".modalDialog");
      if (!dialog) return;

      var logo = doc.getElementById("sc-identity-logo");
      if (!logo) {
        logo = doc.createElement("img");
        logo.id = "sc-identity-logo";
        logo.alt = "Stock Capital";
        logo.src = LOGO_SRC;
        logo.style.cssText =
          "position:fixed;width:150px;z-index:100000;pointer-events:none;";
        doc.body.appendChild(logo);
      }

      var rect = dialog.getBoundingClientRect();
      logo.style.left = rect.left + rect.width / 2 + "px";
      logo.style.top = Math.max(rect.top - 16, 8) + "px";
      logo.style.transform = "translate(-50%, -100%)";
    }

    netlifyIdentity.on("open", function () {
      position();
      if (timer) clearInterval(timer);
      // Reposiciona por um tempo enquanto o modal está aberto: o
      // conteúdo muda de altura ao trocar de aba (login/signup) ou ao
      // mostrar mensagens de erro.
      timer = setInterval(position, 200);
    });

    netlifyIdentity.on("close", function () {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });
  }

  if (window.netlifyIdentity) {
    setup(window.netlifyIdentity);
  } else {
    // O script do widget pode ainda não ter terminado de carregar;
    // tenta de novo por alguns segundos.
    var tries = 0;
    var poll = setInterval(function () {
      tries++;
      if (window.netlifyIdentity) {
        clearInterval(poll);
        setup(window.netlifyIdentity);
      } else if (tries > 50) {
        clearInterval(poll);
      }
    }, 100);
  }
})();
