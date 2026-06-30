import { useEffect } from "react";

// Inyecta title, description y canonical en el <head> via DOM.
// Google renderiza JS y lee estas etiquetas correctamente en SPAs.
export default function SEOHead({ title, description, canonical }) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;

    const upsertMeta = (attr, attrVal, content) => {
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.content = content;
      return el;
    };

    const descEl   = upsertMeta("name",     "description",       description);
    const ogTitle  = upsertMeta("property", "og:title",          title);
    const ogDesc   = upsertMeta("property", "og:description",    description);
    const ogUrl    = upsertMeta("property", "og:url",            canonical);
    const twTitle  = upsertMeta("name",     "twitter:title",     title);
    const twDesc   = upsertMeta("name",     "twitter:description", description);

    let canonEl = document.querySelector('link[rel="canonical"]');
    if (!canonEl) {
      canonEl = document.createElement("link");
      canonEl.rel = "canonical";
      document.head.appendChild(canonEl);
    }
    canonEl.href = canonical;

    return () => {
      document.title = prev;
      [descEl, ogTitle, ogDesc, ogUrl, twTitle, twDesc].forEach(el => el?.remove());
      canonEl?.remove();
    };
  }, [title, description, canonical]);

  return null;
}
