import { useEffect } from "react";

const BASE_URL = "https://stockcapitalmfo.com.br";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * useSEO — define title, description, canonical e Open Graph por rota
 *
 * @param {Object} options
 * @param {string} options.title        — título da página (sem sufixo, o hook adiciona " | Stock Capital MFO")
 * @param {string} options.description  — descrição para SEO e OG (max ~155 chars)
 * @param {string} [options.canonical]  — path da rota, ex: "/fundo-de-investimento"
 * @param {string} [options.image]      — URL absoluta da imagem OG (default: og-image.png)
 */
export function useSEO({ title, description, canonical, image }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Stock Capital MFO`
      : "Stock Capital MFO — Multi Family Office";

    // Title
    document.title = fullTitle;

    // Helpers
    function setMeta(selector, content) {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.match(/\[([^\]]+)="([^"]+)"\]/);
        if (attr) el.setAttribute(attr[1], attr[2]);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }

    function setLink(rel, href) {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    }

    // Description
    setMeta('meta[name="description"]', description);

    // Canonical
    if (canonical) {
      setLink("canonical", `${BASE_URL}${canonical}`);
    }

    // Open Graph
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', image || DEFAULT_IMAGE);
    if (canonical) {
      setMeta('meta[property="og:url"]', `${BASE_URL}${canonical}`);
    }

    // Twitter Card
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', image || DEFAULT_IMAGE);
  }, [title, description, canonical, image]);
}
