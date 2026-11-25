import React from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Composant d'injection sécurisée de données structurées Schema.org (JSON-LD).
 * Émet un bloc <script type="application/ld+json"> distinct par schéma pour garantir
 * une détection universelle par Google, Bing et les analyseurs GEO/Schema.
 * Échappe le caractère '<' pour prévenir toute vulnérabilité d'injection XSS.
 */
export function JsonLd({ data }: JsonLdProps) {
  const rawItems = Array.isArray(data) ? data : [data];
  const items = rawItems.filter(Boolean);

  return (
    <>
      {items.map((item, index) => {
        const json = JSON.stringify(item);
        if (!json) return null;
        const jsonString = json.replace(/</g, "\\u003c");
        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonString }}
          />
        );
      })}
    </>
  );
}
